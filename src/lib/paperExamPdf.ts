import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamVariant {
  letter: string;
  questions: ExamQuestion[];
}

export interface StudentBlankData {
  studentName: string;
  studentId: string;
  classLabel: string;
  examId: string;
  examTitle: string;
  variant: ExamVariant;
  date: string;
}

const OPT_LABELS = ['A', 'B', 'D', 'E'] as const;

async function qrDataURL(data: object): Promise<string> {
  return QRCode.toDataURL(JSON.stringify(data), {
    width: 80,
    margin: 0,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return window.btoa(binary);
}

/** ≤20 → 1 block; 21–40 → 2 equal blocks */
function blockCounts(numQ: number): number[] {
  if (numQ <= 20) return [numQ];
  const top = Math.ceil(numQ / 2);
  return [top, numQ - top];
}

// ─── Layout constants ──────────────────────────────────────────────────────
const PAGE_W = 210; // A4 portrait width mm
const PAGE_H = 297; // A4 portrait height mm
const MARGIN_LEFT = 20; // 2 cm left
const MARGIN_RIGHT = 10; // 1 cm right
const MARGIN_TOP = 10; // 1 cm top
const MARGIN_BOTTOM = 10; // 1 cm bottom
const BLANK_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT; // 180mm
const CUT_LINE_GAP = 5;

const HEADER_H = 24;     // title + info + divider
const ROW_H = 5.2;       // bubble row height
const BLOCK_GAP = 7;     // gap between 2 question blocks
const BLOCK_HEADER = 5;  // distance between question numbers and row A
const CARD_PADDING = 2.5; // padding inside the variant card
const BLANK_PADDING_BOTTOM = 3;

function calcGridH(numQ: number, numOpts: number): number {
  const blocks = blockCounts(numQ);
  let gridH = 0;
  for (let b = 0; b < blocks.length; b++) {
    gridH += BLOCK_HEADER + numOpts * ROW_H;
    if (b < blocks.length - 1) gridH += BLOCK_GAP;
  }
  return gridH;
}

/** Calculate the height of one student blank based on question count */
function calcBlankHeight(numQ: number, numOpts: number): number {
  return HEADER_H + CARD_PADDING * 2 + calcGridH(numQ, numOpts) + BLANK_PADDING_BOTTOM;
}

/** How many blanks fit on one A4 page */
function blanksPerPage(blankH: number): number {
  const usable = PAGE_H - MARGIN_TOP - MARGIN_BOTTOM;
  const n = Math.floor((usable + CUT_LINE_GAP) / (blankH + CUT_LINE_GAP));
  return Math.max(1, n);
}

// ─── Drawing functions ─────────────────────────────────────────────────────

export function setDMSans(doc: jsPDF, weight: 'normal' | 'bold') {
  try {
    doc.setFont('DMSans', weight);
  } catch(e) {
    doc.setFont('helvetica', weight);
  }
}

export async function loadPDFDMSans(doc: jsPDF): Promise<void> {
  try {
    const fetchFont = async (name: string) => {
      const resp = await fetch(`/fonts/${name}`);
      if (!resp.ok) throw new Error();
      return await resp.arrayBuffer();
    };

    const regBuf = await fetchFont('DMSans-Regular.ttf');
    doc.addFileToVFS('DMSans-Regular.ttf', arrayBufferToBase64(regBuf));
    doc.addFont('DMSans-Regular.ttf', 'DMSans', 'normal');

    const boldBuf = await fetchFont('DMSans-Bold.ttf');
    doc.addFileToVFS('DMSans-Bold.ttf', arrayBufferToBase64(boldBuf));
    doc.addFont('DMSans-Bold.ttf', 'DMSans', 'bold');
  } catch (e) {
    console.warn("DMSans fonts couldn't be loaded, falling back to default.", e);
  }
}

/** Draw minimalist 3-bubble instruction strip */
function drawInstructions(doc: jsPDF, cx: number, cy: number): void {
  const R = 1.6;
  const bubbleY = cy;

  doc.setFontSize(5.5);
  setDMSans(doc, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text("Ko'rsatma:", cx, bubbleY + 1.5);

  const sx = cx + 22;
  const gap = 16;

  // 1 – empty
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.circle(sx, bubbleY, R, 'S');
  doc.setFontSize(4.5);
  setDMSans(doc, 'normal');
  doc.setTextColor(140, 140, 140);
  doc.text("bo'sh", sx - 3, bubbleY + 4.5);

  // 2 – filled (correct)
  doc.setFillColor(15, 15, 15);
  doc.setDrawColor(15, 15, 15);
  doc.circle(sx + gap, bubbleY, R, 'FD');
  doc.setTextColor(140, 140, 140);
  doc.text("to'g'ri", sx + gap - 4, bubbleY + 4.5);

  // 3 – crossed (wrong)
  doc.setDrawColor(155, 155, 155);
  doc.setLineWidth(0.25);
  doc.circle(sx + gap * 2, bubbleY, R, 'S');
  const d = R * 0.55;
  doc.line(sx + gap * 2 - d, bubbleY - d, sx + gap * 2 + d, bubbleY + d);
  doc.line(sx + gap * 2 + d, bubbleY - d, sx + gap * 2 - d, bubbleY + d);
  doc.setTextColor(140, 140, 140);
  doc.text("noto'g'ri", sx + gap * 2 - 4.5, bubbleY + 4.5);

  // Instruction text right below
  doc.setFontSize(4.5);
  setDMSans(doc, 'normal');
  doc.setTextColor(160, 160, 160);
  doc.text("Faqat to'liq bo'yang · Qalamda o'zgartirmang", cx + 8, bubbleY + 8);
}

/** Draw one student blank at (ox, oy) */
async function drawBlank(
  doc: jsPDF,
  blank: StudentBlankData,
  ox: number,
  oy: number,
): Promise<void> {
  const w = BLANK_W;
  const questions = blank.variant.questions;
  const numQ = questions.length;
  const numOpts = Math.max(2, ...questions.map((q) => q.options.length));
  
  const blankH = calcBlankHeight(numQ, numOpts);

  // Outer Frame
  doc.setDrawColor(220, 220, 220); // very light outer frame
  doc.setLineWidth(0.25);
  doc.rect(ox, oy, w, blankH);

  const px = ox + 4; // Padding left
  let cy = oy + 4;

  // Title
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(8);
  setDMSans(doc, 'bold');
  doc.text('MURABBIYONA', px, cy + 3);

  doc.setFontSize(5.5);
  setDMSans(doc, 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('· JAVOB BLANKI', px + 25, cy + 3);

  // QR code
  const qrSize = 13;
  const qrX = ox + w - qrSize - 4;
  const qrY = oy + 3.5;
  const qrUrl = await qrDataURL({
    examId: blank.examId,
    studentId: blank.studentId,
    variant: blank.variant.letter,
  });
  doc.addImage(qrUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  // Variant Badge
  const badgeW = 18;
  const badgeH = 8;
  const badgeX = qrX - badgeW - 3;
  const badgeY = qrY + (qrSize - badgeH) / 2;
  doc.setFillColor(67, 56, 202);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  setDMSans(doc, 'bold');
  doc.text(`VARIANT ${blank.variant.letter}`, badgeX + 1.8, badgeY + 5.5);

  cy += 7;

  // Student Info
  const nameText =
    blank.studentName.length > 32
      ? blank.studentName.slice(0, 30) + '…'
      : blank.studentName;

  doc.setFontSize(6.5);
  setDMSans(doc, 'bold');
  doc.setTextColor(15, 15, 15);
  doc.text(nameText, px, cy + 3);

  doc.setFontSize(5);
  setDMSans(doc, 'normal');
  doc.setTextColor(110, 110, 110);
  doc.text(
    `Sinf: ${blank.classLabel}  ·  Sana: ${blank.date}  ·  Test: ${blank.examTitle.slice(0, 25)}`,
    px,
    cy + 7,
  );

  // Instructions centered horizontally
  drawInstructions(doc, ox + w / 2 - 28, oy + 10);

  cy += 10;

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(ox + 2, cy, ox + w - 2, cy);

  cy += 3; // Gap before grid card

  // Inner Card for Options Grid
  const gridH = calcGridH(numQ, numOpts);
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([1, 1.5], 0); // dotted gray line
  doc.roundedRect(ox + 3, cy, w - 6, gridH + CARD_PADDING * 2, 2.5, 2.5, 'S');
  doc.setLineDashPattern([], 0); // reset

  cy += CARD_PADDING;

  // Grid
  const blocks = blockCounts(numQ);
  const labelW = 7;
  const availW = w - 8 - labelW;
  const bubbleR = 1.65;

  let qCursor = 0;
  for (let b = 0; b < blocks.length; b++) {
    const bq = blocks[b];
    const colW = Math.min(6.8, availW / bq);
    const gx = px + labelW;

    // Number Row
    doc.setFontSize(5.2);
    setDMSans(doc, 'bold');
    doc.setTextColor(130, 130, 130);
    for (let i = 0; i < bq; i++) {
      const num = String(qCursor + i + 1);
      const tw = doc.getTextWidth(num);
      doc.text(num, gx + i * colW - tw / 2, cy + 2.5);
    }
    
    cy += BLOCK_HEADER;

    // Bubble Rows
    for (let optIdx = 0; optIdx < numOpts; optIdx++) {
      const ry = cy + optIdx * ROW_H;

      doc.setFontSize(6);
      setDMSans(doc, 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(OPT_LABELS[optIdx], px + 0.5, ry + 2);

      doc.setDrawColor(170, 170, 170);
      doc.setLineWidth(0.2);
      for (let qi = 0; qi < bq; qi++) {
        const bx = gx + qi * colW;
        doc.circle(bx, ry, bubbleR, 'S');
        // Scan dot
        doc.setFillColor(215, 215, 215);
        doc.circle(bx, ry, 0.12, 'F');
      }
    }

    qCursor += bq;
    cy += numOpts * ROW_H;

    if (b < blocks.length - 1) {
      cy += 1;
      doc.setDrawColor(225, 225, 225);
      doc.setLineWidth(0.15);
      for (let dx = ox + 4; dx < ox + w - 4; dx += 3) {
        doc.line(dx, cy, dx + 1.5, cy);
      }
      cy += BLOCK_GAP - 1;
    }
  }
}

// ─── Main export ───────────────────────────────────────────────────────────

export async function generatePaperExamPDF(
  students: { id: string; name: string }[],
  variants: ExamVariant[],
  classLabel: string,
  examId: string,
  examTitle: string,
  date: string,
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  await loadPDFDMSans(doc);

  const sampleQ = variants[0].questions;
  const numOpts = Math.max(2, ...sampleQ.map((q) => q.options.length));
  const blankH = calcBlankHeight(sampleQ.length, numOpts);
  const perPage = blanksPerPage(blankH);

  for (let i = 0; i < students.length; i++) {
    const posInPage = i % perPage;

    if (posInPage === 0 && i > 0) {
      doc.addPage('a4', 'portrait');
    }

    const oy = MARGIN_TOP + posInPage * (blankH + CUT_LINE_GAP);

    await drawBlank(
      doc,
      {
        studentName: students[i].name,
        studentId: students[i].id,
        classLabel,
        examId,
        examTitle,
        variant: variants[i % variants.length],
        date,
      },
      MARGIN_LEFT,
      oy,
    );

    if (posInPage < perPage - 1 && i < students.length - 1) {
      const cutY = oy + blankH + CUT_LINE_GAP / 2;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.15);
      for (let dx = MARGIN_LEFT; dx < MARGIN_LEFT + BLANK_W; dx += 4) {
        doc.line(dx, cutY, dx + 2, cutY);
      }
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(6);
      setDMSans(doc, 'normal');
      doc.text('✂', MARGIN_LEFT - 2.5, cutY + 1.5);
    }
  }

  doc.save(`${examTitle.replace(/\s+/g, '_')}_blanki.pdf`);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

export function createVariants(
  baseQuestions: ExamQuestion[],
  count: 2 | 3 | 4,
): ExamVariant[] {
  const letters = ['A', 'B', 'D', 'E'];
  return Array.from({ length: count }, (_, i) => ({
    letter: letters[i],
    questions: shuffleArray(baseQuestions),
  }));
}
