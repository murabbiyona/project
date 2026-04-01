import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Target,
  Clock,
  BookOpen,
  Send,
  Download,
  MessageSquare,
  FileText,
  Zap,
  GraduationCap,
  Lightbulb,
  Users,
  ChevronDown,
} from 'lucide-react';
import { useLessonPlanner, type PlanningModel as PlanningModelType, type BloomLevel } from '../hooks/useLessonPlanner';
import { useAIChat } from '../hooks/useAIChat';

// ── Types ──────────────────────────────────────────────────────────────
interface PlanningModel {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
  ring: string;
  icon: React.ReactNode;
}

// ── Constants ──────────────────────────────────────────────────────────
const PLANNING_MODELS: PlanningModel[] = [
  {
    id: '5E',
    title: '5E Model',
    subtitle: 'Engage, Explore, Explain, Elaborate, Evaluate',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    ring: 'ring-emerald-500/30',
    icon: <Lightbulb className="size-5" />,
  },
  {
    id: 'SMART',
    title: 'SMART Model',
    subtitle: 'Specific, Measurable, Achievable, Relevant, Time-bound',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    ring: 'ring-blue-500/30',
    icon: <Target className="size-5" />,
  },
  {
    id: '20/80',
    title: '20/80 Model',
    subtitle: "20% nazariya, 80% amaliyot",
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    ring: 'ring-purple-500/30',
    icon: <Zap className="size-5" />,
  },
  {
    id: 'backward_design',
    title: 'Backward Design',
    subtitle: "Natijadan boshlab rejalashtirish",
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    ring: 'ring-amber-500/30',
    icon: <Brain className="size-5" />,
  },
];

const CLASSES = ['5-A', '5-B', '6-A', '6-B', '7-A', '7-B'];

const BLOOM_LEVELS = [
  { label: 'remember', displayName: 'Eslash', color: 'bg-red-500/15 text-red-400 border-red-500/25' },
  { label: 'understand', displayName: 'Tushunish', color: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  { label: 'apply', displayName: "Qo'llash", color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
  { label: 'analyze', displayName: 'Tahlil', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  { label: 'evaluate', displayName: 'Baholash', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  { label: 'create', displayName: 'Ijod etish', color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
];

const DURATIONS = [35, 40, 45, 80];

// ── Component ──────────────────────────────────────────────────────────
export default function AIPlanner() {
  // Real AI hooks
  const { generatePlan, generatedPlan, loading: planLoading, error: planError } = useLessonPlanner();
  const {
    messages: chatMessages,
    sendMessage,
    loading: chatLoading,
    error: chatError,
    credits
  } = useAIChat({
    contextType: 'lesson_plan',
    systemPrompt: 'Sen O\'zbekiston maktablari uchun dars rejalashtirish bo\'yicha AI yordamchisisisan. Murabbiylarning savollariga qisqa va amaliy javoblar ber.',
  });

  // Config state
  const [selectedModel, setSelectedModel] = useState<string>('5E');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(45);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  // Right panel state
  const [activeTab, setActiveTab] = useState<'chat' | 'plan'>('chat');
  const [chatInput, setChatInput] = useState('');

  const toggleBloom = (label: string) => {
    setSelectedBlooms((prev) =>
      prev.includes(label) ? prev.filter((b) => b !== label) : [...prev, label]
    );
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    await sendMessage(chatInput);
    setChatInput('');
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !selectedClass) {
      alert('Iltimos, mavzu va sinfni tanlang');
      return;
    }

    await generatePlan({
      classId: selectedClass,
      subjectId: subject || 'general',
      topic: topic.trim(),
      planningModel: selectedModel as PlanningModelType,
      bloomLevel: selectedBlooms.length > 0 ? (selectedBlooms[0] as BloomLevel) : undefined,
      duration,
    });

    // Show plan tab after generation
    if (generatedPlan) {
      setActiveTab('plan');
    }
  };

  const [configCollapsed, setConfigCollapsed] = useState(false);

  return (
    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 px-6 pt-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/20">
            <Brain className="size-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Dars Rejalashtirish</h1>
            <p className="text-sm text-muted-foreground">
              Sun'iy intellekt yordamida professional dars rejalarini yarating
            </p>
          </div>
        </div>

        {/* Credits Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="size-4 text-amber-400" />
          </motion.div>
          <span className="text-sm font-semibold text-amber-300/90">
            {credits} kredit qoldi
          </span>
        </motion.div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 min-h-0 flex gap-5">
        {/* ─── LEFT SIDE: Configuration Panel ─── */}
        <AnimatePresence initial={false}>
          {!configCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[340px] h-full flex flex-col gap-4 overflow-y-auto pr-2 pb-2">
          {/* Planning Model Selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Rejalashtirish modeli
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {PLANNING_MODELS.map((model) => (
                <motion.button
                  key={model.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedModel(model.id)}
                  className={`relative p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                    selectedModel === model.id
                      ? `${model.bg} ${model.border} ring-2 ${model.ring}`
                      : 'bg-card border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        selectedModel === model.id ? model.bg : 'bg-muted'
                      }`}
                    >
                      <span className={selectedModel === model.id ? model.color : 'text-muted-foreground'}>
                        {model.icon}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        selectedModel === model.id ? model.color : 'text-foreground'
                      }`}
                    >
                      {model.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                    {model.subtitle}
                  </p>
                  {selectedModel === model.id && (
                    <motion.div
                      layoutId="model-indicator"
                      className={`absolute top-2 right-2 size-2 rounded-full ${model.color.replace('text-', 'bg-')}`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Class Selector */}
          <div className="relative">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              <Users className="size-3.5 inline mr-1.5 -mt-0.5" />
              Sinf
            </label>
            <button
              onClick={() => setClassDropdownOpen(!classDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors text-sm cursor-pointer"
            >
              <span className={selectedClass ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {selectedClass || 'Sinfni tanlang'}
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${
                  classDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {classDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute z-20 mt-1 w-full rounded-xl bg-card border border-border shadow-xl overflow-hidden"
                >
                  {CLASSES.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        setSelectedClass(cls);
                        setClassDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-muted/60 transition-colors cursor-pointer ${
                        selectedClass === cls ? 'bg-muted font-semibold' : ''
                      }`}
                    >
                      {cls} sinf
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subject Input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              <BookOpen className="size-3.5 inline mr-1.5 -mt-0.5" />
              Fan
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Masalan: Matematika"
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
            />
          </div>

          {/* Topic Input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              <GraduationCap className="size-3.5 inline mr-1.5 -mt-0.5" />
              Mavzu
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: Pythagor teoremasi"
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
            />
          </div>

          {/* Bloom's Taxonomy */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
              Blum taksonomiyasi darajasi
            </label>
            <div className="flex flex-wrap gap-2">
              {BLOOM_LEVELS.map((level) => (
                <motion.button
                  key={level.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleBloom(level.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedBlooms.includes(level.label)
                      ? level.color
                      : 'bg-muted/40 text-muted-foreground border-transparent'
                  }`}
                >
                  {level.displayName}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
              <Clock className="size-3.5 inline mr-1.5 -mt-0.5" />
              Dars davomiyligi
            </label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <motion.button
                  key={d}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                    duration === d
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 ring-2 ring-emerald-500/20'
                      : 'bg-card border-border text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {d} daq
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error display */}
          {planError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600">
              {planError}
            </div>
          )}

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={planLoading}
            className="relative w-full py-3.5 rounded-xl font-bold text-white text-[15px] bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {planLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="size-5" />
                  </motion.div>
                  Yaratilmoqda...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  Dars reja yaratish
                </>
              )}
            </span>
            {/* Shimmer effect */}
            {!planLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
          </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Collapse/Expand Toggle ─── */}
        <div className="shrink-0 flex items-start pt-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setConfigCollapsed(!configCollapsed)}
            className="group relative w-8 h-14 rounded-xl bg-card border border-border hover:border-emerald-500/30 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
            title={configCollapsed ? "Panelni ochish" : "Panelni yopish"}
          >
            <motion.div
              animate={{ rotate: configCollapsed ? 0 : 180 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <ChevronDown className="size-4 text-muted-foreground group-hover:text-emerald-500 transition-colors -rotate-90" />
            </motion.div>
            {/* Decorative dots */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-500/20" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-emerald-500/20" />
          </motion.button>
        </div>

        {/* ─── RIGHT SIDE: Chat & Result Panel ─── */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0 bg-card rounded-2xl border border-border overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex shrink-0 border-b border-border">
            {[
              { key: 'chat' as const, label: 'Chat', icon: <MessageSquare className="size-4" /> },
              { key: 'plan' as const, label: 'Dars reja', icon: <FileText className="size-4" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all cursor-pointer relative ${
                  activeTab === tab.key
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/70'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-indigo-500"
                  />
                )}
                {tab.key === 'plan' && generatedPlan && (
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 min-h-0 flex flex-col"
                >
                  {/* Messages Area */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <MessageSquare className="size-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Assalomu alaykum! Dars reja haqida savol bering.</p>
                        </div>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-3 ${
                            msg.role === 'user' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="shrink-0 size-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/20 flex items-center justify-center">
                              <Sparkles className="size-4 text-emerald-500" />
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-emerald-500 to-indigo-500 text-white rounded-br-md'
                                : 'bg-muted/60 text-foreground rounded-bl-md'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {chatLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                      >
                        <div className="shrink-0 size-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/20 flex items-center justify-center">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                            <Sparkles className="size-4 text-emerald-500" />
                          </motion.div>
                        </div>
                        <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-bl-md">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="shrink-0 p-4 border-t border-border">
                    {chatError && (
                      <div className="mb-2 p-2 text-xs text-red-600 bg-red-500/10 rounded-lg">
                        {chatError}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Savolingizni yozing..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-muted/40 border border-border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={chatLoading || !chatInput.trim()}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 text-white hover:from-emerald-600 hover:to-indigo-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="size-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 min-h-0 flex flex-col"
                >
                  {generatedPlan ? (
                    <>
                      {/* Plan Content */}
                      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
                        {/* Plan Header */}
                        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/15 p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-lg font-bold text-foreground mb-1">
                                {generatedPlan.title}
                              </h2>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Lightbulb className="size-3.5 text-emerald-500" />
                                  {generatedPlan.planning_model}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3.5 text-indigo-500" />
                                  {generatedPlan.duration} daqiqa
                                </span>
                                {selectedClass && (
                                  <span className="flex items-center gap-1">
                                    <Users className="size-3.5 text-amber-500" />
                                    {selectedClass} sinf
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <Sparkles className="size-3.5 text-emerald-500" />
                              <span className="text-xs font-semibold text-emerald-500">
                                AI yaratgan
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Plan Structure Display */}
                        <div className="space-y-3">
                          {generatedPlan.lesson_structure && typeof generatedPlan.lesson_structure === 'object' && (
                            <div>
                              {Object.entries(generatedPlan.lesson_structure).map(([key, value]: [string, any]) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="rounded-xl bg-card border border-border p-4 hover:shadow-md transition-shadow mb-3"
                                >
                                  <h3 className="text-sm font-bold text-foreground mb-2 capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Objectives */}
                        {generatedPlan.objectives && generatedPlan.objectives.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold text-foreground mb-3">Maqsadlar</h3>
                            <div className="space-y-2">
                              {generatedPlan.objectives.map((obj: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                                  <span className="text-xs font-semibold text-emerald-500 mt-0.5">✓</span>
                                  <span className="text-sm text-foreground">{obj}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Export Button */}
                      <div className="shrink-0 p-4 border-t border-border">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer"
                        >
                          <Download className="size-4" />
                          PDF formatda yuklab olish
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                      <div className="size-20 rounded-2xl bg-muted/40 flex items-center justify-center mb-5">
                        <FileText className="size-10 text-muted-foreground/30" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Dars reja hali yaratilmadi
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Chap paneldan parametrlarni to'ldiring va "Dars reja yaratish" tugmasini
                        bosing. AI sizga professional dars reja tayyorlab beradi.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
