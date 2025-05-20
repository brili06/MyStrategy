'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Plus, FileText, Download } from 'lucide-react';
import { CompanyProfile, SwotItem, Factor } from '@/types/matrix';
interface LandingPageProps {
  onNewAnalysis: () => void;
  onOpenProject: (data: {
    companyProfile: CompanyProfile | null;
    swotItems: SwotItem[];
    ifeFactors: Factor[];
    efeFactors: Factor[];
    currentStep: string;
    soStrategies?: any[];
    stStrategies?: any[];
    woStrategies?: any[];
    wtStrategies?: any[];
    prioritizedStrategies?: any[];
  }) => void;
}
export default function LandingPage({
  onNewAnalysis,
  onOpenProject
}: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  const handleFileUpload = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.aiproj') && !file.name.endsWith('.json')) {
      setError('Please upload a valid project file (.aiproj or .json)');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const projectData = JSON.parse(result);

          // Validate the project data has required fields
          if (!projectData.companyProfile && !projectData.swotItems) {
            throw new Error('Invalid project file format');
          }
          onOpenProject(projectData);
        }
      } catch (err) {
        console.error('Error parsing project file:', err);
        setError('Invalid project file format. Please upload a valid project file.');
      }
    };
    reader.onerror = () => {
      setError('Error reading the file. Please try again.');
    };
    reader.readAsText(file);
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto" data-unique-id="289bc3ca-d187-47f8-ad21-805511f6746d" data-file-name="components/LandingPage.tsx">
      <div className="text-center mb-10" data-unique-id="b3ca802a-2348-44b4-9c92-4eae564aeb6f" data-file-name="components/LandingPage.tsx">
        <h1 className="text-3xl font-bold text-slate-800 mb-4" data-unique-id="3d67b0f4-c29f-4dec-8c59-1f7ca995e578" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="ebb8eecf-ee28-4d26-9bae-cb88fc9664c6" data-file-name="components/LandingPage.tsx">Strategic Management Assistant</span></h1>
        <p className="text-slate-500 max-w-2xl mx-auto" data-unique-id="53e366c0-1f4b-4f5d-a7bc-baf2e2af51ba" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="1bce486e-17ca-4853-b14c-6fc85d8ab250" data-file-name="components/LandingPage.tsx">
          Comprehensive strategic analysis tool for business planning. Create SWOT analyses, 
          evaluate internal and external factors, and generate AI-powered strategic recommendations.
        </span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12" data-unique-id="19debc39-f422-48a0-9164-757cb42e2843" data-file-name="components/LandingPage.tsx">
        <motion.div whileHover={{
        scale: 1.03
      }} transition={{
        type: 'spring',
        stiffness: 300
      }} className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md" onClick={onNewAnalysis} data-unique-id="ea687dcc-40f0-4543-9852-8d6647b6c502" data-file-name="components/LandingPage.tsx">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4" data-unique-id="20032607-e80b-409c-8cd8-1d9be484ccc7" data-file-name="components/LandingPage.tsx">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2" data-unique-id="4fcccb31-8568-4875-a118-39b7a3f3f332" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="1d6d69c4-0b80-4264-8db2-f8b168997ff3" data-file-name="components/LandingPage.tsx">New Analysis</span></h3>
          <p className="text-slate-500" data-unique-id="cfe40db0-90b3-4679-bcc3-256ac75dff92" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="48c07d81-6a4e-4f65-ab5a-5c001daf6e62" data-file-name="components/LandingPage.tsx">
            Start a new strategic analysis from scratch. Define your company profile, 
            conduct SWOT analysis, and evaluate internal and external factors.
          </span></p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={onNewAnalysis} data-unique-id="05b78899-3138-4c6d-a815-000f717adb86" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="9cc17baf-72c2-453a-a0b1-ef9fedf9b8d4" data-file-name="components/LandingPage.tsx">
            Start New Analysis
          </span></button>
        </motion.div>

        <motion.div whileHover={{
        scale: 1.03
      }} transition={{
        type: 'spring',
        stiffness: 300
      }} className={`bg-slate-50 border ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200'} rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} data-unique-id="bd8562a1-b8d0-4ed5-9e08-2dbc68b22078" data-file-name="components/LandingPage.tsx" data-dynamic-text="true">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" data-unique-id="92cf7f0b-426c-46c3-bcb3-ede99815eb7d" data-file-name="components/LandingPage.tsx">
            <FileUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2" data-unique-id="c17bdcc6-92e6-440a-837f-d63eb7d01ec6" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="ea9bbfbc-0f4a-4e47-82d9-7a48bdb71cf7" data-file-name="components/LandingPage.tsx">Open Project</span></h3>
          <p className="text-slate-500" data-unique-id="8e72ac38-9450-433f-b700-fffe82172b41" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="a3cf83cb-1b42-423c-9936-a54510ee2c19" data-file-name="components/LandingPage.tsx">
            Continue working on a previously saved analysis project. 
            Upload your .aiproj or .json file to restore all your data.
          </span></p>
          
          <label className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer" data-unique-id="cb4194de-aa86-47d2-9ed8-15a34d387989" data-file-name="components/LandingPage.tsx">
            <input type="file" accept=".aiproj,.json" className="hidden" onChange={handleFileChange} data-unique-id="54760a70-0659-4cf0-a830-9261f5cb3495" data-file-name="components/LandingPage.tsx" /><span className="editable-text" data-unique-id="a23aab30-b929-4930-b886-5b7da9f00ce7" data-file-name="components/LandingPage.tsx">
            Upload Project File
          </span></label>
          
          <p className="mt-4 text-sm text-slate-400" data-unique-id="feed2cea-2179-4605-b3e1-a81180122857" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="3f90ad1f-b425-4738-a4fb-5211a66a45bc" data-file-name="components/LandingPage.tsx">
            Drag and drop your project file here, or click to browse
          </span></p>
          
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm" data-unique-id="a3ca89fb-83a8-4580-a6e3-28f65ff71229" data-file-name="components/LandingPage.tsx" data-dynamic-text="true">
              {error}
            </div>}
        </motion.div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200" data-unique-id="62a7dab6-2edb-4d0f-8e81-1cb3cc5bd1e0" data-file-name="components/LandingPage.tsx">
        <div className="flex items-center justify-center gap-8" data-unique-id="12cf1645-8885-4f3e-9663-3820fe2ab002" data-file-name="components/LandingPage.tsx">
          <div className="flex items-center text-slate-500" data-unique-id="fbc2f95a-2225-4184-943a-fb327ba1b474" data-file-name="components/LandingPage.tsx">
            <FileText className="h-5 w-5 mr-2" />
            <span data-unique-id="23f59c46-72ba-4618-9bbb-f3fa998c2ba7" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="18ce5f41-af8e-4d62-9cc6-94ae14b74593" data-file-name="components/LandingPage.tsx">SWOT Analysis</span></span>
          </div>
          <div className="flex items-center text-slate-500" data-unique-id="64a21b2c-d530-4aed-9e65-9c4541117c41" data-file-name="components/LandingPage.tsx">
            <Download className="h-5 w-5 mr-2" />
            <span data-unique-id="a6273dba-6309-4643-a112-715dc0a364b1" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="614ec49f-96fe-49c1-a629-9c4ed8478e16" data-file-name="components/LandingPage.tsx">Matrix Evaluation</span></span>
          </div>
          <div className="flex items-center text-slate-500" data-unique-id="69acff34-fec4-4780-82b0-c668465ebb45" data-file-name="components/LandingPage.tsx">
            <FileText className="h-5 w-5 mr-2" />
            <span data-unique-id="23f24957-afc9-49f1-944f-803f7b67055d" data-file-name="components/LandingPage.tsx"><span className="editable-text" data-unique-id="b9ee2090-38b7-4992-bbcd-48e69585bb40" data-file-name="components/LandingPage.tsx">AI Strategy Generation</span></span>
          </div>
        </div>
      </div>
    </motion.div>;
}