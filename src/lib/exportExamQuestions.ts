import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { type ExamVariant, loadPDFDMSans, setDMSans } from './paperExamPdf';

const OPT_LABELS = ['A', 'B', 'D', 'E'];

/**
 * Export variants into a single DOCX file
 */
export async function exportQuestionsDocx(variants: ExamVariant[], examTitle: string): Promise<void> {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      text: examTitle,
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
    })
  );

  variants.forEach((variant) => {
    // Variant Header
    children.push(
      new Paragraph({
        text: `VARIANT ${variant.letter}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    // Questions
    variant.questions.forEach((q, idx) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true }),
            new TextRun({ text: q.text }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      // Options
      q.options.forEach((optText, optIdx) => {
        if (optIdx >= OPT_LABELS.length) return;
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${OPT_LABELS[optIdx]}) `, bold: true }),
              new TextRun({ text: optText }),
            ],
            indent: { left: 400 },
            spacing: { after: 50 },
          })
        );
      });
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${examTitle.replace(/\s+/g, '_')}_savollar.docx`);
}

/**
 * Export variants into a single PDF file using jsPDF
 */
export async function exportQuestionsPdf(variants: ExamVariant[], examTitle: string): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  await loadPDFDMSans(doc);

  let y = 20;
  const PAGE_HEIGHT = 297;
  const MARGIN_BOTTOM = 20;
  const MARGIN_LEFT = 20;
  const CONTENT_WIDTH = 170; // 210 - 20(left) - 20(right)

  doc.setFontSize(16);
  setDMSans(doc, 'bold');
  doc.text(examTitle, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 15;

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > PAGE_HEIGHT - MARGIN_BOTTOM) {
      doc.addPage();
      y = 20;
      return true;
    }
    return false;
  };

  variants.forEach((variant, vIdx) => {
    if (vIdx > 0) {
      y += 10;
      checkPageBreak(25);
    }

    doc.setFontSize(14);
    setDMSans(doc, 'bold');
    doc.text(`VARIANT ${variant.letter}`, MARGIN_LEFT, y);
    y += 10;

    variant.questions.forEach((q, qIdx) => {
      doc.setFontSize(11);
      setDMSans(doc, 'bold');
      const qNumText = `${qIdx + 1}. `;
      const qNumWidth = doc.getTextWidth(qNumText);
      
      setDMSans(doc, 'normal');
      const splitQuestion = doc.splitTextToSize(q.text, CONTENT_WIDTH - qNumWidth);
      
      const qNeededSpace = splitQuestion.length * 6 + q.options.length * 6 + 10;
      checkPageBreak(qNeededSpace);

      setDMSans(doc, 'bold');
      doc.text(qNumText, MARGIN_LEFT, y);
      setDMSans(doc, 'normal');
      doc.text(splitQuestion, MARGIN_LEFT + qNumWidth, y);
      y += splitQuestion.length * 6;

      q.options.forEach((optText, optIdx) => {
        if (optIdx >= OPT_LABELS.length) return;
        
        doc.setFontSize(11);
        const optLabel = `${OPT_LABELS[optIdx]}) `;
        const optLabelWidth = doc.getTextWidth(optLabel);
        const splitOpt = doc.splitTextToSize(optText, CONTENT_WIDTH - 10 - optLabelWidth);
        
        setDMSans(doc, 'bold');
        doc.text(optLabel, MARGIN_LEFT + 5, y);
        setDMSans(doc, 'normal');
        doc.text(splitOpt, MARGIN_LEFT + 5 + optLabelWidth, y);
        y += splitOpt.length * 6;
      });

      y += 5; // space between questions
    });
  });

  doc.save(`${examTitle.replace(/\s+/g, '_')}_savollar.pdf`);
}
