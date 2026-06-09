import React, { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { pdf } from '@react-pdf/renderer';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { FileDown, FileText, Loader2 } from 'lucide-react';
import { PDFExporter } from '@/exports/pdfExporter';
import { generateDocx } from '@/exports/docxExporter';

export const ExportCVActions: React.FC = () => {
  const { cvData, appearanceSettings } = useCVStore();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDOCX, setIsExportingDOCX] = useState(false);

  const handleDownloadPDF = async () => {
    if (isExportingPDF || isExportingDOCX) return;
    setIsExportingPDF(true);
    try {
      const blob = await pdf(<PDFExporter data={cvData} settings={appearanceSettings} />).toBlob();
      const filename = `${(cvData.personalInfo.fullName || 'Michael_Anderson').replace(/\s+/g, '_')}_CV.pdf`;
      
      saveAs(blob, filename);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error('PDF Export Audit Error:', error);
      toast.error("PDF generation failed");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (isExportingPDF || isExportingDOCX) return;
    setIsExportingDOCX(true);
    try {
      const doc = generateDocx(cvData, appearanceSettings);
      const blob = await Packer.toBlob(doc);
      const filename = `${(cvData.personalInfo.fullName || 'Michael_Anderson').replace(/\s+/g, '_')}_CV.docx`;
      
      saveAs(blob, filename);
      toast.success("DOCX downloaded successfully");
    } catch (error) {
      console.error('DOCX Export Audit Error:', error);
      toast.error("DOCX generation failed");
    } finally {
      setIsExportingDOCX(false);
    }
  };

  return (
    <div className="flex items-center gap-3 relative">
      <button
        onClick={handleDownloadDOCX}
        disabled={isExportingPDF || isExportingDOCX}
        className={`px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
          isExportingDOCX ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95 cursor-pointer'
        }`}
      >
        {isExportingDOCX ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Generating DOCX...
          </>
        ) : (
          <>
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Download DOCX
          </>
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
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileDown className="w-3.5 h-3.5 text-white" />
            Download PDF
          </>
        )}
      </button>
    </div>
  );
};
