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
      return <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-200" data-unique-id="56d07af6-aa04-4a15-8674-86ec7eab68e8" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true">
          <p className="font-medium" data-unique-id="ee724d58-6c0c-4b20-b035-55e895073007" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="f9a85c87-1563-466d-ba7e-c0cd2f212410" data-file-name="components/IEMatrix.tsx">Company Position</span></p>
          <p className="text-sm" data-unique-id="1aec37ba-fef3-4061-b621-11a2b279b597" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ac2a82b3-e63c-48c5-9638-4253d7c28345" data-file-name="components/IEMatrix.tsx">IFE Score: </span>{payload[0].payload.x.toFixed(2)}</p>
          <p className="text-sm" data-unique-id="b2b70865-5e1e-4dfd-a7c5-3071da99215c" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0a8d28aa-37d6-40f2-8724-64bfa1d4c9c2" data-file-name="components/IEMatrix.tsx">EFE Score: </span>{payload[0].payload.y.toFixed(2)}</p>
          {currentCell && <p className="text-sm mt-1" data-unique-id="0bdeaf71-2794-4d6f-91eb-18bb8da2c53e" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8eb2df45-ea1c-4131-9ea8-8415b768dee2" data-file-name="components/IEMatrix.tsx">Cell: </span>{currentCell.id}<span className="editable-text" data-unique-id="c09f543f-25f2-4eba-9c1a-fe8c32866896" data-file-name="components/IEMatrix.tsx"> (</span>{currentCell.strategy}<span className="editable-text" data-unique-id="c75c547b-40bd-43a9-a247-8bc66c4049af" data-file-name="components/IEMatrix.tsx">)</span></p>}
        </div>;
    }
    return null;
  };

  // Custom cell tooltip
  const CellTooltip = ({
    cell
  }: {
    cell: MatrixCell;
  }) => <div className="absolute z-10 bg-white p-3 shadow-lg rounded-lg border border-slate-200 max-w-xs" data-unique-id="d953eb06-dfc3-45ea-ad23-2a65ef41fac9" data-file-name="components/IEMatrix.tsx">
      <p className="font-medium" data-unique-id="00838334-ef56-47f5-9671-808b387afc0b" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="15cf3d2c-0bc9-4de2-9978-32aa3d60ddc4" data-file-name="components/IEMatrix.tsx">Cell </span>{cell.id}<span className="editable-text" data-unique-id="b2f10906-27c0-42dc-ba6f-3ee049fe97fb" data-file-name="components/IEMatrix.tsx">: </span>{cell.strategy}</p>
      <p className="text-sm mt-1" data-unique-id="4dc13511-9570-427a-9746-6d8b87a818cd" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true">{cell.description}</p>
    </div>;

  // Get the strategy recommendation based on the current cell
  const getStrategyRecommendation = () => {
    if (!currentCell) return null;
    switch (currentCell.strategy) {
      case "Grow and Build":
        return <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4" data-unique-id="22529d3a-e468-4857-8219-13af2c0e0f5e" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-green-800" data-unique-id="b01ec94c-34db-434f-a639-651ba05207ab" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="78724f8e-9e58-4eb9-893c-71681b9154f7" data-file-name="components/IEMatrix.tsx">Recommended Strategy: Grow and Build</span></h4>
            <p className="text-sm text-green-700 mt-1" data-unique-id="91405968-761f-403f-b8bf-6f520df9897c" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="a5cdb0ca-2057-417c-8720-49f77c89bee5" data-file-name="components/IEMatrix.tsx">
              Focus on intensive strategies like market penetration, market development, and product development.
              Consider integrative strategies such as backward, forward, or horizontal integration.
            </span></p>
            <div className="mt-3 p-3 bg-green-100 rounded-md" data-unique-id="33848b9e-f984-47a3-9f9a-806b77f711f0" data-file-name="components/IEMatrix.tsx">
              <p className="text-sm font-medium text-green-800" data-unique-id="0fbf36a4-1f03-4146-a5eb-e9257bb682e0" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="cf434a41-c9d9-4613-a9c1-a7a61f4da36e" data-file-name="components/IEMatrix.tsx">SWOT Strategy Focus:</span></p>
              <ul className="mt-1 text-sm text-green-700 list-disc pl-5 space-y-1" data-unique-id="16bac6bd-981f-4e14-a19e-15d9ab159b63" data-file-name="components/IEMatrix.tsx">
                <li data-unique-id="8210f8b9-3674-48cb-9259-f2c5ad80929b" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="3544a0b6-0f5d-4ca6-a962-04f9d6b2799d" data-file-name="components/IEMatrix.tsx">Prioritize SO strategies that leverage strengths to capitalize on opportunities</span></li>
                <li data-unique-id="fa179323-448e-42be-b40e-e731a3e57d22" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="e2c698bf-80bd-4843-84a4-d3173aa0699d" data-file-name="components/IEMatrix.tsx">Consider WO strategies to improve weaknesses by taking advantage of opportunities</span></li>
                <li data-unique-id="cdbd1459-d31a-4627-8440-1ac4d857f55f" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="3fd680d2-110b-4bc1-8f2c-609f76c37166" data-file-name="components/IEMatrix.tsx">Invest in growth-oriented initiatives and expansion</span></li>
              </ul>
            </div>
          </div>;
      case "Hold and Maintain":
        return <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4" data-unique-id="5e3fefe3-4fa3-4017-95b1-6439ccda1c7f" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-amber-800" data-unique-id="c2e39e8e-56ff-4815-bd5a-d7524dda62d0" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="14e271b2-d0f6-4a62-a0af-45013abaaf3c" data-file-name="components/IEMatrix.tsx">Recommended Strategy: Hold and Maintain</span></h4>
            <p className="text-sm text-amber-700 mt-1" data-unique-id="9036baed-529b-41b6-ab6f-cfcb579c6bd6" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="7e68900c-ac41-48b4-a2a2-b95dadf2c952" data-file-name="components/IEMatrix.tsx">
              Focus on market penetration and product development strategies.
              These are two commonly employed strategies for this position.
            </span></p>
            <div className="mt-3 p-3 bg-amber-100 rounded-md" data-unique-id="cd3215d9-754d-4c5a-a3fd-5a349bc26da3" data-file-name="components/IEMatrix.tsx">
              <p className="text-sm font-medium text-amber-800" data-unique-id="df62c08e-1799-496a-baed-574d17c9caff" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="802431c5-d170-4bcf-8c08-8c3f97fc25ac" data-file-name="components/IEMatrix.tsx">SWOT Strategy Focus:</span></p>
              <ul className="mt-1 text-sm text-amber-700 list-disc pl-5 space-y-1" data-unique-id="08c5e5ff-8623-4d13-bf3e-4338d4dd7923" data-file-name="components/IEMatrix.tsx">
                <li data-unique-id="4ea6b55e-4f30-4165-83da-d7965a9141d7" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="19a65eee-b8a6-4f76-b8d8-ec7318f91d7b" data-file-name="components/IEMatrix.tsx">Balance SO strategies to maintain market position</span></li>
                <li data-unique-id="48353a73-8104-4338-aba0-6483590cd9ec" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="61aa172a-d225-495a-a12b-fbd67a42c794" data-file-name="components/IEMatrix.tsx">Implement ST strategies to protect against external threats</span></li>
                <li data-unique-id="f6fe3286-a389-4e96-8dec-f32df8e8cd0d" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="1f04b9e1-5430-4de9-bba9-0ee0671c8a20" data-file-name="components/IEMatrix.tsx">Focus on operational efficiency and incremental improvements</span></li>
              </ul>
            </div>
          </div>;
      case "Harvest or Exit":
        return <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4" data-unique-id="b8234bea-4ef6-43dc-804d-b8857b5e869d" data-file-name="components/IEMatrix.tsx">
            <h4 className="font-medium text-red-800" data-unique-id="d87b3f7f-ca87-47be-9d2c-2ea3bf0e750c" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="88b3b92f-6ddf-447f-8926-85b9f4fe23dd" data-file-name="components/IEMatrix.tsx">Recommended Strategy: Harvest or Exit</span></h4>
            <p className="text-sm text-red-700 mt-1" data-unique-id="1ccb9d69-4d23-4312-970b-737092170213" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="9c50bf0a-ba6f-469a-983c-d9f5170582a2" data-file-name="components/IEMatrix.tsx">
              Don't expand; consider divesting, retrenching, or diversifying.
              If costs for rejuvenating the business are low, attempt to revitalize the business.
              Consider forming joint ventures to improve weaknesses.
            </span></p>
            <div className="mt-3 p-3 bg-red-100 rounded-md" data-unique-id="df6e990b-6234-469d-8e25-9e0d28e0de23" data-file-name="components/IEMatrix.tsx">
              <p className="text-sm font-medium text-red-800" data-unique-id="a62992dc-5f77-4580-80f3-63a7145b033e" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="89e88620-f2d5-4ea1-9bdb-d64a2cf3f093" data-file-name="components/IEMatrix.tsx">SWOT Strategy Focus:</span></p>
              <ul className="mt-1 text-sm text-red-700 list-disc pl-5 space-y-1" data-unique-id="ba4b3b7b-c4cd-4ffd-9330-e3541893dd4c" data-file-name="components/IEMatrix.tsx">
                <li data-unique-id="26d84762-f2b6-48fe-8d71-1d86781d6039" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="9416a64f-b2a2-4d93-883a-c818fa06773f" data-file-name="components/IEMatrix.tsx">Prioritize ST strategies to use strengths to minimize threats</span></li>
                <li data-unique-id="68b760ce-0b70-4539-bbda-5cf58316a97c" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="335f9563-9a38-4ac5-90cd-109a77692557" data-file-name="components/IEMatrix.tsx">Implement WT strategies to minimize weaknesses and avoid threats</span></li>
                <li data-unique-id="14997f31-9d9b-4bc0-9af6-a52ce4cad237" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="6df74ccd-e148-42cf-b4b1-8fc9a10c03d5" data-file-name="components/IEMatrix.tsx">Consider defensive approaches or strategic exit options</span></li>
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
  }} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5" data-unique-id="10413ae4-d68f-4d48-b94f-945dc7c704bf" data-file-name="components/IEMatrix.tsx">
      <h3 className="text-xl font-semibold text-slate-800 mb-2" data-unique-id="38425545-52be-446c-ab05-6a04a0421e73" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="f7bc37f0-80ac-46bc-a5bb-e4d5cfde6a0b" data-file-name="components/IEMatrix.tsx">IE Matrix Analysis</span></h3>
      <p className="text-slate-500 mb-6" data-unique-id="44d7ad76-ac71-4e3e-929d-d1dfbe366173" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="f21aa7cb-9f7b-47dd-a792-eaa720bc37bf" data-file-name="components/IEMatrix.tsx">Internal-External Matrix based on IFE and EFE scores</span></p>
      
      <div className="relative h-[400px] mb-4" data-unique-id="22643fdf-e971-45ed-a0f7-ac074b7590dc" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true">
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
        {showTooltip && <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none" data-unique-id="b8daf96f-2d01-4cb6-aa54-996ca3fb28c6" data-file-name="components/IEMatrix.tsx">
            <CellTooltip cell={matrixCells.find(cell => cell.id === showTooltip)!} />
          </div>}
      </div>
      
      <div className="mt-6 bg-slate-50 p-4 rounded-lg" data-unique-id="3114d350-27fa-4c69-b1e4-75ca545a51ec" data-file-name="components/IEMatrix.tsx">
        <div className="flex items-start gap-3" data-unique-id="ca3f6ac6-4fa6-4712-9e11-03fb809bdba3" data-file-name="components/IEMatrix.tsx">
          <div className="mt-1" data-unique-id="110b5a52-2835-4fc2-a51b-f3b8b2b31c5c" data-file-name="components/IEMatrix.tsx">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div data-unique-id="0bf61100-7025-4dd3-b676-4de42c4be237" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true">
            <h4 className="font-medium text-slate-800" data-unique-id="98461854-3c9e-4f1a-9af1-558cd1a130b2" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="321baa23-17ad-4799-8a7f-1f74d8bb82a8" data-file-name="components/IEMatrix.tsx">Current Position</span></h4>
            <p className="text-slate-600 mt-1" data-unique-id="bb358cdb-590c-4578-aa80-5535d04f831b" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="55e0ec17-0826-4512-a7af-6e8442081151" data-file-name="components/IEMatrix.tsx">
              Based on your IFE score of </span><span className="font-medium" data-unique-id="47963eea-77ec-4a18-8b7a-7086fc3ebc89" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true">{ifeScore.toFixed(2)}</span><span className="editable-text" data-unique-id="4880de90-2fc4-4ecd-a570-29399338959f" data-file-name="components/IEMatrix.tsx"> and 
              EFE score of </span><span className="font-medium" data-unique-id="7b7a5108-78d1-4455-89b1-be54be576974" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true">{efeScore.toFixed(2)}</span><span className="editable-text" data-unique-id="2d0029c2-9739-43d6-8be1-6b1a8561a66a" data-file-name="components/IEMatrix.tsx">, your organization 
              is positioned in </span><span className="font-medium" data-unique-id="4d93a2b1-a3c5-4114-b24d-d9d7320e4b94" data-file-name="components/IEMatrix.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f71bea51-0285-4c08-b928-9646fdadf7e7" data-file-name="components/IEMatrix.tsx">Cell </span>{currentCell?.id || '?'}</span><span className="editable-text" data-unique-id="f11b219a-03e3-4a20-8757-e01dbfad6346" data-file-name="components/IEMatrix.tsx">.
            </span></p>
            
            {getStrategyRecommendation()}
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-2" data-unique-id="a1d88f4d-ae73-421f-9670-63da6c6cb5a9" data-file-name="components/IEMatrix.tsx">
        <div className="flex flex-col items-center" data-unique-id="aeb9bbbb-fd62-4e36-850b-92eb94525317" data-file-name="components/IEMatrix.tsx">
          <div className="w-full h-3 bg-green-400 rounded-full opacity-30" data-unique-id="40ca9e11-11ec-403f-b7d9-f4a2146cfdaa" data-file-name="components/IEMatrix.tsx"></div>
          <div className="text-xs mt-1 text-center" data-unique-id="ae6f0f24-05a1-47f6-8d13-41c44d5ea8b8" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="dd72cd5f-8d5c-486e-9980-8d4168f5cb2c" data-file-name="components/IEMatrix.tsx">Grow and Build</span><br data-unique-id="07cb57e6-8d78-4bcf-bbec-4f89de7cabde" data-file-name="components/IEMatrix.tsx" /><span className="editable-text" data-unique-id="e6634357-db24-4987-a249-50f4a48a73e1" data-file-name="components/IEMatrix.tsx">(I, II, IV)</span></div>
        </div>
        <div className="flex flex-col items-center" data-unique-id="a94af6af-8c2c-4c97-b5fc-ed5508a64e98" data-file-name="components/IEMatrix.tsx">
          <div className="w-full h-3 bg-amber-400 rounded-full opacity-30" data-unique-id="bb8816b0-a76e-4e07-8634-21cd6e70e3be" data-file-name="components/IEMatrix.tsx"></div>
          <div className="text-xs mt-1 text-center" data-unique-id="e8978cda-5b6f-4df6-8c6f-2134066140c1" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="15a365ed-7cf5-495b-839a-a7bba1ac267f" data-file-name="components/IEMatrix.tsx">Hold and Maintain</span><br data-unique-id="b1098a90-a0bc-4369-bac2-6d6f8fdad2f5" data-file-name="components/IEMatrix.tsx" /><span className="editable-text" data-unique-id="506fc7fa-8410-497a-ba87-39df4ab2fab5" data-file-name="components/IEMatrix.tsx">(III, V, VII)</span></div>
        </div>
        <div className="flex flex-col items-center" data-unique-id="fed34a71-6b2d-4a02-8958-ea4c137c4ab3" data-file-name="components/IEMatrix.tsx">
          <div className="w-full h-3 bg-red-400 rounded-full opacity-30" data-unique-id="b9bff8a2-b8fe-483b-9c81-f52384539bb4" data-file-name="components/IEMatrix.tsx"></div>
          <div className="text-xs mt-1 text-center" data-unique-id="d13239f0-a487-4cb9-8a01-926d85225f49" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="762d1463-9bbb-4146-9f59-92b80b165ba2" data-file-name="components/IEMatrix.tsx">Harvest or Exit</span><br data-unique-id="53fb77fe-2e7d-4c79-9d14-d16c83848897" data-file-name="components/IEMatrix.tsx" /><span className="editable-text" data-unique-id="d41b65b3-9a4c-4191-9f9f-4ea154120c24" data-file-name="components/IEMatrix.tsx">(VI, VIII, IX)</span></div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-slate-500" data-unique-id="4ca8325b-2867-493d-9eed-30caf9b15f2d" data-file-name="components/IEMatrix.tsx">
        <p data-unique-id="596001fe-ff24-4721-9355-63f9e9480680" data-file-name="components/IEMatrix.tsx"><strong data-unique-id="c1963fc5-1715-4aa9-8370-289a2035aa58" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="a720f7f4-95f9-4223-87a5-4dfcdf18fcd0" data-file-name="components/IEMatrix.tsx">IFE Axis (X):</span></strong><span className="editable-text" data-unique-id="87aca36c-033a-4332-a020-1112a1d74afd" data-file-name="components/IEMatrix.tsx"> 1.0–1.99 = Weak, 2.0–2.99 = Average, 3.0–4.0 = Strong</span></p>
        <p data-unique-id="07b1e5dc-dbdb-4b2c-8a4d-09038162bc1b" data-file-name="components/IEMatrix.tsx"><strong data-unique-id="e23527b5-7eac-4300-9080-6998b52404d7" data-file-name="components/IEMatrix.tsx"><span className="editable-text" data-unique-id="1a0864b2-9dbd-4323-97f9-617e58b9eb34" data-file-name="components/IEMatrix.tsx">EFE Axis (Y):</span></strong><span className="editable-text" data-unique-id="f89de35f-e495-46ea-95e2-890cc7c26646" data-file-name="components/IEMatrix.tsx"> 1.0–1.99 = Low, 2.0–2.99 = Medium, 3.0–4.0 = High</span></p>
      </div>
    </motion.div>;
}