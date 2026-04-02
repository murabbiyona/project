import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileDown,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  FileText,
  Settings,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  FileType,
} from 'lucide-react';
import {
  type ExamQuestion,
  type ExamVariant,
  generatePaperExamPDF,
  createVariants,
} from '../lib/paperExamPdf';
import { exportQuestionsDocx, exportQuestionsPdf } from '../lib/exportExamQuestions';
import { parseExamExcel, downloadExcelTemplate } from '../lib/parseExamExcel';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const OPTION_LABELS = ['A', 'B', 'D', 'E'] as const;
const MAX_QUESTIONS = 40;

// ─── Mock class data (same as Grading.tsx) ────────────────────────────────────
const MOCK_STUDENTS: Record<string, { id: string; name: string }[]> = {
  '7-D': [
    { id: 's1', name: 'Abdulhamid Malikov' },
    { id: 's2', name: "Abror Jo'rayev" },
    { id: 's3', name: 'Charos Abdusalomova' },
    { id: 's4', name: 'Elyor Alisherov' },
    { id: 's5', name: 'Farrux Boynazarov' },
    { id: 's6', name: 'Jonibek Abdujalilov' },
    { id: 's7', name: 'Manzura Ergasheva' },
    { id: 's8', name: 'Mohinur Abdurasulova' },
    { id: 's9', name: "Mohinur Jo'rayeva" },
    { id: 's10', name: 'Muborak Abdushukurova' },
    { id: 's11', name: 'Mushtariy Bahriddinova' },
    { id: 's12', name: 'Odil Abrayev' },
    { id: 's13', name: 'Shahrizoda Abdumalikova' },
    { id: 's14', name: 'Shohjahon Esonov' },
    { id: 's15', name: 'Shukurullo Abdumurotov' },
    { id: 's16', name: 'Zilola Eshmirzayeva' },
  ],
};

function createEmptyQuestion(): ExamQuestion {
  return {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    text: '',
    options: ['', '', '', ''], // Default 4 options (2–4 supported)
    correctAnswer: 0,
  };
}

/** ≤20 → 1 block; 21–40 → 2 equal blocks */
function blockCounts(numQ: number): number[] {
  if (numQ <= 20) return [numQ];
  const top = Math.ceil(numQ / 2);
  return [top, numQ - top];
}

// ─── Export Dropdown Component ───────────────────────────────────────────────
function ExportDropdown({
  disabled,
  isGeneratingPDF,
  onBlanki,
  onQuestionsDocx,
  onQuestionsPdf,
}: {
  disabled: boolean;
  isGeneratingPDF: boolean;
  onBlanki: () => void;
  onQuestionsDocx: () => void;
  onQuestionsPdf: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isGeneratingPDF}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGeneratingPDF ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        Yuklab olish
        <ChevronDown className={`w-4 h-4 ml-1 opacity-70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border shadow-lg rounded-xl overflow-hidden py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <button 
              onClick={() => { setIsOpen(false); onBlanki(); }} 
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-sm transition-colors text-left"
            >
              <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Javob blanki (PDF)</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">O'quvchilar test ishlashi uchun</span>
              </div>
            </button>
            <button 
              onClick={() => { setIsOpen(false); onQuestionsDocx(); }} 
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-sm transition-colors border-t border-border/50 text-left"
            >
              <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                <FileType className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Savollar (DOCX)</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">MS Word'da tahrirlash uchun</span>
              </div>
            </button>
            <button 
              onClick={() => { setIsOpen(false); onQuestionsPdf(); }} 
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-sm transition-colors border-t border-border/50 text-left"
            >
              <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                <FileDown className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Savollar (PDF)</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">Shu zahoti chop etish uchun</span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onMove,
  total,
}: {
  question: ExamQuestion;
  index: number;
  onUpdate: (q: ExamQuestion) => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  total: number;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${
      question.text ? 'border-border' : 'border-destructive/40'
    }`}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
        <div className="text-muted-foreground cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">{index + 1}</span>
        </div>
        <p className="flex-1 text-sm font-medium truncate text-foreground/80">
          {question.text || <span className="text-muted-foreground italic">Savol matni yo'q...</span>}
        </p>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            {collapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Card body */}
      {!collapsed && (
        <div className="px-4 py-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Savol matni
            </label>
            <textarea
              className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              rows={2}
              placeholder={`${index + 1}-savol matnini kiriting...`}
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {question.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...question,
                      correctAnswer: optIdx,
                    })
                  }
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    question.correctAnswer === optIdx
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {OPTION_LABELS[optIdx]}
                </button>
                <input
                  className="flex-1 bg-background border border-input rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  placeholder={`${OPTION_LABELS[optIdx]} variant`}
                  value={opt}
                  onChange={(e) => {
                    const opts = [...question.options];
                    opts[optIdx] = e.target.value;
                    onUpdate({ ...question, options: opts });
                  }}
                />
              </div>
            ))}
            
            {/* Remove option button (min 2) */}
            {question.options.length > 2 && (
              <button
                onClick={() => {
                  const opts = question.options.slice(0, -1);
                  onUpdate({ 
                    ...question, 
                    options: opts,
                    correctAnswer: question.correctAnswer >= opts.length ? 0 : question.correctAnswer
                  });
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/5 rounded-lg transition-all"
              >
                <Trash2 className="w-3 h-3" />
                Variantni olib tashlash
              </button>
            )}
            {/* Add option button (max 4) */}
            {question.options.length < 4 && (
              <button
                onClick={() => {
                  const opts = [...question.options, ''];
                  onUpdate({ ...question, options: opts });
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-border rounded-lg text-[11px] font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                {OPTION_LABELS[question.options.length]}-variant qo'shish
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {question.correctAnswer !== undefined && (
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                To'g'ri javob: {OPTION_LABELS[question.correctAnswer]}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bubble Preview ───────────────────────────────────────────────────────────
function BubblePreview({ questions, variantLetter }: { questions: ExamQuestion[]; variantLetter: string }) {
  const numQ = questions.length;
  if (numQ === 0) return null;

  const blocks = blockCounts(numQ);
  const maxOpts = Math.max(2, ...questions.map(q => q.options.length));

  return (
    <div className="bg-white border border-border rounded-xl p-4 text-[8px] font-mono shadow-sm">
      {/* Mini header */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200">
        <div>
          <div className="font-bold text-[9px] text-gray-800">MURABBIYONA · JAVOB BLANKI</div>
          <div className="text-gray-500 mt-0.5 text-[7px]">O'quvchi ismi · Sinf · Sana</div>
        </div>
        <div className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
          VAR. {variantLetter}
        </div>
      </div>

      {/* Instructions mini */}
      <div className="flex items-center gap-3 mb-3 text-[7px] text-gray-400">
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"></span> bo'sh</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-800"></span> to'g'ri</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300 relative"><span className="absolute inset-0 flex items-center justify-center text-[6px] text-gray-400">✕</span></span> noto'g'ri</span>
      </div>

      <div className="space-y-4">
        {(() => {
          let qCursor = 0;
          return blocks.map((bq, b) => {
            const startIdx = qCursor;
            qCursor += bq;
            return (
              <div key={b} className="space-y-1">
                {/* Question numbers */}
                <div className="flex pl-5">
                  {Array.from({ length: bq }, (_, i) => (
                    <div key={i} className="w-[16px] text-center text-gray-400 font-bold text-[7px]">
                      {startIdx + i + 1}
                    </div>
                  ))}
                </div>
                {/* Rows for A, B, D, E */}
                {Array.from({ length: maxOpts }, (_, optIdx) => (
                  <div key={optIdx} className="flex items-center">
                    <div className="w-5 text-[8px] font-bold text-gray-700">{OPTION_LABELS[optIdx]}</div>
                    <div className="flex">
                      {Array.from({ length: bq }, (_, qIdx) => {
                        const absoluteIdx = startIdx + qIdx;
                        const isCorrect = questions[absoluteIdx]?.correctAnswer === optIdx;
                        return (
                          <div key={qIdx} className="w-[16px] flex justify-center">
                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                              isCorrect 
                                ? 'bg-gray-800 border-gray-800 text-white' 
                                : 'border-gray-300 text-transparent'
                            }`}>
                              •
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          });
        })()}
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-1.5 border-t border-gray-100 flex justify-between text-[6px] text-gray-400">
        <span>murabbiyona.uz</span>
        <span>Imzo: ____________</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PaperExamEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId') || '7-D';
  const examTitle = searchParams.get('title') || 'Yangi test';

  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('paper_exam_questions_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse draft from localStorage', e);
    }
    return [createEmptyQuestion()];
  });
  
  useEffect(() => {
    localStorage.setItem('paper_exam_questions_draft', JSON.stringify(questions));
  }, [questions]);

  const [variantCount, setVariantCount] = useState<2 | 3 | 4>(2);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const students = MOCK_STUDENTS[classId] || MOCK_STUDENTS['7-D'];
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const examId = `exam_${Date.now().toString(36)}`;
  const today = new Date().toLocaleDateString('uz-UZ');

  // ─── Question operations ──────────────────────────────────────────
  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) {
      setImportError(`Maksimal ${MAX_QUESTIONS} ta savol qo'shish mumkin!`);
      return;
    }
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const updateQuestion = useCallback((index: number, updated: ExamQuestion) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const deleteQuestion = useCallback((index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveQuestion = useCallback((index: number, dir: 'up' | 'down') => {
    setQuestions((prev) => {
      const next = [...prev];
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  // ─── Excel import ─────────────────────────────────────────────────
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccess(null);

    try {
      const imported = await parseExamExcel(file);
      setQuestions((prev) => [...prev.filter((q) => q.text.trim()), ...imported]);
      setImportSuccess(`${imported.length} ta savol muvaffaqiyatli import qilindi`);
      setTimeout(() => setImportSuccess(null), 4000);
    } catch (err) {
      setImportError(String(err));
    }
    e.target.value = '';
  };

  // ─── PDF generation ───────────────────────────────────────────────
  const handleGeneratePDF = async () => {
    const validQuestions = questions.filter((q) => q.text.trim());
    if (validQuestions.length === 0) {
      setImportError('Avval kamida 1 ta savol kiriting!');
      return;
    }

    setIsGeneratingPDF(true);
    setImportError(null);
    try {
      const variants: ExamVariant[] = createVariants(validQuestions, variantCount);
      await generatePaperExamPDF(
        students,
        variants,
        classId,
        examId,
        examTitle,
        today,
      );
    } catch (err) {
      setImportError('PDF yaratishda xatolik: ' + String(err));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // ─── Save to Database ─────────────────────────────────────────────
  const handleSaveAssessment = async () => {
    const validQuestions = questions.filter((q) => q.text.trim());
    if (validQuestions.length === 0) {
      setImportError('Kamida 1 ta savol boʻlishi shart!');
      return;
    }

    // REMOVED FOR TESTING: Allow saving without login
    // if (!user) {
    //   setImportError('Tizimga kirmagansiz!');
    //   return;
    // }

    setIsSaving(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      // 1. Variant data (answer keys)
      const variantsData: Record<string, number[]> = {};
      const generatedVariants = createVariants(validQuestions, variantCount);
      
      generatedVariants.forEach(v => {
        variantsData[v.letter] = v.questions.map(q => q.correctAnswer);
      });

      // 2. Insert or Update assessment session
      const { error: dbErr } = await supabase
        .from('assessments')
        .insert({
          teacher_id: user?.id || '00000000-0000-0000-0000-000000000000',
          class_id: classId, // Assuming actual UUID here in real app
          title: examTitle,
          assessment_type: 'summative',
          method: 'qr_code', // Mobile scan mode
          total_points: validQuestions.length,
          questions_count: validQuestions.length,
          variant_count: variantCount,
          answer_key: variantsData,
          status: 'active'
        })
        .select()
        .single();

      if (dbErr) throw dbErr;

      setImportSuccess('Assessment muvaffaqiyatli saqlandi! Endi uni skanerlash mumkin.');
      setTimeout(() => setImportSuccess(null), 5000);
    } catch (err: any) {
      setImportError('Saqlashda xatolik: ' + (err?.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const validCount = questions.filter((q) => q.text.trim()).length;
  const previewVariants = createVariants(questions.filter((q) => q.text.trim()), variantCount);

  return (
    <div className="flex flex-col h-screen bg-pattern-active overflow-hidden">
      {/* ─── Top Bar ──────────────────────────────────────────────── */}
      <div className="shrink-0 bg-card border-b border-border px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-base font-bold text-foreground truncate">{examTitle}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{classId}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Qog'oz test blanki • {students.length} o'quvchi • {validCount} savol
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Ko'rinish
          </button>
        </div>

        {/* ── Export Dropdown ── */}
        <ExportDropdown
          disabled={validCount === 0}
          isGeneratingPDF={isGeneratingPDF}
          onBlanki={handleGeneratePDF}
          onQuestionsDocx={async () => {
            const variants = createVariants(questions.filter(q => q.text.trim()), variantCount);
            await exportQuestionsDocx(variants, examTitle);
          }}
          onQuestionsPdf={async () => {
            const variants = createVariants(questions.filter(q => q.text.trim()), variantCount);
            await exportQuestionsPdf(variants, examTitle);
          }}
        />

        {/* Save Assessment Button */}
        <button
          onClick={handleSaveAssessment}
          disabled={validCount === 0 || isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Saqlash
        </button>
      </div>

      {/* ─── Notifications ────────────────────────────────────────── */}
      {(importError || importSuccess) && (
        <div className={`shrink-0 mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
          importError
            ? 'bg-destructive/10 border-destructive/30 text-destructive'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {importError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span className="flex-1">{importError || importSuccess}</span>
          <button onClick={() => { setImportError(null); setImportSuccess(null); }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex gap-0 overflow-hidden">

        {activeTab === 'editor' ? (
          <>
            {/* ── Left: Question editor ── */}
            <div className="flex-1 min-w-0 overflow-y-auto px-6 py-5 space-y-3 custom-scrollbar">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-foreground">
                  Savollar
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({validCount}/{questions.length} to'ldirilgan)
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileImport}
                  />
                  <button
                    onClick={() => downloadExcelTemplate()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border/80 rounded-lg transition-colors bg-card"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Shablon
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded-lg transition-colors bg-card hover:bg-muted"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Excel import
                  </button>
                </div>
              </div>

              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  onUpdate={(updated) => updateQuestion(idx, updated)}
                  onDelete={() => deleteQuestion(idx)}
                  onMove={(dir) => moveQuestion(idx, dir)}
                  total={questions.length}
                />
              ))}

              <button
                onClick={addQuestion}
                className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary transition-all"
              >
                <Plus className="w-4 h-4" />
                Savol qo'shish
              </button>
            </div>

            {/* ── Right: Settings panel ── */}
            <div className="w-72 shrink-0 border-l border-border bg-card overflow-y-auto px-5 py-5 space-y-5 custom-scrollbar">

              {/* Variant settings */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Variantlar</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {([2, 3, 4] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setVariantCount(n)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        variantCount === n
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {`${variantCount} ta variant — savollar har birida aralashtiriladi`}
                </p>
              </div>

              {/* Class & students */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">O'quvchilar</h3>
                <div className="bg-muted/50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Sinf</span>
                    <span className="text-xs font-bold text-foreground">{classId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">O'quvchilar soni</span>
                    <span className="text-xs font-bold text-foreground">{students.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Jami betlar</span>
                    <span className="text-xs font-bold text-foreground">
                      {Math.ceil(students.length / 2)}
                    </span>
                  </div>
                </div>

                {/* Students list */}
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                  {students.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">
                          {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-xs text-foreground truncate flex-1">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        Var. {['A', 'B', 'D', 'E'][i % variantCount]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Summary */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">PDF haqida</h3>
                <div className="space-y-2">
                  {[
                    ['Format', 'A4 portrait'],
                    ['Savollar', `${validCount} / ${MAX_QUESTIONS} ta`],
                    ['Variantlar', `${variantCount} ta`],
                    ['QR kod', 'Har bir blanki uchun'],
                    ['O\'quvchilar', `${students.length} ta`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── Preview tab ── */
          <div className="flex-1 min-w-0 overflow-y-auto px-6 py-5 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-foreground">
                  Test blanki ko'rinishi
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    (A4 da 2 ta o'quvchi yonma-yon joylashadi)
                  </span>
                </h2>
                <span className="text-xs text-muted-foreground">
                  Variant{variantCount > 1 ? 'lar' : ''}: {previewVariants.map((v) => v.letter).join(', ')}
                </span>
              </div>

              {validCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ko'rinish uchun kamida 1 ta savol kiriting
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* A4 simulation — 2 A5 side by side */}
                  {Array.from({ length: Math.ceil(students.length / 2) }, (_, pageIdx) => {
                    const leftIdx = pageIdx * 2;
                    const rightIdx = pageIdx * 2 + 1;
                    return (
                      <div key={pageIdx}>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">
                          {pageIdx + 1}-bet
                        </p>
                        <div className="flex gap-2 bg-gray-100 rounded-xl p-4 border border-border">
                          {/* Left blank */}
                          <div className="flex-1">
                            <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                              {students[leftIdx]?.name}
                            </p>
                            <BubblePreview
                              questions={previewVariants[leftIdx % variantCount]?.questions || []}
                              variantLetter={previewVariants[leftIdx % variantCount]?.letter || 'A'}
                            />
                          </div>

                          {/* Scissor cut line */}
                          <div className="w-4 flex flex-col items-center gap-0.5 opacity-40">
                            <span className="text-gray-400 text-xs rotate-90">✂</span>
                            {Array.from({ length: 20 }, (_, i) => (
                              <div key={i} className="w-px h-2 bg-gray-400" />
                            ))}
                          </div>

                          {/* Right blank */}
                          {students[rightIdx] && (
                            <div className="flex-1">
                              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                                {students[rightIdx]?.name}
                              </p>
                              <BubblePreview
                                questions={previewVariants[rightIdx % variantCount]?.questions || []}
                                variantLetter={previewVariants[rightIdx % variantCount]?.letter || 'A'}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 10px; }
      `}</style>
    </div>
  );
}
