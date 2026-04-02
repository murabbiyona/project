import * as XLSX from 'xlsx';

export interface WorkPlanEntry {
  date: string;      // 'YYYY-MM-DD'
  rawDate: string;   // original date string from Excel
  topic: string;
  homework?: string;
}

export interface WorkPlanData {
  className: string;
  subject: string;
  teacher: string;
  entries: WorkPlanEntry[];
}

/**
 * Parse a work plan Excel file and extract date-topic pairs.
 * Supports formats like the screenshot: columns A=Sana, B=dars mavzusi, C=uy vazifasi
 */
export async function parseWorkPlan(file: File): Promise<WorkPlanData> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Extract metadata from first rows
  let className = '';
  let subject = '';
  let teacher = '';

  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i]?.map(String).join(' ') || '';
    const lower = row.toLowerCase();
    if (lower.includes('sinf') || lower.includes('guruh')) {
      className = row.replace(/^.*?:\s*/, '').trim();
      if (!className || className === row) className = rows[i]?.[0]?.toString() || '';
    }
    if (lower.includes('fan')) {
      subject = row.replace(/^.*?:\s*/, '').trim();
      if (!subject || subject === row) subject = rows[i]?.[1]?.toString() || rows[i]?.[0]?.toString().replace(/fan:?\s*/i, '') || '';
    }
    if (lower.includes('fio') || lower.includes('o\'qituvchi') || lower.includes('ustoz')) {
      teacher = row.replace(/^.*?:\s*/, '').trim();
    }
  }

  // Find header row (contains "sana" or "mavzu" or date-like pattern)
  let headerIdx = -1;
  let dateCol = -1;
  let topicCol = -1;
  let hwCol = -1;

  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i];
    if (!row) continue;
    for (let j = 0; j < row.length; j++) {
      const val = String(row[j]).toLowerCase().trim();
      if (val.includes('sana') || val === 'date' || val === 'kun') {
        dateCol = j;
        headerIdx = i;
      }
      if (val.includes('mavzu') || val.includes('topic') || val.includes('dars mavzusi')) {
        topicCol = j;
        headerIdx = i;
      }
      if (val.includes('vazifa') || val.includes('homework') || val.includes('uy vazifasi') || val.includes('keyingi')) {
        hwCol = j;
      }
    }
    if (headerIdx >= 0) break;
  }

  // Fallback: assume col 0 = date, col 1 = topic
  if (dateCol < 0) dateCol = 0;
  if (topicCol < 0) topicCol = 1;

  const entries: WorkPlanEntry[] = [];
  const startRow = headerIdx >= 0 ? headerIdx + 1 : 5;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[dateCol] && !row[topicCol]) continue;

    const rawDate = String(row[dateCol] || '').trim();
    const topic = String(row[topicCol] || '').trim();
    if (!topic) continue;

    const parsedDate = parseExcelDate(rawDate, row[dateCol]);
    if (!parsedDate) continue;

    entries.push({
      date: parsedDate,
      rawDate,
      topic,
      homework: hwCol >= 0 ? String(row[hwCol] || '').trim() : undefined,
    });
  }

  return { className, subject, teacher, entries };
}

/**
 * Parse various date formats from Excel cells
 */
function parseExcelDate(rawDate: string, cellValue: any): string | null {
  // Excel serial date number
  if (typeof cellValue === 'number' && cellValue > 40000 && cellValue < 60000) {
    const d = XLSX.SSF.parse_date_code(cellValue);
    if (d) {
      return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
    }
  }

  if (!rawDate) return null;

  // DD/MM/YYYY or DD.MM.YYYY
  const dmy = rawDate.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }

  // YYYY-MM-DD
  const ymd = rawDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymd) {
    return `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`;
  }

  // Try JS Date parse
  const d = new Date(rawDate);
  if (!isNaN(d.getTime()) && d.getFullYear() > 2020) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  return null;
}

/**
 * Find today's topic from the work plan
 */
export function findTodaysTopic(entries: WorkPlanEntry[]): WorkPlanEntry | null {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Exact match
  const exact = entries.find(e => e.date === todayStr);
  if (exact) return exact;

  // Find closest upcoming topic
  const upcoming = entries
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (upcoming.length > 0) return upcoming[0];

  // Find most recent past topic
  const past = entries
    .filter(e => e.date < todayStr)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (past.length > 0) return past[0];

  return null;
}

/**
 * Find a specific date's topic
 */
export function findTopicByDate(entries: WorkPlanEntry[], date: string): WorkPlanEntry | null {
  return entries.find(e => e.date === date) || null;
}
