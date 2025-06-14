'use client';

import { useState, useEffect } from 'react';
import MatrixAnalysisTool from "@/components/MatrixAnalysisTool";
import LandingPage from "@/components/LandingPage";
import { CompanyProfile, SwotItem, Factor } from "@/types/matrix";
export default function HomePage() {
  const [showLanding, setShowLanding] = useState(true);
  const [projectData, setProjectData] = useState<{
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
  } | null>(null);

  // Check if there's an existing session or a new analysis request
  useEffect(() => {
    // Check for URL parameters
    const url = new URL(window.location.href);
    const newAnalysis = url.searchParams.get("newAnalysis");
    const openProject = url.searchParams.get("openProject");

    // Clear URL parameters without refreshing the page
    window.history.replaceState({}, document.title, window.location.pathname);
    if (newAnalysis === "true") {
      // Automatically trigger new analysis
      handleNewAnalysis();
    } else if (openProject === "true") {
      // Show landing page in "open project" mode
      setShowLanding(true);
    } else {
      // Normal flow - check for existing session
      const savedProfile = localStorage.getItem("companyProfile");
      // If there's already data in localStorage, skip the landing page
      if (savedProfile) {
        setShowLanding(false);
      }
    }
  }, []);

  // Set up automatic cookie and localStorage clearance when browser tab/window is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear all localStorage items
      localStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    };

    // Add event listener for tab/window close
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const handleNewAnalysis = () => {
    // Clear any existing data in localStorage
    localStorage.removeItem("companyProfile");
    localStorage.removeItem("swotItems");
    localStorage.removeItem("ifeFactors");
    localStorage.removeItem("efeFactors");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("soStrategies");
    localStorage.removeItem("stStrategies");
    localStorage.removeItem("woStrategies");
    localStorage.removeItem("wtStrategies");
    localStorage.removeItem("prioritizedStrategies");
    setProjectData(null);
    setShowLanding(false);
  };
  const handleOpenProject = (data: any) => {
    setProjectData(data);
    setShowLanding(false);
  };
  return <div className="min-h-screen bg-[#f8fafc]" data-unique-id="3375cf66-aef9-4c43-95a6-5ebc87af135b" data-file-name="app/page.tsx">
      <header className="bg-white shadow-sm border-b border-slate-200 py-6" data-unique-id="59bfaa88-1cc3-48cc-8b7b-525e76c68b9d" data-file-name="app/page.tsx">
        <div className="container mx-auto px-6" data-unique-id="0a387dd1-ce6d-470e-8385-d8d0b03cdd08" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-slate-800" data-unique-id="c0142381-e3b2-49a2-a53e-084e545255da" data-file-name="app/page.tsx"><span className="editable-text" data-unique-id="4e6255cd-a1d3-41e0-86b8-07287cc79abb" data-file-name="app/page.tsx">Strategic Management Assistant</span></h1>
          <p className="text-slate-500 mt-2" data-unique-id="b4b36e9d-c1d8-4ed9-ac21-5ddf80ed7b2b" data-file-name="app/page.tsx"><span className="editable-text" data-unique-id="54d382ec-a553-4baf-8834-0f1ae5591189" data-file-name="app/page.tsx">From Company Profiling to IE Matrix Generation</span></p>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8" data-unique-id="9878516d-d625-443a-be0f-c0af73c53d1a" data-file-name="app/page.tsx" data-dynamic-text="true">
        {showLanding ? <LandingPage onNewAnalysis={handleNewAnalysis} onOpenProject={handleOpenProject} /> : <MatrixAnalysisTool initialData={projectData} />}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-12" data-unique-id="9bda3c60-958e-4679-a31e-dbd878d29da8" data-file-name="app/page.tsx">
        <div className="container mx-auto px-6 text-center text-slate-500" data-unique-id="6c9a267e-62c4-4fe2-9782-1adc5307018a" data-file-name="app/page.tsx"><span className="editable-text" data-unique-id="6491278d-1b6d-4ab6-9818-8e11927d38ed" data-file-name="app/page.tsx">
          &copy; 2025 – This system is owned by Brilian Setia | All rights reserved.
        </span></div>
      </footer>
    </div>;
}