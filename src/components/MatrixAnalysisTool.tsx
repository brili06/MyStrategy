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
export default function MatrixAnalysisTool({
  initialData
}: MatrixAnalysisToolProps) {
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
    const newIfeScore = ifeFactors.reduce((sum, factor) => sum + factor.weight * factor.rating, 0);
    setIfeScore(parseFloat(newIfeScore.toFixed(2)));
  }, [ifeFactors]);
  useEffect(() => {
    localStorage.setItem("efeFactors", JSON.stringify(efeFactors));
    const newEfeScore = efeFactors.reduce((sum, factor) => sum + factor.weight * factor.rating, 0);
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
        prioritizedStrategies: localStorage.getItem("prioritizedStrategies") ? JSON.parse(localStorage.getItem("prioritizedStrategies") || "[]") : []
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(projectData, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonString], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Use company name in filename if available
      const fileName = companyProfile?.name ? `${companyProfile.name.replace(/\s+/g, '_')}_strategic_analysis.aiproj` : 'strategic_analysis.aiproj';
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
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
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
      if (efeScore >= 3) return "I";else if (efeScore >= 2) return "IV";else return "VII";
    } else if (ifeScore >= 2) {
      if (efeScore >= 3) return "II";else if (efeScore >= 2) return "V";else return "VIII";
    } else {
      if (efeScore >= 3) return "III";else if (efeScore >= 2) return "VI";else return "IX";
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
    const newIfeFactors = [...strengths.map(item => ({
      id: item.id,
      description: item.description,
      weight: 1 / (strengths.length + weaknesses.length),
      // Default equal weights
      rating: 3,
      // Default rating for strengths
      category: "strength" as FactorCategory
    })), ...weaknesses.map(item => ({
      id: item.id,
      description: item.description,
      weight: 1 / (strengths.length + weaknesses.length),
      // Default equal weights
      rating: 2,
      // Default rating for weaknesses
      category: "weakness" as FactorCategory
    }))];

    // Create EFE factors from opportunities and threats only
    const newEfeFactors = [...opportunities.map(item => ({
      id: item.id,
      description: item.description,
      weight: 1 / (opportunities.length + threats.length),
      // Default equal weights
      rating: 3,
      // Default rating for opportunities
      category: "opportunity" as FactorCategory
    })), ...threats.map(item => ({
      id: item.id,
      description: item.description,
      weight: 1 / (opportunities.length + threats.length),
      // Default equal weights
      rating: 2,
      // Default rating for threats
      category: "threat" as FactorCategory
    }))];
    setIfeFactors(newIfeFactors);
    setEfeFactors(newEfeFactors);
    setCurrentStep("matrix");
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
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
  const renderProgressBar = () => <div className="mb-8" data-unique-id="3649ad06-fe97-4c11-87d9-d91af9a38833" data-loc="457:4-457:26" data-file-name="components/MatrixAnalysisTool.tsx">
      <div className="flex items-center justify-between" data-unique-id="ddf822f8-08ab-438b-90df-0257c026daac" data-loc="458:6-458:57" data-file-name="components/MatrixAnalysisTool.tsx">
        <div className={`flex flex-col items-center ${currentStep === "profile" ? "text-blue-600" : "text-slate-400"}`} data-unique-id="9323a86a-8a88-47f5-83da-148bced8876f" data-loc="459:8-459:120" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "profile" ? "bg-blue-100 text-blue-600" : currentStep === "swot" || currentStep === "matrix" ? "bg-green-100 text-green-600" : "bg-slate-100"}`} data-unique-id="4b9b5e78-e0ab-4a74-bafb-660fe6a05f8b" data-loc="460:10-463:14" data-file-name="components/MatrixAnalysisTool.tsx">
            1
          </div>
          <span className="text-sm mt-1" data-unique-id="fe96add0-f1f6-4d1b-8468-3424c2340a31" data-loc="466:10-466:41" data-file-name="components/MatrixAnalysisTool.tsx">Company Profile</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${currentStep === "profile" ? "bg-slate-200" : "bg-green-300"}`} data-unique-id="d88008a9-4c73-4f92-900e-de6b1295a797" data-loc="469:8-471:12" data-file-name="components/MatrixAnalysisTool.tsx"></div>
        
        <div className={`flex flex-col items-center ${currentStep === "swot" ? "text-blue-600" : currentStep === "profile" ? "text-slate-400" : "text-green-600"}`} data-unique-id="8b7893bb-bcec-4176-9a87-e19318b2cd0f" data-loc="473:8-473:164" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "swot" ? "bg-blue-100 text-blue-600" : currentStep === "matrix" ? "bg-green-100 text-green-600" : "bg-slate-100"}`} data-unique-id="0372a220-37c7-49e7-a9ae-4c2c4230536e" data-loc="474:10-477:14" data-file-name="components/MatrixAnalysisTool.tsx">
            2
          </div>
          <span className="text-sm mt-1" data-unique-id="a0ef5372-8939-4f74-b655-9e424e88f0e2" data-loc="480:10-480:41" data-file-name="components/MatrixAnalysisTool.tsx">SWOT Analysis</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${currentStep === "profile" || currentStep === "swot" ? "bg-slate-200" : "bg-green-300"}`} data-unique-id="c58e8adb-ad74-43a7-98d1-82035dc0a22d" data-loc="483:8-485:12" data-file-name="components/MatrixAnalysisTool.tsx"></div>
        
        <div className={`flex flex-col items-center ${currentStep === "matrix" ? "text-blue-600" : "text-slate-400"}`} data-unique-id="c1f09749-5be9-4f22-a5be-0f5dc35fc02c" data-loc="487:8-487:119" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "matrix" ? "bg-blue-100 text-blue-600" : "bg-slate-100"}`} data-unique-id="5b83f3f5-a12c-4c7d-a039-2139407bbbbd" data-loc="488:10-490:14" data-file-name="components/MatrixAnalysisTool.tsx">
            3
          </div>
          <span className="text-sm mt-1" data-unique-id="a4738fc7-7d6c-4785-83fe-144959e6a5d1" data-loc="493:10-493:41" data-file-name="components/MatrixAnalysisTool.tsx">Matrix Analysis</span>
        </div>
      </div>
    </div>;

  // Render the matrix analysis tabs and content
  const renderMatrixAnalysis = () => <>
      <div className="w-full" data-unique-id="c5be77e9-6587-4b7e-ad3f-0052bae1fbef" data-loc="502:6-502:30" data-file-name="components/MatrixAnalysisTool.tsx">
        <div className="flex justify-between items-center mb-8" data-unique-id="2749a387-81cc-47f5-ad5b-a2359d1cc060" data-loc="503:8-503:64" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 w-[800px] grid grid-cols-4" data-unique-id="d4dc738f-ac27-435e-aa98-a4f62e4c00e5" data-loc="504:10-504:142" data-file-name="components/MatrixAnalysisTool.tsx">
            <button onClick={() => setActiveTab("ife")} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "ife" ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-50"}`} data-unique-id="38d4614b-2da2-4ef6-8d03-7672b7b7b622" data-loc="505:12-512:13" data-file-name="components/MatrixAnalysisTool.tsx">
              IFE Matrix
              <span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="3423415e-4210-449a-894e-f7b443beda2b" data-loc="514:14-514:72" data-file-name="components/MatrixAnalysisTool.tsx">(Internal)</span>
            </button>
            <button onClick={() => setActiveTab("efe")} disabled={ifeFactors.length === 0} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "efe" ? "bg-white text-slate-950 shadow-sm" : ifeFactors.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`} data-unique-id="431b586d-f460-4610-a53e-8095f21b8982" data-loc="516:12-526:13" data-file-name="components/MatrixAnalysisTool.tsx">
              EFE Matrix
              <span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="5d65a454-ebad-445b-aed6-9af66c91def2" data-loc="528:14-528:72" data-file-name="components/MatrixAnalysisTool.tsx">(External)</span>
            </button>
            <button onClick={() => setActiveTab("ie")} disabled={efeFactors.length === 0} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "ie" ? "bg-white text-slate-950 shadow-sm" : efeFactors.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`} data-unique-id="edf95ffb-2983-42c4-9856-99d6cfd5d346" data-loc="530:12-540:13" data-file-name="components/MatrixAnalysisTool.tsx">
              IE Matrix
              <span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="63ee8a47-ac74-4091-bb0d-41c776c3ba05" data-loc="542:14-542:72" data-file-name="components/MatrixAnalysisTool.tsx">(Combined)</span>
            </button>
            <button onClick={() => setActiveTab("strategies")} disabled={ifeScore === 0 || efeScore === 0} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "strategies" ? "bg-white text-slate-950 shadow-sm" : ifeScore === 0 || efeScore === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`} data-unique-id="68babc9d-74fb-4615-bcf0-8742105be045" data-loc="544:12-554:13" data-file-name="components/MatrixAnalysisTool.tsx">
              AI Integration
              <span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="08f0a395-46bc-4215-9ce5-afa557070730" data-loc="556:14-556:72" data-file-name="components/MatrixAnalysisTool.tsx">(Strategies)</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4" data-unique-id="1e951198-3271-46ed-ae33-a0facb6a28fe" data-loc="560:10-560:51" data-file-name="components/MatrixAnalysisTool.tsx">
            <div className="flex items-center" data-unique-id="b9516f66-77d5-4fd2-b629-32f2cb739bee" data-loc="561:12-561:47" data-file-name="components/MatrixAnalysisTool.tsx">
              <label htmlFor="language-select" className="mr-2 text-sm text-slate-600" data-unique-id="e13fd497-1107-4cbf-8108-ccdd8c55e725" data-loc="562:14-562:87" data-file-name="components/MatrixAnalysisTool.tsx">Language:</label>
              <select id="language-select" value={selectedLanguage} onChange={e => {
              setSelectedLanguage(e.target.value);
              localStorage.setItem("selectedLanguage", e.target.value);
            }} className="p-2 border border-slate-300 rounded-md text-sm" data-unique-id="65642884-9a22-474a-81dd-75ba21f026d9" data-loc="563:14-571:15" data-file-name="components/MatrixAnalysisTool.tsx">
                {supportedLanguages.map(lang => <option key={lang.code} value={lang.code} data-unique-id="map_012734c1-86ff-4a92-9246-b338772ef2cf" data-loc="573:18-573:60" data-file-name="components/MatrixAnalysisTool.tsx" data-is-mapped="true">
                    {lang.name}
                  </option>)}
              </select>
            </div>
            
            <button onClick={saveProject} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1" data-unique-id="efd9893b-eccb-4570-8742-81879429a3e6" data-loc="580:12-583:13" data-file-name="components/MatrixAnalysisTool.tsx">
              <Save className="h-4 w-4" />
              Save Project
            </button>
          </div>
        </div>
        
        {showSaveSuccess && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center" data-unique-id="44f20bf6-1838-4c59-9587-f38bec33af48" data-loc="591:10-596:11" data-file-name="components/MatrixAnalysisTool.tsx">
            <span data-unique-id="35e49ef3-8295-457f-b077-5afa97dc9f03" data-loc="597:12-597:18" data-file-name="components/MatrixAnalysisTool.tsx">Project saved successfully! File downloaded to your computer.</span>
          </motion.div>}
        
        <AnimatePresence mode="wait">
          {activeTab === "ife" && <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} transition={{
          duration: 0.3
        }} data-unique-id="0446592d-4a1c-419f-8c35-7ce2dd7e4b1b" data-loc="603:12-608:13" data-file-name="components/MatrixAnalysisTool.tsx">
              <MatrixTable factors={ifeFactors} setFactors={setIfeFactors} type="ife" />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="06dc597a-0eb3-4b63-b135-43fc9e5db593" data-loc="614:14-614:74" data-file-name="components/MatrixAnalysisTool.tsx">
                <ScoreInterpretation score={ifeScore} type="ife" />
                <ExportOptions factors={ifeFactors} score={ifeScore} type="ife" />
              </div>
            </motion.div>}
          
          {activeTab === "efe" && <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} transition={{
          duration: 0.3
        }} data-unique-id="120e999f-e18a-4467-83e0-d0d54cc50ddc" data-loc="622:12-627:13" data-file-name="components/MatrixAnalysisTool.tsx">
              <MatrixTable factors={efeFactors} setFactors={setEfeFactors} type="efe" />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="e41a2a87-97a7-4d7c-b2db-d24af6e20c7f" data-loc="633:14-633:74" data-file-name="components/MatrixAnalysisTool.tsx">
                <ScoreInterpretation score={efeScore} type="efe" />
                <ExportOptions factors={efeFactors} score={efeScore} type="efe" />
              </div>
            </motion.div>}
          
          {activeTab === "strategies" && <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} transition={{
          duration: 0.3
        }} data-unique-id="bda11692-e16c-48f7-a735-81f812938460" data-loc="641:12-646:13" data-file-name="components/MatrixAnalysisTool.tsx">
              <SwotMatrixStrategies swotItems={swotItems} ieQuadrant={getIEQuadrant()} ieStrategy={getIEStrategy()} selectedLanguage={selectedLanguage} />
            </motion.div>}
          
          {activeTab === "ie" && <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} transition={{
          duration: 0.3
        }} data-unique-id="3fbcc046-c7c3-4682-96a8-4dd527325c34" data-loc="657:12-662:13" data-file-name="components/MatrixAnalysisTool.tsx">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4" data-unique-id="a71e1b56-dc8a-47aa-8611-6547b8036412" data-loc="663:14-663:85" data-file-name="components/MatrixAnalysisTool.tsx">
                <h3 className="text-lg font-medium text-blue-800" data-unique-id="2a2a8499-9d28-4c6b-b81e-9259ab0681b9" data-loc="664:16-664:66" data-file-name="components/MatrixAnalysisTool.tsx">Internal-External (IE) Matrix</h3>
                <p className="text-blue-700 mt-1" data-unique-id="649ff4dc-9a6e-4e8f-802d-d3e321c669b7" data-loc="665:16-665:50" data-file-name="components/MatrixAnalysisTool.tsx">
                  The IE Matrix plots your organization's position based on the total weighted scores from both 
                  the IFE Matrix (x-axis) and EFE Matrix (y-axis). This helps determine appropriate strategic approaches.
                </p>
              </div>
              
              {companyProfile && <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="12d0bd9a-bd20-40a3-ab25-db8741c9664e" data-loc="672:16-672:96" data-file-name="components/MatrixAnalysisTool.tsx">
                  <h4 className="text-lg font-medium text-slate-800 mb-3" data-unique-id="70d0f8b1-9611-4f4f-93c9-ab9b7faefaba" data-loc="673:18-673:74" data-file-name="components/MatrixAnalysisTool.tsx">Company Profile Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="50175365-a0cc-4c74-a480-14975bcdbd6d" data-loc="674:18-674:73" data-file-name="components/MatrixAnalysisTool.tsx">
                    <div data-unique-id="c3519f80-0085-4407-b2a0-b5d0c2602f1c" data-loc="675:20-675:25" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-sm text-slate-500" data-unique-id="07c0d9f4-069a-4448-962d-b7d391c4f242" data-loc="676:22-676:60" data-file-name="components/MatrixAnalysisTool.tsx">Company Name</p>
                      <p className="font-medium" data-unique-id="8c50b07b-6330-4e3d-baac-881617323da0" data-loc="677:22-677:49" data-file-name="components/MatrixAnalysisTool.tsx">{companyProfile.name}</p>
                    </div>
                    <div data-unique-id="8a597ba6-079f-47b6-b40c-74d536f36b87" data-loc="679:20-679:25" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-sm text-slate-500" data-unique-id="4fe52d52-bc3a-442b-8ef9-ca8516f45892" data-loc="680:22-680:60" data-file-name="components/MatrixAnalysisTool.tsx">Industry</p>
                      <p className="font-medium" data-unique-id="af87dabb-3cbd-452c-b06a-ed46a17e2108" data-loc="681:22-681:49" data-file-name="components/MatrixAnalysisTool.tsx">{companyProfile.industry}</p>
                    </div>
                  </div>
                </div>}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" data-unique-id="20613e1e-4dd9-4adc-a706-676da509468c" data-loc="687:14-687:74" data-file-name="components/MatrixAnalysisTool.tsx">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="35a7f57c-c57d-4269-b996-966100544e2e" data-loc="688:16-688:91" data-file-name="components/MatrixAnalysisTool.tsx">
                  <h4 className="text-lg font-medium text-slate-800 mb-3" data-unique-id="a3e0dfef-d513-4db6-9ce0-b354808de125" data-loc="689:18-689:74" data-file-name="components/MatrixAnalysisTool.tsx">IFE Score Summary</h4>
                  <div className="flex items-center" data-unique-id="7324b829-caae-4bfb-adfd-8e25e2f4dca4" data-loc="690:18-690:53" data-file-name="components/MatrixAnalysisTool.tsx">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" data-unique-id="34bad79a-4a3d-43d2-843e-980798aa5401" data-loc="691:20-691:106" data-file-name="components/MatrixAnalysisTool.tsx">
                      <span className="text-xl font-bold" data-unique-id="0da5e387-a681-4709-8446-af95e3fc7f78" data-loc="692:22-692:58" data-file-name="components/MatrixAnalysisTool.tsx">{ifeScore.toFixed(2)}</span>
                    </div>
                    <div className="ml-4" data-unique-id="4f019d4b-6906-4235-9d2c-fe69eda5db9b" data-loc="694:20-694:42" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-slate-600" data-unique-id="3fe5510f-717a-4c81-a773-322c91387a17" data-loc="695:22-695:52" data-file-name="components/MatrixAnalysisTool.tsx">
                        {ifeScore < 2.0 ? <span className="text-orange-600 font-medium" data-unique-id="1c15649f-aaaa-449e-b790-a1205c6dc755" data-loc="697:26-697:72" data-file-name="components/MatrixAnalysisTool.tsx">Weak internal position</span> : ifeScore < 3.0 ? <span className="text-blue-600 font-medium" data-unique-id="c4f918e8-2418-4047-a03b-d698315790c0" data-loc="699:26-699:70" data-file-name="components/MatrixAnalysisTool.tsx">Average internal position</span> : <span className="text-green-600 font-medium" data-unique-id="91c2b6a9-c80d-4662-b920-9b45da7156cf" data-loc="701:26-701:71" data-file-name="components/MatrixAnalysisTool.tsx">Strong internal position</span>}
                      </p>
                      <p className="text-sm text-slate-500 mt-1" data-unique-id="ad13fb8e-1819-4ef9-b4d3-c6400427f365" data-loc="704:22-704:65" data-file-name="components/MatrixAnalysisTool.tsx">Based on {ifeFactors.length} internal factors</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="9023de2c-4f49-42aa-86fc-f4c20a2ef301" data-loc="709:16-709:91" data-file-name="components/MatrixAnalysisTool.tsx">
                  <h4 className="text-lg font-medium text-slate-800 mb-3" data-unique-id="150a5a6c-af7b-42f9-989b-04087548849d" data-loc="710:18-710:74" data-file-name="components/MatrixAnalysisTool.tsx">EFE Score Summary</h4>
                  <div className="flex items-center" data-unique-id="4dfd1796-4f7f-4d47-b18c-fd2b12f3b3b2" data-loc="711:18-711:53" data-file-name="components/MatrixAnalysisTool.tsx">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" data-unique-id="7d14f5de-3f31-4c54-b704-e3cb903aea1a" data-loc="712:20-712:106" data-file-name="components/MatrixAnalysisTool.tsx">
                      <span className="text-xl font-bold" data-unique-id="b9e73de6-23b2-444d-84f3-6703a5dd2ce1" data-loc="713:22-713:58" data-file-name="components/MatrixAnalysisTool.tsx">{efeScore.toFixed(2)}</span>
                    </div>
                    <div className="ml-4" data-unique-id="c6bf3837-2337-4a51-8ff9-050ced113fa7" data-loc="715:20-715:42" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-slate-600" data-unique-id="e48e50d8-7c2a-4f14-8998-43db0c81e810" data-loc="716:22-716:52" data-file-name="components/MatrixAnalysisTool.tsx">
                        {efeScore < 2.0 ? <span className="text-orange-600 font-medium" data-unique-id="f4e1455f-707f-440a-9f39-045840c4dc4f" data-loc="718:26-718:72" data-file-name="components/MatrixAnalysisTool.tsx">Low external response</span> : efeScore < 3.0 ? <span className="text-blue-600 font-medium" data-unique-id="787e3e56-1642-4fa9-b1eb-9bc87bbd7022" data-loc="720:26-720:70" data-file-name="components/MatrixAnalysisTool.tsx">Medium external response</span> : <span className="text-green-600 font-medium" data-unique-id="bec4642f-1d17-4f57-88a6-53593e414a65" data-loc="722:26-722:71" data-file-name="components/MatrixAnalysisTool.tsx">High external response</span>}
                      </p>
                      <p className="text-sm text-slate-500 mt-1" data-unique-id="9ea56203-f81b-4f6e-9972-a661a2aa0657" data-loc="725:22-725:65" data-file-name="components/MatrixAnalysisTool.tsx">Based on {efeFactors.length} external factors</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <IEMatrix ifeScore={ifeScore} efeScore={efeScore} />
              
              <div className="mt-8" data-unique-id="fadfaeab-19f4-4381-8899-148aa49ae5cb" data-loc="733:14-733:36" data-file-name="components/MatrixAnalysisTool.tsx">
                <FullReport companyProfile={companyProfile} swotItems={swotItems} ifeFactors={ifeFactors} efeFactors={efeFactors} ifeScore={ifeScore} efeScore={efeScore} />
              </div>
            </motion.div>}
          
          
        </AnimatePresence>
      </div>
    </>;

  // Navigation buttons
  const renderNavigation = () => <div className="mt-8 flex justify-between" data-unique-id="8d9cdcd4-b80a-4e62-b3d5-37c819177354" data-loc="754:4-754:47" data-file-name="components/MatrixAnalysisTool.tsx">
      {currentStep !== "profile" && <button onClick={() => setCurrentStep(currentStep === "matrix" ? "swot" : "profile")} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors" data-unique-id="4d30a422-7b9e-49e8-9abe-b5f7bf77f920" data-loc="756:8-759:9" data-file-name="components/MatrixAnalysisTool.tsx">
          Back
        </button>}
      
      {currentStep === "profile" && <div data-unique-id="a7fe5b53-1a31-47d7-956c-e7a8dbf09ecd" data-loc="765:8-765:13" data-file-name="components/MatrixAnalysisTool.tsx"></div> // Empty div for flex spacing
    }
      
      {currentStep === "swot" && <button onClick={() => handleSwotComplete(swotItems)} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center" data-unique-id="7100ed66-9f49-4d64-9eda-1c92b1889b48" data-loc="769:8-772:9" data-file-name="components/MatrixAnalysisTool.tsx">
          Continue to Matrix Analysis
          <ChevronRight className="ml-1 h-5 w-5" />
        </button>}
    </div>;
  return <motion.div ref={containerRef} variants={containerVariants} initial="hidden" animate="visible" className="bg-white shadow-lg rounded-xl p-6 relative" data-unique-id="ccce2997-3f3e-471b-b495-8a648a27876e" data-loc="781:4-787:5" data-file-name="components/MatrixAnalysisTool.tsx">
      <h2 className="text-2xl font-bold text-slate-800 mb-6" data-unique-id="1489e7de-dd42-4649-96a5-0e27815ffced" data-loc="788:6-788:61" data-file-name="components/MatrixAnalysisTool.tsx">Strategic Management Assistant</h2>
      
      {renderProgressBar()}
      
      <AnimatePresence mode="wait">
        {currentStep === "profile" && <motion.div key="profile" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: 20
      }} transition={{
        duration: 0.3
      }} data-unique-id="c180e9f4-6d99-4634-b626-238a45823168" data-loc="794:10-800:11" data-file-name="components/MatrixAnalysisTool.tsx">
            <CompanyProfileForm onComplete={handleProfileComplete} initialProfile={companyProfile || undefined} />
          </motion.div>}
        
        {currentStep === "swot" && <motion.div key="swot" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: 20
      }} transition={{
        duration: 0.3
      }} data-unique-id="26155294-9ad6-4c46-9069-02dbaf5e3179" data-loc="809:10-815:11" data-file-name="components/MatrixAnalysisTool.tsx">
            <SwotAnalysis onComplete={handleSwotComplete} initialItems={swotItems} selectedLanguage={selectedLanguage} />
          </motion.div>}
        
        {currentStep === "matrix" && <motion.div key="matrix" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} exit={{
        opacity: 0,
        x: 20
      }} transition={{
        duration: 0.3
      }} data-unique-id="8c5887a2-8fa5-4e0d-bbaa-6b822556fffd" data-loc="825:10-831:11" data-file-name="components/MatrixAnalysisTool.tsx">
            {renderMatrixAnalysis()}
            <div className="mt-8 flex justify-between" data-unique-id="ba1dd531-be3f-42d9-997a-e2f2be4d01c7" data-loc="833:12-833:55" data-file-name="components/MatrixAnalysisTool.tsx">
              <button onClick={() => setCurrentStep("swot")} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors" data-unique-id="a45d36b0-419c-4696-9d39-14852c22ca33" data-loc="834:14-837:15" data-file-name="components/MatrixAnalysisTool.tsx">
                Back
              </button>
                
              {activeTab !== "strategies" && <button onClick={() => {
            // Enforce sequential navigation
            if (activeTab === "ife" && ifeFactors.length > 0) {
              setActiveTab("efe");
            } else if (activeTab === "efe" && efeFactors.length > 0) {
              setActiveTab("ie");
            } else if (activeTab === "ie" && ifeScore > 0 && efeScore > 0) {
              setActiveTab("strategies");
            }
          }} disabled={activeTab === "ife" && ifeFactors.length === 0 || activeTab === "efe" && efeFactors.length === 0 || activeTab === "ie" && (ifeScore === 0 || efeScore === 0)} className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${activeTab === "ife" && ifeFactors.length === 0 || activeTab === "efe" && efeFactors.length === 0 || activeTab === "ie" && (ifeScore === 0 || efeScore === 0) ? "opacity-50 cursor-not-allowed" : ""}`} data-unique-id="09cbc64c-2be0-46c8-a3ca-2570eb319125" data-loc="842:16-865:17" data-file-name="components/MatrixAnalysisTool.tsx">
                  Next
                  <ChevronRight className="ml-1 h-5 w-5" />
                </button>}
            </div>
          </motion.div>}
      </AnimatePresence>
      
      {(currentStep === "profile" || currentStep === "swot") && renderNavigation()}
      
      {/* Floating "+" button for new analysis - fixed position */}
      {showNewAnalysisButton && <div className="relative" data-unique-id="95a10ecb-549a-41bc-a7b6-98ff4bcc1015" data-loc="879:8-879:34" data-file-name="components/MatrixAnalysisTool.tsx">
          {/* Contextual menu */}
          <AnimatePresence>
            {isMenuOpen && <motion.div ref={menuRef} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: 10
        }} transition={{
          duration: 0.2
        }} className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 w-48" data-unique-id="c16bef25-b3ab-4fc3-aa0a-b22699b16db4" data-loc="883:14-890:15" data-file-name="components/MatrixAnalysisTool.tsx">
                <ul data-unique-id="1986cf03-3fc4-40af-a808-76e225d91904" data-loc="891:16-891:20" data-file-name="components/MatrixAnalysisTool.tsx">
                  <li data-unique-id="a5e79670-4854-4e01-a311-7fc997e1b0cb" data-loc="892:18-892:22" data-file-name="components/MatrixAnalysisTool.tsx">
                    <button onClick={openNewAnalysisInNewTab} className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors" data-unique-id="39462b32-f27d-4b12-b856-ea4652d478a5" data-loc="893:20-896:21" data-file-name="components/MatrixAnalysisTool.tsx">
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span data-unique-id="ee4735ef-9756-4c1f-aaaa-b75b70455c7e" data-loc="898:22-898:28" data-file-name="components/MatrixAnalysisTool.tsx">New Analysis</span>
                    </button>
                  </li>
                  <li className="border-t border-slate-100" data-unique-id="8f86ba07-9d42-499d-80a9-85e7d21c6b96" data-loc="901:18-901:60" data-file-name="components/MatrixAnalysisTool.tsx">
                    <button onClick={openProjectInNewTab} className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors" data-unique-id="f55821e8-456f-4e10-85f7-361d798469e7" data-loc="902:20-905:21" data-file-name="components/MatrixAnalysisTool.tsx">
                      <FileUp className="h-4 w-4 text-green-600" />
                      <span data-unique-id="c67fbb7a-bc24-4eef-a62f-bfa9c7fa4501" data-loc="907:22-907:28" data-file-name="components/MatrixAnalysisTool.tsx">Open Project</span>
                    </button>
                  </li>
                </ul>
              </motion.div>}
          </AnimatePresence>
          
          {/* The "+" button */}
          <motion.button ref={buttonRef} initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.8
      }} whileHover={{
        scale: 1.1
      }} onClick={() => setIsMenuOpen(!isMenuOpen)} className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50" data-unique-id="46e7ff8a-6b22-440e-8a0c-6ef4497c4b3a" data-loc="916:10-924:11" data-file-name="components/MatrixAnalysisTool.tsx">
            <Plus className="h-6 w-6" />
          </motion.button>
        </div>}
    </motion.div>;
}