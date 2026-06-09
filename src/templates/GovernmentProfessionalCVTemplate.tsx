import React from 'react';
import { GovernmentCVData } from '@/types/governmentCV.types';

interface TemplateProps {
  data: GovernmentCVData;
}

export const GovernmentProfessionalCVTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-[#333333] font-sans box-border p-[25.4mm] shadow-lg mx-auto print:shadow-none print:w-auto print:min-h-auto print:p-0">
      
      {/* Header section */}
      <div className="text-center mb-[18pt]">
        <h1 className="text-[24pt] font-bold text-black mb-[4pt] leading-none">
          {data.personalInfo.fullName || 'First Name Last Name'}
        </h1>
        <hr className="mt-[8pt] mb-[8pt] border-t border-black" />
        <div className="text-[10pt] leading-tight text-gray-800">
          <p className="mb-[2pt]">
            {data.personalInfo.address || 'Address'} | {data.personalInfo.email || 'email@example.com'}
          </p>
          <p>
            {data.personalInfo.linkedin || 'LinkedIn'} | Contact: {data.personalInfo.phone || 'Phone'}
          </p>
        </div>
        <hr className="mt-[8pt] border-t border-black" />
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-[12pt] text-[10pt] text-justify leading-[1.4]">
          <p>{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-[12pt]">
          <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Skills</h2>
          <hr className="border-t border-black mb-[8pt]" />
          <ul className="list-disc ml-[18pt] text-[10pt] leading-[1.4]">
            {data.skills.map((skill) => (
              <li key={skill.id} className="pl-1">
                <strong>{skill.category}:</strong> {skill.skills}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div className="mb-[12pt]">
          <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Work Experience</h2>
          <hr className="border-t border-black mb-[8pt]" />
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-[12pt] text-[10pt] leading-[1.4]">
              <div className="flex justify-between">
                <span className="font-bold">{exp.jobTitle}</span>
                <span>{exp.location}{exp.location ? '. ' : ''}{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
              </div>
              {exp.company && <div className="mb-[4pt]">{exp.company}</div>}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="mb-[4pt] text-justify">{exp.responsibilities.join(' ')}</div>
              )}
              {exp.achievements.length > 0 && (
                <ul className="list-disc ml-[18pt]">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="pl-1 mb-[2pt]">{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-[12pt]">
          <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Education and Training</h2>
          <hr className="border-t border-black mb-[8pt]" />
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-[8pt] text-[10pt] leading-[1.4]">
              <div className="flex justify-between">
                <span className="font-bold">{edu.degree}</span>
                <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
              <div className="flex justify-between">
                <span>{edu.institution}</span>
                {edu.gpa && <span>{edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Language */}
      {data.languages.length > 0 && (
        <div className="mb-[12pt]">
          <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Language Proficiency</h2>
          <hr className="border-t border-black mb-[8pt]" />
          <ul className="list-disc ml-[18pt] text-[10pt] leading-[1.4]">
            {data.languages.map((lang) => (
              <li key={lang.id} className="pl-1">
                <strong>{lang.name}:</strong> {lang.fluency}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracurricular */}
      {data.extracurricular.length > 0 && (
        <div className="mb-[12pt]">
          <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Extracurricular Activities:</h2>
          <hr className="border-t border-black mb-[8pt]" />
          <ul className="list-disc ml-[18pt] text-[10pt] leading-[1.4]">
            {data.extracurricular.map((item) => (
              <li key={item.id} className="pl-1">
                <strong>{item.role},</strong> {item.organization}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personal Information */}
      <div className="mb-[12pt]">
        <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Personal Information</h2>
        <hr className="border-t border-black mb-[8pt]" />
        <div className="text-[10pt] leading-[1.4] grid grid-cols-[140px_1fr] gap-x-2">
          {data.personalInfo.fatherName && (
             <><div>Father&apos;s Name</div><div>: {data.personalInfo.fatherName}</div></>
          )}
          {data.personalInfo.motherName && (
             <><div>Mother&apos;s Name</div><div>: {data.personalInfo.motherName}</div></>
          )}
          {data.personalInfo.dateOfBirth && (
             <><div>Date of Birth</div><div>: {data.personalInfo.dateOfBirth}</div></>
          )}
          {data.personalInfo.gender && (
             <><div>Gender</div><div>: {data.personalInfo.gender}</div></>
          )}
          {data.personalInfo.maritalStatus && (
             <><div>Marital Status</div><div>: {data.personalInfo.maritalStatus}</div></>
          )}
          {data.personalInfo.nationality && (
             <><div>Nationality</div><div>: {data.personalInfo.nationality}</div></>
          )}
          {data.personalInfo.religion && (
             <><div>Religion</div><div>: {data.personalInfo.religion}</div></>
          )}
          {data.personalInfo.permanentAddress && (
             <><div>Permanent Address</div><div>: {data.personalInfo.permanentAddress}</div></>
          )}
        </div>
      </div>

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="mb-[12pt]">
          <h2 className="text-[12pt] font-bold uppercase text-black leading-none mb-1">Additional Information</h2>
          <hr className="border-t border-black mb-[8pt]" />
          <ul className="list-disc ml-[18pt] text-[10pt] leading-[1.4]">
            <li className="pl-1">
              <strong>Certifications: </strong>
              {data.certifications.map(c => c.name).join(', ')}
            </li>
          </ul>
        </div>
      )}

    </div>
  );
};
