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
export default function MatrixTable({
  factors,
  setFactors,
  type
}: MatrixTableProps) {
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
          return {
            ...factor,
            [field]: weightValue
          };
        }
        if (field === "rating") {
          const ratingValue = parseInt(value as string);
          if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 4) {
            setError("Rating must be between 1 and 4");
            return factor;
          }
          setError("");
          return {
            ...factor,
            [field]: ratingValue
          };
        }
        return {
          ...factor,
          [field]: value
        };
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
        method: 'PUT',
        // Using PUT to replace all factors at once
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyProfileId,
          matrixType: type,
          factors
        })
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
  const totalWeightedScore = factors.reduce((sum, factor) => sum + factor.weight * factor.rating, 0).toFixed(2);
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2);
  return <div className="overflow-x-auto" data-unique-id="57ecf232-8528-4549-9268-b77f08530a07" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
      <div className="mb-4" data-unique-id="bbb4f81b-28e3-4470-ba11-3ebc8d4897d9" data-file-name="components/MatrixTable.tsx">
        <h3 className="text-xl font-semibold text-slate-800" data-unique-id="f7bce6ae-a483-45c0-9f21-3bf57a2a2896" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
          {type === "ife" ? "Internal Factor Evaluation" : "External Factor Evaluation"}
        </h3>
        <p className="text-slate-500 mt-1" data-unique-id="a7b09cbf-d2b2-4e73-9c62-d65719604cd7" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2fdd8428-1b9b-4d71-b96e-4c9add2d4f94" data-file-name="components/MatrixTable.tsx">
          Assign weights (0.0-1.0) and ratings (1-4) to your </span>{type === "ife" ? "internal" : "external"}<span className="editable-text" data-unique-id="f482998d-fd32-4524-a233-fbc5ca9114a3" data-file-name="components/MatrixTable.tsx"> strategic factors
        </span></p>
      </div>
      
      {error && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center" data-unique-id="5207abc6-5117-4beb-ae9f-21fe4b881956" data-file-name="components/MatrixTable.tsx">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span data-unique-id="ac4d6642-9b3a-4c28-a918-64098f96b6c6" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">{error}</span>
        </motion.div>}
      
      <table className="w-full border-collapse mt-4" data-unique-id="4e81c9a5-fda0-4f5e-bab0-180904972c8a" data-file-name="components/MatrixTable.tsx">
        <thead data-unique-id="bbf1331c-ac16-43b9-a9a3-f9e7cf6ff1e9" data-file-name="components/MatrixTable.tsx">
          <tr className="bg-slate-100" data-unique-id="23d91e65-6168-4b47-8161-d1ba5a5daabe" data-file-name="components/MatrixTable.tsx">
            <th className="text-left p-3 border border-slate-200 w-10" data-unique-id="81a82cb6-1329-48eb-b4e0-b543fdc4a72e" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="724e2656-40ab-40c3-9b26-0bd9bd97403f" data-file-name="components/MatrixTable.tsx">#</span></th>
            <th className="text-left p-3 border border-slate-200" data-unique-id="6c9dedbc-0f11-4dd1-80d5-28e8be301b71" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
              {type === "ife" ? "Internal Factors" : "External Factors"}
            </th>
            <th className="text-left p-3 border border-slate-200 w-24" data-unique-id="5752dc40-2cde-44b7-8d10-a65e23ebbd91" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="ba5b2201-9027-467e-8b09-04e5a3d0f1f3" data-file-name="components/MatrixTable.tsx">
              Weight
              </span><span className="block text-xs text-slate-500 font-normal" data-unique-id="b63b4f9e-9314-424e-a661-dfb926d7c5f9" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="197f94ac-911c-499c-83d0-3c101c1a6517" data-file-name="components/MatrixTable.tsx">(0.0-1.0)</span></span>
            </th>
            <th className="text-left p-3 border border-slate-200 w-24" data-unique-id="d4dcffe0-b304-4d66-a04d-8730a9263543" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="ef7a3867-a5ca-4178-a5b7-2e289213ce7a" data-file-name="components/MatrixTable.tsx">
              Rating
              </span><span className="block text-xs text-slate-500 font-normal" data-unique-id="94a9411a-18bb-4979-a142-ca50e9adbd3b" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="39bf2f44-9bb2-4a1b-a205-11e182cdea10" data-file-name="components/MatrixTable.tsx">(1-4)</span></span>
            </th>
            <th className="text-left p-3 border border-slate-200 w-36" data-unique-id="b7020019-bc2f-47c2-8561-71fb6826125e" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="794a52cb-b360-4847-bc9d-136c35b60d21" data-file-name="components/MatrixTable.tsx">Weighted Score</span></th>
            <th className="text-left p-3 border border-slate-200 w-20" data-unique-id="a04cd502-f2c9-47b0-9398-1aa1bd2b8d51" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="0f03310b-03a6-4b88-9d78-9e6322ef4b9a" data-file-name="components/MatrixTable.tsx">Action</span></th>
          </tr>
        </thead>
        <tbody data-unique-id="d482aba6-ceaa-47c5-81a7-33cf5ebcde38" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
          {type === "ife" && <tr className="bg-green-50" data-unique-id="07a31b43-8308-4d0a-9c1d-4067b1aeb4b2" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-green-800 border border-slate-200" data-unique-id="88f93100-1482-4905-a7b8-a425940e77f3" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="376b85f1-31d4-4d74-baf0-2ebe4ca01a3d" data-file-name="components/MatrixTable.tsx">
                Strengths
              </span></td>
            </tr>}
          
          <AnimatePresence>
            {factors.filter(f => f.category === "strength").map((factor, index) => <motion.tr key={factor.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="border-b border-slate-200 hover:bg-slate-50" data-is-mapped="true" data-unique-id="dce32edb-22a2-4930-b635-8d6becd258b8" data-file-name="components/MatrixTable.tsx">
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="e26c768e-b7fe-4c26-aca3-a3b37047e25d" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="581b112e-ab01-4b93-a0d1-9f0601455234" data-file-name="components/MatrixTable.tsx">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter ${type === "ife" ? "internal" : "external"} factor`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="a8361681-9c05-4aa8-a21c-9cff1bc16165" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="97eccb77-ed89-4601-8ce0-98bf15a0aee0" data-file-name="components/MatrixTable.tsx">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="da5d4b86-a19d-4365-8f7e-d6595f592cbe" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="0f5d11fc-a49c-42c7-a744-a4ba9f210713" data-file-name="components/MatrixTable.tsx">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="c82b963e-36b1-428a-97ed-743a43f3c56d" data-file-name="components/MatrixTable.tsx">
                    <option value={1} data-is-mapped="true" data-unique-id="8add5613-dfeb-47d3-aa22-876f487d59bf" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="df6f4057-5c78-4a62-80e7-af257968201f" data-file-name="components/MatrixTable.tsx">1 - </span>{type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-is-mapped="true" data-unique-id="3658b54f-f2e3-496f-a5f7-a159bcb55d0b" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="baa45d02-6db5-4c1f-86a9-410757c3a0b3" data-file-name="components/MatrixTable.tsx">2 - </span>{type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-is-mapped="true" data-unique-id="fbc65b80-128a-49cd-b337-6a4a24a7770a" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3786feeb-626d-4986-8d50-6cc39f756967" data-file-name="components/MatrixTable.tsx">3 - </span>{type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-is-mapped="true" data-unique-id="dc220f17-4f2c-4890-b0c2-9e668db89c7a" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2305491b-5849-4ec9-a93a-c85249e116dc" data-file-name="components/MatrixTable.tsx">4 - </span>{type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-is-mapped="true" data-unique-id="99b12908-ac7d-4b3b-9068-9bd926b7a1db" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="58e313ad-88ad-4ee7-80f2-2c33fbdd80f5" data-file-name="components/MatrixTable.tsx">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-is-mapped="true" data-unique-id="5c4b926b-8ba9-458e-a0c9-cfd2929ccca2" data-file-name="components/MatrixTable.tsx">
                    <Trash2 className="w-5 h-5" data-unique-id="e3b30f77-7710-460b-b62d-cf941b0e4e88" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          {type === "ife" && <tr className="bg-red-50" data-unique-id="838abf90-df56-48c8-8e0c-3232a5327128" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-red-800 border border-slate-200" data-unique-id="0ec30a3c-9468-4dfd-994f-89be2f6d13e2" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="ff6ba329-6dfe-4a77-89ad-d46d3845e79c" data-file-name="components/MatrixTable.tsx">
                Weaknesses
              </span></td>
            </tr>}
          
          <AnimatePresence>
            {factors.filter(f => f.category === "weakness").map((factor, index) => <motion.tr key={factor.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="border-b border-slate-200 hover:bg-slate-50" data-is-mapped="true" data-unique-id="94542331-f178-4e07-a94f-9df79d2a3cf0" data-file-name="components/MatrixTable.tsx">
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="94d5fb10-77d6-455b-b477-ad384e20d209" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="f274b635-6869-4b1f-9fa9-7b51f89bce42" data-file-name="components/MatrixTable.tsx">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter weakness`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="d2a18306-65ec-4997-b080-03d11b1ad7cd" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="750b0db0-f820-494e-9835-22283755d55c" data-file-name="components/MatrixTable.tsx">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="e18cf16e-6b34-4a2e-b804-84b9b0f455d2" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="d96f9045-30d3-409b-9764-00b1b46bf42e" data-file-name="components/MatrixTable.tsx">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="03f11bcd-d79b-44ea-9607-262102dd3e7e" data-file-name="components/MatrixTable.tsx">
                    <option value={1} data-is-mapped="true" data-unique-id="9f004ca6-073f-4f4c-ad53-2122ee7ca800" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b56d0073-d455-4e35-952e-50473a7de9c5" data-file-name="components/MatrixTable.tsx">1 - </span>{type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-is-mapped="true" data-unique-id="4c4ec4fc-996c-465a-9f00-78d42f829d2e" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ea0a5a9f-028e-4c0f-b3e9-fdb956ef45ed" data-file-name="components/MatrixTable.tsx">2 - </span>{type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-is-mapped="true" data-unique-id="f96640fd-e568-4a97-a10c-0887ecd298eb" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="edffe56b-b493-4547-bce4-77b912ac6ee2" data-file-name="components/MatrixTable.tsx">3 - </span>{type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-is-mapped="true" data-unique-id="69257081-d855-4cb7-bf6f-37728a2ad385" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b453d647-3b9c-413e-9e30-709642df8a96" data-file-name="components/MatrixTable.tsx">4 - </span>{type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-is-mapped="true" data-unique-id="805c6466-ca8d-4e64-b9c7-702f315892aa" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="b03dfa75-ce62-426b-82ae-cfe25d260c97" data-file-name="components/MatrixTable.tsx">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-is-mapped="true" data-unique-id="ef90c28f-1dc3-420e-a2dd-72a65d042229" data-file-name="components/MatrixTable.tsx">
                    <Trash2 className="w-5 h-5" data-unique-id="5433cec8-1042-45c1-a707-75d493354b59" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          {type === "efe" && <tr className="bg-blue-50" data-unique-id="cd8153f8-8637-43b4-befd-2c84d1c3dd22" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-blue-800 border border-slate-200" data-unique-id="86a405c4-6b6d-4b1a-b96c-000ed1eb42f3" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="91f72aa1-df62-4582-af99-fe770b4dc32d" data-file-name="components/MatrixTable.tsx">
                Opportunities
              </span></td>
            </tr>}
          
          <AnimatePresence>
            {factors.filter(f => f.category === "opportunity").map((factor, index) => <motion.tr key={factor.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="border-b border-slate-200 hover:bg-slate-50" data-is-mapped="true" data-unique-id="7d5f453d-2c09-40d0-8cb6-c19dfaed207f" data-file-name="components/MatrixTable.tsx">
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="1501e786-4aa4-4ec7-a516-81aa51a5aef3" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="d9486e76-c985-4434-9c0a-7b9052ec369e" data-file-name="components/MatrixTable.tsx">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter opportunity`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="2fe4a046-369a-4cd3-841d-6131e375b028" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="242a25cf-ef33-4c43-886b-823393974eee" data-file-name="components/MatrixTable.tsx">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="63263e01-2316-431b-98e5-cf73b79d10dd" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="97220fdd-9dfe-4e49-a781-3f5b3298ce7a" data-file-name="components/MatrixTable.tsx">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="aad06a45-a382-4254-8dd7-c7f3d1ac3566" data-file-name="components/MatrixTable.tsx">
                    <option value={1} data-is-mapped="true" data-unique-id="189e290a-2199-43c6-bd42-fe2a6d5284c9" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="92226031-8370-4dc4-8e42-fde7938267fc" data-file-name="components/MatrixTable.tsx">1 - </span>{type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-is-mapped="true" data-unique-id="964213c0-139e-4ac7-973b-56f9d7cb0459" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="01f82229-64fe-40e6-82cd-89da8c2a384c" data-file-name="components/MatrixTable.tsx">2 - </span>{type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-is-mapped="true" data-unique-id="fb51466b-03bd-4b68-a5a8-b938e1f86a24" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2c301622-cfba-4f37-9639-2450ac870d3c" data-file-name="components/MatrixTable.tsx">3 - </span>{type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-is-mapped="true" data-unique-id="f5745778-907b-4d4a-8923-338d28f31ba3" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3f098120-f6d1-4d3c-8da7-098717971401" data-file-name="components/MatrixTable.tsx">4 - </span>{type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-is-mapped="true" data-unique-id="32d119d0-1c73-40e6-9ef4-b8f0a23d45a1" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="c67befbe-f426-4352-a4d3-fcce6602de8f" data-file-name="components/MatrixTable.tsx">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-is-mapped="true" data-unique-id="52c090e7-0ac5-40d1-9d66-28b4a54a864e" data-file-name="components/MatrixTable.tsx">
                    <Trash2 className="w-5 h-5" data-unique-id="eba4fdb8-05a9-4004-88bd-e7238f607568" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          {type === "efe" && <tr className="bg-orange-50" data-unique-id="426d4a53-1e5b-420e-88c2-22a4c31c71c9" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-orange-800 border border-slate-200" data-unique-id="d1371bf1-6ef9-45a4-997b-332079d98815" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="57279601-5272-49bb-9dd0-526966a9d98a" data-file-name="components/MatrixTable.tsx">
                Threats
              </span></td>
            </tr>}
          
          <AnimatePresence>
            {factors.filter(f => f.category === "threat").map((factor, index) => <motion.tr key={factor.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            height: 0
          }} transition={{
            duration: 0.3
          }} className="border-b border-slate-200 hover:bg-slate-50" data-is-mapped="true" data-unique-id="dceea567-252a-44c8-ae9b-78c417c990fc" data-file-name="components/MatrixTable.tsx">
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="8ba44b9f-f2c4-473d-893f-ff1f91da4b35" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="5989e9f6-0078-428e-844c-8b056e1cb889" data-file-name="components/MatrixTable.tsx">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter threat`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="cc504a59-4c56-45f9-b8ec-2f8de2441135" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="69452480-2532-419e-9892-2731a6adf44a" data-file-name="components/MatrixTable.tsx">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="255d48fb-3083-4fb0-a557-c5edfb50ea21" data-file-name="components/MatrixTable.tsx" />
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="cb9ce905-95bb-44a0-9a32-ebd471f423e7" data-file-name="components/MatrixTable.tsx">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-is-mapped="true" data-unique-id="5386ce0c-314a-464c-b2db-7060a6e2049a" data-file-name="components/MatrixTable.tsx">
                    <option value={1} data-is-mapped="true" data-unique-id="5e18513e-cbd1-422a-8f37-c099552a5121" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="422ae65e-c935-4d92-97b1-fb123ae03e83" data-file-name="components/MatrixTable.tsx">1 - </span>{type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-is-mapped="true" data-unique-id="5e2623c3-d888-4668-b851-b5f25ca56f4f" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="786e2e01-68a2-4672-bcea-fc0b21bf203a" data-file-name="components/MatrixTable.tsx">2 - </span>{type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-is-mapped="true" data-unique-id="965fed77-1b46-4faa-89d8-1e70ae8a416f" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c7ea3597-646d-4776-a6ed-91055c3fd213" data-file-name="components/MatrixTable.tsx">3 - </span>{type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-is-mapped="true" data-unique-id="3019f229-58b7-4d55-ae3e-10c6fac4cb1a" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="bca89e4e-e298-4090-aa2e-7fc8f331fdee" data-file-name="components/MatrixTable.tsx">4 - </span>{type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-is-mapped="true" data-unique-id="02174e98-4b17-4e4f-b554-e48be59a8a22" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-is-mapped="true" data-unique-id="e304867e-663f-4c31-93ec-8ed308ba31ca" data-file-name="components/MatrixTable.tsx">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-is-mapped="true" data-unique-id="72269387-1bde-40e7-a3f2-ddaf64045e99" data-file-name="components/MatrixTable.tsx">
                    <Trash2 className="w-5 h-5" data-unique-id="93188c73-6c9c-45b0-bd46-38427daec681" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          <tr className="bg-slate-50" data-unique-id="d5529bb4-8459-4e91-ba2e-6f35a113ad7e" data-file-name="components/MatrixTable.tsx">
            <td colSpan={2} className="p-3 border border-slate-200 font-medium text-right" data-unique-id="e4ceef7d-26b9-4118-9c23-f16e6f330c9a" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="a877b53b-b10e-40aa-8ea6-1bb7c9cd135a" data-file-name="components/MatrixTable.tsx">
              Total
            </span></td>
            <td className={`p-3 border border-slate-200 font-medium ${Math.abs(parseFloat(totalWeight) - 1) > 0.01 ? "text-red-600" : "text-green-600"}`} data-unique-id="d114ea16-d1eb-48ae-a945-4fd3dd4018fb" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
              {totalWeight}
              {Math.abs(parseFloat(totalWeight) - 1) > 0.01 && <span className="block text-xs" data-unique-id="cb876a3d-cfd5-4b67-82e1-c167691f1b71" data-file-name="components/MatrixTable.tsx"><span className="editable-text" data-unique-id="14f85950-e50b-41d0-9d31-5a4b368fa011" data-file-name="components/MatrixTable.tsx">(Should be 1.0)</span></span>}
            </td>
            <td className="p-3 border border-slate-200" data-unique-id="6c4ebc9a-2138-4656-931d-53e2565f8136" data-file-name="components/MatrixTable.tsx"></td>
            <td className="p-3 border border-slate-200 font-bold text-lg" data-unique-id="ef011490-e057-4d7f-9718-39a754b64dcb" data-file-name="components/MatrixTable.tsx" data-dynamic-text="true">
              {totalWeightedScore}
            </td>
            <td className="p-3 border border-slate-200" data-unique-id="e1759e3c-41de-4cd4-8e8b-245d1a836ccf" data-file-name="components/MatrixTable.tsx"></td>
          </tr>
        </tbody>
      </table>
      
      {type === "ife" && <div className="mt-4 flex gap-2" data-unique-id="09cbe30c-d9c7-4fd3-82fe-3373d176fa81" data-file-name="components/MatrixTable.tsx">
          <button onClick={() => addFactor("strength")} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" data-unique-id="9fc57eb8-e67d-40b0-9e3e-2603bf3c1fdd" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" /><span className="editable-text" data-unique-id="b5fab2fe-394a-410a-9138-19c024ccfa87" data-file-name="components/MatrixTable.tsx">
            Add Strength
          </span></button>
          <button onClick={() => addFactor("weakness")} className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" data-unique-id="8f770794-748b-4d64-b0f9-a540e54ecca4" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" /><span className="editable-text" data-unique-id="9d159261-d6f8-458e-a2e4-4ee33f23ef9d" data-file-name="components/MatrixTable.tsx">
            Add Weakness
          </span></button>
        </div>}
      
      {type === "efe" && <div className="mt-4 flex gap-2" data-unique-id="4e56b2c5-adec-4169-b95f-2e70b0274c08" data-file-name="components/MatrixTable.tsx">
          <button onClick={() => addFactor("opportunity")} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" data-unique-id="ee880912-1a16-4745-97ed-1b853057dfb0" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" /><span className="editable-text" data-unique-id="2a9b6b67-3740-4b4c-a9a7-2609ee609ddf" data-file-name="components/MatrixTable.tsx">
            Add Opportunity
          </span></button>
          <button onClick={() => addFactor("threat")} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors" data-unique-id="677ba575-377a-4c1c-988e-fca82e94c08c" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" /><span className="editable-text" data-unique-id="e911d2ad-f1e7-4646-b0d1-511a3c3807e1" data-file-name="components/MatrixTable.tsx">
            Add Threat
          </span></button>
        </div>}
    </div>;
}