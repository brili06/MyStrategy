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
  return <div className="min-h-screen bg-[#f8fafc]" data-unique-id="4bc803d9-2368-4cac-a39f-0ecc4a48ae4a" data-loc="95:4-95:47" data-file-name="app/page.tsx">
      <header className="bg-white shadow-sm border-b border-slate-200 py-6" data-unique-id="37c64766-698d-4e60-b3e3-aacf378dbdff" data-loc="96:6-96:76" data-file-name="app/page.tsx">
        <div className="container mx-auto px-6" data-unique-id="11df79ed-6329-45d5-9ca9-8815740a749a" data-loc="97:8-97:48" data-file-name="app/page.tsx">
          <h1 className="text-3xl font-bold text-slate-800" data-unique-id="33ba7f8f-d0a1-45a6-a3a7-8afa2efef3b1" data-loc="98:10-98:60" data-file-name="app/page.tsx">Strategic Management Assistant</h1>
          <p className="text-slate-500 mt-2" data-unique-id="ae27a52d-b242-439c-8cc0-0fdab0d7a07b" data-loc="99:10-99:45" data-file-name="app/page.tsx">From Company Profiling to IE Matrix Generation</p>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8" data-unique-id="c4e0aff8-a8fa-4084-adad-263481766820" data-loc="103:6-103:52" data-file-name="app/page.tsx">
        {showLanding ? <LandingPage onNewAnalysis={handleNewAnalysis} onOpenProject={handleOpenProject} /> : <MatrixAnalysisTool initialData={projectData} />}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-12" data-unique-id="ac4e529b-1859-4d67-8baa-6bd88eff6ffb" data-loc="114:6-114:72" data-file-name="app/page.tsx">
        <div className="container mx-auto px-6 text-center text-slate-500" data-unique-id="e5abf817-a2c8-44ae-9192-4b08cedba2f5" data-loc="115:8-115:75" data-file-name="app/page.tsx">
          &copy; 2025 – This system is owned by Brilian Setia | All rights reserved.
        </div>
      </footer>
    </div>;
}