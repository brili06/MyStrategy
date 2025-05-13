"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FileText, Lightbulb, Save, Plus, FileUp } from "lucide-react";
import CompanyProfileForm from "@/components/CompanyProfileForm";
import SwotAnalysis from "@/components/SwotAnalysis";
import MatrixTable from "@/components/MatrixTable";
import ScoreInterpretation from "@/components/ScoreInterpretation";
import ExportOptions from "@/components/ExportOptions";
import IEMatrix from "@/components/IEMatrix";
import FullReport from "@/components/FullReport";
import SwotMatrixStrategies from "@/components/SwotMatrixStrategies";
import { MatrixType, Factor, CompanyProfile, SwotItem, FactorCategory } from "@/types/matrix";
import { supportedLanguages } from "@/types/language";

type AnalysisStep = "profile" | "swot" | "matrix";

interface MatrixAnalysisToolProps {
  initialData?: {
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
  } | null;
}

export default function MatrixAnalysisTool({ initialData }: MatrixAnalysisToolProps) {
  const [showNewAnalysisButton, setShowNewAnalysisButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>("profile");
  const [activeTab, setActiveTab] = useState<MatrixType>("ife");
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [ifeFactors, setIfeFactors] = useState<Factor[]>([]);
  const [efeFactors, setEfeFactors] = useState<Factor[]>([]);
  const [ifeScore, setIfeScore] = useState(0);
  const [efeScore, setEfeScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Load saved data on initial render
  useEffect(() => {
    const loadDataFromDatabase = async () => {
      try {
        // If initialData is provided, use it instead of loading from localStorage
        if (initialData) {
          if (initialData.companyProfile) setCompanyProfile(initialData.companyProfile);
          if (initialData.swotItems) setSwotItems(initialData.swotItems);
          if (initialData.ifeFactors) setIfeFactors(initialData.ifeFactors);
          if (initialData.efeFactors) setEfeFactors(initialData.efeFactors);
          if (initialData.currentStep) setCurrentStep(initialData.currentStep as AnalysisStep);
          
          // Save to localStorage for persistence
          if (initialData.companyProfile) localStorage.setItem("companyProfile", JSON.stringify(initialData.companyProfile));
          if (initialData.swotItems) localStorage.setItem("swotItems", JSON.stringify(initialData.swotItems));
          if (initialData.ifeFactors) localStorage.setItem("ifeFactors", JSON.stringify(initialData.ifeFactors));
          if (initialData.efeFactors) localStorage.setItem("efeFactors", JSON.stringify(initialData.efeFactors));
          if (initialData.currentStep) localStorage.setItem("currentStep", initialData.currentStep);
          
          // Load strategies if available
          if (initialData.soStrategies) localStorage.setItem("soStrategies", JSON.stringify(initialData.soStrategies));
          if (initialData.stStrategies) localStorage.setItem("stStrategies", JSON.stringify(initialData.stStrategies));
          if (initialData.woStrategies) localStorage.setItem("woStrategies", JSON.stringify(initialData.woStrategies));
          if (initialData.wtStrategies) localStorage.setItem("wtStrategies", JSON.stringify(initialData.wtStrategies));
          if (initialData.prioritizedStrategies) localStorage.setItem("prioritizedStrategies", JSON.stringify(initialData.prioritizedStrategies));
          
          return;
        }
        
        // First check if we have a company profile in localStorage
        const savedProfileStr = localStorage.getItem("companyProfile");
        
        if (savedProfileStr) {
          const savedProfile = JSON.parse(savedProfileStr);
          setCompanyProfile(savedProfile);
          
          // If we have a company profile with ID, load related data from database
          if (savedProfile.id) {
            // Load SWOT items
            const swotResponse = await fetch(`/api/swot-items?companyProfileId=${savedProfile.id}`);
            if (swotResponse.ok) {
              const swotData = await swotResponse.json();
              setSwotItems(swotData);
              localStorage.setItem("swotItems", JSON.stringify(swotData));
            }
            
            // Load IFE factors
            const ifeResponse = await fetch(`/api/matrix-factors?companyProfileId=${savedProfile.id}&matrixType=ife`);
            if (ifeResponse.ok) {
              const ifeData = await ifeResponse.json();
              setIfeFactors(ifeData);
              localStorage.setItem("ifeFactors", JSON.stringify(ifeData));
            }
            
            // Load EFE factors
            const efeResponse = await fetch(`/api/matrix-factors?companyProfileId=${savedProfile.id}&matrixType=efe`);
            if (efeResponse.ok) {
              const efeData = await efeResponse.json();
              setEfeFactors(efeData);
              localStorage.setItem("efeFactors", JSON.stringify(efeData));
            }
          }
        }
        
        // Fallback to localStorage if database fetch fails or no profile ID
        const savedSwot = localStorage.getItem("swotItems");
        const savedIfeFactors = localStorage.getItem("ifeFactors");
        const savedEfeFactors = localStorage.getItem("efeFactors");
        const savedStep = localStorage.getItem("currentStep");
        const savedLanguage = localStorage.getItem("selectedLanguage");
        
        if (savedSwot && swotItems.length === 0) {
          setSwotItems(JSON.parse(savedSwot));
        }
        
        if (savedIfeFactors && ifeFactors.length === 0) {
          setIfeFactors(JSON.parse(savedIfeFactors));
        } else if (ifeFactors.length === 0) {
          // Initialize with empty factors
          setIfeFactors([]);
        }
        
        if (savedEfeFactors && efeFactors.length === 0) {
          setEfeFactors(JSON.parse(savedEfeFactors));
        } else if (efeFactors.length === 0) {
          // Initialize with empty factors
          setEfeFactors([]);
        }
        
        if (savedStep) {
          setCurrentStep(savedStep as AnalysisStep);
        }
        
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading data from database:", error);
        
        // Fallback to localStorage if database fetch fails
        const savedProfile = localStorage.getItem("companyProfile");
        const savedSwot = localStorage.getItem("swotItems");
        const savedIfeFactors = localStorage.getItem("ifeFactors");
        const savedEfeFactors = localStorage.getItem("efeFactors");
        const savedStep = localStorage.getItem("currentStep");
        const savedLanguage = localStorage.getItem("selectedLanguage");
        
        if (savedProfile) {
          setCompanyProfile(JSON.parse(savedProfile));
        }
        
        if (savedSwot) {
          setSwotItems(JSON.parse(savedSwot));
        }
        
        if (savedIfeFactors) {
          setIfeFactors(JSON.parse(savedIfeFactors));
        } else {
          // Initialize with empty factors
          setIfeFactors([]);
        }
        
        if (savedEfeFactors) {
          setEfeFactors(JSON.parse(savedEfeFactors));
        } else {
          // Initialize with empty factors
          setEfeFactors([]);
        }
        
        if (savedStep) {
          setCurrentStep(savedStep as AnalysisStep);
        }
        
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      }
    };
    
    loadDataFromDatabase();
  }, [initialData]);
  
  // Calculate scores whenever factors change
  useEffect(() => {
    localStorage.setItem("ifeFactors", JSON.stringify(ifeFactors));
    const newIfeScore = ifeFactors.reduce((sum, factor) => sum + (factor.weight * factor.rating), 0);
    setIfeScore(parseFloat(newIfeScore.toFixed(2)));
  }, [ifeFactors]);
  
  useEffect(() => {
    localStorage.setItem("efeFactors", JSON.stringify(efeFactors));
    const newEfeScore = efeFactors.reduce((sum, factor) => sum + (factor.weight * factor.rating), 0);
    setEfeScore(parseFloat(newEfeScore.toFixed(2)));
  }, [efeFactors]);
  
  // Detect language from SWOT items
  useEffect(() => {
    if (swotItems.length > 0) {
      // Combine all SWOT descriptions to detect language
      const allText = swotItems.map(item => item.description).join(' ');
      detectLanguage(allText);
    }
  }, [swotItems]);
  
  // Determine if we should show the add button based on current step
  useEffect(() => {
    const shouldShowButton = currentStep === "profile" || currentStep === "swot" || currentStep === "matrix";
    setShowNewAnalysisButton(shouldShowButton);
  }, [currentStep]);
  
  // Function to detect language from text
  const detectLanguage = (text: string) => {
    if (!text || text.trim().length < 10) return;
    
    try {
      // Simple language detection heuristics
      const lowerText = text.toLowerCase();
      
      // Check for common words in different languages
      if (lowerText.match(/\b(the|and|is|in|to|of|for)\b/gi)?.length > 3) {
        setDetectedLanguage('en');
      } else if (lowerText.match(/\b(dan|yang|untuk|dari|dengan|ini|itu)\b/gi)?.length > 2) {
        setDetectedLanguage('id');
      } else if (lowerText.match(/\b(el|la|los|las|es|en|y|de|para)\b/gi)?.length > 3) {
        setDetectedLanguage('es');
      } else if (lowerText.match(/\b(le|la|les|et|en|dans|pour|de|du)\b/gi)?.length > 3) {
        setDetectedLanguage('fr');
      } else if (lowerText.match(/\b(der|die|das|und|in|zu|für|von)\b/gi)?.length > 3) {
        setDetectedLanguage('de');
      } else {
        // Default to English if detection fails
        setDetectedLanguage('en');
      }
      
      // Set selected language if not already set
      if (!selectedLanguage) {
        setSelectedLanguage(detectedLanguage);
        localStorage.setItem("selectedLanguage", detectedLanguage);
      }
    } catch (error) {
      console.error("Error detecting language:", error);
      setDetectedLanguage('en');
    }
  };
  
  // Function to save project to file
  const saveProject = () => {
    try {
      // Collect all project data
      const projectData = {
        companyProfile,
        swotItems,
        ifeFactors,
        efeFactors,
        currentStep,
        selectedLanguage,
        // Get strategies from localStorage
        soStrategies: localStorage.getItem("soStrategies") ? JSON.parse(localStorage.getItem("soStrategies") || "[]") : [],
        stStrategies: localStorage.getItem("stStrategies") ? JSON.parse(localStorage.getItem("stStrategies") || "[]") : [],
        woStrategies: localStorage.getItem("woStrategies") ? JSON.parse(localStorage.getItem("woStrategies") || "[]") : [],
        wtStrategies: localStorage.getItem("wtStrategies") ? JSON.parse(localStorage.getItem("wtStrategies") || "[]") : [],
        prioritizedStrategies: localStorage.getItem("prioritizedStrategies") ? JSON.parse(localStorage.getItem("prioritizedStrategies") || "[]") : [],
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(projectData, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use company name in filename if available
      const fileName = companyProfile?.name 
        ? `${companyProfile.name.replace(/\s+/g, '_')}_strategic_analysis.aiproj`
        : 'strategic_analysis.aiproj';
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    }
  };
  
  // State for the contextual menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Function to open a new analysis in a new tab
  const openNewAnalysisInNewTab = () => {
    window.open('/?newAnalysis=true', '_blank');
    setIsMenuOpen(false);
  };
  
  // Function to open a project in a new tab
  const openProjectInNewTab = () => {
    window.open('/?openProject=true', '_blank');
    setIsMenuOpen(false);
  };
  
  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    // Handle ESC key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMenuOpen]);
  
  // Helper functions for IE Matrix quadrant and strategy
  const getIEQuadrant = () => {
    if (ifeScore === 0 || efeScore === 0) return null;
    
    // Determine cell position
    if (ifeScore >= 3) {
      if (efeScore >= 3) return "I";
      else if (efeScore >= 2) return "IV";
      else return "VII";
    } else if (ifeScore >= 2) {
      if (efeScore >= 3) return "II";
      else if (efeScore >= 2) return "V";
      else return "VIII";
    } else {
      if (efeScore >= 3) return "III";
      else if (efeScore >= 2) return "VI";
      else return "IX";
    }
  };
  
  const getIEStrategy = () => {
    const quadrant = getIEQuadrant();
    if (!quadrant) return null;
    
    if (["I", "II", "IV"].includes(quadrant)) {
      return "Grow and Build";
    } else if (["III", "V", "VII"].includes(quadrant)) {
      return "Hold and Maintain";
    } else {
      return "Harvest or Exit";
    }
  };
  
  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);
  
  const handleProfileComplete = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    setCurrentStep("swot");
  };
  
  const handleSwotComplete = (items: SwotItem[]) => {
    setSwotItems(items);
    
    // Filter SWOT items by category
    const strengths = items.filter(item => item.category === "strength");
    const weaknesses = items.filter(item => item.category === "weakness");
    const opportunities = items.filter(item => item.category === "opportunity");
    const threats = items.filter(item => item.category === "threat");
    
    // Create IFE factors from strengths and weaknesses only
    const newIfeFactors = [
      ...strengths.map(item => ({
        id: item.id,
        description: item.description,
        weight: 1 / (strengths.length + weaknesses.length), // Default equal weights
        rating: 3, // Default rating for strengths
        category: "strength" as FactorCategory
      })),
      ...weaknesses.map(item => ({
        id: item.id,
        description: item.description,
        weight: 1 / (strengths.length + weaknesses.length), // Default equal weights
        rating: 2, // Default rating for weaknesses
        category: "weakness" as FactorCategory
      }))
    ];
    
    // Create EFE factors from opportunities and threats only
    const newEfeFactors = [
      ...opportunities.map(item => ({
        id: item.id,
        description: item.description,
        weight: 1 / (opportunities.length + threats.length), // Default equal weights
        rating: 3, // Default rating for opportunities
        category: "opportunity" as FactorCategory
      })),
      ...threats.map(item => ({
        id: item.id,
        description: item.description,
        weight: 1 / (opportunities.length + threats.length), // Default equal weights
        rating: 2, // Default rating for threats
        category: "threat" as FactorCategory
      }))
    ];
    
    setIfeFactors(newIfeFactors);
    setEfeFactors(newEfeFactors);
    setCurrentStep("matrix");
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  // Progress indicator
  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className={`flex flex-col items-center ${currentStep === "profile" ? "text-blue-600" : "text-slate-400"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep === "profile" ? "bg-blue-100 text-blue-600" : 
            currentStep === "swot" || currentStep === "matrix" ? "bg-green-100 text-green-600" : "bg-slate-100"
          }`}>
            1
          </div>
          <span className="text-sm mt-1">Company Profile</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${
          currentStep === "profile" ? "bg-slate-200" : "bg-green-300"
        }`}></div>
        
        <div className={`flex flex-col items-center ${currentStep === "swot" ? "text-blue-600" : currentStep === "profile" ? "text-slate-400" : "text-green-600"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep === "swot" ? "bg-blue-100 text-blue-600" : 
            currentStep === "matrix" ? "bg-green-100 text-green-600" : "bg-slate-100"
          }`}>
            2
          </div>
          <span className="text-sm mt-1">SWOT Analysis</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${
          currentStep === "profile" || currentStep === "swot" ? "bg-slate-200" : "bg-green-300"
        }`}></div>
        
        <div className={`flex flex-col items-center ${currentStep === "matrix" ? "text-blue-600" : "text-slate-400"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep === "matrix" ? "bg-blue-100 text-blue-600" : "bg-slate-100"
          }`}>
            3
          </div>
          <span className="text-sm mt-1">Matrix Analysis</span>
        </div>
      </div>
    </div>
  );
  
  // Render the matrix analysis tabs and content
  const renderMatrixAnalysis = () => (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 w-[800px] grid grid-cols-4">
            <button 
              onClick={() => setActiveTab("ife")} 
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${
                activeTab === "ife" 
                  ? "bg-white text-slate-950 shadow-sm" 
                  : "hover:bg-slate-50"
              }`}
            >
              IFE Matrix
              <span className="ml-2 text-sm font-normal text-slate-500">(Internal)</span>
            </button>
            <button 
              onClick={() => setActiveTab("efe")} 
              disabled={ifeFactors.length === 0}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${
                activeTab === "efe" 
                  ? "bg-white text-slate-950 shadow-sm" 
                  : ifeFactors.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-50"
              }`}
            >
              EFE Matrix
              <span className="ml-2 text-sm font-normal text-slate-500">(External)</span>
            </button>
            <button 
              onClick={() => setActiveTab("ie")} 
              disabled={efeFactors.length === 0}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${
                activeTab === "ie" 
                  ? "bg-white text-slate-950 shadow-sm" 
                  : efeFactors.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-50"
              }`}
            >
              IE Matrix
              <span className="ml-2 text-sm font-normal text-slate-500">(Combined)</span>
            </button>
            <button 
              onClick={() => setActiveTab("strategies")} 
              disabled={ifeScore === 0 || efeScore === 0}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${
                activeTab === "strategies" 
                  ? "bg-white text-slate-950 shadow-sm" 
                  : ifeScore === 0 || efeScore === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-50"
              }`}
            >
              AI Integration
              <span className="ml-2 text-sm font-normal text-slate-500">(Strategies)</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="language-select" className="mr-2 text-sm text-slate-600">Language:</label>
              <select 
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  localStorage.setItem("selectedLanguage", e.target.value);
                }}
                className="p-2 border border-slate-300 rounded-md text-sm"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={saveProject}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save Project
            </button>
          </div>
        </div>
        
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center"
          >
            <span>Project saved successfully! File downloaded to your computer.</span>
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {activeTab === "ife" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MatrixTable 
                factors={ifeFactors}
                setFactors={setIfeFactors}
                type="ife"
              />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ScoreInterpretation score={ifeScore} type="ife" />
                <ExportOptions factors={ifeFactors} score={ifeScore} type="ife" />
              </div>
            </motion.div>
          )}
          
          {activeTab === "efe" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MatrixTable 
                factors={efeFactors}
                setFactors={setEfeFactors}
                type="efe"
              />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ScoreInterpretation score={efeScore} type="efe" />
                <ExportOptions factors={efeFactors} score={efeScore} type="efe" />
              </div>
            </motion.div>
          )}
          
          {activeTab === "strategies" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SwotMatrixStrategies 
                swotItems={swotItems}
                ieQuadrant={getIEQuadrant()}
                ieStrategy={getIEStrategy()}
                selectedLanguage={selectedLanguage}
              />
            </motion.div>
          )}
          
          {activeTab === "ie" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-800">Internal-External (IE) Matrix</h3>
                <p className="text-blue-700 mt-1">
                  The IE Matrix plots your organization's position based on the total weighted scores from both 
                  the IFE Matrix (x-axis) and EFE Matrix (y-axis). This helps determine appropriate strategic approaches.
                </p>
              </div>
              
              {companyProfile && (
                <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                  <h4 className="text-lg font-medium text-slate-800 mb-3">Company Profile Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Company Name</p>
                      <p className="font-medium">{companyProfile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Industry</p>
                      <p className="font-medium">{companyProfile.industry}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                  <h4 className="text-lg font-medium text-slate-800 mb-3">IFE Score Summary</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-xl font-bold">{ifeScore.toFixed(2)}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-slate-600">
                        {ifeScore < 2.0 ? (
                          <span className="text-orange-600 font-medium">Weak internal position</span>
                        ) : ifeScore < 3.0 ? (
                          <span className="text-blue-600 font-medium">Average internal position</span>
                        ) : (
                          <span className="text-green-600 font-medium">Strong internal position</span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">Based on {ifeFactors.length} internal factors</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                  <h4 className="text-lg font-medium text-slate-800 mb-3">EFE Score Summary</h4>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-xl font-bold">{efeScore.toFixed(2)}</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-slate-600">
                        {efeScore < 2.0 ? (
                          <span className="text-orange-600 font-medium">Low external response</span>
                        ) : efeScore < 3.0 ? (
                          <span className="text-blue-600 font-medium">Medium external response</span>
                        ) : (
                          <span className="text-green-600 font-medium">High external response</span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">Based on {efeFactors.length} external factors</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <IEMatrix ifeScore={ifeScore} efeScore={efeScore} />
              
              <div className="mt-8">
                <FullReport 
                  companyProfile={companyProfile}
                  swotItems={swotItems}
                  ifeFactors={ifeFactors}
                  efeFactors={efeFactors}
                  ifeScore={ifeScore}
                  efeScore={efeScore}
                />
              </div>
            </motion.div>
          )}
          
          
        </AnimatePresence>
      </div>
    </>
  );
  
  // Navigation buttons
  const renderNavigation = () => (
    <div className="mt-8 flex justify-between">
      {currentStep !== "profile" && (
        <button
          onClick={() => setCurrentStep(currentStep === "matrix" ? "swot" : "profile")}
          className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
        >
          Back
        </button>
      )}
      
      {currentStep === "profile" && (
        <div></div> // Empty div for flex spacing
      )}
      
      {currentStep === "swot" && (
        <button
          onClick={() => handleSwotComplete(swotItems)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          Continue to Matrix Analysis
          <ChevronRight className="ml-1 h-5 w-5" />
        </button>
      )}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-lg rounded-xl p-6 relative"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Strategic Management Assistant</h2>
      
      {renderProgressBar()}
      
      <AnimatePresence mode="wait">
        {currentStep === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CompanyProfileForm 
              onComplete={handleProfileComplete}
              initialProfile={companyProfile || undefined}
            />
          </motion.div>
        )}
        
        {currentStep === "swot" && (
          <motion.div
            key="swot"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SwotAnalysis 
              onComplete={handleSwotComplete}
              initialItems={swotItems}
              selectedLanguage={selectedLanguage}
            />
          </motion.div>
        )}
        
        {currentStep === "matrix" && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMatrixAnalysis()}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep("swot")}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
              >
                Back
              </button>
                
              {activeTab !== "strategies" && (
                <button
                  onClick={() => {
                    // Enforce sequential navigation
                    if (activeTab === "ife" && ifeFactors.length > 0) {
                      setActiveTab("efe");
                    } else if (activeTab === "efe" && efeFactors.length > 0) {
                      setActiveTab("ie");
                    } else if (activeTab === "ie" && ifeScore > 0 && efeScore > 0) {
                      setActiveTab("strategies");
                    }
                  }}
                  disabled={
                    (activeTab === "ife" && ifeFactors.length === 0) ||
                    (activeTab === "efe" && efeFactors.length === 0) ||
                    (activeTab === "ie" && (ifeScore === 0 || efeScore === 0))
                  }
                  className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                    (activeTab === "ife" && ifeFactors.length === 0) ||
                    (activeTab === "efe" && efeFactors.length === 0) ||
                    (activeTab === "ie" && (ifeScore === 0 || efeScore === 0))
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                  <ChevronRight className="ml-1 h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {(currentStep === "profile" || currentStep === "swot") && renderNavigation()}
      
      {/* Floating "+" button for new analysis - fixed position */}
      {showNewAnalysisButton && (
        <div className="relative">
          {/* Contextual menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 w-48"
              >
                <ul>
                  <li>
                    <button
                      onClick={openNewAnalysisInNewTab}
                      className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span>New Analysis</span>
                    </button>
                  </li>
                  <li className="border-t border-slate-100">
                    <button
                      onClick={openProjectInNewTab}
                      className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <FileUp className="h-4 w-4 text-green-600" />
                      <span>Open Project</span>
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* The "+" button */}
          <motion.button
            ref={buttonRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
