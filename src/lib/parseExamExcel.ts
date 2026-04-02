import * as XLSX from 'xlsx';
import type { ExamQuestion } from './paperExamPdf';

/**
 * Expected Excel format:
 * Row 1: Headers — "Savol", "A", "B", "D", "E", "Javob"
 * Row 2+: Data
 *
 * "Javob" column should contain "A", "B", "D", or "E"
 */
export function parseExamExcel(file: File): Promise<ExamQuestion[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Use first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
          header: 0,
          defval: '',
        });

        const questions: ExamQuestion[] = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          // Try common header variants (case-insensitive)
          const text =
            row['Savol'] || row['savol'] || row['Question'] || row['question'] || '';
          
          // Options A, B, D, E, F (Uzbek Latin skips C)
          const optA = row['A'] || row['a'] || '';
          const optB = row['B'] || row['b'] || '';
          const optD = row['D'] || row['d'] || '';
          const optE = row['E'] || row['e'] || '';

          const answer = (
            row['Javob'] ||
            row['javob'] ||
            row['Answer'] ||
            row['answer'] ||
            'A'
          )
            .toString()
            .trim()
            .toUpperCase();

          if (!text) continue; // skip empty rows

          // Map Uzbek labels to indices
          const answerMap: Record<string, number> = {
            A: 0,
            B: 1,
            D: 2,
            E: 3,
          };
          const correctAnswer = answerMap[answer] ?? 0;

          // Build options array (2–4)
          const allOpts = [
            optA.toString(),
            optB.toString(),
            optD.toString(),
            optE.toString(),
          ];
          // Trim trailing empty options (min 2)
          let options = allOpts;
          while (options.length > 2 && !options[options.length - 1].trim()) {
            options = options.slice(0, -1);
          }
          // Fill empty with placeholder
          options = options.map((o, i) => o || `Variant ${['A','B','D','E'][i]}`);

          questions.push({
            id: `q_${Date.now()}_${i}`,
            text: text.toString(),
            options,
            correctAnswer,
          });
        }

        if (questions.length === 0) {
          reject(new Error('Excel faylida savollar topilmadi. Ustun nomlari: Savol, A, B, D, E, Javob'));
          return;
        }

        resolve(questions);
      } catch (err) {
        reject(new Error('Excel faylini o\'qishda xatolik: ' + String(err)));
      }
    };

    reader.onerror = () => reject(new Error('Fayl o\'qib bo\'lmadi'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate a sample Excel template for download
 */
export function downloadExcelTemplate(): void {
  const templateData = [
    { Savol: '2 + 2 = ?', A: '3', B: '4', D: '5', E: '6', Javob: 'B' },
    { Savol: 'O\'zbekistonning poytaxti?', A: 'Samarqand', B: 'Buxoro', D: 'Toshkent', E: 'Namangan', Javob: 'D' },
    { Savol: 'Namuna savol...', A: 'Variant A', B: 'Variant B', D: 'Variant D', E: 'Variant E', Javob: 'A' },
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Savollar');

  // Set column widths
  ws['!cols'] = [
    { width: 40 }, // Savol
    { width: 15 }, // A
    { width: 15 }, // B
    { width: 15 }, // D
    { width: 15 }, // E
    { width: 8 },  // Javob
  ];

  XLSX.writeFile(wb, 'test_blanki_shablon.xlsx');
}
