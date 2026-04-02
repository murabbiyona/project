import { useState } from 'react';
import { X, Check, Shield, Sparkles } from 'lucide-react';

interface ProModalProps {
  onClose: () => void;
}

export default function ProModal({ onClose }: ProModalProps) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" style={{ fontFamily: "'Urbanist', sans-serif" }}>
       <div className="bg-white w-[900px] h-[500px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-300 flex overflow-hidden">
          
          {/* Left Panel */}
          <div className="w-1/2 p-10 flex flex-col bg-white">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                 <Sparkles className="w-5 h-5" />
               </div>
               <h2 className="text-[24px] font-black text-slate-800">Pro Plan</h2>
             </div>

             <div className="flex bg-slate-100 p-1 rounded-full mb-8 shadow-inner w-[240px]">
                <button 
                  onClick={() => setPlan('monthly')}
                  className={`flex-1 py-1.5 rounded-full text-[13px] font-bold transition-all ${plan === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setPlan('annual')}
                  className={`flex-1 py-1.5 rounded-full text-[13px] font-bold transition-all ${plan === 'annual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Annual
                </button>
             </div>

             <div className="mb-8">
               <div className="flex items-baseline gap-2">
                 <span className="text-[42px] font-black text-slate-800 tracking-tight">${plan === 'monthly' ? '12' : '9'}</span>
                 <span className="text-[16px] font-bold text-slate-500">/month</span>
                 {plan === 'annual' && (
                    <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md">SAVE 25%</span>
                 )}
               </div>
               <p className="text-[13px] font-medium text-slate-500 mt-1">
                 {plan === 'monthly' ? 'Billed monthly. Switch to annual to save.' : '$108 billed annually.'}
               </p>
             </div>

             <div className="space-y-6 flex-1">
               <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-800 mb-0.5">Unlimited Everything</h4>
                    <p className="text-[13px] font-medium text-slate-500 leading-snug">Classes, students, lessons, and grades — no caps, ever.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-800 mb-0.5">Gradebook & Attendance</h4>
                    <p className="text-[13px] font-medium text-slate-500 leading-snug">Weighted categories, report cards, and daily tracking.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-800 mb-0.5">AI-Powered Lesson Planning</h4>
                    <p className="text-[13px] font-medium text-slate-500 leading-snug">100K credits to generate full lesson plans in seconds.</p>
                  </div>
               </div>
             </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 bg-[#fafafa] border-l border-slate-100 p-10 flex flex-col relative">
             <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
               <X className="w-5 h-5" />
             </button>

             <div className="flex-1 flex flex-col justify-center max-w-[340px] mx-auto w-full">
                
                <div className="space-y-4 mb-8">
                  <div className="space-y-1.5">
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm flex items-center justify-between focus-within:border-emerald-500 transition-colors">
                       <input type="text" placeholder="Card number" className="bg-transparent font-medium text-[14px] outline-none w-full placeholder:text-slate-400" />
                       <div className="flex items-center gap-1 opacity-50">
                         <div className="w-7 h-4 bg-blue-600 rounded-[2px]" />
                         <div className="w-7 h-4 bg-red-500 rounded-[2px]" />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm focus-within:border-emerald-500 transition-colors">
                       <input type="text" placeholder="Expiration date" className="bg-transparent font-medium text-[14px] outline-none w-full placeholder:text-slate-400" />
                    </div>
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm flex items-center justify-between focus-within:border-emerald-500 transition-colors">
                       <input type="text" placeholder="Security code" className="bg-transparent font-medium text-[14px] outline-none w-full placeholder:text-slate-400" />
                       <span className="text-[10px] bg-slate-100 px-1 rounded font-bold text-slate-400">123</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Country</label>
                     <div className="flex items-center justify-between">
                       <span className="text-[14px] font-medium text-slate-800">Uzbekistan</span>
                       <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                     </div>
                  </div>
                </div>

                <button className="w-full bg-[#10b981] text-white rounded-xl py-4 text-[15px] font-black hover:bg-[#059669] transition-colors shadow-lg shadow-emerald-500/20 mb-6">
                   Upgrade to Pro
                </button>

                <p className="text-[11px] font-medium text-slate-500 text-center leading-relaxed px-4 mb-6">
                   By providing your card information, you allow EMStudio to charge your card for future payments in accordance with our Terms and Privacy Policy.
                </p>

                <div className="flex items-center justify-center gap-1.5 text-slate-400">
                   <Shield className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Stripe</span>
                </div>

             </div>
          </div>
       </div>
    </div>
  );
}
