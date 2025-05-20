"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { MatrixType } from "@/types/matrix";
interface ScoreInterpretationProps {
  score: number;
  type: MatrixType;
}
export default function ScoreInterpretation({
  score,
  type
}: ScoreInterpretationProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  useEffect(() => {
    setChartData([{
      name: type.toUpperCase(),
      score
    }]);
  }, [score, type]);
  let interpretation = "";
  let icon = <HelpCircle className="h-6 w-6" />;
  let color = "text-slate-600";

  // Score interpretation logic
  if (score < 2.0) {
    interpretation = `Weak ${type === "ife" ? "internal" : "external"} position. Strategic improvements are urgently needed.`;
    icon = <AlertTriangle className="h-6 w-6 text-orange-500" />;
    color = "text-orange-500";
  } else if (score < 2.5) {
    interpretation = `Below average ${type === "ife" ? "internal" : "external"} position. There is significant room for improvement.`;
    icon = <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    color = "text-yellow-500";
  } else if (score < 3.0) {
    interpretation = `Average ${type === "ife" ? "internal" : "external"} position. The organization is holding its own but should seek improvements.`;
    icon = <HelpCircle className="h-6 w-6 text-blue-500" />;
    color = "text-blue-500";
  } else if (score < 3.5) {
    interpretation = `Above average ${type === "ife" ? "internal" : "external"} position. The organization is performing well but can still strengthen its position.`;
    icon = <CheckCircle className="h-6 w-6 text-green-400" />;
    color = "text-green-400";
  } else {
    interpretation = `Strong ${type === "ife" ? "internal" : "external"} position. The organization is well-positioned for success.`;
    icon = <CheckCircle className="h-6 w-6 text-green-600" />;
    color = "text-green-600";
  }
  const getBarColor = (score: number) => {
    if (score < 2.0) return "#f97316";
    if (score < 2.5) return "#eab308";
    if (score < 3.0) return "#3b82f6";
    if (score < 3.5) return "#4ade80";
    return "#16a34a";
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="748b6c26-56be-400d-98ea-10c21e7d5f05" data-file-name="components/ScoreInterpretation.tsx">
      <h3 className="text-xl font-semibold text-slate-800 mb-4" data-unique-id="a77fa92d-5f7f-4fbf-9a22-c1ba9382dbc4" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="b73eb5c0-db6f-4dc5-9314-65ef77a60957" data-file-name="components/ScoreInterpretation.tsx">Score Analysis</span></h3>
      
      <div className="flex items-center space-x-2 mb-6" data-unique-id="1640bf52-1041-4518-b596-c86a94ec17d7" data-file-name="components/ScoreInterpretation.tsx">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" data-unique-id="d34e1655-7f39-4600-9093-cc7694a0ea41" data-file-name="components/ScoreInterpretation.tsx">
          <span className="text-xl font-bold" data-unique-id="d177b1ff-d24b-434c-b9eb-96589763decc" data-file-name="components/ScoreInterpretation.tsx" data-dynamic-text="true">{score.toFixed(2)}</span>
        </div>
        <div className="flex-1" data-unique-id="1fe16851-c1c4-415b-95d7-5e081a74fc42" data-file-name="components/ScoreInterpretation.tsx">
          <h4 className={`text-lg font-medium flex items-center gap-2 ${color}`} data-unique-id="27bec937-0a73-43c7-9f77-a36d28f90e09" data-file-name="components/ScoreInterpretation.tsx" data-dynamic-text="true">
            {icon}
            <span data-unique-id="f9f2fa7c-68be-49bb-86ba-a27a48c3e5f9" data-file-name="components/ScoreInterpretation.tsx" data-dynamic-text="true">{type === "ife" ? "Internal Factor" : "External Factor"}<span className="editable-text" data-unique-id="07d7bcb3-a880-4fb7-bd93-9961a2ddc5b6" data-file-name="components/ScoreInterpretation.tsx"> Score</span></span>
          </h4>
          <p className="text-slate-600 mt-1" data-unique-id="c5443f7b-236d-4b7a-88e4-8d12690e00a7" data-file-name="components/ScoreInterpretation.tsx" data-dynamic-text="true">{interpretation}</p>
        </div>
      </div>
      
      <div className="h-52 mt-6" data-unique-id="f0ba41eb-734a-4388-bb9a-78c359ef2424" data-file-name="components/ScoreInterpretation.tsx">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 4]} />
            <Tooltip formatter={value => [`${value} / 4.0`, "Score"]} labelStyle={{
            color: "#1e293b"
          }} contentStyle={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem"
          }} />
            <Bar dataKey="score" maxBarSize={80}>
              {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} data-unique-id="3e266422-70ee-400e-a182-060c6900113a" data-file-name="components/ScoreInterpretation.tsx" data-dynamic-text="true" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 bg-slate-50 p-3 rounded-lg" data-unique-id="2638b817-e9de-4993-aa16-d52617dfc5c8" data-file-name="components/ScoreInterpretation.tsx">
        <div className="text-xs text-slate-500 mb-2" data-unique-id="307cf25b-38bb-457d-9f8a-de7774a6d3fb" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="c84f0e24-2428-49c6-94c3-0c68251ebf54" data-file-name="components/ScoreInterpretation.tsx">Score Range Interpretation:</span></div>
        <div className="grid grid-cols-5 gap-2" data-unique-id="0a2392e5-02d9-43be-96ab-be2cfa7651d9" data-file-name="components/ScoreInterpretation.tsx">
          <div className="flex flex-col items-center" data-unique-id="65a3a01f-b935-444c-96ba-2459c116997a" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-orange-500 rounded-full" data-unique-id="796c7172-87ed-473b-bdb0-92c01dff6e64" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="168a93ee-4990-42c5-8a1f-8d93fa1e68ae" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="7db162c3-cb40-4131-a22f-a02f08efb4d7" data-file-name="components/ScoreInterpretation.tsx">1.0-1.99</span><br data-unique-id="84389552-d0ae-439b-bc57-fc37038fc68a" data-file-name="components/ScoreInterpretation.tsx" /><span className="editable-text" data-unique-id="109d8793-7228-4082-9277-4f132fa192e0" data-file-name="components/ScoreInterpretation.tsx">Weak</span></div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="1c7a0477-4c78-435c-8d8a-03919dcaeab3" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-yellow-500 rounded-full" data-unique-id="0eefd150-121c-42c8-a6c8-d0b08e373b78" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="c18caeb0-7c77-46aa-9e0f-97d49248c206" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="0282ec1a-7b8d-4e03-91f9-8b2748a7832f" data-file-name="components/ScoreInterpretation.tsx">2.0-2.49</span><br data-unique-id="8cf43a21-ef35-4f62-9721-467b88170e58" data-file-name="components/ScoreInterpretation.tsx" /><span className="editable-text" data-unique-id="5ac1d80d-41e2-4bb3-8d5a-0ca9f1b65411" data-file-name="components/ScoreInterpretation.tsx">Below Avg.</span></div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="87d591df-4246-476f-99af-f6cbe76a21b9" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-blue-500 rounded-full" data-unique-id="77322ed8-9f1f-4412-8b17-a9518044828f" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="0b9edd21-1cb0-4bc8-8f1b-394acdec110c" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="55acf52b-f3a3-4d74-868a-003a2aee9535" data-file-name="components/ScoreInterpretation.tsx">2.5-2.99</span><br data-unique-id="ca474ae9-7ef7-4c24-b1fd-b404e867ff92" data-file-name="components/ScoreInterpretation.tsx" /><span className="editable-text" data-unique-id="185e94cd-56e0-466e-b848-262aba569408" data-file-name="components/ScoreInterpretation.tsx">Average</span></div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="83569653-4922-446a-8317-ff047b7c3f59" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-green-400 rounded-full" data-unique-id="0e348618-347b-4e4c-88b3-97647cc7e56b" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="e36e97fe-26fa-493a-88cc-221b07815222" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="1599b7ad-8cd8-4dba-81c3-c99ebbab4208" data-file-name="components/ScoreInterpretation.tsx">3.0-3.49</span><br data-unique-id="7d5c7503-5d10-407b-bf07-04b96f865155" data-file-name="components/ScoreInterpretation.tsx" /><span className="editable-text" data-unique-id="4e8343cb-5c94-41fd-8b34-eceb5865da45" data-file-name="components/ScoreInterpretation.tsx">Above Avg.</span></div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="dfbb4851-fddc-4bae-819e-abb15971fb86" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-green-600 rounded-full" data-unique-id="fe406f78-39bb-406f-984c-730a2fba7d5b" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="e1296cdd-9677-4311-adad-09f345ba09fb" data-file-name="components/ScoreInterpretation.tsx"><span className="editable-text" data-unique-id="c09aed1c-4fbd-4a19-bd61-3ca01f62ea4c" data-file-name="components/ScoreInterpretation.tsx">3.5-4.0</span><br data-unique-id="b97a12a1-2b5d-49c0-828b-bd69d1cefbdc" data-file-name="components/ScoreInterpretation.tsx" /><span className="editable-text" data-unique-id="5251557b-c4e1-4e1d-a379-83ef7bc559f9" data-file-name="components/ScoreInterpretation.tsx">Strong</span></div>
          </div>
        </div>
      </div>
    </motion.div>;
}