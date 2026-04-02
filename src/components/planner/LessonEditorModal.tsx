import { 
  X, Check, Image as ImageIcon, Undo2, Redo2, Bold, Italic, 
  Underline, Strikethrough, Eraser,
  List, ListOrdered, Code, Minus, Link2, Sigma, Plus, ChevronDown, PenLine
} from 'lucide-react';


export function LessonEditorModal({ onClose }: { onClose: () => void }) {

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-8 animate-in fade-in duration-200">
      <div className="bg-white rounded-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-[960px] h-full max-h-[85vh] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100/60 shrink-0">
           <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
             <Check className="w-4 h-4 text-emerald-500" />
             Saqlandi
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 text-white rounded-lg overflow-hidden shadow-sm transition-transform active:scale-95">
                <button className="flex items-center gap-2 text-[12px] font-bold px-4 py-2 hover:bg-slate-700 transition-colors border-r border-slate-700/50">
                   <PenLine className="w-4 h-4" />
                   Tahrirchini ochish
                </button>
                <button className="px-2 py-2 hover:bg-slate-700 transition-colors flex items-center justify-center">
                   <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-[100px] py-[60px] custom-scrollbar flex flex-col">
           
           {/* Cover Image Placeholder */}
           <div className="w-full h-[180px] border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-500 transition-colors cursor-pointer mb-12">
              <ImageIcon className="w-8 h-8 opacity-60" />
              <span className="text-[13px] font-extrabold tracking-tight">Muqova rasmini qo'shish</span>
           </div>

           {/* Title */}
           <h1 className="text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
             Sarlavhasiz dars
           </h1>

           {/* Toolbar (Rich Text Editor Mock) */}
           <div className="flex flex-wrap items-center gap-1.5 mb-10 text-slate-400">
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Undo2 className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Redo2 className="w-4 h-4" /></button>
             <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Bold className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Italic className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Underline className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Strikethrough className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Eraser className="w-4 h-4" /></button>
             <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
             <button className="p-1 hover:bg-slate-100 hover:text-slate-700 rounded text-[13px] font-black">H1</button>
             <button className="p-1 hover:bg-slate-100 hover:text-slate-700 rounded text-[13px] font-black">H2</button>
             <button className="p-1 hover:bg-slate-100 hover:text-slate-700 rounded text-[13px] font-black">H3</button>
             <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
             <button className="p-1.5 flex items-center gap-0.5 hover:bg-slate-100 hover:text-slate-700 rounded"><List className="w-4 h-4" /><ChevronDown className="w-3 h-3" /></button>
             <button className="p-1.5 flex items-center gap-0.5 hover:bg-slate-100 hover:text-slate-700 rounded"><ListOrdered className="w-4 h-4" /><ChevronDown className="w-3 h-3" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Code className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Minus className="w-4 h-4" /></button>
             <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Link2 className="w-4 h-4" /></button>
             <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Sigma className="w-4 h-4" /></button>
             <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
             <button className="p-1.5 flex items-center gap-0.5 hover:bg-slate-100 hover:text-slate-700 rounded"><Plus className="w-4 h-4" /><ChevronDown className="w-3 h-3" /></button>
           </div>

           {/* Content Editor Area */}
           <div className="flex-1 flex flex-col">
              <h2 className="text-[28px] font-bold text-slate-300 tracking-tight mb-4">Sarlavha...</h2>
              <p className="text-[15px] text-slate-400 cursor-text flex-1">
                Dars mazmunini yozishni boshlang.
              </p>
           </div>

        </div>
      </div>
    </div>
  );
}
