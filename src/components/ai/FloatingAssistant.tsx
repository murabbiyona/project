import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, X, Send, User, Sparkles, BookOpen, ClipboardCheck, MessageCircle, GraduationCap } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAIChat } from '../../hooks/useAIChat'

// ---------------------------------------------------------------------------
// Quick-action chips
// ---------------------------------------------------------------------------

const QUICK_ACTIONS = [
  { label: 'Dars reja', icon: BookOpen },
  { label: 'Baholash', icon: ClipboardCheck },
  { label: 'Maslahat', icon: MessageCircle },
  { label: 'Metodika', icon: GraduationCap },
] as const

// ---------------------------------------------------------------------------
// Simple markdown-ish formatter
// ---------------------------------------------------------------------------

function formatContent(content: string): string {
  let f = content
  f = f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  f = f.replace(/^### (.+)$/gm, '<h4 class="text-sm font-semibold mt-3 mb-1">$1</h4>')
  f = f.replace(/^## (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-2 text-emerald-400">$1</h3>')
  f = f.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-2 border-emerald-500/40 pl-3 my-2 italic text-slate-300">$1</blockquote>'
  )
  f = f.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  f = f.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal" value="$1">$2</li>')
  f = f.replace(/((?:<li class="ml-4 list-disc">.*<\/li>\n?)+)/g, '<ul class="my-1 space-y-0.5">$1</ul>')
  f = f.replace(/((?:<li class="ml-4 list-decimal".*<\/li>\n?)+)/g, '<ol class="my-1 space-y-0.5">$1</ol>')
  f = f.replace(/\n/g, '<br />')
  f = f.replace(/(<\/h[34]>)<br \/>/g, '$1')
  f = f.replace(/(<\/blockquote>)<br \/>/g, '$1')
  f = f.replace(/(<\/ul>)<br \/>/g, '$1')
  f = f.replace(/(<\/ol>)<br \/>/g, '$1')
  return f
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
        <Brain className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Real AI chat hook
  const { messages, sendMessage: sendAIMessage, loading, error, credits } = useAIChat({
    contextType: 'general',
  })

  const creditBalance = credits?.balance ?? 0

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
    }
  }, [input])

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 350)
    }
  }, [isOpen])

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim() || loading) return
      sendAIMessage(content.trim())
      setInput('')
    },
    [loading, sendAIMessage]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <>
      {/* Overlay backdrop (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'fixed top-0 right-0 h-full z-[999] flex flex-col',
              'w-full sm:w-[400px]',
              'bg-slate-900/80 backdrop-blur-xl border-l border-white/10 shadow-2xl shadow-black/40'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Murabbiy AI</h2>
                  <p className="text-[11px] text-emerald-400/80">Shaxsiy yordamchingiz</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  <Sparkles className="w-3 h-3 inline -mt-0.5 mr-1 text-amber-400" />
                  {creditBalance} kredit
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {isEmpty && !loading ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center h-full min-h-[260px] text-center gap-5"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                    >
                      <Brain className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-200 mb-1">
                        Assalomu alaykum, Ustoz!
                      </h3>
                      <p className="text-sm text-slate-400 max-w-[280px]">
                        Men Murabbiy AI — dars rejalar, baholash va metodika bo'yicha doimiy yordamchingiz
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn('flex items-start gap-2.5', {
                        'justify-end': message.role === 'user',
                      })}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <Brain className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}

                      <div
                        className={cn('max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', {
                          'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-sm shadow-lg shadow-emerald-500/20':
                            message.role === 'user',
                          'bg-white/5 backdrop-blur-sm border border-white/10 rounded-tl-sm text-slate-200':
                            message.role === 'assistant',
                        })}
                      >
                        {message.role === 'assistant' ? (
                          <div
                            className="prose-chat"
                            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
                          />
                        ) : (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-emerald-300" />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>

              {/* Error message */}
              {error && (
                <div className="text-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick action chips */}
            {isEmpty && (
              <div className="flex-shrink-0 px-4 py-2 border-t border-white/5">
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSend(label)}
                      disabled={loading}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon className="w-3 h-3 text-emerald-400" />
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="flex-shrink-0 border-t border-white/10 px-4 py-3 bg-slate-900/60 backdrop-blur-sm">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Savolingizni yozing..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || loading}
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                    input.trim() && !loading
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600'
                      : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
                  )}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                Murabbiy AI javoblari tavsiya sifatida. Yakuniy qaror o'qituvchida.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[997]"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center"
            >
              <Brain className="w-6 h-6" />

              {creditBalance > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-amber-500/40 border-2 border-slate-900">
                  {creditBalance > 99 ? '99+' : creditBalance}
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
