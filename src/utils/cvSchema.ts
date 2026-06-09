import { z } from "zod";

export const candidateProfileSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  linkedin: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  permanentAddress: z.string().optional(),
});

export const professionalExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});

export const academicQualificationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
});

export const competencySchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Category is required"),
  skills: z.string().min(1, "Skills are required"),
});

export const languageProficiencySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Language is required"),
  fluency: z.string().min(1, "Fluency is required"),
});

export const extracurricularActivitySchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required"),
  organization: z.string().min(1, "Organization is required"),
});

export const professionalCertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
});

export const cvSchema = z.object({
  personalInfo: candidateProfileSchema,
  summary: z.string().optional(),
  skills: z.array(competencySchema).default([]),
  experience: z.array(professionalExperienceSchema).default([]),
  education: z.array(academicQualificationSchema).default([]),
  languages: z.array(languageProficiencySchema).default([]),
  extracurricular: z.array(extracurricularActivitySchema).default([]),
  certifications: z.array(professionalCertificationSchema).default([]),
});

export type CVFormValues = z.infer<typeof cvSchema>;
