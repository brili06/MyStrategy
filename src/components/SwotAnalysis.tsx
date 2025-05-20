"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, AlertCircle, Tag } from "lucide-react";
import { SwotItem, FactorCategory } from "@/types/matrix";
interface SwotAnalysisProps {
  onComplete: (swotItems: SwotItem[]) => void;
  initialItems?: SwotItem[];
  selectedLanguage?: string;
}
export default function SwotAnalysis({
  onComplete,
  initialItems,
  selectedLanguage = 'en'
}: SwotAnalysisProps) {
  const [strengths, setStrengths] = useState<SwotItem[]>([]);
  const [weaknesses, setWeaknesses] = useState<SwotItem[]>([]);
  const [opportunities, setOpportunities] = useState<SwotItem[]>([]);
  const [threats, setThreats] = useState<SwotItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    // Load from localStorage if available
    const savedSwot = localStorage.getItem("swotItems");
    if (savedSwot && !initialItems) {
      const parsedItems = JSON.parse(savedSwot) as SwotItem[];
      setStrengths(parsedItems.filter(item => item.category === "strength"));
      setWeaknesses(parsedItems.filter(item => item.category === "weakness"));
      setOpportunities(parsedItems.filter(item => item.category === "opportunity"));
      setThreats(parsedItems.filter(item => item.category === "threat"));
    } else if (initialItems) {
      setStrengths(initialItems.filter(item => item.category === "strength"));
      setWeaknesses(initialItems.filter(item => item.category === "weakness"));
      setOpportunities(initialItems.filter(item => item.category === "opportunity"));
      setThreats(initialItems.filter(item => item.category === "threat"));
    }
  }, [initialItems]);
  const addItem = (category: FactorCategory) => {
    const newId = Date.now().toString();
    const newItem: SwotItem = {
      id: newId,
      description: "",
      category,
      significance: ""
    };
    switch (category) {
      case "strength":
        setStrengths([...strengths, newItem]);
        break;
      case "weakness":
        setWeaknesses([...weaknesses, newItem]);
        break;
      case "opportunity":
        setOpportunities([...opportunities, newItem]);
        break;
      case "threat":
        setThreats([...threats, newItem]);
        break;
    }
  };
  const deleteItem = (id: string, category: FactorCategory) => {
    switch (category) {
      case "strength":
        setStrengths(strengths.filter(item => item.id !== id));
        break;
      case "weakness":
        setWeaknesses(weaknesses.filter(item => item.id !== id));
        break;
      case "opportunity":
        setOpportunities(opportunities.filter(item => item.id !== id));
        break;
      case "threat":
        setThreats(threats.filter(item => item.id !== id));
        break;
    }
  };
  const updateItem = (id: string, field: keyof SwotItem, value: string, category: FactorCategory) => {
    const updateItemInArray = (items: SwotItem[]) => items.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item);
    switch (category) {
      case "strength":
        setStrengths(updateItemInArray(strengths));
        break;
      case "weakness":
        setWeaknesses(updateItemInArray(weaknesses));
        break;
      case "opportunity":
        setOpportunities(updateItemInArray(opportunities));
        break;
      case "threat":
        setThreats(updateItemInArray(threats));
        break;
    }
  };
  const handleSubmit = async () => {
    const allItems = [...strengths, ...weaknesses, ...opportunities, ...threats];

    // Validate that there's at least one item in each category
    if (strengths.length === 0 || weaknesses.length === 0 || opportunities.length === 0 || threats.length === 0) {
      setError("Please add at least one item to each SWOT category");
      return;
    }

    // Validate that all items have descriptions
    const emptyItems = allItems.filter(item => !item.description.trim());
    if (emptyItems.length > 0) {
      setError("All items must have descriptions");
      return;
    }
    try {
      // Get company profile from localStorage to get the ID
      const savedProfileStr = localStorage.getItem("companyProfile");
      if (!savedProfileStr) {
        throw new Error("Company profile not found");
      }
      const savedProfile = JSON.parse(savedProfileStr);
      const companyProfileId = savedProfile.id;
      if (!companyProfileId) {
        throw new Error("Company profile ID not found");
      }

      // Save to database
      const response = await fetch('/api/swot-items', {
        method: 'PUT',
        // Using PUT to replace all items at once
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyProfileId,
          items: allItems
        })
      });
      if (!response.ok) {
        throw new Error('Failed to save SWOT items to database');
      }
      const savedItems = await response.json();

      // Also save to localStorage as a backup
      localStorage.setItem("swotItems", JSON.stringify(savedItems));

      // Call the completion handler
      onComplete(savedItems);
    } catch (error) {
      console.error('Error saving SWOT items:', error);

      // Fallback to localStorage only if database save fails
      localStorage.setItem("swotItems", JSON.stringify(allItems));
      onComplete(allItems);
    }
  };
  const getCategoryColor = (category: FactorCategory) => {
    switch (category) {
      case "strength":
        return "bg-green-100 border-green-300 text-green-800";
      case "weakness":
        return "bg-red-100 border-red-300 text-red-800";
      case "opportunity":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "threat":
        return "bg-orange-100 border-orange-300 text-orange-800";
    }
  };
  const getCategoryIcon = (category: FactorCategory) => {
    switch (category) {
      case "strength":
        return "💪";
      case "weakness":
        return "⚠️";
      case "opportunity":
        return "🚀";
      case "threat":
        return "🛡️";
    }
  };
  const renderSwotSection = (title: string, items: SwotItem[], category: FactorCategory, colorClass: string) => <div className="mb-8" data-unique-id="222c42c6-381a-40bd-90ca-5481d6e1c1bf" data-file-name="components/SwotAnalysis.tsx">
      <div className={`p-4 rounded-t-lg ${colorClass}`} data-unique-id="4cdec290-6c54-4af5-b805-cd8c0771eb40" data-file-name="components/SwotAnalysis.tsx">
        <h3 className="text-lg font-semibold flex items-center" data-unique-id="8cd1d576-918f-4831-832a-54b83af48d1f" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">
          {getCategoryIcon(category)} {title}
        </h3>
      </div>
      
      <div className="border border-t-0 rounded-b-lg p-4" data-unique-id="49bd512f-422a-434a-a74e-fea62bf54dc2" data-file-name="components/SwotAnalysis.tsx">
        <AnimatePresence>
          {items.map(item => <motion.div key={item.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2
        }} className="mb-3 last:mb-0" data-is-mapped="true" data-unique-id="6eff335c-e4cc-415c-9abd-aa1bb4af4555" data-file-name="components/SwotAnalysis.tsx">
              <div className="flex items-start gap-2" data-is-mapped="true" data-unique-id="0cce3813-cbdf-4a52-978e-581f7493ec72" data-file-name="components/SwotAnalysis.tsx">
                <div className="flex-1" data-is-mapped="true" data-unique-id="7c6d65ae-ec41-4670-a4c1-d984400e0f28" data-file-name="components/SwotAnalysis.tsx">
                  <input type="text" value={item.description} onChange={e => updateItem(item.id, "description", e.target.value, category)} placeholder={`Enter ${category}`} className="w-full p-2 border border-slate-300 rounded-md mb-2" data-is-mapped="true" data-unique-id="b1d82970-4a18-4c0d-bab3-c5cb1e0ae57a" data-file-name="components/SwotAnalysis.tsx" />
                  <div className="flex items-center" data-is-mapped="true" data-unique-id="bc4c21b6-11ee-4a58-8643-e0912232aba8" data-file-name="components/SwotAnalysis.tsx">
                    <Tag className="h-4 w-4 text-slate-400 mr-1" />
                    <input type="text" value={item.significance || ""} onChange={e => updateItem(item.id, "significance", e.target.value, category)} placeholder="Strategic significance (optional)" className="w-full p-1 text-sm border-b border-dashed border-slate-300 focus:outline-none focus:border-slate-500" data-is-mapped="true" data-unique-id="f5b9357f-e89c-4d71-bb6c-b88b4b8cff82" data-file-name="components/SwotAnalysis.tsx" />
                  </div>
                </div>
                <button onClick={() => deleteItem(item.id, category)} className="p-2 text-red-600 hover:bg-red-50 rounded-full" data-is-mapped="true" data-unique-id="a3148fcc-510e-49ad-b22b-7f53eca1559e" data-file-name="components/SwotAnalysis.tsx">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>)}
        </AnimatePresence>
        
        <button onClick={() => addItem(category)} className={`mt-3 flex items-center px-3 py-2 text-sm rounded-md hover:bg-opacity-80 ${category === "strength" ? "bg-green-100 text-green-700" : category === "weakness" ? "bg-red-100 text-red-700" : category === "opportunity" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`} data-unique-id="20e9e0e3-e377-4833-9cc7-ba5d741f6fcf" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">
          <Plus className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="5805a767-94ef-4200-a0db-bc4d5545f495" data-file-name="components/SwotAnalysis.tsx">
          Add </span>{title.slice(0, -1)}
        </button>
      </div>
    </div>;
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="bg-white shadow-lg rounded-xl p-6" data-unique-id="f4897795-0cfb-4d2f-b118-06345480a4d0" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">
      <h2 className="text-2xl font-bold text-slate-800 mb-2" data-unique-id="6f08bb8d-4f3f-432d-a35d-aad031a7b41e" data-file-name="components/SwotAnalysis.tsx"><span className="editable-text" data-unique-id="69378712-6866-43a1-a0e8-8ff6adfaec8a" data-file-name="components/SwotAnalysis.tsx">SWOT Analysis</span></h2>
      <p className="text-slate-500 mb-6" data-unique-id="887c020d-9763-492f-81b4-e9080eb3291b" data-file-name="components/SwotAnalysis.tsx"><span className="editable-text" data-unique-id="6bcc9b52-7aee-4e04-afae-d9c8d13bc5e5" data-file-name="components/SwotAnalysis.tsx">
        Identify your organization's Strengths, Weaknesses, Opportunities, and Threats
      </span></p>

      {error && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center" data-unique-id="abe5d3a5-ec0f-471e-b7e1-c90d79d2a30a" data-file-name="components/SwotAnalysis.tsx">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span data-unique-id="d8f84b66-57d6-49b7-b201-63c3fb3ed731" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">{error}</span>
        </motion.div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="4c14e7d8-3cf4-4f82-99aa-f2133076c762" data-file-name="components/SwotAnalysis.tsx">
        <div data-unique-id="a16a5090-2aa1-44a6-be90-49646d999ad4" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">
          {renderSwotSection("Strengths", strengths, "strength", "bg-green-50 border-green-200")}
          
          {renderSwotSection("Weaknesses", weaknesses, "weakness", "bg-red-50 border-red-200")}
        </div>
        
        <div data-unique-id="998c6951-5b6f-4fb6-a350-4e3812ce0d1d" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">
          {renderSwotSection("Opportunities", opportunities, "opportunity", "bg-blue-50 border-blue-200")}
          
          {renderSwotSection("Threats", threats, "threat", "bg-orange-50 border-orange-200")}
        </div>
      </div>

      <div className="mt-8 flex justify-end" data-unique-id="290b969d-3c54-41bd-bbdc-1eb6c8042ca6" data-file-name="components/SwotAnalysis.tsx" data-dynamic-text="true">
        {/* Button removed as requested */}
      </div>
    </motion.div>;
}