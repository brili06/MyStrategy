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
  const renderProgressBar = () => <div className="mb-8" data-unique-id="457ca30c-e565-4fed-8024-2eddf69341c1" data-file-name="components/MatrixAnalysisTool.tsx">
      <div className="flex items-center justify-between" data-unique-id="00c133c9-eb76-49a2-8cd7-b67864753c8c" data-file-name="components/MatrixAnalysisTool.tsx">
        <div className={`flex flex-col items-center ${currentStep === "profile" ? "text-blue-600" : "text-slate-400"}`} data-unique-id="f9e91b9e-a0cd-4f00-87d4-92ad89976e1a" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "profile" ? "bg-blue-100 text-blue-600" : currentStep === "swot" || currentStep === "matrix" ? "bg-green-100 text-green-600" : "bg-slate-100"}`} data-unique-id="77c67408-f0f1-4a96-bdce-d3b10393b928" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="7af355bf-dad0-4fa4-b2f3-7c8200c17071" data-file-name="components/MatrixAnalysisTool.tsx">
            1
          </span></div>
          <span className="text-sm mt-1" data-unique-id="69404f05-5366-47d4-b279-27c6eb3f1e77" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="0a1d2cd7-79db-4b81-9dd6-79a305e69dbc" data-file-name="components/MatrixAnalysisTool.tsx">Company Profile</span></span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${currentStep === "profile" ? "bg-slate-200" : "bg-green-300"}`} data-unique-id="c2834d30-dfe2-441e-9318-c17af5b3640a" data-file-name="components/MatrixAnalysisTool.tsx"></div>
        
        <div className={`flex flex-col items-center ${currentStep === "swot" ? "text-blue-600" : currentStep === "profile" ? "text-slate-400" : "text-green-600"}`} data-unique-id="e21c2631-ee10-44c4-8cb3-61f490f309f4" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "swot" ? "bg-blue-100 text-blue-600" : currentStep === "matrix" ? "bg-green-100 text-green-600" : "bg-slate-100"}`} data-unique-id="af45d35e-3a58-43cc-95c9-5355dd42b904" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="114c08e3-9bdf-4acd-b5e1-4351a839b857" data-file-name="components/MatrixAnalysisTool.tsx">
            2
          </span></div>
          <span className="text-sm mt-1" data-unique-id="1ade8286-6793-4b8f-b042-66a20fbdeb0f" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="1424676b-bc72-4f89-9f28-faa5d9701882" data-file-name="components/MatrixAnalysisTool.tsx">SWOT Analysis</span></span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${currentStep === "profile" || currentStep === "swot" ? "bg-slate-200" : "bg-green-300"}`} data-unique-id="1eabcf37-d6cd-4905-bad0-582143db40f4" data-file-name="components/MatrixAnalysisTool.tsx"></div>
        
        <div className={`flex flex-col items-center ${currentStep === "matrix" ? "text-blue-600" : "text-slate-400"}`} data-unique-id="f985753b-be6c-4a24-b775-b5b51e9ac0da" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "matrix" ? "bg-blue-100 text-blue-600" : "bg-slate-100"}`} data-unique-id="60b30a49-ebf0-4473-9010-3f5faae20fcf" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="884d255f-a1cf-497f-9435-30e8b334db5a" data-file-name="components/MatrixAnalysisTool.tsx">
            3
          </span></div>
          <span className="text-sm mt-1" data-unique-id="1bfbcd7e-1c7e-4e5d-bea9-2fb8ae668b2c" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="d0390c00-9c22-4186-969a-5be3d7432c32" data-file-name="components/MatrixAnalysisTool.tsx">Matrix Analysis</span></span>
        </div>
      </div>
    </div>;

  // Render the matrix analysis tabs and content
  const renderMatrixAnalysis = () => <>
      <div className="w-full" data-unique-id="b2c4264b-ee17-46a5-a099-4cfd0c402cf2" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-8" data-unique-id="4cbf368d-b36e-488e-baa6-439a6d4f09cb" data-file-name="components/MatrixAnalysisTool.tsx">
          <div className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 w-[800px] grid grid-cols-4" data-unique-id="455c6584-25ec-4e71-97e4-56d0756c3f9e" data-file-name="components/MatrixAnalysisTool.tsx">
            <button onClick={() => setActiveTab("ife")} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "ife" ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-50"}`} data-unique-id="acc1c8e9-5627-47c0-8526-de43f96209d6" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="0c516fbb-1ffa-46bc-8151-91ae06629412" data-file-name="components/MatrixAnalysisTool.tsx">
              IFE Matrix
              </span><span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="a1f3387d-79fd-4bdf-a36a-7e88c7e96e2f" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="6dcca302-7934-4ee2-8b31-cfa401ae586d" data-file-name="components/MatrixAnalysisTool.tsx">(Internal)</span></span>
            </button>
            <button onClick={() => setActiveTab("efe")} disabled={ifeFactors.length === 0} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "efe" ? "bg-white text-slate-950 shadow-sm" : ifeFactors.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`} data-unique-id="c85db360-4702-48e0-bd01-a8a53bd9ef9b" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="960074a1-9262-4e74-b71a-4f417a814c65" data-file-name="components/MatrixAnalysisTool.tsx">
              EFE Matrix
              </span><span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="e2582f69-61cd-457f-b0ee-b2e237bff10f" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="4b0f2c4c-dad9-4956-89d6-d41b18122b44" data-file-name="components/MatrixAnalysisTool.tsx">(External)</span></span>
            </button>
            <button onClick={() => setActiveTab("ie")} disabled={efeFactors.length === 0} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "ie" ? "bg-white text-slate-950 shadow-sm" : efeFactors.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`} data-unique-id="b20dbb06-342a-447b-8043-679bc64ee6d2" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="6cc0c26d-0a78-4a35-a0ea-6a9f2676834e" data-file-name="components/MatrixAnalysisTool.tsx">
              IE Matrix
              </span><span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="482f1860-d264-477d-8702-e6f6d0dac0a2" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="bc409474-29c4-48e8-9fe1-886d489a3cc7" data-file-name="components/MatrixAnalysisTool.tsx">(Combined)</span></span>
            </button>
            <button onClick={() => setActiveTab("strategies")} disabled={ifeScore === 0 || efeScore === 0} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 h-10 text-sm font-medium text-lg ${activeTab === "strategies" ? "bg-white text-slate-950 shadow-sm" : ifeScore === 0 || efeScore === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`} data-unique-id="3be4ac09-5d6e-4310-88f2-f4305fdb478d" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="966103c2-ed35-4aa2-9ca2-f072eb9d3eb7" data-file-name="components/MatrixAnalysisTool.tsx">
              AI Integration
              </span><span className="ml-2 text-sm font-normal text-slate-500" data-unique-id="95cc070b-b25e-4128-97d1-e267c52cb09c" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="47eeec72-218a-4d5c-ba6d-3704ee702656" data-file-name="components/MatrixAnalysisTool.tsx">(Strategies)</span></span>
            </button>
          </div>
          
          <div className="flex items-center gap-4" data-unique-id="414052f8-8bbf-46f3-82f6-c063fdb3c1e8" data-file-name="components/MatrixAnalysisTool.tsx">
            <div className="flex items-center" data-unique-id="2b721428-db36-4f72-9070-476f6249bcf6" data-file-name="components/MatrixAnalysisTool.tsx">
              <label htmlFor="language-select" className="mr-2 text-sm text-slate-600" data-unique-id="d1462425-9085-4971-acca-bf2621c3810a" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="39085303-fedb-4d98-a61c-2a8330e40a56" data-file-name="components/MatrixAnalysisTool.tsx">Language:</span></label>
              <select id="language-select" value={selectedLanguage} onChange={e => {
              setSelectedLanguage(e.target.value);
              localStorage.setItem("selectedLanguage", e.target.value);
            }} className="p-2 border border-slate-300 rounded-md text-sm" data-unique-id="d56081ac-aaf3-4fe8-b5fc-e0cd062ea68a" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
                {supportedLanguages.map(lang => <option key={lang.code} value={lang.code} data-is-mapped="true" data-unique-id="28935591-37c5-4302-b578-e87be0772f0a" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
                    {lang.name}
                  </option>)}
              </select>
            </div>
            
            <button onClick={saveProject} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1" data-unique-id="953dec40-086d-4e62-94e4-9926855090aa" data-file-name="components/MatrixAnalysisTool.tsx">
              <Save className="h-4 w-4" /><span className="editable-text" data-unique-id="03bed953-def0-43d5-91d1-ddbc24cacee4" data-file-name="components/MatrixAnalysisTool.tsx">
              Save Project
            </span></button>
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
      }} className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center" data-unique-id="edef082a-50ec-4c18-ac3c-4e0cc63aa232" data-file-name="components/MatrixAnalysisTool.tsx">
            <span data-unique-id="267524b1-11ab-41b3-a551-e0c77683bef2" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="c1dbfa0f-a1d7-4d2b-a2e5-8dd7d7626c53" data-file-name="components/MatrixAnalysisTool.tsx">Project saved successfully! File downloaded to your computer.</span></span>
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
        }} data-unique-id="4f6dc59a-3cc5-445c-bd72-f30c0ab502f6" data-file-name="components/MatrixAnalysisTool.tsx">
              <MatrixTable factors={ifeFactors} setFactors={setIfeFactors} type="ife" />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="2c107cbb-1f54-459b-8ba7-b693277ab640" data-file-name="components/MatrixAnalysisTool.tsx">
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
        }} data-unique-id="8ccb15cf-86ba-49b6-bb2e-580c37c62155" data-file-name="components/MatrixAnalysisTool.tsx">
              <MatrixTable factors={efeFactors} setFactors={setEfeFactors} type="efe" />
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="977d8a2e-d12c-46cf-bc63-65e231141e84" data-file-name="components/MatrixAnalysisTool.tsx">
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
        }} data-unique-id="2dc74804-8607-4f69-a579-e1d8dd503b4b" data-file-name="components/MatrixAnalysisTool.tsx">
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
        }} data-unique-id="7aec70c7-6ce5-457d-966c-c990e28f5eb5" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4" data-unique-id="8ce9a36e-1610-4c4b-a037-092fb17c7828" data-file-name="components/MatrixAnalysisTool.tsx">
                <h3 className="text-lg font-medium text-blue-800" data-unique-id="f7b747f9-94ea-49e9-95f8-000755733738" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="61e6a14c-c77c-4e81-8090-7821a6cf9643" data-file-name="components/MatrixAnalysisTool.tsx">Internal-External (IE) Matrix</span></h3>
                <p className="text-blue-700 mt-1" data-unique-id="baa963bb-cc75-4872-9498-1cecea143378" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="5a4ff4ef-2288-4859-bb1b-d95de87227c1" data-file-name="components/MatrixAnalysisTool.tsx">
                  The IE Matrix plots your organization's position based on the total weighted scores from both 
                  the IFE Matrix (x-axis) and EFE Matrix (y-axis). This helps determine appropriate strategic approaches.
                </span></p>
              </div>
              
              {companyProfile && <div className="mb-6 bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="b5719134-f8ce-41d3-b568-f27c2d846958" data-file-name="components/MatrixAnalysisTool.tsx">
                  <h4 className="text-lg font-medium text-slate-800 mb-3" data-unique-id="4b8d292a-12fb-4d9e-8ba6-b71e1f92e10b" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="d508c1d8-1e2e-4c08-9162-0e5c34eeee4a" data-file-name="components/MatrixAnalysisTool.tsx">Company Profile Summary</span></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="4dd51ab6-7fb7-4791-b1cf-af815bd02bc8" data-file-name="components/MatrixAnalysisTool.tsx">
                    <div data-unique-id="9d6964d6-ffa0-431c-aeec-7fdec08a9e1e" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-sm text-slate-500" data-unique-id="c12a9de6-2955-488e-b088-eae06ccca60c" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="c9771783-70dc-4eff-948d-830b83d22d4e" data-file-name="components/MatrixAnalysisTool.tsx">Company Name</span></p>
                      <p className="font-medium" data-unique-id="6e9cc1a9-62e4-4b3a-b553-55da9180d1c7" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">{companyProfile.name}</p>
                    </div>
                    <div data-unique-id="371bd468-f9c5-4142-bbce-d85d89b1799a" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-sm text-slate-500" data-unique-id="3e25f4f5-e8c2-48dc-a208-daed3ec51c01" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="96d44679-e1e8-482a-aa59-9585a691268f" data-file-name="components/MatrixAnalysisTool.tsx">Industry</span></p>
                      <p className="font-medium" data-unique-id="d04fe043-01aa-403e-be55-5711e4bba025" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">{companyProfile.industry}</p>
                    </div>
                  </div>
                </div>}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" data-unique-id="0a7c65dc-31be-4ea7-b4bd-61d6e421d595" data-file-name="components/MatrixAnalysisTool.tsx">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="189d3a13-0fe6-4eaf-953b-d50798f4ffd5" data-file-name="components/MatrixAnalysisTool.tsx">
                  <h4 className="text-lg font-medium text-slate-800 mb-3" data-unique-id="8baeacd1-aff3-434d-81ab-e2d2781293e2" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="f99da628-dba1-4afe-a877-25de161904aa" data-file-name="components/MatrixAnalysisTool.tsx">IFE Score Summary</span></h4>
                  <div className="flex items-center" data-unique-id="c45a9813-8bf5-4cb1-b32f-8cdb5a7a980d" data-file-name="components/MatrixAnalysisTool.tsx">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" data-unique-id="25c94169-34d6-4209-9eca-9227c392de41" data-file-name="components/MatrixAnalysisTool.tsx">
                      <span className="text-xl font-bold" data-unique-id="35617640-7f69-445e-afbd-f309c3e0c6f9" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">{ifeScore.toFixed(2)}</span>
                    </div>
                    <div className="ml-4" data-unique-id="94b80719-56f9-4534-9e94-14b568b5bc8c" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-slate-600" data-unique-id="6ea755ba-c25d-406b-a3b8-adb5d690e1f9" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
                        {ifeScore < 2.0 ? <span className="text-orange-600 font-medium" data-unique-id="d32825e9-5d72-42e7-8355-43d6193d157c" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="dd9048c8-324a-431c-b3cc-744957c10665" data-file-name="components/MatrixAnalysisTool.tsx">Weak internal position</span></span> : ifeScore < 3.0 ? <span className="text-blue-600 font-medium" data-unique-id="c5afe56c-7512-4695-b7fe-96a7b2b5bb40" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="48e3294b-caf9-48a8-8330-0c2e03b0dde9" data-file-name="components/MatrixAnalysisTool.tsx">Average internal position</span></span> : <span className="text-green-600 font-medium" data-unique-id="7f7b1792-c537-4e03-bc25-a3661c05b9ac" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="486974a1-8aad-410d-8064-16c7be9ad463" data-file-name="components/MatrixAnalysisTool.tsx">Strong internal position</span></span>}
                      </p>
                      <p className="text-sm text-slate-500 mt-1" data-unique-id="ac066083-1867-499a-b7ba-26ae92ae7a7f" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d8ebdb7c-789e-42cd-83b6-1bdffcb75ac4" data-file-name="components/MatrixAnalysisTool.tsx">Based on </span>{ifeFactors.length}<span className="editable-text" data-unique-id="6d41e451-8cbc-40ca-aa76-c7b3e8c91601" data-file-name="components/MatrixAnalysisTool.tsx"> internal factors</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="64952beb-1537-46cb-b16d-168e80a87141" data-file-name="components/MatrixAnalysisTool.tsx">
                  <h4 className="text-lg font-medium text-slate-800 mb-3" data-unique-id="efa0eb89-bdb1-4266-b32e-a3e6754065f2" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="53a3952a-4bd4-452b-b5da-7db9b1eacd80" data-file-name="components/MatrixAnalysisTool.tsx">EFE Score Summary</span></h4>
                  <div className="flex items-center" data-unique-id="a6aabb14-91ec-4128-90d8-339e588f8369" data-file-name="components/MatrixAnalysisTool.tsx">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" data-unique-id="425eb91c-79c7-4974-8589-f2897c88ca03" data-file-name="components/MatrixAnalysisTool.tsx">
                      <span className="text-xl font-bold" data-unique-id="39920d2f-561d-452d-8032-70706e73a5ff" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">{efeScore.toFixed(2)}</span>
                    </div>
                    <div className="ml-4" data-unique-id="7da2aacd-0511-4138-8fb4-e2db39209ace" data-file-name="components/MatrixAnalysisTool.tsx">
                      <p className="text-slate-600" data-unique-id="0f29f9b4-cfc2-48b3-b47c-8e7538f0bab6" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
                        {efeScore < 2.0 ? <span className="text-orange-600 font-medium" data-unique-id="8cb981b4-337f-45b3-9294-cff002aaee36" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="be5d1da6-f3ae-46f6-be71-dff2d8c24b44" data-file-name="components/MatrixAnalysisTool.tsx">Low external response</span></span> : efeScore < 3.0 ? <span className="text-blue-600 font-medium" data-unique-id="cd704f51-e615-473c-908a-d48c8f4702da" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="1e3a6d5c-b433-45e5-8fc7-3a6cf3604794" data-file-name="components/MatrixAnalysisTool.tsx">Medium external response</span></span> : <span className="text-green-600 font-medium" data-unique-id="359adb99-afa7-4344-962f-55511712398e" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="6a817335-3a94-419b-9585-6b21de3734e7" data-file-name="components/MatrixAnalysisTool.tsx">High external response</span></span>}
                      </p>
                      <p className="text-sm text-slate-500 mt-1" data-unique-id="7d2859af-6043-4225-841f-174dd607cc05" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1944fbf7-2d66-4ae3-af49-10371c76e15b" data-file-name="components/MatrixAnalysisTool.tsx">Based on </span>{efeFactors.length}<span className="editable-text" data-unique-id="7db394d2-ea72-4897-a801-90771b2f0806" data-file-name="components/MatrixAnalysisTool.tsx"> external factors</span></p>
                    </div>
                  </div>
                </div>
              </div>
              
              <IEMatrix ifeScore={ifeScore} efeScore={efeScore} />
              
              <div className="mt-8" data-unique-id="67207e81-bccb-4c47-aa5d-dac7933b49ac" data-file-name="components/MatrixAnalysisTool.tsx">
                <FullReport companyProfile={companyProfile} swotItems={swotItems} ifeFactors={ifeFactors} efeFactors={efeFactors} ifeScore={ifeScore} efeScore={efeScore} />
              </div>
            </motion.div>}
          
          
        </AnimatePresence>
      </div>
    </>;

  // Navigation buttons
  const renderNavigation = () => <div className="mt-8 flex justify-between" data-unique-id="2a4bf3f3-19ea-463c-96dd-b40f6be8adf5" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
      {currentStep !== "profile" && <button onClick={() => setCurrentStep(currentStep === "matrix" ? "swot" : "profile")} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors" data-unique-id="f73bac16-1d4b-4c9e-b16a-88ac0e10c514" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="43596abe-ba22-4dc8-be04-b550b51a0187" data-file-name="components/MatrixAnalysisTool.tsx">
          Back
        </span></button>}
      
      {currentStep === "profile" && <div data-unique-id="275d2148-2dff-4f6d-a3d3-20ed5fcf5bf8" data-file-name="components/MatrixAnalysisTool.tsx"></div> // Empty div for flex spacing
    }
      
      {currentStep === "swot" && <button onClick={() => handleSwotComplete(swotItems)} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center" data-unique-id="32a16781-f811-414b-8e37-a40b9bb1faa3" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="b8d6dde9-c614-4b28-8b57-39f00b5a1f70" data-file-name="components/MatrixAnalysisTool.tsx">
          Continue to Matrix Analysis
          </span><ChevronRight className="ml-1 h-5 w-5" />
        </button>}
    </div>;
  return <motion.div ref={containerRef} variants={containerVariants} initial="hidden" animate="visible" className="bg-white shadow-lg rounded-xl p-6 relative" data-unique-id="45b1846b-4549-4c39-ab5e-f55163f6804f" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
      <h2 className="text-2xl font-bold text-slate-800 mb-6" data-unique-id="65c62b60-563d-48f3-a859-3a44de9c7b11" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="96e26a5a-1251-4f96-8bae-d11faf40a51d" data-file-name="components/MatrixAnalysisTool.tsx">Strategic Management Assistant</span></h2>
      
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
      }} data-unique-id="acc6a93b-8c24-4b88-8673-8c0b3c4430fc" data-file-name="components/MatrixAnalysisTool.tsx">
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
      }} data-unique-id="88738390-c0c0-474f-ae38-1c62e7f52a1a" data-file-name="components/MatrixAnalysisTool.tsx">
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
      }} data-unique-id="2ccc17fd-0af4-49c2-86f8-56c73e1bfd30" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
            {renderMatrixAnalysis()}
            <div className="mt-8 flex justify-between" data-unique-id="71817ada-a108-44c6-ab75-bd069155c737" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
              <button onClick={() => setCurrentStep("swot")} className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors" data-unique-id="73ea4892-9da1-4817-88ff-a24ed5c1b80c" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="e5de4f30-26cd-48c0-9cbc-732c53c18852" data-file-name="components/MatrixAnalysisTool.tsx">
                Back
              </span></button>
                
              {activeTab !== "strategies" && <button onClick={() => {
            // Enforce sequential navigation
            if (activeTab === "ife" && ifeFactors.length > 0) {
              setActiveTab("efe");
            } else if (activeTab === "efe" && efeFactors.length > 0) {
              setActiveTab("ie");
            } else if (activeTab === "ie" && ifeScore > 0 && efeScore > 0) {
              setActiveTab("strategies");
            }
          }} disabled={activeTab === "ife" && ifeFactors.length === 0 || activeTab === "efe" && efeFactors.length === 0 || activeTab === "ie" && (ifeScore === 0 || efeScore === 0)} className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${activeTab === "ife" && ifeFactors.length === 0 || activeTab === "efe" && efeFactors.length === 0 || activeTab === "ie" && (ifeScore === 0 || efeScore === 0) ? "opacity-50 cursor-not-allowed" : ""}`} data-unique-id="335bc70e-96a6-4a72-9b3b-55d12c0380d5" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="4503f6fc-8452-419b-9acb-b877567ff486" data-file-name="components/MatrixAnalysisTool.tsx">
                  Next
                  </span><ChevronRight className="ml-1 h-5 w-5" />
                </button>}
            </div>
          </motion.div>}
      </AnimatePresence>
      
      {(currentStep === "profile" || currentStep === "swot") && renderNavigation()}
      
      {/* Floating "+" button for new analysis - fixed position */}
      {showNewAnalysisButton && <div className="relative" data-unique-id="7bfd513a-4191-4475-931c-16b8cd74c892" data-file-name="components/MatrixAnalysisTool.tsx" data-dynamic-text="true">
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
        }} className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 w-48" data-unique-id="309ec00b-5fa3-447b-9f36-7788ad2508c9" data-file-name="components/MatrixAnalysisTool.tsx">
                <ul data-unique-id="d2473173-455c-450d-a75b-d9777f06c2d1" data-file-name="components/MatrixAnalysisTool.tsx">
                  <li data-unique-id="73c92a6a-c999-48c1-82ea-fa0ba1513237" data-file-name="components/MatrixAnalysisTool.tsx">
                    <button onClick={openNewAnalysisInNewTab} className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors" data-unique-id="3b61db57-7cef-4558-96c9-5d08795f5c89" data-file-name="components/MatrixAnalysisTool.tsx">
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span data-unique-id="534146ae-28b6-4d81-bec6-2b2abe104768" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="428b126e-3b01-4173-b535-02b91b06b9e4" data-file-name="components/MatrixAnalysisTool.tsx">New Analysis</span></span>
                    </button>
                  </li>
                  <li className="border-t border-slate-100" data-unique-id="3848f57d-22f7-4ce9-ab68-e607a88ecffe" data-file-name="components/MatrixAnalysisTool.tsx">
                    <button onClick={openProjectInNewTab} className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors" data-unique-id="e1e233dd-349e-4d8a-a496-c6f6a32af8f0" data-file-name="components/MatrixAnalysisTool.tsx">
                      <FileUp className="h-4 w-4 text-green-600" />
                      <span data-unique-id="8cececb2-aab2-476e-b1c7-49388ea93d88" data-file-name="components/MatrixAnalysisTool.tsx"><span className="editable-text" data-unique-id="d4a7acd4-351a-4bfd-8e02-87898657f082" data-file-name="components/MatrixAnalysisTool.tsx">Open Project</span></span>
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
      }} onClick={() => setIsMenuOpen(!isMenuOpen)} className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50" data-unique-id="a8a78e9c-1dfb-4d9b-909b-7cace318214b" data-file-name="components/MatrixAnalysisTool.tsx">
            <Plus className="h-6 w-6" />
          </motion.button>
        </div>}
    </motion.div>;
}