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
  }} className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto" data-unique-id="bfb498ab-06fd-44ab-8e0f-5de93dd9dad8" data-loc="90:4-95:5" data-file-name="components/LandingPage.tsx">
      <div className="text-center mb-10" data-unique-id="970fe086-9b8a-4dd8-8b1c-2ed3afebbee4" data-loc="96:6-96:41" data-file-name="components/LandingPage.tsx">
        <h1 className="text-3xl font-bold text-slate-800 mb-4" data-unique-id="ff2f85f3-9602-4116-94b2-7e1a8e81fbde" data-loc="97:8-97:63" data-file-name="components/LandingPage.tsx">Strategic Management Assistant</h1>
        <p className="text-slate-500 max-w-2xl mx-auto" data-unique-id="17f403e3-35e4-4367-ab16-ff6bb65213ff" data-loc="98:8-98:56" data-file-name="components/LandingPage.tsx">
          Comprehensive strategic analysis tool for business planning. Create SWOT analyses, 
          evaluate internal and external factors, and generate AI-powered strategic recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12" data-unique-id="a0deeceb-c2cd-4821-99ff-a0b77c8c1f1e" data-loc="104:6-104:67" data-file-name="components/LandingPage.tsx">
        <motion.div whileHover={{
        scale: 1.03
      }} transition={{
        type: 'spring',
        stiffness: 300
      }} className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md" onClick={onNewAnalysis} data-unique-id="b4c7bf7f-e9fe-4b28-9eef-314cc2472158" data-loc="105:8-110:9" data-file-name="components/LandingPage.tsx">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4" data-unique-id="1e745041-d438-4a42-8074-913aff2c80ed" data-loc="111:10-111:100" data-file-name="components/LandingPage.tsx">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2" data-unique-id="b59f9124-7155-44b1-9380-7b4326e85188" data-loc="114:10-114:68" data-file-name="components/LandingPage.tsx">New Analysis</h3>
          <p className="text-slate-500" data-unique-id="ed926670-3185-4177-b5c8-22111b0ea2b0" data-loc="115:10-115:40" data-file-name="components/LandingPage.tsx">
            Start a new strategic analysis from scratch. Define your company profile, 
            conduct SWOT analysis, and evaluate internal and external factors.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={onNewAnalysis} data-unique-id="a0d22203-b975-4da5-9485-da770e3eed64" data-loc="119:10-122:11" data-file-name="components/LandingPage.tsx">
            Start New Analysis
          </button>
        </motion.div>

        <motion.div whileHover={{
        scale: 1.03
      }} transition={{
        type: 'spring',
        stiffness: 300
      }} className={`bg-slate-50 border ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200'} rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} data-unique-id="4a4a4e6c-b95f-4e4a-a550-c1df3ed86a21" data-loc="127:8-134:9" data-file-name="components/LandingPage.tsx">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" data-unique-id="9fbc6084-2de0-4c63-a112-c0a355fa169c" data-loc="135:10-135:101" data-file-name="components/LandingPage.tsx">
            <FileUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2" data-unique-id="60cba8fb-72ab-4fd9-b684-91377d08a36c" data-loc="138:10-138:68" data-file-name="components/LandingPage.tsx">Open Project</h3>
          <p className="text-slate-500" data-unique-id="2a6ed6a2-23fc-4da3-b723-8a9f2f2e2802" data-loc="139:10-139:40" data-file-name="components/LandingPage.tsx">
            Continue working on a previously saved analysis project. 
            Upload your .aiproj or .json file to restore all your data.
          </p>
          
          <label className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer" data-unique-id="15d5dd2b-c028-42d4-be80-ec7c9c06f251" data-loc="144:10-144:131" data-file-name="components/LandingPage.tsx">
            <input type="file" accept=".aiproj,.json" className="hidden" onChange={handleFileChange} data-unique-id="9a8d6d08-fb06-4161-be9f-fbac72aaacb8" data-loc="145:12-150:14" data-file-name="components/LandingPage.tsx" />
            Upload Project File
          </label>
          
          <p className="mt-4 text-sm text-slate-400" data-unique-id="7c7103eb-4212-4cdc-a820-304535867a7c" data-loc="154:10-154:53" data-file-name="components/LandingPage.tsx">
            Drag and drop your project file here, or click to browse
          </p>
          
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm" data-unique-id="d8aa6a15-728e-4024-9f9c-fb294443f619" data-loc="159:12-159:80" data-file-name="components/LandingPage.tsx">
              {error}
            </div>}
        </motion.div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200" data-unique-id="b6906e55-4f8e-4cff-89a9-666a4dda234b" data-loc="166:6-166:60" data-file-name="components/LandingPage.tsx">
        <div className="flex items-center justify-center gap-8" data-unique-id="2f5aa205-81d8-4059-a5e3-091a327ab78e" data-loc="167:8-167:64" data-file-name="components/LandingPage.tsx">
          <div className="flex items-center text-slate-500" data-unique-id="c5ad4def-bf9d-4920-a7ae-e6736c091905" data-loc="168:10-168:60" data-file-name="components/LandingPage.tsx">
            <FileText className="h-5 w-5 mr-2" />
            <span data-unique-id="222155be-53da-4df3-b91c-7133e9e55338" data-loc="170:12-170:18" data-file-name="components/LandingPage.tsx">SWOT Analysis</span>
          </div>
          <div className="flex items-center text-slate-500" data-unique-id="4fc7dbf4-7615-4657-9cf4-76b943190c2d" data-loc="172:10-172:60" data-file-name="components/LandingPage.tsx">
            <Download className="h-5 w-5 mr-2" />
            <span data-unique-id="b7c3453c-e16c-40ff-a290-610677512613" data-loc="174:12-174:18" data-file-name="components/LandingPage.tsx">Matrix Evaluation</span>
          </div>
          <div className="flex items-center text-slate-500" data-unique-id="3a33915f-5d23-4eab-a40f-9339cf8d5c13" data-loc="176:10-176:60" data-file-name="components/LandingPage.tsx">
            <FileText className="h-5 w-5 mr-2" />
            <span data-unique-id="bf789096-9bea-4f78-85f7-de5ed9bcc01a" data-loc="178:12-178:18" data-file-name="components/LandingPage.tsx">AI Strategy Generation</span>
          </div>
        </div>
      </div>
    </motion.div>;
}