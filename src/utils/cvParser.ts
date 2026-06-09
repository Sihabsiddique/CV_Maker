/**
 * CV Parser & Field Mapper Utility
 * 
 * Provides client-side extraction and heuristic parsing of PDF and DOCX documents.
 * Employs dynamic CDN-based loader scripts to keep Next.js bundle footprint small
 * and bypass SSR compiling problems.
 */

export interface ParsedCV {
  personalInfo: {
    fullName: string;
    address: string;
    email: string;
    phone: string;
    linkedin: string;
    fatherName?: string;
    motherName?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    nationality?: string;
    religion?: string;
    permanentAddress?: string;
  };
  summary: string;
  skills: Array<{ id: string; category: string; skills: string }>;
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    responsibilities: string[];
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  languages: Array<{ id: string; name: string; fluency: string }>;
  certifications: Array<{ id: string; name: string }>;
  extracurricular: Array<{ id: string; role: string; organization: string }>;
  
  // Metadata for report
  detectedType: string;
  overallConfidence: number;
  confidenceScores: Record<string, number>;
  fieldsFound: string[];
  fieldsMissing: string[];
  warnings: string[];
}

// ----------------------------------------------------
// DYNAMIC LOADER UTILITIES FOR BROWSER
// ----------------------------------------------------

let pdfjsPromise: Promise<any> | null = null;
export function loadPdfJS(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject("Not running in browser");
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);
  if (pdfjsPromise) return pdfjsPromise;
  
  pdfjsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = (err) => {
      pdfjsPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });
  
  return pdfjsPromise;
}

let mammothPromise: Promise<any> | null = null;
export function loadMammoth(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject("Not running in browser");
  if ((window as any).mammoth) return Promise.resolve((window as any).mammoth);
  if (mammothPromise) return mammothPromise;
  
  mammothPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    script.onload = () => {
      resolve((window as any).mammoth);
    };
    script.onerror = (err) => {
      mammothPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });
  
  return mammothPromise;
}

// ----------------------------------------------------
// CLIENT-SIDE EXTRACTORS
// ----------------------------------------------------

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await loadPdfJS();
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let rawText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    rawText += pageText + '\n';
  }
  
  return rawText;
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  const mammoth = await loadMammoth();
  const arrayBuffer = await file.arrayBuffer();
  
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

// ----------------------------------------------------
// HEURISTIC COGNITIVE PARSING ENGINE
// ----------------------------------------------------

export function parseRawTextToCVData(rawText: string, filename: string): ParsedCV {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // 1. Personal Information extraction via Regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = rawText.match(emailRegex) || [];
  const email = emails[0] || '';
  
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,9}/g;
  const phones = rawText.match(phoneRegex) || [];
  const phone = phones.filter(p => p.replace(/[^0-9]/g, '').length >= 7)[0] || '';
  
  const linkedinRegex = /(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const linkedinMatch = rawText.match(linkedinRegex);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';
  
  // Extract Name (first line that is not email/phone/heading/standard junk)
  let fullName = '';
  for (const line of lines.slice(0, 8)) {
    const clean = line.toLowerCase();
    if (
      !clean.includes('@') &&
      !clean.match(/\+?\d{4,}/) &&
      !clean.includes('cv') &&
      !clean.includes('resume') &&
      !clean.includes('curriculum') &&
      !clean.includes('portfolio') &&
      !/^(experience|education|skills|summary|profile|about|contact|address)/i.test(clean) &&
      line.length > 2 &&
      line.length < 40
    ) {
      fullName = line;
      break;
    }
  }
  if (!fullName) {
    // Fallback search in filename
    const cleanName = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ').replace(/(cv|resume)/gi, '').trim();
    fullName = cleanName || 'Extracted Candidate';
  }
  
  // Extract Address (look near personal details header)
  let address = '';
  const addressKeywords = ['street', 'road', 'avenue', 'lane', 'house', 'flat', 'apt', 'block', 'dhaka', 'london', 'comilla', 'uk', 'bangladesh', 'usa', 'ny', 'ca', 'permanent'];
  for (const line of lines.slice(0, 15)) {
    const clean = line.toLowerCase();
    if (
      addressKeywords.some(kw => clean.includes(kw)) &&
      !clean.includes('@') &&
      !clean.includes('linkedin.com') &&
      line !== fullName &&
      line.length > 5 &&
      line.length < 80
    ) {
      address = line;
      break;
    }
  }
  if (!address) {
    // Search default lines
    for (const line of lines.slice(0, 10)) {
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        const candidate = parts.find(p => addressKeywords.some(kw => p.toLowerCase().includes(kw)));
        if (candidate) {
          address = candidate;
          break;
        }
      }
    }
  }
  
  // Dynamic Additional fields
  let fatherName = '';
  let motherName = '';
  let dateOfBirth = '';
  let gender = 'Male';
  let maritalStatus = 'Single';
  let nationality = 'Bangladeshi';
  let religion = 'Islam';
  let permanentAddress = '';
  
  lines.forEach(line => {
    const clean = line.replace(/[^a-zA-Z0-9 :]/g, '').trim();
    const lower = clean.toLowerCase();
    if (lower.startsWith('father name') || lower.startsWith('fathers name')) fatherName = clean.split(':')[1]?.trim() || '';
    if (lower.startsWith('mother name') || lower.startsWith('mothers name')) motherName = clean.split(':')[1]?.trim() || '';
    if (lower.startsWith('date of birth') || lower.startsWith('dob')) dateOfBirth = clean.split(':')[1]?.trim() || '';
    if (lower.startsWith('gender') || lower.startsWith('sex')) {
      const g = clean.split(':')[1]?.trim() || '';
      if (g) gender = g;
    }
    if (lower.startsWith('marital status') || lower.startsWith('marriage')) {
      const m = clean.split(':')[1]?.trim() || '';
      if (m) maritalStatus = m;
    }
    if (lower.startsWith('nationality')) nationality = clean.split(':')[1]?.trim() || '';
    if (lower.startsWith('religion')) religion = clean.split(':')[1]?.trim() || '';
    if (lower.startsWith('permanent address')) permanentAddress = clean.split(':')[1]?.trim() || '';
  });

  // 2. Identify Section Boundaries
  const checkHeading = (line: string): string | null => {
    const clean = line.toLowerCase().replace(/[^a-z ]/g, '').trim();
    if (/^(summary|profile|objective|about me|about|career summary|executive summary)$/.test(clean)) return 'summary';
    if (/^(work experience|experience|employment history|employment|career history|work history|professional experience|experience history)$/.test(clean)) return 'experience';
    if (/^(education|education and training|academic history|academic qualification|academic qualifications|academic background|studies)$/.test(clean)) return 'education';
    if (/^(skills|technical skills|key skills|competencies|professional skills|expertise|core competencies|abilities)$/.test(clean)) return 'skills';
    if (/^(languages|language proficiency|language|linguistic skills)$/.test(clean)) return 'languages';
    if (/^(certifications|licenses|courses|professional certifications|additional information)$/.test(clean)) return 'certifications';
    if (/^(extracurricular activities|extracurricular|activities|volunteer work|interests|organizations)$/.test(clean)) return 'extracurricular';
    return null;
  };
  
  interface SectionHeading {
    key: string;
    index: number;
  }
  
  const headings: SectionHeading[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 50) {
      const key = checkHeading(line);
      if (key) {
        headings.push({ key, index: i });
      }
    }
  }
  
  const sections: Record<string, string[]> = {};
  for (let h = 0; h < headings.length; h++) {
    const start = headings[h].index + 1;
    const end = h + 1 < headings.length ? headings[h+1].index : lines.length;
    const key = headings[h].key;
    if (!sections[key]) sections[key] = [];
    sections[key].push(...lines.slice(start, end));
  }
  
  // 3. Extract Summary
  let summary = '';
  if (sections['summary']) {
    summary = sections['summary'].join(' ');
  } else if (headings.length > 0) {
    // Heuristic: Intro lines before first heading represent summary
    const firstHeadingIndex = headings[0].index;
    const introLines = lines.slice(0, firstHeadingIndex).filter(line => {
      const lower = line.toLowerCase();
      return (
        line !== fullName &&
        line !== address &&
        !lower.includes('@') &&
        !line.match(/\+?\d{4,}/) &&
        !lower.includes('linkedin')
      );
    });
    summary = introLines.join(' ');
  }
  
  // 4. Extract Skills (structured categories)
  const parsedSkills: any[] = [];
  const skillLines = sections['skills'] || [];
  let skillIdCounter = 1;
  
  skillLines.forEach(line => {
    const cleanLine = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!cleanLine) return;
    
    if (cleanLine.includes(':')) {
      const parts = cleanLine.split(':');
      parsedSkills.push({
        id: `sk_imported_${skillIdCounter++}`,
        category: parts[0].trim(),
        skills: parts.slice(1).join(':').trim()
      });
    } else {
      parsedSkills.push({
        id: `sk_imported_${skillIdCounter++}`,
        category: 'Core Competency',
        skills: cleanLine
      });
    }
  });
  
  // 5. Extract Experience (Blocks divided by dates)
  const parsedExperience: any[] = [];
  const expLines = sections['experience'] || [];
  let currentJob: any = null;
  let jobCounter = 1;
  
  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i].trim();
    const cleanLine = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!cleanLine) continue;
    
    // Check if line contains standard date patterns: "2018 - 2021" or "2019 - Present" or "Jan 2020"
    const hasDateRange = /\b(19|20)\d{2}\s*[-–—]\s*(\b(19|20)\d{2}|present|current|now)\b/i.test(line) ||
                         /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(19|20)\d{2}/i.test(line);
    
    const isStartOfJob = hasDateRange || !currentJob;
    
    if (isStartOfJob && currentJob) {
      parsedExperience.push(currentJob);
      currentJob = null;
    }
    
    if (!currentJob) {
      currentJob = {
        id: `exp_imported_${jobCounter++}`,
        jobTitle: '',
        company: '',
        location: '',
        startDate: 'Jan 2020',
        endDate: 'Present',
        isCurrent: false,
        responsibilities: [],
        achievements: []
      };
      
      const dateMatch = line.match(/\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|\d{4})\s*[-–—]\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|\d{4}|present|current|now)/i);
      if (dateMatch) {
        currentJob.startDate = dateMatch[1].trim();
        const endText = dateMatch[2].trim();
        if (/present|current|now/i.test(endText)) {
          currentJob.endDate = '';
          currentJob.isCurrent = true;
        } else {
          currentJob.endDate = endText;
          currentJob.isCurrent = false;
        }
      }
      
      let titleLine = cleanLine;
      if (dateMatch) {
        titleLine = titleLine.replace(dateMatch[0], '').replace(/[(),]/g, '').trim();
      }
      
      // Parse Company and Title
      const splitters = [' at ', ' @ ', ' - ', ' | ', ', '];
      let matchedSplitter = '';
      for (const sp of splitters) {
        if (titleLine.includes(sp)) {
          matchedSplitter = sp;
          break;
        }
      }
      
      if (matchedSplitter) {
        const parts = titleLine.split(matchedSplitter);
        currentJob.jobTitle = parts[0].trim();
        currentJob.company = parts[1].trim();
      } else {
        currentJob.jobTitle = titleLine;
        // Peek next line
        if (i + 1 < expLines.length && !expLines[i+1].includes('•') && !expLines[i+1].includes('-')) {
          currentJob.company = expLines[i+1].trim();
          i++;
        }
      }
    } else {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        if (/\b(achieved|delivered|reduced|increased|led|spearheaded|won|managed to|improved)\b/i.test(cleanLine)) {
          currentJob.achievements.push(cleanLine);
        } else {
          currentJob.responsibilities.push(cleanLine);
        }
      } else {
        currentJob.responsibilities.push(cleanLine);
      }
    }
  }
  if (currentJob) parsedExperience.push(currentJob);
  
  parsedExperience.forEach(job => {
    if (!job.jobTitle) job.jobTitle = 'Officer';
    if (!job.company) job.company = 'Department / Company';
    if (!job.location) job.location = 'Dhaka';
  });
  
  // 6. Extract Education
  const parsedEducation: any[] = [];
  const eduLines = sections['education'] || [];
  let currentEdu: any = null;
  let eduCounter = 1;
  
  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i].trim();
    const cleanLine = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!cleanLine) continue;
    
    const hasDegree = /\b(bsc|bsc|msc|msc|phd|b\.s\.|b\.a\.|m\.s\.|m\.a\.|bachelor|master|doctor|diploma|college|school|hsc|ssc)\b/i.test(line);
    const isStartOfEdu = hasDegree || !currentEdu;
    
    if (isStartOfEdu && currentEdu) {
      parsedEducation.push(currentEdu);
      currentEdu = null;
    }
    
    if (!currentEdu) {
      currentEdu = {
        id: `edu_imported_${eduCounter++}`,
        degree: '',
        institution: '',
        startDate: '2015',
        endDate: '2019',
        gpa: ''
      };
      
      const dateMatch = line.match(/\b(\d{4})\s*[-–—]\s*(\d{4}|present|current|now)\b/i);
      if (dateMatch) {
        currentEdu.startDate = dateMatch[1];
        currentEdu.endDate = dateMatch[2];
      }
      
      let cleanEduLine = cleanLine;
      if (dateMatch) {
        cleanEduLine = cleanEduLine.replace(dateMatch[0], '').replace(/[(),]/g, '').trim();
      }
      
      const gpaMatch = line.match(/\b(gpa|cgpa|grade):?\s*([0-9.]+)\b/i) || line.match(/\b([0-9.]+)\s*out of\s*[0-9.]+\b/i);
      if (gpaMatch) {
        currentEdu.gpa = `CGPA ${gpaMatch[2] || gpaMatch[0]}`;
        cleanEduLine = cleanEduLine.replace(gpaMatch[0], '').trim();
      }
      
      const eduSplitters = [' at ', ' from ', ' - ', ' , ', ', '];
      let matchedSplitter = '';
      for (const sp of eduSplitters) {
        if (cleanEduLine.includes(sp)) {
          matchedSplitter = sp;
          break;
        }
      }
      
      if (matchedSplitter) {
        const parts = cleanEduLine.split(matchedSplitter);
        currentEdu.degree = parts[0].trim();
        currentEdu.institution = parts[1].trim();
      } else {
        currentEdu.degree = cleanEduLine;
        if (i + 1 < eduLines.length && !eduLines[i+1].includes('•') && !eduLines[i+1].includes('-')) {
          currentEdu.institution = eduLines[i+1].trim();
          i++;
        }
      }
    } else {
      const gpaMatch = line.match(/\b(gpa|cgpa|grade):?\s*([0-9.]+)\b/i);
      if (gpaMatch) currentEdu.gpa = `CGPA ${gpaMatch[2]}`;
    }
  }
  if (currentEdu) parsedEducation.push(currentEdu);
  
  parsedEducation.forEach(edu => {
    if (!edu.degree) edu.degree = 'BSc / Degree';
    if (!edu.institution) edu.institution = 'Institution / University';
  });
  
  // 7. Languages
  const parsedLanguages: any[] = [];
  const langLines = sections['languages'] || [];
  let langCounter = 1;
  
  langLines.forEach(line => {
    const clean = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!clean) return;
    
    const fluencyKeywords = ['native', 'fluent', 'conversational', 'intermediate', 'basic', 'proficient', 'bilingual', 'advanced'];
    let fluency = 'Conversational';
    for (const kw of fluencyKeywords) {
      if (clean.toLowerCase().includes(kw)) {
        fluency = kw.charAt(0).toUpperCase() + kw.slice(1);
        break;
      }
    }
    
    let name = clean;
    for (const kw of fluencyKeywords) {
      const idx = name.toLowerCase().indexOf(kw);
      if (idx !== -1) {
        name = name.substring(0, idx).replace(/[:\-—,]/g, '').trim();
        break;
      }
    }
    if (name.includes(':')) name = name.split(':')[0].trim();
    
    if (name.length > 2 && name.length < 20) {
      parsedLanguages.push({
        id: `lang_imported_${langCounter++}`,
        name,
        fluency
      });
    }
  });
  
  // 8. Certifications
  const parsedCertifications: any[] = [];
  const certLines = sections['certifications'] || [];
  let certCounter = 1;
  certLines.forEach(line => {
    const clean = line.replace(/^[•\-\*\s]+/, '').trim();
    if (clean.length > 3 && clean.length < 80) {
      parsedCertifications.push({
        id: `cert_imported_${certCounter++}`,
        name: clean
      });
    }
  });
  
  // 9. Extracurricular
  const parsedExtracurricular: any[] = [];
  const extraLines = sections['extracurricular'] || [];
  let extraCounter = 1;
  extraLines.forEach(line => {
    const clean = line.replace(/^[•\-\*\s]+/, '').trim();
    if (!clean) return;
    
    const splitters = [' at ', ' for ', ' - ', ', '];
    let role = clean;
    let organization = 'Organization';
    for (const sp of splitters) {
      if (clean.includes(sp)) {
        const parts = clean.split(sp);
        role = parts[0].trim();
        organization = parts[1].trim();
        break;
      }
    }
    
    if (role.length > 2 && role.length < 80) {
      parsedExtracurricular.push({
        id: `extra_imported_${extraCounter++}`,
        role,
        organization
      });
    }
  });
  
  // 10. Audit Analytics (Confidence Metrics & Report Summary)
  const fieldsFound: string[] = [];
  const fieldsMissing: string[] = [];
  const warnings: string[] = [];
  const confidenceScores: Record<string, number> = {};
  
  if (fullName && fullName !== 'Extracted Candidate') {
    fieldsFound.push('Full Name');
  } else {
    fieldsMissing.push('Full Name');
    warnings.push('We could not identify the candidate name.');
  }
  
  if (email) fieldsFound.push('Email Address');
  else {
    fieldsMissing.push('Email Address');
    warnings.push('Email address was not found.');
  }
  
  if (phone) fieldsFound.push('Phone Number');
  else {
    fieldsMissing.push('Phone Number');
    warnings.push('Phone number was not found.');
  }
  
  if (address) fieldsFound.push('Current Address');
  else {
    fieldsMissing.push('Current Address');
    warnings.push('Current address was not found.');
  }
  
  if (linkedin) fieldsFound.push('LinkedIn Profile');
  else fieldsMissing.push('LinkedIn Profile');
  
  const personalCount = [fullName && fullName !== 'Extracted Candidate', email, phone, address, linkedin].filter(Boolean).length;
  confidenceScores['Personal Info'] = Math.round((personalCount / 5) * 100);
  
  if (summary) {
    fieldsFound.push('Professional Summary');
    confidenceScores['Summary'] = 98;
  } else {
    fieldsMissing.push('Professional Summary');
    warnings.push('Professional summary block is empty.');
    confidenceScores['Summary'] = 0;
  }
  
  if (parsedExperience.length > 0) {
    fieldsFound.push(`${parsedExperience.length} Work Experience items`);
    const hasFallback = parsedExperience.some(j => j.company.includes('Company') || j.jobTitle.includes('Officer'));
    confidenceScores['Experience'] = hasFallback ? 70 : 95;
    if (hasFallback) warnings.push('Some job descriptions look generic or details are incomplete.');
  } else {
    fieldsMissing.push('Work Experience');
    warnings.push('No professional experience items detected.');
    confidenceScores['Experience'] = 0;
  }
  
  if (parsedEducation.length > 0) {
    fieldsFound.push(`${parsedEducation.length} Education items`);
    const hasFallback = parsedEducation.some(e => e.institution.includes('Institution'));
    confidenceScores['Education'] = hasFallback ? 75 : 94;
  } else {
    fieldsMissing.push('Education');
    warnings.push('No academic credentials found.');
    confidenceScores['Education'] = 0;
  }
  
  if (parsedSkills.length > 0) {
    fieldsFound.push('Skills Section');
    confidenceScores['Skills'] = 95;
  } else {
    fieldsMissing.push('Skills Section');
    warnings.push('No core skills extracted.');
    confidenceScores['Skills'] = 0;
  }
  
  confidenceScores['Languages'] = parsedLanguages.length > 0 ? 90 : 0;
  confidenceScores['Certifications'] = parsedCertifications.length > 0 ? 100 : 0;
  confidenceScores['Activities'] = parsedExtracurricular.length > 0 ? 90 : 0;
  
  const scoreKeys = Object.keys(confidenceScores);
  const totalScore = scoreKeys.reduce((sum, key) => sum + confidenceScores[key], 0);
  const overallConfidence = scoreKeys.length > 0 ? Math.round(totalScore / scoreKeys.length) : 50;
  
  // Layout Classification Heuristics
  let detectedType = 'ATS CV';
  const rawLower = rawText.toLowerCase();
  if (rawLower.includes('mother tongue') || rawLower.includes('cefr') || rawLower.includes('europass')) {
    detectedType = 'Europass CV';
  } else if (rawLower.includes("father's name") || rawLower.includes("mother's name") || rawLower.includes('religion') || rawLower.includes('nationality: bangladeshi')) {
    detectedType = 'ATS CV';
  } else if (rawLower.includes('united nations') || rawLower.includes('personal history profile') || rawLower.includes('p11')) {
    detectedType = 'UN CV';
  } else if (lines.length < 35 && (rawLower.includes('portfolio') || rawLower.includes('designer') || rawLower.includes('artwork'))) {
    detectedType = 'Creative CV';
  } else if (rawLower.includes('executive summary') || rawLower.includes('directorship') || rawLower.includes('board of directors')) {
    detectedType = 'Corporate CV';
  }

  return {
    personalInfo: {
      fullName,
      address,
      email,
      phone,
      linkedin,
      fatherName,
      motherName,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      religion,
      permanentAddress
    },
    summary,
    skills: parsedSkills,
    experience: parsedExperience,
    education: parsedEducation,
    languages: parsedLanguages,
    certifications: parsedCertifications,
    extracurricular: parsedExtracurricular,
    detectedType,
    overallConfidence,
    confidenceScores,
    fieldsFound,
    fieldsMissing,
    warnings
  };
}
