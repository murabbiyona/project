export function RemoveLessonModal({ onClose, onConfirm, targetName }: { onClose: () => void, onConfirm: () => void, targetName: string }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[420px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Content */}
        <div className="px-6 py-6 pb-4 shrink-0">
           <h2 className="font-extrabold text-slate-900 text-[18px] tracking-tight mb-2">
             Darsni olib tashlash
           </h2>
           <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
             Ushbu jadval o'rnidan "{targetName}"ni olib tashlamoqchimisiz?
           </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-[13px] text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors active:scale-95 shadow-sm">
            Bekor qilish
          </button>
          <button onClick={onConfirm} className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white bg-slate-800 hover:bg-slate-900 transition-colors active:scale-95 shadow-md">
            Uzish
          </button>
        </div>

      </div>
    </div>
  );
}
