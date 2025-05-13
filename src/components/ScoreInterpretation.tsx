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

export default function ScoreInterpretation({ score, type }: ScoreInterpretationProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    setChartData([{ name: type.toUpperCase(), score }]);
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-5"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Score Analysis</h3>
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <span className="text-xl font-bold">{score.toFixed(2)}</span>
        </div>
        <div className="flex-1">
          <h4 className={`text-lg font-medium flex items-center gap-2 ${color}`}>
            {icon}
            <span>{type === "ife" ? "Internal Factor" : "External Factor"} Score</span>
          </h4>
          <p className="text-slate-600 mt-1">{interpretation}</p>
        </div>
      </div>
      
      <div className="h-52 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 4]} />
            <Tooltip 
              formatter={(value) => [`${value} / 4.0`, "Score"]}
              labelStyle={{ color: "#1e293b" }}
              contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}
            />
            <Bar dataKey="score" maxBarSize={80}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 bg-slate-50 p-3 rounded-lg">
        <div className="text-xs text-slate-500 mb-2">Score Range Interpretation:</div>
        <div className="grid grid-cols-5 gap-2">
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-orange-500 rounded-full"></div>
            <div className="text-xs mt-1 text-center">1.0-1.99<br/>Weak</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-yellow-500 rounded-full"></div>
            <div className="text-xs mt-1 text-center">2.0-2.49<br/>Below Avg.</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-blue-500 rounded-full"></div>
            <div className="text-xs mt-1 text-center">2.5-2.99<br/>Average</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-green-400 rounded-full"></div>
            <div className="text-xs mt-1 text-center">3.0-3.49<br/>Above Avg.</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-2 bg-green-600 rounded-full"></div>
            <div className="text-xs mt-1 text-center">3.5-4.0<br/>Strong</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
