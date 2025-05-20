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
  return <div className="overflow-x-auto" data-unique-id="7fffcfd4-8630-4d98-b353-8d190cc37828" data-loc="120:4-120:37" data-file-name="components/MatrixTable.tsx">
      <div className="mb-4" data-unique-id="5d4841f4-af07-4608-a6f7-b9ae6fbc9a84" data-loc="121:6-121:28" data-file-name="components/MatrixTable.tsx">
        <h3 className="text-xl font-semibold text-slate-800" data-unique-id="90d402e5-5d47-4979-957a-13a06938a85e" data-loc="122:8-122:61" data-file-name="components/MatrixTable.tsx">
          {type === "ife" ? "Internal Factor Evaluation" : "External Factor Evaluation"}
        </h3>
        <p className="text-slate-500 mt-1" data-unique-id="1c166621-6bc2-41cb-822e-47be406f032f" data-loc="125:8-125:43" data-file-name="components/MatrixTable.tsx">
          Assign weights (0.0-1.0) and ratings (1-4) to your {type === "ife" ? "internal" : "external"} strategic factors
        </p>
      </div>
      
      {error && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center" data-unique-id="b418cf86-1a73-4ba8-8677-eebe69a04e34" data-loc="131:8-135:9" data-file-name="components/MatrixTable.tsx">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span data-unique-id="fa60c9f2-3719-44d8-a633-bdddc8f335d1" data-loc="137:10-137:16" data-file-name="components/MatrixTable.tsx">{error}</span>
        </motion.div>}
      
      <table className="w-full border-collapse mt-4" data-unique-id="f57d1ca8-f7ca-4aa5-ae3b-21d599d81ce1" data-loc="141:6-141:53" data-file-name="components/MatrixTable.tsx">
        <thead data-unique-id="69e087cf-f781-4fd6-aca9-fe40f6dfb5f3" data-loc="142:8-142:15" data-file-name="components/MatrixTable.tsx">
          <tr className="bg-slate-100" data-unique-id="1e05af25-4fac-4219-a80f-f75c8098ff8f" data-loc="143:10-143:39" data-file-name="components/MatrixTable.tsx">
            <th className="text-left p-3 border border-slate-200 w-10" data-unique-id="2fae8023-2934-48ef-bafb-e34fa6e3540f" data-loc="144:12-144:71" data-file-name="components/MatrixTable.tsx">#</th>
            <th className="text-left p-3 border border-slate-200" data-unique-id="82531d30-435c-4db5-9b41-6586ae2be5d6" data-loc="145:12-145:66" data-file-name="components/MatrixTable.tsx">
              {type === "ife" ? "Internal Factors" : "External Factors"}
            </th>
            <th className="text-left p-3 border border-slate-200 w-24" data-unique-id="13e5d383-3bc7-4a8d-b3cc-88405c0ebac9" data-loc="148:12-148:71" data-file-name="components/MatrixTable.tsx">
              Weight
              <span className="block text-xs text-slate-500 font-normal" data-unique-id="739b2c40-e47d-4aa8-8ba6-4b4b43935058" data-loc="150:14-150:73" data-file-name="components/MatrixTable.tsx">(0.0-1.0)</span>
            </th>
            <th className="text-left p-3 border border-slate-200 w-24" data-unique-id="4baa0ded-b973-495f-b55a-7984cee8a8c2" data-loc="152:12-152:71" data-file-name="components/MatrixTable.tsx">
              Rating
              <span className="block text-xs text-slate-500 font-normal" data-unique-id="0734feee-ca76-46f6-920f-cd439ab7bf0d" data-loc="154:14-154:73" data-file-name="components/MatrixTable.tsx">(1-4)</span>
            </th>
            <th className="text-left p-3 border border-slate-200 w-36" data-unique-id="474fc5a3-a585-463d-8e0e-cd5ce51a2767" data-loc="156:12-156:71" data-file-name="components/MatrixTable.tsx">Weighted Score</th>
            <th className="text-left p-3 border border-slate-200 w-20" data-unique-id="57d46d49-db9d-4168-bc31-0cc7cd7fb441" data-loc="157:12-157:71" data-file-name="components/MatrixTable.tsx">Action</th>
          </tr>
        </thead>
        <tbody data-unique-id="3eb1f749-de4b-4895-8ffb-6c76f6a8a82d" data-loc="160:8-160:15" data-file-name="components/MatrixTable.tsx">
          {type === "ife" && <tr className="bg-green-50" data-unique-id="bf054bfe-1efe-49a2-ba46-94fd116dacc2" data-loc="162:12-162:40" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-green-800 border border-slate-200" data-unique-id="766f8cdc-df60-425b-8d84-3fe413dc1384" data-loc="163:14-163:97" data-file-name="components/MatrixTable.tsx">
                Strengths
              </td>
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
          }} className="border-b border-slate-200 hover:bg-slate-50" data-unique-id="map_6eb00959-4247-42d4-afeb-f77fff0374bf" data-loc="173:14-180:15" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                <td className="p-3 border border-slate-200" data-unique-id="map_fbb2f7ac-79fb-4b83-b828-6542fff92f64" data-loc="181:16-181:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-unique-id="map_4df63380-b91d-4b6a-9899-b26a9d860a3a" data-loc="182:16-182:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter ${type === "ife" ? "internal" : "external"} factor`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_1abfcb0d-e351-474f-ab0a-b44ad9c1005c" data-loc="183:18-189:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_b3fa1fef-67ba-46f0-b474-e34af6547bd0" data-loc="191:16-191:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_4a538fe1-1f15-4d22-9d0d-716eed283896" data-loc="192:18-201:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_30252686-c2f7-48de-b823-cdc698d268af" data-loc="203:16-203:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_5a06acbf-9d18-4b7e-b39d-88090c49a6d7" data-loc="204:18-208:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <option value={1} data-unique-id="map_aee676aa-fec2-4310-a150-98221c91062b" data-loc="209:20-209:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-unique-id="map_df63c975-5202-4f68-814c-30d60760fe9f" data-loc="210:20-210:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-unique-id="map_274f34fe-3769-428f-b9a5-db6f97c8fc01" data-loc="211:20-211:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-unique-id="map_cf37fa12-64a9-49de-995c-a4391c68029f" data-loc="212:20-212:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-unique-id="map_9eb693a8-74e2-4557-a190-1f8a2c510c59" data-loc="215:16-215:72" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_ee37175c-ba55-4384-970e-dafda59abadd" data-loc="218:16-218:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-unique-id="map_0a8da83f-bc58-440d-a4fe-717c68c97a38" data-loc="219:18-223:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          {type === "ife" && <tr className="bg-red-50" data-unique-id="4831acc3-68a9-480f-9f67-d240aa0f2bf3" data-loc="232:12-232:38" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-red-800 border border-slate-200" data-unique-id="8da07138-7c45-40ae-b3aa-2b2f09125d93" data-loc="233:14-233:95" data-file-name="components/MatrixTable.tsx">
                Weaknesses
              </td>
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
          }} className="border-b border-slate-200 hover:bg-slate-50" data-unique-id="map_cc5d2d87-c657-4a77-8baf-b2afb4b0135f" data-loc="243:14-250:15" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                <td className="p-3 border border-slate-200" data-unique-id="map_175e3c1d-5611-4d39-9766-5cc16950b4cb" data-loc="251:16-251:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-unique-id="map_68ca444f-b200-4476-8185-8e7055a5ea64" data-loc="252:16-252:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter weakness`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_9da885a2-0593-49da-8616-f0501c51e5de" data-loc="253:18-259:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_1172755c-9231-4f6b-ba5d-a1beaa96f742" data-loc="261:16-261:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_15de4bd2-1855-491f-bbb3-86ad0294785b" data-loc="262:18-271:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_901330d6-495a-4365-a5c5-cc49b68c3819" data-loc="273:16-273:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_bb867bf5-71cc-4aa5-82fc-ed36126186d0" data-loc="274:18-278:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <option value={1} data-unique-id="map_4061f823-b9c1-44a3-b680-def630ecb561" data-loc="279:20-279:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-unique-id="map_243f91be-b0c1-4c48-9873-c8a3f5506188" data-loc="280:20-280:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-unique-id="map_fc22f863-c016-46ea-84d9-de6682270b43" data-loc="281:20-281:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-unique-id="map_dc7788ff-c93a-4240-95bd-72c073362664" data-loc="282:20-282:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-unique-id="map_8c1685d8-54b5-4c43-b4a5-06f1781635f4" data-loc="285:16-285:72" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_63410376-8078-424e-8546-5c1e889b0650" data-loc="288:16-288:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-unique-id="map_261d303d-1384-4828-ba1c-4abfe33fa83d" data-loc="289:18-293:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          {type === "efe" && <tr className="bg-blue-50" data-unique-id="1676b86d-7898-4323-a2dd-b10ad9144672" data-loc="302:12-302:39" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-blue-800 border border-slate-200" data-unique-id="9f0efbff-ff46-4bce-8a3c-4e70cab7b81a" data-loc="303:14-303:96" data-file-name="components/MatrixTable.tsx">
                Opportunities
              </td>
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
          }} className="border-b border-slate-200 hover:bg-slate-50" data-unique-id="map_d4e5eee1-62e9-4b30-9d9f-7d9f3888f653" data-loc="313:14-320:15" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                <td className="p-3 border border-slate-200" data-unique-id="map_3d10db1b-51ee-4387-b1ff-49e2c006dcb8" data-loc="321:16-321:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-unique-id="map_7fc24b2f-84b7-40ea-a2a4-11dfcca64f37" data-loc="322:16-322:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter opportunity`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_9eb127e6-6814-41c3-aea2-ad711b93ee22" data-loc="323:18-329:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_cc2bbba9-58b3-4030-8851-7e7e21dccc8d" data-loc="331:16-331:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_22732cd6-8c48-4ea0-9188-6c360ac760da" data-loc="332:18-341:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_3f4b8aa2-198c-4251-9ab7-9791b7c4b331" data-loc="343:16-343:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_c3c64fd4-a67b-477d-858d-9275a051c432" data-loc="344:18-348:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <option value={1} data-unique-id="map_11c18f08-a403-4030-8d49-3ee154b537f3" data-loc="349:20-349:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-unique-id="map_5de2cc11-97cd-4bc4-b6a4-35bc95be0992" data-loc="350:20-350:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-unique-id="map_41f14c6d-c892-4c39-bcc2-0d82877855ec" data-loc="351:20-351:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-unique-id="map_ebfec21d-4fae-4142-9513-377482eba3cf" data-loc="352:20-352:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-unique-id="map_e1ed4426-2e78-458f-8b24-3b6765bf104d" data-loc="355:16-355:72" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_366418a1-4bc5-4042-b000-66af929d9a94" data-loc="358:16-358:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-unique-id="map_8f88f5bc-4b3c-4e2c-b94d-bd65c137d89f" data-loc="359:18-363:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          {type === "efe" && <tr className="bg-orange-50" data-unique-id="32d2cd92-0aa4-4adb-8a40-826dfd9a7012" data-loc="372:12-372:41" data-file-name="components/MatrixTable.tsx">
              <td colSpan={6} className="p-2 font-medium text-orange-800 border border-slate-200" data-unique-id="46d3f9d6-790a-44f1-92f3-b02e0f99f3f4" data-loc="373:14-373:98" data-file-name="components/MatrixTable.tsx">
                Threats
              </td>
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
          }} className="border-b border-slate-200 hover:bg-slate-50" data-unique-id="map_af777d33-d934-4ed9-a44c-78c7c87a4e00" data-loc="383:14-390:15" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                <td className="p-3 border border-slate-200" data-unique-id="map_13c39bdb-eed8-4ca9-ba64-2dacae7a7b34" data-loc="391:16-391:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">{index + 1}</td>
                <td className="p-3 border border-slate-200" data-unique-id="map_0b39fc70-7cc4-40b1-872f-a2e7346587c9" data-loc="392:16-392:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="text" value={factor.description} onChange={e => updateFactor(factor.id, "description", e.target.value)} placeholder={`Enter threat`} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_248bdd11-a6dd-4749-8437-a78fdda3925a" data-loc="393:18-399:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_9edfcace-1e05-41b9-8deb-539b8270d3ef" data-loc="401:16-401:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <input type="number" min="0" max="1" step="0.01" value={factor.weight} onChange={e => updateFactor(factor.id, "weight", e.target.value)} onBlur={checkWeightSum} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_0d56fed1-c68c-4328-90cf-78528e03217f" data-loc="402:18-411:20" data-file-name="components/MatrixTable.tsx" data-is-mapped="true" />
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_5f672304-a072-4005-9750-be622803e2b1" data-loc="413:16-413:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <select value={factor.rating} onChange={e => updateFactor(factor.id, "rating", e.target.value)} className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="map_a22c6976-b189-4b09-815d-7782045bd0bd" data-loc="414:18-418:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <option value={1} data-unique-id="map_f05e5df2-0c15-4b59-91d6-3c180a78ca62" data-loc="419:20-419:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">1 - {type === "ife" ? "Major Weakness" : "Poor Response"}</option>
                    <option value={2} data-unique-id="map_c2b9e0db-a592-4a4c-bba4-d9d0c4e55694" data-loc="420:20-420:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">2 - {type === "ife" ? "Minor Weakness" : "Average Response"}</option>
                    <option value={3} data-unique-id="map_8c1aefc6-0053-4b36-a9b4-57f34ceded60" data-loc="421:20-421:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">3 - {type === "ife" ? "Minor Strength" : "Above Average"}</option>
                    <option value={4} data-unique-id="map_7e50a9be-b128-43f6-b51a-b2a1f5c1b3aa" data-loc="422:20-422:38" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">4 - {type === "ife" ? "Major Strength" : "Superior Response"}</option>
                  </select>
                </td>
                <td className="p-3 border border-slate-200 font-medium" data-unique-id="map_56f29804-3958-4b1a-9b32-67cd6302a5ae" data-loc="425:16-425:72" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  {(factor.weight * factor.rating).toFixed(2)}
                </td>
                <td className="p-3 border border-slate-200" data-unique-id="map_7aedcd41-8bdd-4636-81b9-7093e76026fc" data-loc="428:16-428:60" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                  <button onClick={() => deleteFactor(factor.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete factor" data-unique-id="map_eb423a89-a2c1-4a1f-b439-1f95b464b924" data-loc="429:18-433:19" data-file-name="components/MatrixTable.tsx" data-is-mapped="true">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>)}
          </AnimatePresence>
          
          <tr className="bg-slate-50" data-unique-id="21e2de1f-d3fb-466b-bf51-87542c4ee714" data-loc="441:10-441:38" data-file-name="components/MatrixTable.tsx">
            <td colSpan={2} className="p-3 border border-slate-200 font-medium text-right" data-unique-id="25e648c7-2b93-4999-b542-b51ecde3b536" data-loc="442:12-442:91" data-file-name="components/MatrixTable.tsx">
              Total
            </td>
            <td className={`p-3 border border-slate-200 font-medium ${Math.abs(parseFloat(totalWeight) - 1) > 0.01 ? "text-red-600" : "text-green-600"}`} data-unique-id="c793086a-2fda-4797-8ab5-e4c54a8a8200" data-loc="445:12-447:16" data-file-name="components/MatrixTable.tsx">
              {totalWeight}
              {Math.abs(parseFloat(totalWeight) - 1) > 0.01 && <span className="block text-xs" data-unique-id="61d35054-10ef-40c2-b7f9-be7a607f5293" data-loc="450:16-450:48" data-file-name="components/MatrixTable.tsx">(Should be 1.0)</span>}
            </td>
            <td className="p-3 border border-slate-200" data-unique-id="7c38c630-6fc4-4f08-87fb-b055b895b3c6" data-loc="453:12-453:56" data-file-name="components/MatrixTable.tsx"></td>
            <td className="p-3 border border-slate-200 font-bold text-lg" data-unique-id="39c8d43b-0016-43d3-9c1f-13b700f2227d" data-loc="454:12-454:74" data-file-name="components/MatrixTable.tsx">
              {totalWeightedScore}
            </td>
            <td className="p-3 border border-slate-200" data-unique-id="80f9b16d-66ac-4b8e-8546-cb3bee35841e" data-loc="457:12-457:56" data-file-name="components/MatrixTable.tsx"></td>
          </tr>
        </tbody>
      </table>
      
      {type === "ife" && <div className="mt-4 flex gap-2" data-unique-id="5262874d-2ea0-4714-95e1-621dc76c61f4" data-loc="463:8-463:41" data-file-name="components/MatrixTable.tsx">
          <button onClick={() => addFactor("strength")} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" data-unique-id="b8dddb79-8231-42d3-8e63-0ab4eb8854c4" data-loc="464:10-467:11" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" />
            Add Strength
          </button>
          <button onClick={() => addFactor("weakness")} className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" data-unique-id="b6a9ef20-2507-4d58-b5d2-d546247b5543" data-loc="471:10-474:11" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" />
            Add Weakness
          </button>
        </div>}
      
      {type === "efe" && <div className="mt-4 flex gap-2" data-unique-id="95ac11b6-f577-4880-aaf6-4312117837f4" data-loc="482:8-482:41" data-file-name="components/MatrixTable.tsx">
          <button onClick={() => addFactor("opportunity")} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" data-unique-id="51311d35-afd8-4bd6-a288-66f94dc0f9b4" data-loc="483:10-486:11" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" />
            Add Opportunity
          </button>
          <button onClick={() => addFactor("threat")} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors" data-unique-id="887ca125-68eb-40c9-be9f-c0f2362352e9" data-loc="490:10-493:11" data-file-name="components/MatrixTable.tsx">
            <Plus className="w-5 h-5 mr-1" />
            Add Threat
          </button>
        </div>}
    </div>;
}