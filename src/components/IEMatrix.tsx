"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Rectangle, ZAxis } from "recharts";
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
export default function IEMatrix({
  ifeScore,
  efeScore
}: IEMatrixProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [currentCell, setCurrentCell] = useState<MatrixCell | null>(null);

  // Define the matrix cells
  const matrixCells: MatrixCell[] = [
  // Row 1 (High EFE 3.0-4.0)
  {
    id: "I",
    x1: 3,
    x2: 4,
    y1: 3,
    y2: 4,
    strategy: "Grow and Build",
    color: "#4ade80",
    description: "Intensive strategies (market penetration, market development, product development) or integrative strategies (backward, forward, horizontal integration)"
  }, {
    id: "II",
    x1: 2,
    x2: 3,
    y1: 3,
    y2: 4,
    strategy: "Grow and Build",
    color: "#4ade80",
    description: "Intensive strategies (market penetration, market development, product development) or integrative strategies (backward, forward, horizontal integration)"
  }, {
    id: "III",
    x1: 1,
    x2: 2,
    y1: 3,
    y2: 4,
    strategy: "Harvest or Exit",
    color: "#f87171",
    description: "Defensive strategies (retrenchment, divestiture, liquidation)"
  },
  // Row 2 (Medium EFE 2.0-2.99)
  {
    id: "IV",
    x1: 3,
    x2: 4,
    y1: 2,
    y2: 3,
    strategy: "Grow and Build",
    color: "#4ade80",
    description: "Intensive strategies (market penetration, market development, product development) or integrative strategies (backward, forward, horizontal integration)"
  }, {
    id: "V",
    x1: 2,
    x2: 3,
    y1: 2,
    y2: 3,
    strategy: "Hold and Maintain",
    color: "#fbbf24",
    description: "Market penetration and product development strategies"
  }, {
    id: "VI",
    x1: 1,
    x2: 2,
    y1: 2,
    y2: 3,
    strategy: "Harvest or Exit",
    color: "#f87171",
    description: "Defensive strategies (retrenchment, divestiture, liquidation)"
  },
  // Row 3 (Low EFE 1.0-1.99)
  {
    id: "VII",
    x1: 3,
    x2: 4,
    y1: 1,
    y2: 2,
    strategy: "Harvest or Exit",
    color: "#f87171",
    description: "Defensive strategies (retrenchment, divestiture, liquidation)"
  }, {
    id: "VIII",
    x1: 2,
    x2: 3,
    y1: 1,
    y2: 2,
    strategy: "Harvest or Exit",
    color: "#f87171",
    description: "Defensive strategies (retrenchment, divestiture, liquidation)"
  }, {
    id: "IX",
    x1: 1,
    x2: 2,
    y1: 1,
    y2: 2,
    strategy: "Harvest or Exit",
    color: "#f87171",
    description: "Defensive strategies (retrenchment, divestiture, liquidation)"
  }];

  // Find the current cell based on IFE and EFE scores
  useEffect(() => {
    const cell = matrixCells.find(cell => ifeScore >= cell.x1 && ifeScore <= cell.x2 && efeScore >= cell.y1 && efeScore <= cell.y2);
    setCurrentCell(cell || null);
  }, [ifeScore, efeScore]);

  // Custom tooltip for the scatter point
  const CustomTooltip = ({
    active,
    payload
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-200" data-unique-id="3b1e053e-f8be-4929-a88c-98e0d0726c2c" data-loc="134:8-134:83" data-file-name="components/IEMatrix.tsx">
          <p className="font-medium" data-unique-id="d696d5d1-7131-4d22-a0a9-967c77c9024e" data-loc="135:10-135:37" data-file-name="components/IEMatrix.tsx">Company Position</p>
          <p className="text-sm" data-unique-id="29b8d809-f8b8-4689-89c2-d1a3bbd2a460" data-loc="136:10-136:33" data-file-name="components/IEMatrix.tsx">IFE Score: {payload[0].payload.x.toFixed(2)}</p>
          <p className="text-sm" data-unique-id="8f54828b-5467-4908-881a-16f0c8cd039c" data-loc="137:10-137:33" data-file-name="components/IEMatrix.tsx">EFE Score: {payload[0].payload.y.toFixed(2)}</p>
          {currentCell && <p className="text-sm mt-1" data-unique-id="c38b36c4-bcff-4d2b-ad1f-9849a7cc2cc0" data-loc="139:12-139:40" data-file-name="components/IEMatrix.tsx">Cell: {currentCell.id} ({currentCell.strategy})</p>}
        </div>;
    }
    return null;
  };

  // Custom cell tooltip
  const CellTooltip = ({
    cell
  }: {
    cell: MatrixCell;
  }) => <div className="absolute z-10 bg-white p-3 shadow-lg rounded-lg border border-slate-200 max-w-xs" data-unique-id="bbc9599d-20f2-4b3d-b15b-33575046ecfe" data-loc="149:4-149:102" data-file-name="components/IEMatrix.tsx">
      <p className="font-medium" data-unique-id="dd9edebd-af2d-4773-bba2-a3b04208eed6" data-loc="150:6-150:33" data-file-name="components/IEMatrix.tsx">Cell {cell.id}: {cell.strategy}</p>
      <p className="text-sm mt-1" data-unique-id="213dd06e-7184-4920-b9ad-eeb3f1eb8456" data-loc="151:6-151:34" data-file-name="components/IEMatrix.tsx">{cell.description}</p>
    </div>;

  // Get the strategy recommendation based on the current cell
  const getStrategyRecommendation = () => {
    if (!currentCell) return null;
    switch (currentCell.strategy) {
      case "Grow and Build":
        return <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4" data-unique-id="0f3150df-4946-4917-af76-2d35fc4d237f" data-loc="162:10-162:83" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-green-800" data-unique-id="66c8f0d7-164e-4e48-80de-8200f7d07dcd" data-loc="163:12-163:55" data-file-name="components/IEMatrix.tsx">Recommended Strategy: Grow and Build</h4>
            <p className="text-sm text-green-700 mt-1" data-unique-id="c8c4a539-3c5e-4eb0-88c2-40749ad8becb" data-loc="164:12-164:55" data-file-name="components/IEMatrix.tsx">
              Focus on intensive strategies like market penetration, market development, and product development.
              Consider integrative strategies such as backward, forward, or horizontal integration.
            </p>
            <div className="mt-3 p-3 bg-green-100 rounded-md" data-unique-id="cd9d36b2-15bb-4eab-8a06-00e19b86270c" data-loc="168:12-168:62" data-file-name="components/IEMatrix.tsx">
              <p className="text-sm font-medium text-green-800" data-unique-id="bab5d684-9e13-4845-9cf9-250a227e77d1" data-loc="169:14-169:64" data-file-name="components/IEMatrix.tsx">SWOT Strategy Focus:</p>
              <ul className="mt-1 text-sm text-green-700 list-disc pl-5 space-y-1" data-unique-id="1f85fc4b-3f12-43f4-a240-326cd13b4ca2" data-loc="170:14-170:83" data-file-name="components/IEMatrix.tsx">
                <li data-unique-id="e1778a35-3f96-457d-a7aa-105b260b5c03" data-loc="171:16-171:20" data-file-name="components/IEMatrix.tsx">Prioritize SO strategies that leverage strengths to capitalize on opportunities</li>
                <li data-unique-id="13484e25-bc2f-4a6f-898f-be6f70e051ce" data-loc="172:16-172:20" data-file-name="components/IEMatrix.tsx">Consider WO strategies to improve weaknesses by taking advantage of opportunities</li>
                <li data-unique-id="8e174f2d-9851-41cf-a343-29a7c9c72087" data-loc="173:16-173:20" data-file-name="components/IEMatrix.tsx">Invest in growth-oriented initiatives and expansion</li>
              </ul>
            </div>
          </div>;
      case "Hold and Maintain":
        return <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4" data-unique-id="bf3b4c41-456b-4d69-92df-b86b1762c74d" data-loc="180:10-180:83" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-amber-800" data-unique-id="f36c6504-1ea4-4258-9bf8-b1bc26d51257" data-loc="181:12-181:55" data-file-name="components/IEMatrix.tsx">Recommended Strategy: Hold and Maintain</h4>
            <p className="text-sm text-amber-700 mt-1" data-unique-id="a64f9821-63e4-40ba-bee3-fedcb1f13fc1" data-loc="182:12-182:55" data-file-name="components/IEMatrix.tsx">
              Focus on market penetration and product development strategies.
              These are two commonly employed strategies for this position.
            </p>
            <div className="mt-3 p-3 bg-amber-100 rounded-md" data-unique-id="59d256c0-41d9-4d54-968b-b873ea8cd0da" data-loc="186:12-186:62" data-file-name="components/IEMatrix.tsx">
              <p className="text-sm font-medium text-amber-800" data-unique-id="9a3b4ebe-c630-489d-8d61-9ea8afa22a2e" data-loc="187:14-187:64" data-file-name="components/IEMatrix.tsx">SWOT Strategy Focus:</p>
              <ul className="mt-1 text-sm text-amber-700 list-disc pl-5 space-y-1" data-unique-id="cdca38c8-9e3b-46c7-89a3-54051952434a" data-loc="188:14-188:83" data-file-name="components/IEMatrix.tsx">
                <li data-unique-id="5547989b-76d8-4b03-9556-7a8b050b2b2d" data-loc="189:16-189:20" data-file-name="components/IEMatrix.tsx">Balance SO strategies to maintain market position</li>
                <li data-unique-id="f9f9dd06-f38c-451a-8714-d4c27d62f5ae" data-loc="190:16-190:20" data-file-name="components/IEMatrix.tsx">Implement ST strategies to protect against external threats</li>
                <li data-unique-id="fccfe073-2aac-4e74-9843-b3ecc58c96bc" data-loc="191:16-191:20" data-file-name="components/IEMatrix.tsx">Focus on operational efficiency and incremental improvements</li>
              </ul>
            </div>
          </div>;
      case "Harvest or Exit":
        return <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4" data-unique-id="fd7f08dd-9017-414a-9ef9-f64f0ef3002c" data-loc="198:10-198:79" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-red-800" data-unique-id="290ea365-0b98-4630-8f6a-ae30fa5efdd7" data-loc="199:12-199:53" data-file-name="components/IEMatrix.tsx">Recommended Strategy: Harvest or Exit</h4>
            <p className="text-sm text-red-700 mt-1" data-unique-id="7d10a4c2-ddce-4d21-9862-cc76fbdf700a" data-loc="200:12-200:53" data-file-name="components/IEMatrix.tsx">
              Don't expand; consider divesting, retrenching, or diversifying.
              If costs for rejuvenating the business are low, attempt to revitalize the business.
              Consider forming joint ventures to improve weaknesses.
            </p>
            <div className="mt-3 p-3 bg-red-100 rounded-md" data-unique-id="11a41509-bdd6-4849-8415-913ce5ba1d56" data-loc="205:12-205:60" data-file-name="components/IEMatrix.tsx">
              <p className="text-sm font-medium text-red-800" data-unique-id="33691405-9d72-4ae3-a9cd-d0e9ba4edc99" data-loc="206:14-206:62" data-file-name="components/IEMatrix.tsx">SWOT Strategy Focus:</p>
              <ul className="mt-1 text-sm text-red-700 list-disc pl-5 space-y-1" data-unique-id="3cf056ff-7f1e-4037-ae5e-5c920095c9fe" data-loc="207:14-207:81" data-file-name="components/IEMatrix.tsx">
                <li data-unique-id="15e72bf6-2289-4216-93fb-89b376d85c8e" data-loc="208:16-208:20" data-file-name="components/IEMatrix.tsx">Prioritize ST strategies to use strengths to minimize threats</li>
                <li data-unique-id="04f80744-147b-4365-ae48-98752f42eda2" data-loc="209:16-209:20" data-file-name="components/IEMatrix.tsx">Implement WT strategies to minimize weaknesses and avoid threats</li>
                <li data-unique-id="4d76d254-25c5-4ecb-91ea-14d513dbe875" data-loc="210:16-210:20" data-file-name="components/IEMatrix.tsx">Consider defensive approaches or strategic exit options</li>
              </ul>
            </div>
          </div>;
      default:
        return null;
    }
  };

  // Custom shape for the matrix cells
  const Cell = (props: any) => {
    const {
      x,
      y,
      width,
      height,
      cell
    } = props;
    return <g>
        <Rectangle x={x} y={y} width={width} height={height} fill={cell.color} fillOpacity={0.3} stroke="#666" onMouseEnter={() => setShowTooltip(cell.id)} onMouseLeave={() => setShowTooltip(null)} style={{
        cursor: 'pointer'
      }} />
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#333" fontSize={14} fontWeight={500}>
          {cell.id}
        </text>
      </g>;
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="dd985298-99a8-4d8f-8812-b4a0eaa768b3" data-loc="254:4-259:5" data-file-name="components/IEMatrix.tsx">
      <h3 className="text-xl font-semibold text-slate-800 mb-2" data-unique-id="6c5ada68-1af7-46bc-94a6-4d5f98c21f95" data-loc="260:6-260:64" data-file-name="components/IEMatrix.tsx">IE Matrix Analysis</h3>
      <p className="text-slate-500 mb-6" data-unique-id="4bb60291-c976-479b-9ad3-0b4582bb05d5" data-loc="261:6-261:41" data-file-name="components/IEMatrix.tsx">Internal-External Matrix based on IFE and EFE scores</p>
      
      <div className="relative h-[400px] mb-4" data-unique-id="59310ad8-1615-4a22-9c4b-1c7d58864160" data-loc="263:6-263:47" data-file-name="components/IEMatrix.tsx">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{
          top: 20,
          right: 30,
          bottom: 20,
          left: 30
        }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="IFE Score" domain={[1, 4]} label={{
            value: 'IFE Score',
            position: 'bottom',
            offset: 0
          }} ticks={[1, 2, 3, 4]} />
            <YAxis type="number" dataKey="y" name="EFE Score" domain={[1, 4]} label={{
            value: 'EFE Score',
            angle: -90,
            position: 'left'
          }} ticks={[1, 2, 3, 4]} />
            <ZAxis range={[100]} />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Dividing lines */}
            <ReferenceLine x={2} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine x={3} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine y={2} stroke="#666" strokeDasharray="3 3" />
            <ReferenceLine y={3} stroke="#666" strokeDasharray="3 3" />
            
            {/* Matrix cells */}
            {matrixCells.map(cell => <Rectangle key={cell.id} x={(cell.x1 - 1) * 100} y={(4 - cell.y2) * 100} width={100} height={100} fill={cell.color} fillOpacity={0.3} stroke="#666" />)}
            
            {/* Cell labels */}
            {matrixCells.map(cell => <g key={`label-${cell.id}`}>
                <text x={(cell.x1 + cell.x2) / 2 * 100 - 50} y={(8 - cell.y1 - cell.y2) / 2 * 100 - 50} textAnchor="middle" dominantBaseline="middle" fill="#333" fontSize={14} fontWeight={500}>
                  {cell.id}
                </text>
              </g>)}
            
            {/* Company position */}
            <Scatter name="Company Position" data={[{
            x: ifeScore,
            y: efeScore
          }]} fill="#3b82f6" shape="circle" line={{
            stroke: '#3b82f6',
            strokeWidth: 2
          }} />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Cell tooltips */}
        {showTooltip && <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none" data-unique-id="9db605bf-3ee3-4cd9-8f67-725335641d3b" data-loc="338:10-338:119" data-file-name="components/IEMatrix.tsx">
            <CellTooltip cell={matrixCells.find(cell => cell.id === showTooltip)!} />
          </div>}
      </div>
      
      <div className="mt-6 bg-slate-50 p-4 rounded-lg" data-unique-id="dcd7a005-d8fe-4f9e-9110-e6592d3d3f1b" data-loc="344:6-344:55" data-file-name="components/IEMatrix.tsx">
        <div className="flex items-start gap-3" data-unique-id="9be54168-4212-40bc-ad23-01c53cf693f1" data-loc="345:8-345:48" data-file-name="components/IEMatrix.tsx">
          <div className="mt-1" data-unique-id="89327aa2-810a-4bea-bf68-85799d793df7" data-loc="346:10-346:32" data-file-name="components/IEMatrix.tsx">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div data-unique-id="49191b5d-acda-471b-bd38-792dadf71cea" data-loc="349:10-349:15" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-slate-800" data-unique-id="85fac3cf-fd09-4876-a9fd-ca2d168cbbd5" data-loc="350:12-350:55" data-file-name="components/IEMatrix.tsx">Current Position</h4>
            <p className="text-slate-600 mt-1" data-unique-id="2769f1fc-19aa-43c0-9c2b-74ddb6517975" data-loc="351:12-351:47" data-file-name="components/IEMatrix.tsx">
              Based on your IFE score of <span className="font-medium" data-unique-id="4427a521-334a-468a-8cfd-928cf2c5b9bc" data-loc="352:41-352:71" data-file-name="components/IEMatrix.tsx">{ifeScore.toFixed(2)}</span> and 
              EFE score of <span className="font-medium" data-unique-id="594fb3b9-da71-4c4c-9c81-a8cff3aa6315" data-loc="353:27-353:57" data-file-name="components/IEMatrix.tsx">{efeScore.toFixed(2)}</span>, your organization 
              is positioned in <span className="font-medium" data-unique-id="595dae22-3548-4634-84b1-80b9fbd3263f" data-loc="354:31-354:61" data-file-name="components/IEMatrix.tsx">Cell {currentCell?.id || '?'}</span>.
            </p>
            
            {getStrategyRecommendation()}
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-2" data-unique-id="3870ce94-2074-4e4e-99dc-0bef263ef1c7" data-loc="362:6-362:51" data-file-name="components/IEMatrix.tsx">
        <div className="flex flex-col items-center" data-unique-id="4ce1de6b-7a06-4151-96b9-1e79ecdb802a" data-loc="363:8-363:52" data-file-name="components/IEMatrix.tsx">
          <div className="w-full h-3 bg-green-400 rounded-full opacity-30" data-unique-id="845cb44f-6bf3-4fbf-afc1-8d6a477ee828" data-loc="364:10-364:75" data-file-name="components/IEMatrix.tsx"></div>
          <div className="text-xs mt-1 text-center" data-unique-id="c4f780cc-d339-481c-b71c-c3e1052ae967" data-loc="365:10-365:52" data-file-name="components/IEMatrix.tsx">Grow and Build<br data-unique-id="edb8841e-5013-4134-a608-c78802c0c5e5" data-loc="365:66-365:71" data-file-name="components/IEMatrix.tsx" />(I, II, IV)</div>
        </div>
        <div className="flex flex-col items-center" data-unique-id="1619fcf3-866a-4c02-8d54-8fc924690aa4" data-loc="367:8-367:52" data-file-name="components/IEMatrix.tsx">
          <div className="w-full h-3 bg-amber-400 rounded-full opacity-30" data-unique-id="94634a07-da04-405d-8d7e-adcdbe36b3f5" data-loc="368:10-368:75" data-file-name="components/IEMatrix.tsx"></div>
          <div className="text-xs mt-1 text-center" data-unique-id="f6f3a24f-56d4-47fe-8945-dd4a78dd4671" data-loc="369:10-369:52" data-file-name="components/IEMatrix.tsx">Hold and Maintain<br data-unique-id="60e1e409-4eb8-4943-a9de-7f1a0487b898" data-loc="369:69-369:74" data-file-name="components/IEMatrix.tsx" />(III, V, VII)</div>
        </div>
        <div className="flex flex-col items-center" data-unique-id="60a76597-00e8-4abb-a60f-37068c2417d5" data-loc="371:8-371:52" data-file-name="components/IEMatrix.tsx">
          <div className="w-full h-3 bg-red-400 rounded-full opacity-30" data-unique-id="63487f92-8922-4b00-ab23-ad290a0a4f46" data-loc="372:10-372:73" data-file-name="components/IEMatrix.tsx"></div>
          <div className="text-xs mt-1 text-center" data-unique-id="74bf5714-5d1d-4cb5-aa4b-2971796eed8f" data-loc="373:10-373:52" data-file-name="components/IEMatrix.tsx">Harvest or Exit<br data-unique-id="597a4523-8388-448b-8aa2-6f76ad76dfd5" data-loc="373:67-373:72" data-file-name="components/IEMatrix.tsx" />(VI, VIII, IX)</div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-slate-500" data-unique-id="120adecb-8490-42eb-b7c3-e7f970324a97" data-loc="377:6-377:51" data-file-name="components/IEMatrix.tsx">
        <p data-unique-id="f34fa42d-f2f6-4627-8418-0eca3bf897a6" data-loc="378:8-378:11" data-file-name="components/IEMatrix.tsx"><strong data-unique-id="9c372145-46a0-4eda-a9cb-b0575875242e" data-loc="378:11-378:19" data-file-name="components/IEMatrix.tsx">IFE Axis (X):</strong> 1.0–1.99 = Weak, 2.0–2.99 = Average, 3.0–4.0 = Strong</p>
        <p data-unique-id="bc74b959-a539-4c10-a6a8-497392f476a7" data-loc="379:8-379:11" data-file-name="components/IEMatrix.tsx"><strong data-unique-id="b23dbbcf-977d-4c1b-8ba0-c13a2105a41f" data-loc="379:11-379:19" data-file-name="components/IEMatrix.tsx">EFE Axis (Y):</strong> 1.0–1.99 = Low, 2.0–2.99 = Medium, 3.0–4.0 = High</p>
      </div>
    </motion.div>;
}