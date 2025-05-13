"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Factor, MatrixType, FactorCategory } from "@/types/matrix";

interface MatrixTableProps {
  factors: Factor[];
  setFactors: React.Dispatch<React.SetStateAction<Factor[]>>;
  type: MatrixType;
}

export default function MatrixTable({ factors, setFactors, type }: MatrixTableProps) {
  const [error, setError] = useState("");
  
  const addFactor = (category?: FactorCategory) => {
    const newId = String(Math.max(0, ...factors.map(f => parseInt(f.id))) + 1);
    setFactors([...factors, { 
      id: newId, 
      description: "", 
      weight: 0, 
      rating: 1,
      category
    }]);
  };
  
  const deleteFactor = (id: string) => {
    setFactors(factors.filter(factor => factor.id !== id));
  };
  
  const updateFactor = (id: string, field: keyof Factor, value: string | number) => {
    setFactors(factors.map(factor => {
      if (factor.id === id) {
        if (field === "weight") {
          const weightValue = parseFloat(value as string);
          if (isNaN(weightValue) || weightValue < 0 || weightValue > 1) {
            setError("Weight must be between 0.0 and 1.0");
            return factor;
          }
          setError("");
          return { ...factor, [field]: weightValue };
        }
        
        if (field === "rating") {
          const ratingValue = parseInt(value as string);
          if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 4) {
            setError("Rating must be between 1 and 4");
            return factor;
          }
          setError("");
          return { ...factor, [field]: ratingValue };
        }
        
        return { ...factor, [field]: value };
      }
      return factor;
    }));
    
    // Save to database after a short delay
    saveFactorsToDatabase();
  };
  
  // Debounced function to save factors to database
  const saveFactorsToDatabase = async () => {
    try {
      // Get company profile from localStorage to get the ID
      const savedProfileStr = localStorage.getItem("companyProfile");
      if (!savedProfileStr) {
        return; // Skip if no profile found
      }
      
      const savedProfile = JSON.parse(savedProfileStr);
      const companyProfileId = savedProfile.id;
      
      if (!companyProfileId) {
        return; // Skip if no profile ID found
      }
      
      // Save to database
      const response = await fetch('/api/matrix-factors', {
        method: 'PUT', // Using PUT to replace all factors at once
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyProfileId,
          matrixType: type,
          factors
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save matrix factors to database');
      }
      
      // Always save to localStorage as a backup
      localStorage.setItem(`${type}Factors`, JSON.stringify(factors));
    } catch (error) {
      console.error('Error saving matrix factors:', error);
      
      // Fallback to localStorage only
      localStorage.setItem(`${type}Factors`, JSON.stringify(factors));
    }
  };
  
  const checkWeightSum = () => {
    const sum = factors.reduce((acc, factor) => acc + factor.weight, 0);
    if (Math.abs(sum - 1) > 0.01) {
      setError(`Total weight (${sum.toFixed(2)}) should equal 1.0`);
    } else {
      setError("");
    }
  };
  
  const totalWeightedScore = factors.reduce((sum, factor) => sum + (factor.weight * factor.rating), 0).toFixed(2);
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2);
  
  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-slate-800">
          {type === "ife" ? "Internal Factor Evaluation" : "External Factor Evaluation"}
        </h3>
        <p className="text-slate-500 mt-1">
          Assign weights (0.0-1.0) and ratings (1-4) to your {type === "ife" ? "internal" : "external"} strategic factors
        </p>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center"
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </motion.div>
      )}
      
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-slate-100">
            <th className="text-left p-3 border border-slate-200 w-10">#</th>
            <th className="text-left p-3 border border-slate-200">
              {type === "ife" ? "Internal Factors" : "External Factors"}
            </th>
            <th className="text-left p-3 border border-slate-200 w-24">
              Weight
              <span className="block text-xs text-slate-500 font-normal">(0.0-1.0)</span>
            </th>
            <th className="text-left p-3 border border-slate-200 w-24">
              Rating
              <span className="block text-xs text-slate-500 font-normal">(1-4)</span>
            </th>
            <th className="text-left p-3 border border-slate-200 w-36">Weighted Score</th>
            <th className="text-left p-3 border border-slate-200 w-20">Action</th>
          </tr>
        </thead>
        <tbody>
          {type === "ife" && (
            <tr className="bg-green-50">
              <td colSpan={6} className="p-2 font-medium text-green-800 border border-slate-200">
                Strengths
              </td>
            </tr>
          )}
          
          <AnimatePresence>
            {factors
              .filter(f => f.category === "strength")
              .map((factor, index) => (
              <motion.tr 
                key={factor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3 border border-slate-200">{index + 1}</td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="text"
                    value={factor.description}
                    onChange={(e) => updateFactor(factor.id, "description", e.target.value)}
                    placeholder={`Enter ${type === "ife" ? "internal" : "external"} factor`}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={factor.weight}
                    onChange={(e) => updateFactor(factor.id, "weight", e.target.value)}
                    onBlur={checkWeightSum}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <select
                    value={factor.rating}
                    onChange={(e) => updateFactor(factor.id, "rating", e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2}>2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3}>3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4}>4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200">
                  <button 
                    onClick={() => deleteFactor(factor.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete factor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          
          {type === "ife" && (
            <tr className="bg-red-50">
              <td colSpan={6} className="p-2 font-medium text-red-800 border border-slate-200">
                Weaknesses
              </td>
            </tr>
          )}
          
          <AnimatePresence>
            {factors
              .filter(f => f.category === "weakness")
              .map((factor, index) => (
              <motion.tr 
                key={factor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3 border border-slate-200">{index + 1}</td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="text"
                    value={factor.description}
                    onChange={(e) => updateFactor(factor.id, "description", e.target.value)}
                    placeholder={`Enter weakness`}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={factor.weight}
                    onChange={(e) => updateFactor(factor.id, "weight", e.target.value)}
                    onBlur={checkWeightSum}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <select
                    value={factor.rating}
                    onChange={(e) => updateFactor(factor.id, "rating", e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2}>2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3}>3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4}>4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200">
                  <button 
                    onClick={() => deleteFactor(factor.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete factor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          
          {type === "efe" && (
            <tr className="bg-blue-50">
              <td colSpan={6} className="p-2 font-medium text-blue-800 border border-slate-200">
                Opportunities
              </td>
            </tr>
          )}
          
          <AnimatePresence>
            {factors
              .filter(f => f.category === "opportunity")
              .map((factor, index) => (
              <motion.tr 
                key={factor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3 border border-slate-200">{index + 1}</td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="text"
                    value={factor.description}
                    onChange={(e) => updateFactor(factor.id, "description", e.target.value)}
                    placeholder={`Enter opportunity`}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={factor.weight}
                    onChange={(e) => updateFactor(factor.id, "weight", e.target.value)}
                    onBlur={checkWeightSum}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <select
                    value={factor.rating}
                    onChange={(e) => updateFactor(factor.id, "rating", e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2}>2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3}>3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4}>4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200">
                  <button 
                    onClick={() => deleteFactor(factor.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete factor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          
          {type === "efe" && (
            <tr className="bg-orange-50">
              <td colSpan={6} className="p-2 font-medium text-orange-800 border border-slate-200">
                Threats
              </td>
            </tr>
          )}
          
          <AnimatePresence>
            {factors
              .filter(f => f.category === "threat")
              .map((factor, index) => (
              <motion.tr 
                key={factor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="p-3 border border-slate-200">{index + 1}</td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="text"
                    value={factor.description}
                    onChange={(e) => updateFactor(factor.id, "description", e.target.value)}
                    placeholder={`Enter threat`}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={factor.weight}
                    onChange={(e) => updateFactor(factor.id, "weight", e.target.value)}
                    onBlur={checkWeightSum}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 border border-slate-200">
                  <select
                    value={factor.rating}
                    onChange={(e) => updateFactor(factor.id, "rating", e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2}>2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3}>3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4}>4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200">
                  <button 
                    onClick={() => deleteFactor(factor.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete factor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          
          <tr className="bg-slate-50">
            <td colSpan={2} className="p-3 border border-slate-200 font-medium text-right">
              Total
            </td>
            <td className={`p-3 border border-slate-200 font-medium ${
              Math.abs(parseFloat(totalWeight) - 1) > 0.01 ? "text-red-600" : "text-green-600"
            }`}>
              {totalWeight}
              {Math.abs(parseFloat(totalWeight) - 1) > 0.01 && 
                <span className="block text-xs">(Should be 1.0)</span>
              }
            </td>
            <td className="p-3 border border-slate-200"></td>
            <td className="p-3 border border-slate-200 font-bold text-lg">
              {totalWeightedScore}
            </td>
            <td className="p-3 border border-slate-200"></td>
          </tr>
        </tbody>
      </table>
      
      {type === "ife" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addFactor("strength")}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Strength
          </button>
          <button
            onClick={() => addFactor("weakness")}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Weakness
          </button>
        </div>
      )}
      
      {type === "efe" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addFactor("opportunity")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Opportunity
          </button>
          <button
            onClick={() => addFactor("threat")}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Threat
          </button>
        </div>
      )}
    </div>
  );
}
