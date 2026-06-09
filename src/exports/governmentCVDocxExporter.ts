import { Document, Paragraph, TextRun, BorderStyle, AlignmentType, WidthType, Table, TableRow, TableCell } from 'docx';
import { GovernmentCVData } from '@/types/governmentCV.types';

export const generateGovernmentCVDocx = (data: GovernmentCVData): Document => {
  // Using Arial as a close match to the required sans-serif web safe font
  const FONT = 'Arial'; 
  const COLOR_TEXT = '333333';
  const COLOR_HEADING = '000000';

  const createDivider = () => new Paragraph({
    border: {
      bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 }
    },
    spacing: { after: 120 } // 6pt
  });

  const createSectionTitle = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: 24, color: COLOR_HEADING })],
    spacing: { before: 240, after: 40 }, // 12pt before, 2pt after
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // Header: Name
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: data.personalInfo.fullName || 'First Name Last Name', bold: true, size: 48, font: FONT, color: COLOR_HEADING })],
    spacing: { after: 60 }
  }));

  children.push(createDivider());

  // Header: Contact Info Line 1
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `${data.personalInfo.address || 'Address'} | ${data.personalInfo.email || 'Email'}`, size: 20, font: FONT, color: COLOR_TEXT })],
    spacing: { after: 40 }
  }));

  // Header: Contact Info Line 2
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `${data.personalInfo.linkedin || 'LinkedIn'} | Contact: ${data.personalInfo.phone || 'Phone'}`, size: 20, font: FONT, color: COLOR_TEXT })],
    spacing: { after: 60 }
  }));

  children.push(createDivider());

  // Summary
  if (data.summary) {
    children.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: data.summary, size: 20, font: FONT, color: COLOR_TEXT })],
      spacing: { after: 160 }
    }));
  }

  // Skills
  if (data.skills.length > 0) {
    children.push(createSectionTitle("Skills"));
    children.push(createDivider());
    data.skills.forEach(skill => {
      children.push(new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${skill.category}: `, bold: true, size: 20, font: FONT, color: COLOR_TEXT }),
          new TextRun({ text: skill.skills, size: 20, font: FONT, color: COLOR_TEXT })
        ],
        spacing: { after: 40 }
      }));
    });
  }

  // Experience
  if (data.experience.length > 0) {
    children.push(createSectionTitle("Work Experience"));
    children.push(createDivider());
    data.experience.forEach(exp => {
      const dateText = `${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}`;
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: exp.jobTitle, bold: true, size: 20, font: FONT, color: COLOR_TEXT })] })],
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              }),
              new TableCell({
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${exp.location ? exp.location + '. ' : ''}${dateText}`, size: 20, font: FONT, color: COLOR_TEXT })] })],
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              }),
            ]
          })
        ]
      }));

      if (exp.company) {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.company, size: 20, font: FONT, color: COLOR_TEXT })],
          spacing: { before: 40, after: 80 }
        }));
      }

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        children.push(new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: exp.responsibilities.join(' '), size: 20, font: FONT, color: COLOR_TEXT })],
          spacing: { after: 80 }
        }));
      }

      exp.achievements.forEach(ach => {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: ach, size: 20, font: FONT, color: COLOR_TEXT })],
          spacing: { after: 40 }
        }));
      });
    });
  }

  // Education
  if (data.education.length > 0) {
    children.push(createSectionTitle("Education and Training"));
    children.push(createDivider());
    data.education.forEach(edu => {
      const dateText = `${edu.startDate} - ${edu.endDate || 'Present'}`;
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: 20, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: dateText, size: 20, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: edu.institution, size: 20, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: edu.gpa || '', size: 20, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
            ]
          })
        ]
      }));
      children.push(new Paragraph({ spacing: { after: 120 } }));
    });
  }

  // Language
  if (data.languages.length > 0) {
    children.push(createSectionTitle("Language Proficiency"));
    children.push(createDivider());
    data.languages.forEach(lang => {
      children.push(new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${lang.name}: `, bold: true, size: 20, font: FONT, color: COLOR_TEXT }),
          new TextRun({ text: lang.fluency, size: 20, font: FONT, color: COLOR_TEXT })
        ],
        spacing: { after: 40 }
      }));
    });
  }

  // Extracurricular
  if (data.extracurricular.length > 0) {
    children.push(createSectionTitle("Extracurricular Activities:"));
    children.push(createDivider());
    data.extracurricular.forEach(ext => {
      children.push(new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: `${ext.role}, `, bold: true, size: 20, font: FONT, color: COLOR_TEXT }),
          new TextRun({ text: ext.organization, size: 20, font: FONT, color: COLOR_TEXT })
        ],
        spacing: { after: 40 }
      }));
    });
  }

  // Personal Information
  children.push(createSectionTitle("Personal Information"));
  children.push(createDivider());
  
  const piRows: TableRow[] = [];
  const addPiRow = (label: string, value?: string) => {
    if (value) {
      piRows.push(new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: `: ${value}`, size: 20, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
        ]
      }));
    }
  };
  addPiRow("Father's Name", data.personalInfo.fatherName);
  addPiRow("Mother's Name", data.personalInfo.motherName);
  addPiRow("Date of Birth", data.personalInfo.dateOfBirth);
  addPiRow("Gender", data.personalInfo.gender);
  addPiRow("Marital Status", data.personalInfo.maritalStatus);
  addPiRow("Nationality", data.personalInfo.nationality);
  addPiRow("Religion", data.personalInfo.religion);
  addPiRow("Permanent Address", data.personalInfo.permanentAddress);

  if (piRows.length > 0) {
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
      rows: piRows
    }));
  }

  // Certifications
  if (data.certifications.length > 0) {
    children.push(createSectionTitle("Additional Information"));
    children.push(createDivider());
    children.push(new Paragraph({
      bullet: { level: 0 },
      children: [
        new TextRun({ text: "Certifications: ", bold: true, size: 20, font: FONT, color: COLOR_TEXT }),
        new TextRun({ text: data.certifications.map(c => c.name).join(', '), size: 20, font: FONT, color: COLOR_TEXT })
      ],
      spacing: { after: 40 }
    }));
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } // Exact 1 inch margins (1440 twips)
        }
      },
      children: children
    }]
  });
};
