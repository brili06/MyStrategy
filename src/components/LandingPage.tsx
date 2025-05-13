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

export default function LandingPage({ onNewAnalysis, onOpenProject }: LandingPageProps) {
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
    reader.onload = (e) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Strategic Management Assistant</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Comprehensive strategic analysis tool for business planning. Create SWOT analyses, 
          evaluate internal and external factors, and generate AI-powered strategic recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md"
          onClick={onNewAnalysis}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">New Analysis</h3>
          <p className="text-slate-500">
            Start a new strategic analysis from scratch. Define your company profile, 
            conduct SWOT analysis, and evaluate internal and external factors.
          </p>
          <button 
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={onNewAnalysis}
          >
            Start New Analysis
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`bg-slate-50 border ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200'} rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FileUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Open Project</h3>
          <p className="text-slate-500">
            Continue working on a previously saved analysis project. 
            Upload your .aiproj or .json file to restore all your data.
          </p>
          
          <label className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
            <input 
              type="file" 
              accept=".aiproj,.json" 
              className="hidden" 
              onChange={handleFileChange}
            />
            Upload Project File
          </label>
          
          <p className="mt-4 text-sm text-slate-400">
            Drag and drop your project file here, or click to browse
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center text-slate-500">
            <FileText className="h-5 w-5 mr-2" />
            <span>SWOT Analysis</span>
          </div>
          <div className="flex items-center text-slate-500">
            <Download className="h-5 w-5 mr-2" />
            <span>Matrix Evaluation</span>
          </div>
          <div className="flex items-center text-slate-500">
            <FileText className="h-5 w-5 mr-2" />
            <span>AI Strategy Generation</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
