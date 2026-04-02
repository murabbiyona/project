import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Check,
  Copy,
  Mic,
  Sparkles,
} from 'lucide-react';
import {
  teacherAssistantPrompts,
  teacherIntegrationReadiness,
  teacherWorkflowCards,
} from '../../data/teacherMobile';
import { fadeUpItem, pageTransition, staggerContainer } from '../../lib/mobileMotion';

export default function MobileAssistant() {
  return (
    <motion.div
      className="space-y-5 pb-4"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.section
        variants={fadeUpItem}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-5 text-white shadow-xl"
      >
        <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/75 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              Ustoz uchun yangi modul
            </div>
            <h1 className="mt-3 text-2xl font-bold">AI Yordam</h1>
            <p className="mt-2 max-w-[260px] text-sm leading-6 text-white/70">
              Promptlar, workflow va keyingi integratsiyalar uchun tayyor mobil ekran.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-3 backdrop-blur-sm">
            <Brain className="h-7 w-7 text-emerald-300" />
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {teacherIntegrationReadiness.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-wide text-white/50">{item.progress}</p>
              <p className="mt-2 text-sm font-semibold leading-5">{item.title}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Prompt kutubxonasi</h2>
            <p className="text-sm text-zinc-500">Yangi funksiyalar uchun tayyor andozalar</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {teacherAssistantPrompts.length} ta
          </span>
        </div>

        {teacherAssistantPrompts.map((prompt) => (
          <motion.article
            key={prompt.id}
            variants={fadeUpItem}
            className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-zinc-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">{prompt.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{prompt.description}</p>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500"
                aria-label={`${prompt.title} promptini nusxalash`}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 rounded-2xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
              {prompt.prompt}
            </p>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700"
            >
              Ishlatishga tayyor
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.article>
        ))}
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Feature readiness</h2>
          <p className="text-sm text-zinc-500">Yangi xususiyatlar qo‘shish uchun tayyor bloklar</p>
        </div>

        {teacherWorkflowCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={fadeUpItem}
              className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-zinc-100"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900">{card.title}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${card.accent}`}>
                      {card.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{card.summary}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      <motion.section
        variants={fadeUpItem}
        initial="hidden"
        animate="show"
        className="rounded-[24px] border border-dashed border-zinc-300 bg-zinc-50 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Keyingi modulga tayyor</h2>
            <p className="text-sm text-zinc-500">Voice helper, push va AI chat shu ekran ustiga ulanadi.</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {teacherIntegrationReadiness.map((item) => (
            <div key={item.title} className="flex items-start gap-2 text-sm text-zinc-600">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium text-zinc-800">{item.title}</p>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
