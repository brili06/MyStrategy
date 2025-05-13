"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Rectangle,
  ZAxis
} from "recharts";
import { Info } from "lucide-react";

interface IEMatrixProps {
  ifeScore: number;
  efeScore: number;
}

interface MatrixCell {
  id: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  strategy: string;
  color: string;
  description: string;
}

export default function IEMatrix({ ifeScore, efeScore }: IEMatrixProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [currentCell, setCurrentCell] = useState<MatrixCell | null>(null);
  
  // Define the matrix cells
  const matrixCells: MatrixCell[] = [
    // Row 1 (High EFE 3.0-4.0)
    { 
      id: "I", 
      x1: 3, x2: 4, 
      y1: 3, y2: 4, 
      strategy: "Grow and Build", 
      color: "#4ade80", 
      description: "Intensive strategies (market penetration, market development, product development) or integrative strategies (backward, forward, horizontal integration)"
    },
    { 
      id: "II", 
      x1: 2, x2: 3, 
      y1: 3, y2: 4, 
      strategy: "Grow and Build", 
      color: "#4ade80", 
      description: "Intensive strategies (market penetration, market development, product development) or integrative strategies (backward, forward, horizontal integration)"
    },
    { 
      id: "III", 
      x1: 1, x2: 2, 
      y1: 3, y2: 4, 
      strategy: "Harvest or Exit", 
      color: "#f87171", 
      description: "Defensive strategies (retrenchment, divestiture, liquidation)"
    },
    
    // Row 2 (Medium EFE 2.0-2.99)
    { 
      id: "IV", 
      x1: 3, x2: 4, 
      y1: 2, y2: 3, 
      strategy: "Grow and Build", 
      color: "#4ade80", 
      description: "Intensive strategies (market penetration, market development, product development) or integrative strategies (backward, forward, horizontal integration)"
    },
    { 
      id: "V", 
      x1: 2, x2: 3, 
      y1: 2, y2: 3, 
      strategy: "Hold and Maintain", 
      color: "#fbbf24", 
      description: "Market penetration and product development strategies"
    },
    { 
      id: "VI", 
      x1: 1, x2: 2, 
      y1: 2, y2: 3, 
      strategy: "Harvest or Exit", 
      color: "#f87171", 
      description: "Defensive strategies (retrenchment, divestiture, liquidation)"
    },
    
    // Row 3 (Low EFE 1.0-1.99)
    { 
      id: "VII", 
      x1: 3, x2: 4, 
      y1: 1, y2: 2, 
      strategy: "Harvest or Exit", 
      color: "#f87171", 
      description: "Defensive strategies (retrenchment, divestiture, liquidation)"
    },
    { 
      id: "VIII", 
      x1: 2, x2: 3, 
      y1: 1, y2: 2, 
      strategy: "Harvest or Exit", 
      color: "#f87171", 
      description: "Defensive strategies (retrenchment, divestiture, liquidation)"
    },
    { 
      id: "IX", 
      x1: 1, x2: 2, 
      y1: 1, y2: 2, 
      strategy: "Harvest or Exit", 
      color: "#f87171", 
      description: "Defensive strategies (retrenchment, divestiture, liquidation)"
    },
  ];
  
  // Find the current cell based on IFE and EFE scores
  useEffect(() => {
    const cell = matrixCells.find(cell => 
      ifeScore >= cell.x1 && ifeScore <= cell.x2 && 
      efeScore >= cell.y1 && efeScore <= cell.y2
    );
    
    setCurrentCell(cell || null);
  }, [ifeScore, efeScore]);
  
  // Custom tooltip for the scatter point
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-200">
          <p className="font-medium">Company Position</p>
          <p className="text-sm">IFE Score: {payload[0].payload.x.toFixed(2)}</p>
          <p className="text-sm">EFE Score: {payload[0].payload.y.toFixed(2)}</p>
          {currentCell && (
            <p className="text-sm mt-1">Cell: {currentCell.id} ({currentCell.strategy})</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Custom cell tooltip
  const CellTooltip = ({ cell }: { cell: MatrixCell }) => (
    <div className="absolute z-10 bg-white p-3 shadow-lg rounded-lg border border-slate-200 max-w-xs">
      <p className="font-medium">Cell {cell.id}: {cell.strategy}</p>
      <p className="text-sm mt-1">{cell.description}</p>
    </div>
  );
  
  // Get the strategy recommendation based on the current cell
  const getStrategyRecommendation = () => {
    if (!currentCell) return null;
    
    switch (currentCell.strategy) {
      case "Grow and Build":
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-green-800">Recommended Strategy: Grow and Build</h4>
            <p className="text-sm text-green-700 mt-1">
              Focus on intensive strategies like market penetration, market development, and product development.
              Consider integrative strategies such as backward, forward, or horizontal integration.
            </p>
            <div className="mt-3 p-3 bg-green-100 rounded-md">
              <p className="text-sm font-medium text-green-800">SWOT Strategy Focus:</p>
              <ul className="mt-1 text-sm text-green-700 list-disc pl-5 space-y-1">
                <li>Prioritize SO strategies that leverage strengths to capitalize on opportunities</li>
                <li>Consider WO strategies to improve weaknesses by taking advantage of opportunities</li>
                <li>Invest in growth-oriented initiatives and expansion</li>
              </ul>
            </div>
          </div>
        );
      case "Hold and Maintain":
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-amber-800">Recommended Strategy: Hold and Maintain</h4>
            <p className="text-sm text-amber-700 mt-1">
              Focus on market penetration and product development strategies.
              These are two commonly employed strategies for this position.
            </p>
            <div className="mt-3 p-3 bg-amber-100 rounded-md">
              <p className="text-sm font-medium text-amber-800">SWOT Strategy Focus:</p>
              <ul className="mt-1 text-sm text-amber-700 list-disc pl-5 space-y-1">
                <li>Balance SO strategies to maintain market position</li>
                <li>Implement ST strategies to protect against external threats</li>
                <li>Focus on operational efficiency and incremental improvements</li>
              </ul>
            </div>
          </div>
        );
      case "Harvest or Exit":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-red-800">Recommended Strategy: Harvest or Exit</h4>
            <p className="text-sm text-red-700 mt-1">
              Don't expand; consider divesting, retrenching, or diversifying.
              If costs for rejuvenating the business are low, attempt to revitalize the business.
              Consider forming joint ventures to improve weaknesses.
            </p>
            <div className="mt-3 p-3 bg-red-100 rounded-md">
              <p className="text-sm font-medium text-red-800">SWOT Strategy Focus:</p>
              <ul className="mt-1 text-sm text-red-700 list-disc pl-5 space-y-1">
                <li>Prioritize ST strategies to use strengths to minimize threats</li>
                <li>Implement WT strategies to minimize weaknesses and avoid threats</li>
                <li>Consider defensive approaches or strategic exit options</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Custom shape for the matrix cells
  const Cell = (props: any) => {
    const { x, y, width, height, cell } = props;
    
    return (
      <g>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={cell.color}
          fillOpacity={0.3}
          stroke="#666"
          onMouseEnter={() => setShowTooltip(cell.id)}
          onMouseLeave={() => setShowTooltip(null)}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#333"
          fontSize={14}
          fontWeight={500}
        >
          {cell.id}
        </text>
      </g>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-5"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-2">IE Matrix Analysis</h3>
      <p className="text-slate-500 mb-6">Internal-External Matrix based on IFE and EFE scores</p>
      
      <div className="relative h-[400px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="IFE Score" 
              domain={[1, 4]} 
              label={{ value: 'IFE Score', position: 'bottom', offset: 0 }}
              ticks={[1, 2, 3, 4]}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="EFE Score" 
              domain={[1, 4]} 
              label={{ value: 'EFE Score', angle: -90, position: 'left' }}
              ticks={[1, 2, 3, 4]}
            />
            <ZAxis range={[100]} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Dividing lines */}
            <ReferenceLine x={2} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine x={3} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine y={2} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine y={3} stroke="#666" strokeDasharray="3 3" />
            
            {/* Matrix cells */}
            {matrixCells.map((cell) => (
              <Rectangle
                key={cell.id}
                x={(cell.x1 - 1) * 100}
                y={(4 - cell.y2) * 100}
                width={100}
                height={100}
                fill={cell.color}
                fillOpacity={0.3}
                stroke="#666"
              />
            ))}
            
            {/* Cell labels */}
            {matrixCells.map((cell) => (
              <g key={`label-${cell.id}`}>
                <text
                  x={(cell.x1 + cell.x2) / 2 * 100 - 50}
                  y={(8 - cell.y1 - cell.y2) / 2 * 100 - 50}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#333"
                  fontSize={14}
                  fontWeight={500}
                >
                  {cell.id}
                </text>
              </g>
            ))}
            
            {/* Company position */}
            <Scatter
              name="Company Position"
              data={[{ x: ifeScore, y: efeScore }]}
              fill="#3b82f6"
              shape="circle"
              line={{ stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Cell tooltips */}
        {showTooltip && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
            <CellTooltip cell={matrixCells.find(cell => cell.id === showTooltip)!} />
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-slate-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-800">Current Position</h4>
            <p className="text-slate-600 mt-1">
              Based on your IFE score of <span className="font-medium">{ifeScore.toFixed(2)}</span> and 
              EFE score of <span className="font-medium">{efeScore.toFixed(2)}</span>, your organization 
              is positioned in <span className="font-medium">Cell {currentCell?.id || '?'}</span>.
            </p>
            
            {getStrategyRecommendation()}
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center">
          <div className="w-full h-3 bg-green-400 rounded-full opacity-30"></div>
          <div className="text-xs mt-1 text-center">Grow and Build<br/>(I, II, IV)</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-3 bg-amber-400 rounded-full opacity-30"></div>
          <div className="text-xs mt-1 text-center">Hold and Maintain<br/>(III, V, VII)</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-3 bg-red-400 rounded-full opacity-30"></div>
          <div className="text-xs mt-1 text-center">Harvest or Exit<br/>(VI, VIII, IX)</div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-slate-500">
        <p><strong>IFE Axis (X):</strong> 1.0–1.99 = Weak, 2.0–2.99 = Average, 3.0–4.0 = Strong</p>
        <p><strong>EFE Axis (Y):</strong> 1.0–1.99 = Low, 2.0–2.99 = Medium, 3.0–4.0 = High</p>
      </div>
    </motion.div>
  );
}
