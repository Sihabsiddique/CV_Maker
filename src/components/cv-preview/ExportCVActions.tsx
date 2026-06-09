import React, { useState } from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';
import { pdf } from '@react-pdf/renderer';
import { Packer } from 'docx';
import { GovernmentCVPdfExporter } from '@/exports/governmentCVPdfExporter';
import { generateGovernmentCVDocx } from '@/exports/governmentCVDocxExporter';

export const ExportCVActions: React.FC = () => {
  const { cvData } = useGovernmentCVStore();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDOCX, setIsExportingDOCX] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleDownloadPDF = async () => {
    if (isExportingPDF || isExportingDOCX) return;
    setIsExportingPDF(true);
    try {
      // Compile the PDF doc component into a blob
      const blob = await pdf(<GovernmentCVPdfExporter data={cvData} />).toBlob();
      
      // Exact browser download logic as requested
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${(cvData.personalInfo.fullName || 'Michael_Anderson').replace(/\s+/g, '_')}_CV.pdf`;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error('PDF Export Audit Error:', error);
      showToast("PDF generation failed", "error");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (isExportingPDF || isExportingDOCX) return;
    setIsExportingDOCX(true);
    try {
      const doc = generateGovernmentCVDocx(cvData);
      const blob = await Packer.toBlob(doc);
      
      // Exact browser download logic as requested
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${(cvData.personalInfo.fullName || 'Michael_Anderson').replace(/\s+/g, '_')}_CV.docx`;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast("DOCX downloaded successfully", "success");
    } catch (error) {
      console.error('DOCX Export Audit Error:', error);
      showToast("DOCX generation failed", "error");
    } finally {
      setIsExportingDOCX(false);
    }
  };

  return (
    <div className="flex items-center gap-3 relative">
      {/* Custom Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border text-xs font-semibold transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span className="mr-2">{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <button
        onClick={handleDownloadDOCX}
        disabled={isExportingPDF || isExportingDOCX}
        className={`px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
          isExportingDOCX ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 cursor-pointer'
        }`}
      >
        {isExportingDOCX ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            Generating DOCX...
          </>
        ) : (
          "Download DOCX"
        )}
      </button>

      <button
        onClick={handleDownloadPDF}
        disabled={isExportingPDF || isExportingDOCX}
        className={`px-4 py-1.5 bg-black text-white text-xs font-semibold rounded shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
          isExportingPDF ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800 active:scale-95 cursor-pointer'
        }`}
      >
        {isExportingPDF ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Generating PDF...
          </>
        ) : (
          "Download PDF"
        )}
      </button>
    </div>
  );
};
