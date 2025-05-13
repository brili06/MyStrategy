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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white shadow-sm border-b border-slate-200 py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-slate-800">Strategic Management Assistant</h1>
          <p className="text-slate-500 mt-2">From Company Profiling to IE Matrix Generation</p>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {showLanding ? (
          <LandingPage 
            onNewAnalysis={handleNewAnalysis} 
            onOpenProject={handleOpenProject} 
          />
        ) : (
          <MatrixAnalysisTool initialData={projectData} />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-slate-500">
          &copy; {new Date().getFullYear()} Strategic Management Assistant | All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
