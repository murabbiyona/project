import { useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useAICredits } from './useAICredits'

export type ContextType = 'lesson_plan' | 'general' | 'assessment'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

interface UseAIChatOptions {
  contextType?: ContextType
  systemPrompt?: string
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const { contextType = 'general', systemPrompt } = options
  const { user, session } = useAuth()
  const { credits, refreshCredits } = useAICredits()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  // Create or retrieve a conversation record
  const ensureConversation = useCallback(async (): Promise<string | null> => {
    if (conversationId) return conversationId

    if (!user) {
      setError('Foydalanuvchi tizimga kirmagan')
      return null
    }

    try {
      const { data, error: err } = await supabase
        .from('ai_conversations')
        .insert({
          teacher_id: user.id,
          context_type: contextType,
          messages: [],
        })
        .select()
        .single()

      if (err) {
        setError(err.message)
        return null
      }

      setConversationId(data.id)
      return data.id
    } catch (e: any) {
      setError(e.message || 'Suhbat yaratishda xatolik')
      return null
    }
  }, [conversationId, user, contextType])

  // Save a single message to the ai_messages table
  const saveMessage = useCallback(
    async (convId: string, message: ChatMessage) => {
      try {
        await supabase.from('ai_messages').insert({
          conversation_id: convId,
          role: message.role,
          content: message.content,
        })
      } catch {
        // Silently fail — messages are already in local state
      }
    },
    []
  )

  // Send a message to the Gemini edge function
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      if (!user || !session) {
        setError('Tizimga kiring')
        return
      }

      setError(null)
      setLoading(true)

      // Add user message to local state immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        // Ensure we have a conversation
        const convId = await ensureConversation()
        if (!convId) {
          setLoading(false)
          return
        }

        // Save user message to DB
        await saveMessage(convId, userMessage)

        // Build message history for context
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))
        history.push({ role: 'user', content: content.trim() })

        // Abort any in-flight request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        const response = await fetch(
          `${supabaseUrl}/functions/v1/gemini-ai`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              messages: history,
              context: systemPrompt || undefined,
              model: 'gpt-4o-mini',
            }),
            signal: abortControllerRef.current.signal,
          }
        )

        if (!response.ok) {
          const errBody = await response.json().catch(() => null)
          throw new Error(
            errBody?.error || `Server xatolik: ${response.status}`
          )
        }

        const data = await response.json()

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.content || data.message || '',
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        await saveMessage(convId, assistantMessage)

        // Refresh credits after usage
        refreshCredits()
      } catch (e: any) {
        if (e.name === 'AbortError') return
        setError(e.message || 'AI javob berishda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    },
    [
      user,
      session,
      messages,
      contextType,
      systemPrompt,
      supabaseUrl,
      ensureConversation,
      saveMessage,
      refreshCredits,
    ]
  )

  // Load an existing conversation from the database
  const loadConversation = useCallback(
    async (convId: string) => {
      if (!user) return

      setLoading(true)
      setError(null)

      try {
        const { data, error: err } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true })

        if (err) {
          setError(err.message)
        } else {
          const loaded: ChatMessage[] = (data || []).map((row: any) => ({
            id: row.id,
            role: row.role,
            content: row.content,
            timestamp: row.created_at,
          }))
          setMessages(loaded)
          setConversationId(convId)
        }
      } catch (e: any) {
        setError(e.message || 'Suhbatni yuklashda xatolik')
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  // Clear current chat state
  const clearChat = useCallback(() => {
    setMessages([])
    setConversationId(null)
    setError(null)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    messages,
    sendMessage,
    loading,
    error,
    conversationId,
    clearChat,
    loadConversation,
    credits,
  }
}
