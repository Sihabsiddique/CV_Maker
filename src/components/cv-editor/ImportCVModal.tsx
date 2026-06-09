import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Trash2, 
  FileCheck 
} from 'lucide-react';
import { useCVStore } from '@/store/cvStore';
import { extractTextFromPDF, extractTextFromDOCX, parseRawTextToCVData, ParsedCV } from '@/utils/cvParser';

interface ImportCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANALYSIS_STEPS = [
  'Reading binary file structure...',
  'Extracting raw document text content...',
  'Analyzing syntax & identifying headings...',
  'Mapping equivalent data fields and building confidence scoring...',
];

export const ImportCVModal: React.FC<ImportCVModalProps> = ({ isOpen, onClose }) => {
  const { updateCVData } = useCVStore();
  
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'review'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'others'>('personal');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (droppedFile) {
      validateAndProcessFile(droppedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  if (!isOpen) return null;

  const validateAndProcessFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      toast.error('Unsupported file type');
      return;
    }
    setError(null);
    setFile(file);
    startAnalysis(file);
  };

  const startAnalysis = async (fileToProcess: File) => {
    setStatus('analyzing');
    setCurrentStep(0);
    
    try {
      // Step 0: Reading binary data
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(1);

      // Step 1: Extracting text
      let extractedText = '';
      const ext = fileToProcess.name.split('.').pop()?.toLowerCase();
      
      if (ext === 'pdf') {
        extractedText = await extractTextFromPDF(fileToProcess);
      } else {
        extractedText = await extractTextFromDOCX(fileToProcess);
      }

      if (!extractedText.trim()) {
        throw new Error("Could not extract any readable text from this document. It might be scanned or protected.");
      }

      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(2);

      // Step 2: Analyze syntax and headings
      const data = parseRawTextToCVData(extractedText, fileToProcess.name);
      
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(3);

      // Step 3: Mapping fields
      await new Promise(r => setTimeout(r, 600));
      
      setParsedData(data);
      setStatus('review');
      toast.success("CV parsed successfully. Please review the mapped data.");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || 'Failed to analyze the CV. Please try again.';
      setError(msg);
      toast.error(msg);
      setStatus('idle');
      setFile(null);
    }
  };

  // Update handlers for edited parsed data
  const handlePersonalInfoChange = (key: keyof ParsedCV['personalInfo'], value: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      personalInfo: {
        ...parsedData.personalInfo,
        [key]: value
      }
    });
  };

  const handleSummaryChange = (value: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      summary: value
    });
  };

  const handleExperienceChange = (index: number, key: string, value: any) => {
    if (!parsedData) return;
    const updated = [...parsedData.experience];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setParsedData({
      ...parsedData,
      experience: updated
    });
  };

  const handleAddExperience = () => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: [
        ...parsedData.experience,
        {
          id: `exp_new_${Date.now()}`,
          jobTitle: 'New Job Title',
          company: 'New Company',
          location: 'Location',
          startDate: 'StartDate',
          endDate: 'EndDate',
          isCurrent: false,
          responsibilities: [],
          achievements: []
        }
      ]
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      experience: parsedData.experience.filter((_, idx) => idx !== index)
    });
  };

  const handleEducationChange = (index: number, key: string, value: any) => {
    if (!parsedData) return;
    const updated = [...parsedData.education];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setParsedData({
      ...parsedData,
      education: updated
    });
  };

  const handleAddEducation = () => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: [
        ...parsedData.education,
        {
          id: `edu_new_${Date.now()}`,
          degree: 'New Degree',
          institution: 'New Institution',
          startDate: 'StartDate',
          endDate: 'EndDate',
          gpa: ''
        }
      ]
    });
  };

  const handleRemoveEducation = (index: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      education: parsedData.education.filter((_, idx) => idx !== index)
    });
  };

  const handleSkillsChange = (index: number, key: string, value: string) => {
    if (!parsedData) return;
    const updated = [...parsedData.skills];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setParsedData({
      ...parsedData,
      skills: updated
    });
  };

  const handleAddSkill = () => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: [
        ...parsedData.skills,
        {
          id: `sk_new_${Date.now()}`,
          category: 'Skill Category',
          skills: 'Skill items'
        }
      ]
    });
  };

  const handleRemoveSkill = (index: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter((_, idx) => idx !== index)
    });
  };

  const handleOthersItemChange = (section: 'languages' | 'certifications' | 'extracurricular', index: number, key: string, value: string) => {
    if (!parsedData) return;
    const updated = [...parsedData[section]] as any[];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setParsedData({
      ...parsedData,
      [section]: updated
    });
  };

  const handleAddOthersItem = (section: 'languages' | 'certifications' | 'extracurricular') => {
    if (!parsedData) return;
    let newItem = {};
    if (section === 'languages') {
      newItem = { id: `lang_new_${Date.now()}`, name: 'New Language', fluency: 'Fluent' };
    } else if (section === 'certifications') {
      newItem = { id: `cert_new_${Date.now()}`, name: 'New Certification Name' };
    } else if (section === 'extracurricular') {
      newItem = { id: `extra_new_${Date.now()}`, role: 'Volunteer Role', organization: 'Organization' };
    }
    setParsedData({
      ...parsedData,
      [section]: [...parsedData[section], newItem]
    });
  };

  const handleRemoveOthersItem = (section: 'languages' | 'certifications' | 'extracurricular', index: number) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      [section]: parsedData[section].filter((_, idx) => idx !== index)
    });
  };

  const handleImportSave = () => {
    if (!parsedData) return;
    
    updateCVData({
      personalInfo: parsedData.personalInfo,
      summary: parsedData.summary,
      skills: parsedData.skills,
      experience: parsedData.experience,
      education: parsedData.education,
      languages: parsedData.languages,
      extracurricular: parsedData.extracurricular,
      certifications: parsedData.certifications
    });

    toast.success("CV data loaded into form fields and store.");
    onClose();
  };

  const handleCancel = () => {
    setFile(null);
    setParsedData(null);
    setStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col w-full max-w-5xl h-[85vh] overflow-hidden transform scale-100 transition-all duration-300">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              Import Existing CV
            </h2>
            <p className="text-xs text-gray-500 font-medium">Extract structured contents from PDF or DOCX resume formats</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded transition cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden min-h-0 relative">
          
          {/* STATE 1: Idle - Upload Form */}
          {status === 'idle' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white space-y-6">
              {error && (
                <div className="w-full max-w-md p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div
                {...getRootProps()}
                className={`w-full max-w-lg border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/20'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-800">
                    {isDragActive ? 'Drop the CV file here...' : 'Drag & Drop CV File Here'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">or click to browse your folders</p>
                </div>
                <div className="flex gap-4 pt-2">
                  <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 rounded flex items-center gap-1">
                    <FileText className="w-3 h-3 text-red-500" /> PDF Format
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 rounded flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" /> DOCX Format
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Analyzing Loading Phase */}
          {status === 'analyzing' && (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white space-y-8">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute" />
                <Sparkles className="w-7 h-7 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2 text-center max-w-sm">
                <h3 className="text-sm font-bold text-gray-800">Analyzing Document Structure</h3>
                <p className="text-xs text-gray-400 font-medium">Extracting metadata and mapping text blocks...</p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full max-w-md bg-gray-50 border border-gray-150 rounded-xl p-5 space-y-3.5">
                {ANALYSIS_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${idx <= currentStep ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>
                      {step}
                    </span>
                    {idx < currentStep ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Done
                      </span>
                    ) : idx === currentStep ? (
                      <span className="text-blue-600 font-bold animate-pulse flex items-center gap-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Running...
                      </span>
                    ) : (
                      <span className="text-gray-300">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATE 3: Review & Report Mode (Data Extracted) */}
          {status === 'review' && parsedData && (
            <div className="h-full flex min-h-0 bg-gray-50">
              
              {/* Left Column: Data Editor Tabs */}
              <div className="flex-1 border-r border-gray-200 bg-white flex flex-col min-h-0">
                {/* Review Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50 shrink-0 select-none overflow-x-auto">
                  {(['personal', 'summary', 'experience', 'education', 'skills', 'others'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-xs font-bold border-b-2 capitalize transition cursor-pointer whitespace-nowrap ${
                        activeTab === tab 
                          ? 'border-blue-600 text-blue-600 bg-white' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'personal' ? 'Personal Details' : tab}
                    </button>
                  ))}
                </div>

                {/* Tab Editors Container */}
                <div className="flex-1 p-6 overflow-y-auto min-h-0 custom-scrollbar space-y-6">
                  
                  {/* TAB 1: Personal Details */}
                  {activeTab === 'personal' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Credentials</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.fullName}
                            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={parsedData.personalInfo.email}
                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.phone}
                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Address / Country</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.address}
                            onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">LinkedIn URL</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.linkedin}
                            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider pt-4">ATS CV Demographics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Father's Name</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.fatherName || ''}
                            onChange={(e) => handlePersonalInfoChange('fatherName', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Mother's Name</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.motherName || ''}
                            onChange={(e) => handlePersonalInfoChange('motherName', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Date of Birth</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.dateOfBirth || ''}
                            onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Nationality</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.nationality || ''}
                            onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Gender</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.gender || ''}
                            onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Religion</label>
                          <input
                            type="text"
                            value={parsedData.personalInfo.religion || ''}
                            onChange={(e) => handlePersonalInfoChange('religion', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-gray-500 mb-1">Permanent Address</label>
                          <textarea
                            value={parsedData.personalInfo.permanentAddress || ''}
                            onChange={(e) => handlePersonalInfoChange('permanentAddress', e.target.value)}
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Summary */}
                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Executive Summary</h4>
                      <textarea
                        value={parsedData.summary}
                        onChange={(e) => handleSummaryChange(e.target.value)}
                        rows={8}
                        className="w-full p-3 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800 leading-[1.4]"
                      />
                    </div>
                  )}

                  {/* TAB 3: Experience */}
                  {activeTab === 'experience' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Employment History</h4>
                        <button
                          onClick={handleAddExperience}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 text-[11px] font-bold rounded cursor-pointer transition active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Job
                        </button>
                      </div>

                      {parsedData.experience.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic text-center py-6">No experience logs extracted. Add one manually.</p>
                      ) : (
                        <div className="space-y-6">
                          {parsedData.experience.map((job, idx) => (
                            <div key={job.id} className="p-4 border border-gray-250 rounded-lg bg-gray-50 relative group">
                              <button
                                onClick={() => handleRemoveExperience(idx)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-rose-600 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Job Title</label>
                                  <input
                                    type="text"
                                    value={job.jobTitle}
                                    onChange={(e) => handleExperienceChange(idx, 'jobTitle', e.target.value)}
                                    className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Company / Organization</label>
                                  <input
                                    type="text"
                                    value={job.company}
                                    onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                    className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Location</label>
                                  <input
                                    type="text"
                                    value={job.location}
                                    onChange={(e) => handleExperienceChange(idx, 'location', e.target.value)}
                                    className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Start Date</label>
                                    <input
                                      type="text"
                                      value={job.startDate}
                                      onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                                      className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1">End Date</label>
                                    <input
                                      type="text"
                                      value={job.endDate}
                                      disabled={job.isCurrent}
                                      onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                                      className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800 disabled:opacity-50"
                                    />
                                  </div>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`isCurrent-${job.id}`}
                                    checked={job.isCurrent}
                                    onChange={(e) => {
                                      handleExperienceChange(idx, 'isCurrent', e.target.checked);
                                      if (e.target.checked) handleExperienceChange(idx, 'endDate', '');
                                    }}
                                    className="cursor-pointer"
                                  />
                                  <label htmlFor={`isCurrent-${job.id}`} className="text-xs font-bold text-gray-600 cursor-pointer select-none">
                                    Current Job / Role
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: Education */}
                  {activeTab === 'education' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Academic Credentials</h4>
                        <button
                          onClick={handleAddEducation}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 text-[11px] font-bold rounded cursor-pointer transition active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Academic
                        </button>
                      </div>

                      {parsedData.education.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic text-center py-6">No academic logs extracted. Add one manually.</p>
                      ) : (
                        <div className="space-y-6">
                          {parsedData.education.map((edu, idx) => (
                            <div key={edu.id} className="p-4 border border-gray-250 rounded-lg bg-gray-50 relative">
                              <button
                                onClick={() => handleRemoveEducation(idx)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-rose-600 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Degree / Course</label>
                                  <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                                    className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Institution</label>
                                  <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                                    className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Start Year</label>
                                    <input
                                      type="text"
                                      value={edu.startDate}
                                      onChange={(e) => handleEducationChange(idx, 'startDate', e.target.value)}
                                      className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1">End Year</label>
                                    <input
                                      type="text"
                                      value={edu.endDate}
                                      onChange={(e) => handleEducationChange(idx, 'endDate', e.target.value)}
                                      className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Result / CGPA</label>
                                  <input
                                    type="text"
                                    value={edu.gpa || ''}
                                    onChange={(e) => handleEducationChange(idx, 'gpa', e.target.value)}
                                    className="w-full p-2 border border-gray-350 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: Skills */}
                  {activeTab === 'skills' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Expertise & Skills</h4>
                        <button
                          onClick={handleAddSkill}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 text-[11px] font-bold rounded cursor-pointer transition active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Skill Category
                        </button>
                      </div>

                      {parsedData.skills.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic text-center py-6">No skills extracted. Add one manually.</p>
                      ) : (
                        <div className="space-y-4">
                          {parsedData.skills.map((skill, idx) => (
                            <div key={skill.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded border border-gray-200">
                              <div className="flex-1 grid grid-cols-3 gap-3">
                                <div className="col-span-1">
                                  <label className="block text-[9px] font-bold text-gray-500 mb-0.5">Category</label>
                                  <input
                                    type="text"
                                    value={skill.category}
                                    onChange={(e) => handleSkillsChange(idx, 'category', e.target.value)}
                                    className="w-full p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[9px] font-bold text-gray-500 mb-0.5">Skills (Comma separated)</label>
                                  <input
                                    type="text"
                                    value={skill.skills}
                                    onChange={(e) => handleSkillsChange(idx, 'skills', e.target.value)}
                                    className="w-full p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveSkill(idx)}
                                className="text-gray-400 hover:text-rose-600 transition cursor-pointer text-xs font-bold pt-3 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 6: Others (Languages, Certs, Activities) */}
                  {activeTab === 'others' && (
                    <div className="space-y-8">
                      {/* Section A: Languages */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Languages</h4>
                          <button
                            onClick={() => handleAddOthersItem('languages')}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded cursor-pointer transition border border-blue-200 flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                        {parsedData.languages.map((lang, idx) => (
                          <div key={lang.id} className="flex gap-3 items-center bg-gray-50 p-2.5 rounded border border-gray-200">
                            <input
                              type="text"
                              value={lang.name}
                              placeholder="Language Name"
                              onChange={(e) => handleOthersItemChange('languages', idx, 'name', e.target.value)}
                              className="flex-1 p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                            />
                            <input
                              type="text"
                              value={lang.fluency}
                              placeholder="Fluency (e.g. Native)"
                              onChange={(e) => handleOthersItemChange('languages', idx, 'fluency', e.target.value)}
                              className="flex-1 p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                            />
                            <button
                              onClick={() => handleRemoveOthersItem('languages', idx)}
                              className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Section B: Certifications */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Certifications</h4>
                          <button
                            onClick={() => handleAddOthersItem('certifications')}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded cursor-pointer transition border border-blue-200 flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                        {parsedData.certifications.map((cert, idx) => (
                          <div key={cert.id} className="flex gap-3 items-center bg-gray-50 p-2.5 rounded border border-gray-200">
                            <input
                              type="text"
                              value={cert.name}
                              placeholder="Certification Title"
                              onChange={(e) => handleOthersItemChange('certifications', idx, 'name', e.target.value)}
                              className="flex-1 p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                            />
                            <button
                              onClick={() => handleRemoveOthersItem('certifications', idx)}
                              className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Section C: Extracurricular */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Activities</h4>
                          <button
                            onClick={() => handleAddOthersItem('extracurricular')}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded cursor-pointer transition border border-blue-200 flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                        {parsedData.extracurricular.map((item, idx) => (
                          <div key={item.id} className="flex gap-3 items-center bg-gray-50 p-2.5 rounded border border-gray-200">
                            <input
                              type="text"
                              value={item.role}
                              placeholder="Role / Title"
                              onChange={(e) => handleOthersItemChange('extracurricular', idx, 'role', e.target.value)}
                              className="flex-1 p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                            />
                            <input
                              type="text"
                              value={item.organization}
                              placeholder="Organization"
                              onChange={(e) => handleOthersItemChange('extracurricular', idx, 'organization', e.target.value)}
                              className="flex-1 p-1.5 border border-gray-300 bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                            />
                            <button
                              onClick={() => handleRemoveOthersItem('extracurricular', idx)}
                              className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: Confidence & Extraction Analytics Report */}
              <div className="w-[340px] bg-gray-50 border-l border-gray-200 p-5 overflow-y-auto flex flex-col justify-between shrink-0 custom-scrollbar select-none">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Extraction Report</h3>
                    <div className="p-3.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold">Detected CV Format</p>
                        <p className="text-sm font-extrabold text-blue-600 tracking-tight">{parsedData.detectedType}</p>
                      </div>
                      <FileCheck className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Confidence</h3>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center shadow-sm space-y-2">
                      <div className="relative w-18 h-18 flex items-center justify-center">
                        {/* Circular Meter */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="36" cy="36" r="30" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="36"
                            cy="36"
                            r="30"
                            stroke={parsedData.overallConfidence >= 85 ? '#10b981' : '#f59e0b'}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={188.4}
                            strokeDashoffset={188.4 - (188.4 * parsedData.overallConfidence) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="text-base font-extrabold text-gray-800 z-10">{parsedData.overallConfidence}%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">Heuristic Mapping Index</p>
                    </div>
                  </div>

                  {/* Section Scores */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section Quality Indexes</h3>
                    <div className="space-y-2.5 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      {Object.entries(parsedData.confidenceScores).map(([sect, score]) => (
                        <div key={sect} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-600">
                            <span>{sect}</span>
                            <span>{score}%</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fields Found / Missing lists */}
                  <div className="space-y-4">
                    {/* Warnings List */}
                    {parsedData.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parser Alerts & Warnings</h3>
                        <ul className="space-y-1.5 p-3.5 bg-amber-50/50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-bold leading-normal">
                          {parsedData.warnings.map((warn, idx) => (
                            <li key={idx} className="flex gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{warn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Found Checklist */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Extracted Sections</h3>
                      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-[10px] font-bold text-gray-600 space-y-1.5 max-h-[140px] overflow-y-auto">
                        {parsedData.fieldsFound.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {f}
                          </div>
                        ))}
                        {parsedData.fieldsMissing.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-gray-400">
                            <XCircle className="w-3.5 h-3.5 text-gray-300" /> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Buttons */}
                <div className="pt-5 border-t border-gray-200 flex gap-2.5">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded shadow-sm transition active:scale-95 cursor-pointer text-center"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleImportSave}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded shadow transition active:scale-95 cursor-pointer text-center"
                  >
                    Save & Load Form
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
