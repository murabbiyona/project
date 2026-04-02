import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, User } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AIChatPanelProps {
  contextType?: 'lesson_plan' | 'general' | 'assessment'
  systemContext?: string
  onPlanGenerated?: (plan: any) => void
  className?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_SUGGESTIONS = [
  'Dars reja yozib ber',
  "Bloom taksonomiyasi bo'yicha savol tuz",
  '5E modeli nima?',
  "O'quvchi faolligini oshirish usullari",
]

const MOCK_RESPONSES: Record<string, string> = {
  default: `## Murabbiy AI javobi

Men sizga yordam berishga tayyorman! Quyidagi mavzularda yordam bera olaman:

- **Dars rejalarini tuzish** - fanlar bo'yicha to'liq dars rejalar
- **Baholash usullari** - Bloom taksonomiyasi asosida savollar
- **Zamonaviy metodikalar** - 5E, STEAM va boshqa yondashuvlar
- **O'quvchi faolligi** - interaktiv dars o'tish usullari

Qanday savol bilan yordam kerak?`,

  'Dars reja yozib ber': `## Dars reja namunasi

**Fan:** Matematika
**Sinf:** 5-sinf
**Mavzu:** Kasrlar

### Darsning maqsadi
O'quvchilar kasrlarni solishtirish va tartibga solishni o'rganadilar.

### Dars borishi

1. **Tashkiliy qism** (5 daqiqa)
   - Salomlashish, davomatni olish

2. **O'tgan mavzuni takrorlash** (7 daqiqa)
   - Og'zaki savol-javob
   - Uyga vazifani tekshirish

3. **Yangi mavzu bayoni** (15 daqiqa)
   - Kasrlar haqida tushuntirish
   - Ko'rgazmali materiallar bilan ishlash

4. **Mustahkamlash** (13 daqiqa)
   - Guruh bo'yicha ishlash
   - Mustaqil topshiriqlar

5. **Yakunlash** (5 daqiqa)
   - Darsni yakunlash, uyga vazifa berish
   - Baholash`,

  "Bloom taksonomiyasi bo'yicha savol tuz": `## Bloom taksonomiyasi bo'yicha savollar

**Mavzu:** O'simliklar dunyosi (Biologiya)

### 1. Bilish (Eslab qolish)
- O'simlikning asosiy qismlarini sanab bering.

### 2. Tushunish
- Fotosintez jarayonini **o'z so'zlaringiz** bilan tushuntiring.

### 3. Qo'llash
- Uy sharoitida o'simlik o'stirish uchun qanday sharoitlar yaratgan bo'lar edingiz?

### 4. Tahlil qilish
- Cho'l va tropik o'simliklarining **farqlarini** taqqoslang.

### 5. Baholash
- Sizningcha, o'rmon kesish ekologiyaga qanday ta'sir ko'rsatadi? **Asoslang.**

### 6. Yaratish
- Yangi o'simlik turi yarating va uning **xususiyatlarini** tasvirlab bering.`,

  '5E modeli nima?': `## 5E o'qitish modeli

**5E modeli** - bu tadqiqotga asoslangan o'qitish yondashuvi bo'lib, 5 bosqichdan iborat:

### 1. Engage (Qiziqtirish)
O'quvchilarning **qiziqishini uyg'otish** va mavzuga jalb qilish. Savol, video yoki muammo orqali boshlash.

### 2. Explore (Tadqiq qilish)
O'quvchilar **mustaqil ravishda** tajriba o'tkazadilar, kuzatadilar va ma'lumot to'playdilar.

### 3. Explain (Tushuntirish)
O'quvchilar o'z **topilmalarini tushuntiradilar**, o'qituvchi yangi atamalar va tushunchalarni kiritadi.

### 4. Elaborate (Kengaytirish)
O'rganilgan bilimlarni **yangi vaziyatlarga** qo'llash, chuqurroq tushunish.

### 5. Evaluate (Baholash)
O'quvchilarning **tushunish darajasini** tekshirish va baholash.

> 5E modeli o'quvchilarda **tanqidiy fikrlash** va **mustaqil o'rganish** ko'nikmalarini rivojlantiradi.`,

  "O'quvchi faolligini oshirish usullari": `## O'quvchi faolligini oshirish usullari

### 1. Interfaol metodlar
- **Think-Pair-Share** - fikrla, juftlikda muhokama qil, sinf bilan bo'lish
- **Aqliy hujum** - barcha g'oyalarni yig'ish
- **Rolli o'yinlar** - mavzuni sahna ko'rinishida o'tish

### 2. Texnologiyalar yordamida
- **Kahoot** - viktorina o'yinlari
- **Padlet** - onlayn doska
- **QR kodlar** - topshiriqlarni QR orqali berish

### 3. Guruh ishlari
- **Jigsaw** usuli - har bir o'quvchi ekspert bo'ladi
- **Stansiyalar** - turli topshiriqli stansiyalar
- **Loyiha ishi** - birgalikda loyiha tayyorlash

### 4. Baholash orqali
- **O'z-o'zini baholash** varaqlari
- **Tengdoshlar baholashi**
- **Portfolio** yaratish

> Eng muhimi - har bir o'quvchiga **xavfsiz muhit** yaratib, ularni **rag'batlantirish**!`,
}

function formatMessageContent(content: string): string {
  let formatted = content
  // Bold: **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Headings: ## text
  formatted = formatted.replace(/^### (.+)$/gm, '<h4 class="text-sm font-semibold mt-3 mb-1">$1</h4>')
  formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-emerald-400">$1</h3>')
  // Blockquote: > text
  formatted = formatted.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-2 border-emerald-500/40 pl-3 my-2 italic text-slate-300">$1</blockquote>'
  )
  // Unordered list items: - text
  formatted = formatted.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  // Ordered list items: 1. text
  formatted = formatted.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal" value="$1">$2</li>')
  // Wrap consecutive <li> in <ul>/<ol> (simplified)
  formatted = formatted.replace(
    /((?:<li class="ml-4 list-disc">.*<\/li>\n?)+)/g,
    '<ul class="my-1 space-y-0.5">$1</ul>'
  )
  formatted = formatted.replace(
    /((?:<li class="ml-4 list-decimal".*<\/li>\n?)+)/g,
    '<ol class="my-1 space-y-0.5">$1</ol>'
  )
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br />')
  // Clean up double <br /> after block elements
  formatted = formatted.replace(/(<\/h[34]>)<br \/>/g, '$1')
  formatted = formatted.replace(/(<\/blockquote>)<br \/>/g, '$1')
  formatted = formatted.replace(/(<\/ul>)<br \/>/g, '$1')
  formatted = formatted.replace(/(<\/ol>)<br \/>/g, '$1')

  return formatted
}

function getMockResponse(message: string): string {
  const normalizedMessage = message.trim()
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (key !== 'default' && normalizedMessage.toLowerCase().includes(key.toLowerCase())) {
      return response
    }
  }
  return MOCK_RESPONSES.default
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
        <Brain className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="glass-panel rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function AIChatPanel({
  contextType = 'general',
  systemContext,
  onPlanGenerated,
  className,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const maxHeight = 4 * 24 // ~4 lines
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [input])

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isTyping) return

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsTyping(true)

      // Mock AI response with delay
      const delay = 1000 + Math.random() * 1500
      setTimeout(() => {
        const responseContent = getMockResponse(content)

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)

        // If callback provided and contextType is lesson_plan, fire it
        if (onPlanGenerated && contextType === 'lesson_plan') {
          onPlanGenerated({ content: responseContent, type: contextType, systemContext })
        }
      }, delay)
    },
    [isTyping, contextType, systemContext, onPlanGenerated]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {isEmpty ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center h-full min-h-[300px] text-center gap-6"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center glow-emerald"
              >
                <Brain className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-1">
                  Murabbiy AI bilan suhbatlashing
                </h3>
                <p className="text-sm text-slate-400">
                  Dars rejalar, savollar va metodikalar bo'yicha yordam oling
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(suggestion)}
                    className="glass-button text-sm text-slate-300 px-3 py-2 rounded-xl hover:text-emerald-300 transition-colors"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex items-start gap-3', {
                  'justify-end': message.role === 'user',
                })}
              >
                {/* AI avatar */}
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed', {
                    'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-sm shadow-lg shadow-emerald-500/20':
                      message.role === 'user',
                    'glass-panel rounded-tl-sm text-slate-200':
                      message.role === 'assistant',
                  })}
                >
                  {message.role === 'assistant' ? (
                    <div
                      className="prose-chat"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content),
                      }}
                    />
                  ) : (
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  )}
                </div>

                {/* User avatar */}
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-300" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-white/5 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Savolingizni yozing..."
            rows={1}
            className="glass-input flex-1 resize-none rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
              input.trim() && !isTyping
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600'
                : 'glass-button text-slate-500 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-[11px] text-slate-500 mt-1.5 text-center">
          Murabbiy AI javoblari tavsiya sifatida. Yakuniy qaror o'qituvchida.
        </p>
      </div>
    </div>
  )
}
