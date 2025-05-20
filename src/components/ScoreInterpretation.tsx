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
  }} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="c6119123-6b3f-4b66-97ef-dc7ee4c3f2cd" data-loc="57:4-62:5" data-file-name="components/ScoreInterpretation.tsx">
      <h3 className="text-xl font-semibold text-slate-800 mb-4" data-unique-id="dcbb4096-5c75-4c90-9b71-f2340fe7c2e5" data-loc="63:6-63:64" data-file-name="components/ScoreInterpretation.tsx">Score Analysis</h3>
      
      <div className="flex items-center space-x-2 mb-6" data-unique-id="57f01b92-faad-4982-a623-81e6fe2a2d10" data-loc="65:6-65:56" data-file-name="components/ScoreInterpretation.tsx">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" data-unique-id="efb5b040-a01a-4ab6-a497-824e42112408" data-loc="66:8-66:94" data-file-name="components/ScoreInterpretation.tsx">
          <span className="text-xl font-bold" data-unique-id="1ee24e11-0b23-4d20-940e-273536602568" data-loc="67:10-67:46" data-file-name="components/ScoreInterpretation.tsx">{score.toFixed(2)}</span>
        </div>
        <div className="flex-1" data-unique-id="72b6c1ef-176a-4b95-851d-5ba5d1cb9d36" data-loc="69:8-69:32" data-file-name="components/ScoreInterpretation.tsx">
          <h4 className={`text-lg font-medium flex items-center gap-2 ${color}`} data-unique-id="9e7e648b-4257-4613-9279-82e2161362d9" data-loc="70:10-70:81" data-file-name="components/ScoreInterpretation.tsx">
            {icon}
            <span data-unique-id="70a8f116-9e61-44f7-9aec-c6509dc749af" data-loc="72:12-72:18" data-file-name="components/ScoreInterpretation.tsx">{type === "ife" ? "Internal Factor" : "External Factor"} Score</span>
          </h4>
          <p className="text-slate-600 mt-1" data-unique-id="c73f9aa9-fe50-4c73-a003-09d155d5ed7a" data-loc="74:10-74:45" data-file-name="components/ScoreInterpretation.tsx">{interpretation}</p>
        </div>
      </div>
      
      <div className="h-52 mt-6" data-unique-id="f00f4391-66ad-4d57-9def-bd1e71432d0c" data-loc="78:6-78:33" data-file-name="components/ScoreInterpretation.tsx">
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
              {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 bg-slate-50 p-3 rounded-lg" data-unique-id="6ddc4e8d-fba1-487f-bef0-6a88c7c9d6f6" data-loc="106:6-106:55" data-file-name="components/ScoreInterpretation.tsx">
        <div className="text-xs text-slate-500 mb-2" data-unique-id="b23043e8-73ec-480d-bf15-7292a8675959" data-loc="107:8-107:53" data-file-name="components/ScoreInterpretation.tsx">Score Range Interpretation:</div>
        <div className="grid grid-cols-5 gap-2" data-unique-id="044166db-05c2-4dab-9d30-4e8f10c86bce" data-loc="108:8-108:48" data-file-name="components/ScoreInterpretation.tsx">
          <div className="flex flex-col items-center" data-unique-id="9678f40e-c948-4756-b52d-63c2027ac4ef" data-loc="109:10-109:54" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-orange-500 rounded-full" data-unique-id="92d84bd1-ccb8-4389-81c8-b10c5dde5348" data-loc="110:12-110:67" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="601151c1-2427-4086-ba6d-a7c9422d01d2" data-loc="111:12-111:54" data-file-name="components/ScoreInterpretation.tsx">1.0-1.99<br data-unique-id="d0b991b3-1bc0-420d-a5c3-7c58f38cd8de" data-loc="111:62-111:67" data-file-name="components/ScoreInterpretation.tsx" />Weak</div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="60497f43-c322-4399-ae83-d002ba142697" data-loc="113:10-113:54" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-yellow-500 rounded-full" data-unique-id="1cfb78c0-042f-4d0f-972b-ee9569cd20a0" data-loc="114:12-114:67" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="0e1c6f55-b0b3-44b2-88f1-632097cedc23" data-loc="115:12-115:54" data-file-name="components/ScoreInterpretation.tsx">2.0-2.49<br data-unique-id="60c97c9a-2826-42c8-85c7-4e5b8fae980b" data-loc="115:62-115:67" data-file-name="components/ScoreInterpretation.tsx" />Below Avg.</div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="e79d9a9f-1395-4401-a2b1-212dcd95a738" data-loc="117:10-117:54" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-blue-500 rounded-full" data-unique-id="0a532a7f-20f0-4b51-93b5-4641cd3e08fa" data-loc="118:12-118:65" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="a2d7f1c8-f355-45eb-91d1-1b35475a1470" data-loc="119:12-119:54" data-file-name="components/ScoreInterpretation.tsx">2.5-2.99<br data-unique-id="ed2cf47e-ff9d-48d7-83d1-6ed94b44db01" data-loc="119:62-119:67" data-file-name="components/ScoreInterpretation.tsx" />Average</div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="7fd4b4a8-2065-497b-99b6-78dc62cd6d23" data-loc="121:10-121:54" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-green-400 rounded-full" data-unique-id="e17b1101-9dfb-495d-b35a-f439cc6fac48" data-loc="122:12-122:66" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="e3be97b6-0f9e-44e6-a73a-f4dc25387117" data-loc="123:12-123:54" data-file-name="components/ScoreInterpretation.tsx">3.0-3.49<br data-unique-id="c426ea49-9178-4c09-b9be-2e026287c77d" data-loc="123:62-123:67" data-file-name="components/ScoreInterpretation.tsx" />Above Avg.</div>
          </div>
          <div className="flex flex-col items-center" data-unique-id="25e2363b-99ca-4ce8-9996-5960a051cdad" data-loc="125:10-125:54" data-file-name="components/ScoreInterpretation.tsx">
            <div className="w-full h-2 bg-green-600 rounded-full" data-unique-id="7430363d-bafa-4cda-909c-936ed4ea6f8b" data-loc="126:12-126:66" data-file-name="components/ScoreInterpretation.tsx"></div>
            <div className="text-xs mt-1 text-center" data-unique-id="d154228e-e0fc-48ce-9073-e1959ae02455" data-loc="127:12-127:54" data-file-name="components/ScoreInterpretation.tsx">3.5-4.0<br data-unique-id="59351778-8347-4d8f-acb4-684e0855f05b" data-loc="127:61-127:66" data-file-name="components/ScoreInterpretation.tsx" />Strong</div>
          </div>
        </div>
      </div>
    </motion.div>;
}