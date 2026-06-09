import { Document, Paragraph, TextRun, BorderStyle, AlignmentType, WidthType, Table, TableRow, TableCell } from 'docx';
import { GovernmentCVData, AppearanceSettings } from '@/types/governmentCV.types';

// Helper to blend color hex with white background for opacity simulation
const getBorderHexColor = (colorHex: string, opacity: number): string => {
  const cleanHex = colorHex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const alpha = opacity / 100;
  const targetR = Math.round(r * alpha + 255 * (1 - alpha));
  const targetG = Math.round(g * alpha + 255 * (1 - alpha));
  const targetB = Math.round(b * alpha + 255 * (1 - alpha));
  return [
    targetR.toString(16).padStart(2, '0'),
    targetG.toString(16).padStart(2, '0'),
    targetB.toString(16).padStart(2, '0'),
  ].join('');
};

// Helper to convert text darkness percentage to hex color
const getTextHexColor = (darkness: number): string => {
  const val = Math.round(180 * (1 - darkness / 100));
  const hex = val.toString(16).padStart(2, '0');
  return `${hex}${hex}${hex}`;
};

export const generateGovernmentCVDocx = (data: GovernmentCVData, settings: AppearanceSettings): Document => {
  const FONT = 'Arial'; 
  const COLOR_TEXT = getTextHexColor(settings.textDarkness);
  const COLOR_HEADING = settings.textDarkness === 100 ? '000000' : COLOR_TEXT;

  // Font Sizes mapped to docx half-points
  const sizeName = Math.round(settings.candidateNameSize * 1.5);
  const sizeContact = Math.round(settings.contactInfoSize * 1.5);
  const sizeHeading = Math.round(settings.sectionHeadingSize * 1.5);
  const sizeBody = Math.round(settings.bodyTextSize * 1.5);
  const sizeExperience = Math.round(settings.experienceDescriptionSize * 1.5);

  // Weights
  const boldName = parseInt(settings.candidateNameWeight) >= 600;
  const boldHeading = parseInt(settings.sectionHeadingWeight) >= 600;

  const createDivider = () => {
    const dividerColor = getBorderHexColor(settings.borderColor, settings.borderOpacity);
    const dividerSize = settings.borderThickness * 8; // Size in 1/8 pt

    if (settings.borderWidthPercent === 100) {
      return new Paragraph({
        border: {
          bottom: { color: dividerColor, space: 1, style: BorderStyle.SINGLE, size: dividerSize }
        },
        spacing: { after: 120 }
      });
    } else {
      // Centered table to simulate custom width divider line
      return new Table({
        width: { size: settings.borderWidthPercent, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
        borders: {
          bottom: { style: BorderStyle.SINGLE, size: dividerSize, color: dividerColor },
          top: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE }
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ spacing: { after: 0 } })],
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
              })
            ]
          })
        ]
      });
    }
  };

  const createSectionTitle = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: boldHeading, font: FONT, size: sizeHeading, color: COLOR_HEADING })],
    spacing: { before: 240, after: 40 }, // 12pt before, 2pt after
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // Header: Name
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: data.personalInfo.fullName || 'First Name Last Name', bold: boldName, size: sizeName, font: FONT, color: COLOR_HEADING })],
    spacing: { after: 60 }
  }));

  children.push(createDivider());

  // Header: Contact Info Line 1
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `${data.personalInfo.address || 'Address'} | ${data.personalInfo.email || 'Email'}`, size: sizeContact, font: FONT, color: COLOR_TEXT })],
    spacing: { after: 40 }
  }));

  // Header: Contact Info Line 2
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `${data.personalInfo.linkedin || 'LinkedIn'} | Contact: ${data.personalInfo.phone || 'Phone'}`, size: sizeContact, font: FONT, color: COLOR_TEXT })],
    spacing: { after: 60 }
  }));

  children.push(createDivider());

  // Summary
  if (data.summary) {
    children.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: data.summary, size: sizeBody, font: FONT, color: COLOR_TEXT })],
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
          new TextRun({ text: `${skill.category}: `, bold: true, size: sizeBody, font: FONT, color: COLOR_TEXT }),
          new TextRun({ text: skill.skills, size: sizeBody, font: FONT, color: COLOR_TEXT })
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
                children: [new Paragraph({ children: [new TextRun({ text: exp.jobTitle, bold: true, size: sizeBody, font: FONT, color: COLOR_TEXT })] })],
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              }),
              new TableCell({
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${exp.location ? exp.location + '. ' : ''}${dateText}`, size: sizeBody, font: FONT, color: COLOR_TEXT })] })],
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              }),
            ]
          })
        ]
      }));

      if (exp.company) {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.company, size: sizeBody, font: FONT, color: COLOR_TEXT })],
          spacing: { before: 40, after: 80 }
        }));
      }

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        children.push(new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: exp.responsibilities.join(' '), size: sizeExperience, font: FONT, color: COLOR_TEXT })],
          spacing: { after: 80 }
        }));
      }

      exp.achievements.forEach(ach => {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: ach, size: sizeExperience, font: FONT, color: COLOR_TEXT })],
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
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: sizeBody, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: dateText, size: sizeBody, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: edu.institution, size: sizeBody, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: edu.gpa || '', size: sizeBody, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
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
          new TextRun({ text: `${lang.name}: `, bold: true, size: sizeBody, font: FONT, color: COLOR_TEXT }),
          new TextRun({ text: lang.fluency, size: sizeBody, font: FONT, color: COLOR_TEXT })
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
          new TextRun({ text: `${ext.role}, `, bold: true, size: sizeBody, font: FONT, color: COLOR_TEXT }),
          new TextRun({ text: ext.organization, size: sizeBody, font: FONT, color: COLOR_TEXT })
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
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: label, size: sizeBody, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: `: ${value}`, size: sizeBody, font: FONT, color: COLOR_TEXT })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
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
        new TextRun({ text: "Certifications: ", bold: true, size: sizeBody, font: FONT, color: COLOR_TEXT }),
        new TextRun({ text: data.certifications.map(c => c.name).join(', '), size: sizeBody, font: FONT, color: COLOR_TEXT })
      ],
      spacing: { after: 40 }
    }));
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      children: children
    }]
  });
};
