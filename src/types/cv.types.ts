export interface CandidateProfile {
  fullName: string;
  address: string;
  email: string;
  phone: string;
  linkedin?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  religion?: string;
  permanentAddress?: string;
}

export interface ProfessionalExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface AcademicQualification {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Competency {
  id: string;
  category: string;
  skills: string;
}

export interface LanguageProficiency {
  id: string;
  name: string;
  fluency: string;
}

export interface ExtracurricularActivity {
  id: string;
  role: string;
  organization: string;
}

export interface ProfessionalCertification {
  id: string;
  name: string;
}

export interface CVData {
  personalInfo: CandidateProfile; // Match store state keys for simplicity, but typed as CandidateProfile
  summary: string;
  skills: Competency[];
  experience: ProfessionalExperience[];
  education: AcademicQualification[];
  languages: LanguageProficiency[];
  extracurricular: ExtracurricularActivity[];
  certifications: ProfessionalCertification[];
}

export const initialCVData: CVData = {
  personalInfo: {
    fullName: 'Ahmed Rahman',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
    email: 'ahmed.rahman@example.com',
    phone: '+8801712345678',
    linkedin: 'linkedin.com/in/ahmedrahman',
    fatherName: 'Abdul Karim',
    motherName: 'Rokeya Begum',
    dateOfBirth: '15 January 1997',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    permanentAddress: 'Comilla, Bangladesh'
  },
  summary: 'Results-driven ICT and Digital Transformation professional with experience in enterprise projects, policy implementation, stakeholder engagement, project coordination, and technology leadership. Proven ability to manage cross-functional teams, support digital governance initiatives, and deliver technology-enabled public services. Skilled in strategic planning, policy research, project management, and digital innovation.',
  skills: [
    { id: 'sk1', category: 'Languages & Frameworks', skills: 'C#, ASP.NET Core, JavaScript, TypeScript, React, Next.js' },
    { id: 'sk2', category: 'Database', skills: 'MySQL, PostgreSQL' },
    { id: 'sk3', category: 'Tools & Platforms', skills: 'Git, GitHub, Azure, Docker, Visual Studio Code' },
    { id: 'sk4', category: 'Executive Skills', skills: 'Project Management, Strategic Planning, Stakeholder Management, Digital Transformation' },
    { id: 'sk5', category: 'Soft Skills', skills: 'Communication, Team Management, Analytical Thinking' }
  ],
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Digital Transformation Specialist',
      company: 'National Digital Governance Authority',
      location: 'Dhaka',
      startDate: 'Jan 2024',
      endDate: '',
      isCurrent: true,
      responsibilities: [
        'Led digital service transformation initiatives.',
        'Coordinated inter-agency ICT projects.',
        'Developed digital governance frameworks.',
        'Managed stakeholder communications.'
      ],
      achievements: [
        'Reduced service processing time by 40%.',
        'Implemented digital workflow automation.'
      ]
    },
    {
      id: 'exp2',
      jobTitle: 'ICT Project Manager',
      company: 'Smart Bangladesh Initiative',
      location: 'Dhaka',
      startDate: 'Jan 2022',
      endDate: 'Dec 2023',
      isCurrent: false,
      responsibilities: [
        'Managed nationwide ICT implementation projects.',
        'Oversaw project monitoring and reporting.',
        'Coordinated vendors and technical teams.'
      ],
      achievements: [
        'Successfully delivered 15 enterprise ICT projects.',
        'Managed project portfolio worth BDT 50 Crore.'
      ]
    },
    {
      id: 'exp3',
      jobTitle: 'Software Engineer',
      company: 'Tech Solutions Ltd.',
      location: 'Dhaka',
      startDate: 'Jan 2019',
      endDate: 'Dec 2021',
      isCurrent: false,
      responsibilities: [
        'Developed enterprise applications.',
        'Maintained APIs and databases.',
        'Implemented software security measures.'
      ],
      achievements: [
        'Improved system performance by 35%.',
        'Led migration to cloud infrastructure.'
      ]
    }
  ],
  education: [
    { id: 'edu1', degree: 'BSc in Computer Science & Engineering', institution: 'University of Dhaka', startDate: '2015', endDate: '2019', gpa: 'CGPA 3.80' },
    { id: 'edu2', degree: 'Higher Secondary Certificate', institution: 'Dhaka College', startDate: '2012', endDate: '2014', gpa: 'GPA 5.00' }
  ],
  certifications: [
    { id: 'cert1', name: 'PMP Preparation Certification' },
    { id: 'cert2', name: 'Google Project Management' },
    { id: 'cert3', name: 'Microsoft Azure Fundamentals' },
    { id: 'cert4', name: 'IBM Artificial Intelligence Fundamentals' },
    { id: 'cert5', name: 'Agile Project Management Professional' },
    { id: 'cert6', name: 'Google UX Design' },
    { id: 'cert7', name: 'AWS Cloud Practitioner' },
    { id: 'cert8', name: 'Scrum Fundamentals' },
    { id: 'cert9', name: 'Interests: Technology Policy, Artificial Intelligence, Public Sector Innovation, Digital Governance' }
  ],
  languages: [
    { id: 'lang1', name: 'English', fluency: 'Fluent' },
    { id: 'lang2', name: 'Bangla', fluency: 'Native' },
    { id: 'lang3', name: 'Hindi', fluency: 'Conversational' }
  ],
  extracurricular: [
    { id: 'ext1', role: 'Executive Member', organization: 'ICT Innovation Club' },
    { id: 'ext2', role: 'Volunteer', organization: 'Digital Literacy Campaign' },
    { id: 'ext3', role: 'Mentor', organization: 'Youth Technology Program' }
  ]
};

export interface AppearanceSettings {
  candidateNameSize: number;
  candidateNameWeight: '400' | '500' | '600' | '700' | '800';
  contactInfoSize: number;
  sectionHeadingSize: number;
  sectionHeadingWeight: '400' | '500' | '600' | '700';
  bodyTextSize: number;
  experienceDescriptionSize: number;
  textDarkness: number;
  borderColor: string;
  borderThickness: number;
  borderOpacity: number;
  borderWidthPercent: 80 | 90 | 100;
}

export const initialAppearanceSettings: AppearanceSettings = {
  candidateNameSize: 32,
  candidateNameWeight: '700',
  contactInfoSize: 13,
  sectionHeadingSize: 16,
  sectionHeadingWeight: '700',
  bodyTextSize: 13,
  experienceDescriptionSize: 13,
  textDarkness: 80,
  borderColor: '#000000',
  borderThickness: 1,
  borderOpacity: 100,
  borderWidthPercent: 100
};
