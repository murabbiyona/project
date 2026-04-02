import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Send, Copy, CheckCircle, Unlink } from 'lucide-react';
import { useTelegramLink } from '../hooks/useTelegramLink';

const faqs = [
  { q: 'How do I upgrade or downgrade my plan?', a: 'You can upgrade or downgrade your plan at any time from this page. Simply click the "Upgrade to Pro" button on the Pro plan card. Changes take effect immediately, and billing will be prorated.' },
  { q: 'Can I cancel my subscription?', a: null },
  { q: 'What payment methods do you accept?', a: null },
  { q: 'Do you offer refunds?', a: null },
  { q: 'What happens to my data if I downgrade?', a: null },
];

export default function Subscription() {
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { linkCode, isLinked, loading: telegramLoading, generateCode, unlinkTelegram } = useTelegramLink();
  const [copied, setCopied] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  const handleGenerateCode = async () => {
    setGeneratingCode(true);
    await generateCode();
    setGeneratingCode(false);
  };

  const handleCopyCode = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-10">

      {/* Current Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usage Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="font-semibold text-slate-700 text-[15px] mb-5">Usage Details</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5 text-slate-600">
                <span className="flex items-center gap-1.5 font-medium"><span>✨</span> AI Magic</span>
                <span className="text-slate-400">99,732 / 100,000 credits</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-800 rounded-full" style={{ width: '99.7%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5 text-slate-600">
                <span className="flex items-center gap-1.5 font-medium"><span>💾</span> Storage</span>
                <span className="text-slate-400">30.93 MB / 100 GB</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '0.03%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pro Plan Features */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="font-semibold text-slate-700 text-[15px] mb-5">Pro Plan Features</h3>
          <ul className="space-y-2.5">
            {[
              ['Unlimited', 'classes & students'],
              ['Unlimited', 'lessons & grades'],
              [null, 'Full grade & attendance tracking'],
              [null, '100,000 AI credits'],
              [null, '100 GB storage'],
              [null, 'Community chat'],
              [null, 'Task management'],
              [null, 'Priority email support'],
            ].map(([bold, rest], i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {bold ? <><strong>{bold}</strong>&nbsp;{rest}</> : rest}
              </li>
            ))}
          </ul>
        </div>

        {/* Billing & Payment */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="font-semibold text-slate-700 text-[15px] mb-5">Billing & Payment</h3>
          <div className="space-y-3">
            {[
              { label: 'Price', value: '$9 / mo' },
              { label: 'Status', value: 'Trial' },
              { label: 'Next billing', value: 'Trial ends Apr 25' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{row.label}</span>
                <span className="text-sm font-medium text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Telegram Integration */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-[15px]">Telegram ulash</h3>
            <p className="text-xs text-slate-500">Dars yakuni va baho xabarnomalarini Telegramda oling</p>
          </div>
        </div>

        {telegramLoading ? (
          <div className="text-sm text-slate-400">Yuklanmoqda...</div>
        ) : isLinked ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Telegram ulangan ✓</span>
            </div>
            <button
              onClick={unlinkTelegram}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              <Unlink className="w-3.5 h-3.5" />
              Uzish
            </button>
          </div>
        ) : linkCode ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Telegram botga quyidagi kodni yuboring:
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-lg font-bold text-slate-900 tracking-wider text-center">
                {linkCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Nusxalash"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-500" />}
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
              <strong>Qadamlar:</strong><br />
              1. Telegram da <strong>@MurabbiyonaBot</strong> ni toping<br />
              2. <strong>/start {linkCode}</strong> yuboring<br />
              3. Bot avtomatik hisobingizni ulaydi ✓
            </div>
          </div>
        ) : (
          <button
            onClick={handleGenerateCode}
            disabled={generatingCode}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {generatingCode ? 'Kod yaratilmoqda...' : 'Telegram ulash kodini olish'}
          </button>
        )}
      </div>

      {/* Pricing Plans */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose the right plan for you</h2>
        <p className="text-slate-500 mb-8">Upgrade or switch plans anytime. All your data carries over — nothing is lost.</p>

        <div className="inline-flex items-center bg-slate-100 rounded-full p-1 mb-10 gap-1">
          <button
            onClick={() => setBilling('yearly')}
            className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all ${billing === 'yearly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Yearly Billing
          </button>
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all ${billing === 'monthly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Monthly Billing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Free</h3>
            <p className="text-sm text-slate-500 mb-6">Read-only access after trial</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <div className="text-xs text-slate-400 mt-1">Free forever</div>
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">After trial ends</div>
            <ul className="space-y-2.5 flex-1">
              {['View-only access to all data', 'Browse classes, lessons & students', 'View grades & attendance records'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}</li>
              ))}
              {['No creating or editing', 'No AI credits', 'No file uploads'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-400"><X className="w-4 h-4 text-slate-300 flex-shrink-0" />{f}</li>
              ))}
            </ul>
            <button className="mt-8 w-full border border-slate-300 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Get Started</button>
          </div>

          {/* Pro — Most Popular */}
          <div className="bg-white rounded-2xl border-2 border-slate-800 shadow-xl p-6 flex flex-col relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Pro</h3>
            <p className="text-sm text-slate-500 mb-6">Everything you need, no limits</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">$9</span>
              <span className="text-slate-500 text-sm">/month</span>
              <div className="text-xs text-slate-400 mt-1">Billed annually ($108/yr)</div>
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Includes</div>
            <ul className="space-y-2.5 flex-1">
              {[
                ['Unlimited', 'classes & students'],
                ['Unlimited', 'lessons & grades'],
                [null, 'Full grade & attendance tracking'],
                [null, '100,000 AI credits'],
                [null, '100 GB storage'],
                [null, 'Community chat'],
                [null, 'Task management'],
                [null, 'Priority email support'],
              ].map(([bold, rest], i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {bold ? <><strong>{bold}</strong>&nbsp;{rest}</> : rest}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full bg-slate-800 text-white rounded-xl py-3 text-sm font-semibold hover:bg-slate-900 transition-colors">Subscribe Now</button>
          </div>

          {/* School */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-1">School</h3>
            <p className="text-sm text-slate-500 mb-6">For departments & whole schools</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">$7</span>
              <span className="text-slate-500 text-sm"> /seat/month</span>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Billed annually · Minimum 5 seats</div>
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Everything in Pro, Plus</div>
            <ul className="space-y-2.5 flex-1">
              {['Admin dashboard & reporting', 'Shared lesson libraries', 'Bulk student & class imports', 'School-wide analytics', 'SSO / Google Workspace login', '500 GB shared storage', '300,000 AI credits / seat', 'Dedicated onboarding support'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}</li>
              ))}
            </ul>
            <button className="mt-8 w-full border border-slate-300 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Contact Us</button>
          </div>
        </div>

        <p className="text-sm text-slate-500 mt-8 max-w-xl mx-auto">
          <strong>What happens after your trial?</strong> Your data stays. Classes, students, and grades you entered during the trial become read-only on Free. Upgrade anytime to pick up right where you left off — nothing is deleted.
        </p>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left text-[15px] font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && faq.a && (
                <div className="px-6 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
