import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { parseWorkPlan, findTodaysTopic, type WorkPlanData, type WorkPlanEntry } from '../lib/workPlanParser';

interface CurriculumState {
  // Files
  workPlanFile: File | null;
  textbookFile: File | null;
  // Parsed data
  workPlan: WorkPlanData | null;
  todaysTopic: WorkPlanEntry | null;
  isParsing: boolean;
  parseError: string | null;
  // Actions
  setWorkPlanFile: (file: File | null) => void;
  setTextbookFile: (file: File | null) => void;
}

const CurriculumContext = createContext<CurriculumState | null>(null);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [workPlanFile, setWorkPlanFileState] = useState<File | null>(null);
  const [textbookFile, setTextbookFile] = useState<File | null>(null);
  const [workPlan, setWorkPlan] = useState<WorkPlanData | null>(null);
  const [todaysTopic, setTodaysTopic] = useState<WorkPlanEntry | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const setWorkPlanFile = useCallback(async (file: File | null) => {
    setWorkPlanFileState(file);
    setParseError(null);

    if (!file) {
      setWorkPlan(null);
      setTodaysTopic(null);
      return;
    }

    setIsParsing(true);
    try {
      const data = await parseWorkPlan(file);
      setWorkPlan(data);
      const topic = findTodaysTopic(data.entries);
      setTodaysTopic(topic);
    } catch (err) {
      setParseError('Ish rejani o\'qishda xatolik yuz berdi. Fayl formatini tekshiring.');
      setWorkPlan(null);
      setTodaysTopic(null);
    } finally {
      setIsParsing(false);
    }
  }, []);

  return (
    <CurriculumContext.Provider value={{
      workPlanFile,
      textbookFile,
      workPlan,
      todaysTopic,
      isParsing,
      parseError,
      setWorkPlanFile,
      setTextbookFile,
    }}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const ctx = useContext(CurriculumContext);
  if (!ctx) throw new Error('useCurriculum must be used within CurriculumProvider');
  return ctx;
}
