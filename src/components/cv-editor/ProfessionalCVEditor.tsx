import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';
import { CandidateProfileSection } from './CandidateProfileSection';
import { ExecutiveSummarySection } from './ExecutiveSummarySection';
import { CompetencyProfileSection } from './CompetencyProfileSection';
import { ProfessionalExperienceSection } from './ProfessionalExperienceSection';
import { AcademicQualificationSection } from './AcademicQualificationSection';
import { LanguageProficiencySection } from './LanguageProficiencySection';
import { SupplementaryInformationSection } from './SupplementaryInformationSection';
import { ExtracurricularActivitiesSection } from './ExtracurricularActivitiesSection';

export const ProfessionalCVEditor: React.FC = () => {
  const { updateCVData } = useGovernmentCVStore();

  const handleGenerateDemoCV = () => {
    const demoData = {
      personalInfo: {
        fullName: 'Michael Anderson',
        address: '221B Baker Street, London, UK',
        email: 'michael.anderson@email.com',
        phone: '+44 7700 900123',
        linkedin: 'linkedin.com/in/michael-anderson',
        fatherName: 'Arthur Anderson',
        motherName: 'Helen Anderson',
        dateOfBirth: '24 May 1985',
        gender: 'Male',
        maritalStatus: 'Married',
        nationality: 'British',
        religion: 'Christianity',
        permanentAddress: '221B Baker Street, London, UK'
      },
      summary: 'Results-driven technology and digital transformation professional with experience leading enterprise-scale projects, stakeholder engagement, process optimization, and innovation initiatives across public and private sectors.',
      skills: [
        { id: 'sk1', category: 'Languages & Frameworks', skills: 'C#, ASP.NET Core, JavaScript, TypeScript, React' },
        { id: 'sk2', category: 'Database', skills: 'MySQL, PostgreSQL' },
        { id: 'sk3', category: 'Tools', skills: 'Git, GitHub, Azure DevOps' },
        { id: 'sk4', category: 'Executive Skills', skills: 'Leadership, Strategic Planning, Project Management' },
        { id: 'sk5', category: 'Soft Skills', skills: 'Communication, Teamwork, Problem Solving' }
      ],
      experience: [
        {
          id: 'exp1',
          jobTitle: 'Director of Digital Innovation & Transformation',
          company: 'London Metropolitan Authority',
          location: 'London, UK',
          startDate: 'Jan 2023',
          endDate: '',
          isCurrent: true,
          responsibilities: [
            'Formulated and executed the metropolitan digital innovation roadmap, aligning technology initiatives with public service delivery goals across a multi-million pound budget.',
            'Championed cloud migration and data modernization efforts, moving legacy on-premise infrastructure to Microsoft Azure to improve system reliability, data security, and service speed.',
            'Facilitated cross-functional collaboration between executive stakeholders, engineering teams, and policy developers to build public-facing portals and civic platforms.'
          ],
          achievements: [
            'Spearheaded a digital workflow automation project that reduced public service processing times by 45% and improved citizen satisfaction scores by 30%.',
            'Established an agile center of excellence, mentoring 40+ project managers and software engineers in modern product management methodologies.'
          ]
        },
        {
          id: 'exp2',
          jobTitle: 'Senior Enterprise Program Manager',
          company: 'Global Tech Solutions Corp',
          location: 'London, UK',
          startDate: 'Mar 2020',
          endDate: 'Dec 2022',
          isCurrent: false,
          responsibilities: [
            'Directed the end-to-end delivery of enterprise-scale software solutions for Fortune 500 clients in the financial and retail sectors, managing budgets exceeding £5 million.',
            'Led stakeholder engagement sessions to translate business needs into technical specifications, utilizing ASP.NET Core microservices and React dashboards.',
            'Oversaw risk management, resource allocation, and quality assurance processes across multiple distributed development teams.'
          ],
          achievements: [
            'Delivered a multi-tenant cloud-native platform 2 weeks ahead of schedule, saving the client approximately £150,000 in operational deployment costs.',
            'Improved vendor and client relationship metrics by introducing transparent progress dashboards using Azure DevOps and automated reporting.'
          ]
        },
        {
          id: 'exp3',
          jobTitle: 'IT Projects & Systems Lead',
          company: 'Department for Digital & Public Services',
          location: 'London, UK',
          startDate: 'Sep 2017',
          endDate: 'Feb 2020',
          isCurrent: false,
          responsibilities: [
            'Managed IT project portfolios focusing on civic technology, digital inclusion, and public sector database optimization projects.',
            'Collaborated with security teams to ensure GDPR compliance and robust cybersecurity policies across all database systems, including PostgreSQL and MySQL installations.',
            'Conducted vendor evaluations and negotiated service level agreements (SLAs) for hardware and software procurement.'
          ],
          achievements: [
            'Coordinated the modernization of the municipal housing registry system, integrating web technologies with secure database backends for 500,000+ residents.',
            'Managed project portfolios worth £2.5 million, keeping projects within budget and meeting 95% of target milestones.'
          ]
        },
        {
          id: 'exp4',
          jobTitle: 'Senior Software Engineer & Team Lead',
          company: 'Innovate Software Ltd',
          location: 'Reading, UK',
          startDate: 'Jul 2014',
          endDate: 'Aug 2017',
          isCurrent: false,
          responsibilities: [
            'Designed and developed robust, scalable web applications using C#, ASP.NET MVC, JavaScript, and TypeScript in an agile scrum environment.',
            'Led code reviews, established testing frameworks, and mentored junior developers to maintain high standards of code quality and performance.',
            'Managed database schema migrations and query optimizations for high-traffic transaction processing systems.'
          ],
          achievements: [
            'Engineered a backend search API using ASP.NET and PostgreSQL that reduced query latency by 50% for 1.2 daily active users.',
            'Introduced continuous integration and deployment (CI/CD) pipelines using Git and Jenkins, reducing release cycles from bi-weekly to daily.'
          ]
        },
        {
          id: 'exp5',
          jobTitle: 'Software Engineer',
          company: 'CoreTech Systems',
          location: 'London, UK',
          startDate: 'Oct 2011',
          endDate: 'Jun 2014',
          isCurrent: false,
          responsibilities: [
            'Developed and maintained client-server applications, web services, and user interfaces using C#, SQL Server, and vanilla JavaScript.',
            'Wrote unit tests, debugged application bottlenecks, and provided tier-3 technical support for critical production systems.',
            'Contributed to technical documentation, architecture blueprints, and API design specifications.'
          ],
          achievements: [
            'Successfully migrated a legacy desktop application to a modern web portal, saving client licensing fees and boosting accessibility.',
            'Optimized database stored procedures, reducing database CPU utilization by 25% during peak usage hours.'
          ]
        }
      ],
      education: [
        { id: 'edu1', degree: 'MSc in Software Engineering & Information Systems', institution: 'University of Oxford', startDate: '2010', endDate: '2011', gpa: 'Distinction (CGPA 3.90)' },
        { id: 'edu2', degree: 'BSc (Hons) in Computer Science', institution: 'Imperial College London', startDate: '2007', endDate: '2010', gpa: 'First Class Honours (CGPA 3.85)' },
        { id: 'edu3', degree: 'Advanced Level (A-Levels)', institution: 'Westminster School', startDate: '2005', endDate: '2007', gpa: 'A* in Mathematics, Physics, and Computer Science' }
      ],
      certifications: [
        { id: 'cert1', name: 'Project Management Professional (PMP)' },
        { id: 'cert2', name: 'Certified ScrumMaster (CSM)' },
        { id: 'cert3', name: 'AWS Certified Solutions Architect' },
        { id: 'cert4', name: 'Microsoft Certified: Azure Solutions Architect Expert' },
        { id: 'cert5', name: 'Google Cloud Certified Professional Cloud Architect' },
        { id: 'cert6', name: 'ITIL 4 Foundation Certification' },
        { id: 'cert7', name: 'Certified Information Systems Security Professional (CISSP)' },
        { id: 'cert8', name: 'Salesforce Certified Administrator' },
        { id: 'cert9', name: 'Security Clearance: Active Secret Clearance (UK Developed Vetting equivalent)' },
        { id: 'cert10', name: 'Professional Affiliations: Fellow of the British Computer Society (FBCS)' },
        { id: 'cert11', name: 'Publications: "Digital Transformation in Public Sector Ecosystems" (Tech Policy Review, 2024)' },
        { id: 'cert12', name: 'Interests: Quantum Computing, Public Policy, Digital Rights, Sailing, Chess' },
        { id: 'cert13', name: 'Availability: Immediate / 4 Weeks Notice' }
      ],
      languages: [
        { id: 'lang1', name: 'English', fluency: 'Native / Bilingual' },
        { id: 'lang2', name: 'German', fluency: 'Professional Working Proficiency' },
        { id: 'lang3', name: 'Spanish', fluency: 'Conversational' }
      ],
      extracurricular: [
        { id: 'ext1', role: 'Technical Mentor & Volunteer', organization: 'CodeYourFuture UK' },
        { id: 'ext2', role: 'Youth Leadership Coordinator', organization: 'The Prince\'s Trust' },
        { id: 'ext3', role: 'Active Committee Member', organization: 'London Sailing Association' }
      ]
    };
    updateCVData(demoData);
  };

  return (
    <div className="w-[45%] h-full bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg">
      <div className="p-4 border-b border-gray-100 bg-white shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">CVForge Editor</h1>
          <p className="text-xs text-gray-500 font-medium text-blue-600">Government Digital Transformation Mode</p>
        </div>
        <button
          onClick={handleGenerateDemoCV}
          className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>✨</span> Generate Demo CV
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 custom-scrollbar">
        <CandidateProfileSection />
        <ExecutiveSummarySection />
        <CompetencyProfileSection />
        <ProfessionalExperienceSection />
        <AcademicQualificationSection />
        <LanguageProficiencySection />
        <SupplementaryInformationSection />
        <ExtracurricularActivitiesSection />
      </div>
    </div>
  );
};
