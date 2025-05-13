"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Printer, FileText } from "lucide-react";
import { CompanyProfile, SwotItem, Factor, FactorCategory } from "@/types/matrix";

interface FullReportProps {
  companyProfile: CompanyProfile | null;
  swotItems: SwotItem[];
  ifeFactors: Factor[];
  efeFactors: Factor[];
  ifeScore: number;
  efeScore: number;
}

type StrategyItem = {
  id: string;
  content: string;
  isEditing: boolean;
  editContent: string;
  type?: string;
};

export default function FullReport({
  companyProfile,
  swotItems,
  ifeFactors,
  efeFactors,
  ifeScore,
  efeScore,
}: FullReportProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  // Load AI-generated strategies from localStorage
  const [soStrategies, setSoStrategies] = useState<StrategyItem[]>([]);
  const [stStrategies, setStStrategies] = useState<StrategyItem[]>([]);
  const [woStrategies, setWoStrategies] = useState<StrategyItem[]>([]);
  const [wtStrategies, setWtStrategies] = useState<StrategyItem[]>([]);
  const [prioritizedStrategies, setPrioritizedStrategies] = useState<StrategyItem[]>([]);
  const [hasStrategies, setHasStrategies] = useState(false);
  
  useEffect(() => {
    try {
      const savedSO = localStorage.getItem("soStrategies");
      const savedST = localStorage.getItem("stStrategies");
      const savedWO = localStorage.getItem("woStrategies");
      const savedWT = localStorage.getItem("wtStrategies");
      const savedPrioritized = localStorage.getItem("prioritizedStrategies");

      if (savedSO) setSoStrategies(JSON.parse(savedSO));
      if (savedST) setStStrategies(JSON.parse(savedST));
      if (savedWO) setWoStrategies(JSON.parse(savedWO));
      if (savedWT) setWtStrategies(JSON.parse(savedWT));
      if (savedPrioritized) setPrioritizedStrategies(JSON.parse(savedPrioritized));
      
      // Check if we have any strategies
      setHasStrategies(
        (savedSO && JSON.parse(savedSO).length > 0) ||
        (savedST && JSON.parse(savedST).length > 0) ||
        (savedWO && JSON.parse(savedWO).length > 0) ||
        (savedWT && JSON.parse(savedWT).length > 0)
      );
    } catch (error) {
      console.error("Error loading strategies from localStorage:", error);
    }
  }, []);

  // Get strategy recommendation based on IE Matrix position
  const getStrategyRecommendation = () => {
    let cellId = "";
    let strategy = "";
    
    // Determine cell position
    if (ifeScore >= 3) {
      if (efeScore >= 3) cellId = "I";
      else if (efeScore >= 2) cellId = "IV";
      else cellId = "VII";
    } else if (ifeScore >= 2) {
      if (efeScore >= 3) cellId = "II";
      else if (efeScore >= 2) cellId = "V";
      else cellId = "VIII";
    } else {
      if (efeScore >= 3) cellId = "III";
      else if (efeScore >= 2) cellId = "VI";
      else cellId = "IX";
    }
    
    // Determine strategy
    if (["I", "II", "IV"].includes(cellId)) {
      strategy = "Grow and Build - Focus on intensive strategies like market penetration, market development, and product development. Consider integrative strategies such as backward, forward, or horizontal integration.";
    } else if (["III", "V", "VII"].includes(cellId)) {
      strategy = "Hold and Maintain - Focus on market penetration and product development strategies. These are two commonly employed strategies for this position.";
    } else {
      strategy = "Harvest or Exit - Don't expand; consider divesting, retrenching, or diversifying. If costs for rejuvenating the business are low, attempt to revitalize the business. Consider forming joint ventures to improve weaknesses.";
    }
    
    return { cellId, strategy };
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      
      // Title page
      doc.setFontSize(24);
      doc.setTextColor(44, 62, 80);
      doc.text("Strategic Analysis Report", 105, yPosition, { align: "center" });
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, yPosition, { align: "center" });
      yPosition += 20;
      
      // Table of contents
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Table of Contents", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("1. Company Profile", 25, yPosition);
      yPosition += 7;
      doc.text("2. SWOT Analysis", 25, yPosition);
      yPosition += 7;
      doc.text("3. IFE Matrix (Internal Factor Evaluation)", 25, yPosition);
      yPosition += 7;
      doc.text("4. EFE Matrix (External Factor Evaluation)", 25, yPosition);
      yPosition += 7;
      doc.text("5. IE Matrix Positioning & Strategy Recommendation", 25, yPosition);
      yPosition += 20;
      
      // Add company logo placeholder
      if (companyProfile) {
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`${companyProfile.name}`, 105, yPosition, { align: "center" });
        yPosition += 7;
        doc.text(`${companyProfile.industry}`, 105, yPosition, { align: "center" });
      }
      
      // Add new page - Company Profile
      doc.addPage();
      yPosition = 20;
      
      // Section 1: Company Profile
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("1. Company Profile", 20, yPosition);
      yPosition += 15;
      
      if (companyProfile) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Company Name:", 20, yPosition);
        doc.text(companyProfile.name, 80, yPosition);
        yPosition += 10;
        
        doc.text("Industry Sector:", 20, yPosition);
        doc.text(companyProfile.industry, 80, yPosition);
        yPosition += 10;
        
        doc.text("Company Description:", 20, yPosition);
        yPosition += 7;
        const descriptionLines = doc.splitTextToSize(companyProfile.description, 170);
        doc.setFontSize(12);
        doc.text(descriptionLines, 20, yPosition);
        yPosition += descriptionLines.length * 7 + 10;
        
        doc.setFontSize(14);
        doc.text("Vision:", 20, yPosition);
        yPosition += 7;
        const visionLines = doc.splitTextToSize(companyProfile.vision, 170);
        doc.setFontSize(12);
        doc.text(visionLines, 20, yPosition);
        yPosition += visionLines.length * 7 + 10;
        
        doc.setFontSize(14);
        doc.text("Mission:", 20, yPosition);
        yPosition += 7;
        const missionLines = doc.splitTextToSize(companyProfile.mission, 170);
        doc.setFontSize(12);
        doc.text(missionLines, 20, yPosition);
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("No company profile information available.", 20, yPosition);
      }
      
      // Add new page - SWOT Analysis
      doc.addPage();
      yPosition = 20;
      
      // Section 2: SWOT Analysis
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("2. SWOT Analysis", 20, yPosition);
      yPosition += 15;
      
      if (swotItems.length > 0) {
        // Create SWOT table
        const strengths = swotItems.filter(item => item.category === "strength");
        const weaknesses = swotItems.filter(item => item.category === "weakness");
        const opportunities = swotItems.filter(item => item.category === "opportunity");
        const threats = swotItems.filter(item => item.category === "threat");
        
        // Strengths
        doc.setFontSize(14);
        doc.setTextColor(76, 175, 80); // Green
        doc.text("Strengths", 20, yPosition);
        yPosition += 7;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        if (strengths.length > 0) {
          strengths.forEach((item, index) => {
            const bulletPoint = `• ${item.description}`;
            const lines = doc.splitTextToSize(bulletPoint, 170);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 7 + 3;
            
            if (item.significance) {
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              const sigLines = doc.splitTextToSize(`  Significance: ${item.significance}`, 170);
              doc.text(sigLines, 20, yPosition);
              yPosition += sigLines.length * 5 + 5;
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
            }
          });
        } else {
          doc.text("No strengths identified.", 20, yPosition);
          yPosition += 7;
        }
        yPosition += 5;
        
        // Weaknesses
        doc.setFontSize(14);
        doc.setTextColor(244, 67, 54); // Red
        doc.text("Weaknesses", 20, yPosition);
        yPosition += 7;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        if (weaknesses.length > 0) {
          weaknesses.forEach((item, index) => {
            const bulletPoint = `• ${item.description}`;
            const lines = doc.splitTextToSize(bulletPoint, 170);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 7 + 3;
            
            if (item.significance) {
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              const sigLines = doc.splitTextToSize(`  Significance: ${item.significance}`, 170);
              doc.text(sigLines, 20, yPosition);
              yPosition += sigLines.length * 5 + 5;
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
            }
          });
        } else {
          doc.text("No weaknesses identified.", 20, yPosition);
          yPosition += 7;
        }
        yPosition += 5;
        
        // Check if we need a new page for opportunities and threats
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Opportunities
        doc.setFontSize(14);
        doc.setTextColor(33, 150, 243); // Blue
        doc.text("Opportunities", 20, yPosition);
        yPosition += 7;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        if (opportunities.length > 0) {
          opportunities.forEach((item, index) => {
            const bulletPoint = `• ${item.description}`;
            const lines = doc.splitTextToSize(bulletPoint, 170);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 7 + 3;
            
            if (item.significance) {
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              const sigLines = doc.splitTextToSize(`  Significance: ${item.significance}`, 170);
              doc.text(sigLines, 20, yPosition);
              yPosition += sigLines.length * 5 + 5;
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
            }
          });
        } else {
          doc.text("No opportunities identified.", 20, yPosition);
          yPosition += 7;
        }
        yPosition += 5;
        
        // Check if we need a new page for threats
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Threats
        doc.setFontSize(14);
        doc.setTextColor(255, 152, 0); // Orange
        doc.text("Threats", 20, yPosition);
        yPosition += 7;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        if (threats.length > 0) {
          threats.forEach((item, index) => {
            const bulletPoint = `• ${item.description}`;
            const lines = doc.splitTextToSize(bulletPoint, 170);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 7 + 3;
            
            if (item.significance) {
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              const sigLines = doc.splitTextToSize(`  Significance: ${item.significance}`, 170);
              doc.text(sigLines, 20, yPosition);
              yPosition += sigLines.length * 5 + 5;
              doc.setFontSize(12);
              doc.setTextColor(0, 0, 0);
            }
          });
        } else {
          doc.text("No threats identified.", 20, yPosition);
          yPosition += 7;
        }
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("No SWOT analysis data available.", 20, yPosition);
      }
      
      // Add new page - IFE Matrix
      doc.addPage();
      yPosition = 20;
      
      // Section 3: IFE Matrix
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("3. IFE Matrix (Internal Factor Evaluation)", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("The Internal Factor Evaluation Matrix summarizes and evaluates the major strengths and", 20, yPosition);
      yPosition += 7;
      doc.text("weaknesses in the functional areas of a business.", 20, yPosition);
      yPosition += 15;
      
      if (ifeFactors.length > 0) {
        // Prepare IFE Matrix data
        const strengthFactors = ifeFactors.filter(f => f.category === "strength");
        const weaknessFactors = ifeFactors.filter(f => f.category === "weakness");
        
        // Create IFE Matrix table
        (doc as any).autoTable({
          startY: yPosition,
          head: [["Factor", "Type", "Weight", "Rating", "Weighted Score"]],
          body: [
            ...strengthFactors.map(factor => [
              factor.description,
              "Strength",
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ]),
            ...weaknessFactors.map(factor => [
              factor.description,
              "Weakness",
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ])
          ],
          foot: [["Total", "", ifeFactors.reduce((sum, f) => sum + f.weight, 0).toFixed(2), "", ifeScore.toFixed(2)]],
          theme: 'grid',
          headStyles: {
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            fontSize: 10
          },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 30 },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 30, halign: 'center' },
            4: { cellWidth: 40, halign: 'center' }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 15;
        
        // Add IFE Score interpretation
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text("IFE Score Interpretation", 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total IFE Score: ${ifeScore.toFixed(2)}`, 20, yPosition);
        yPosition += 7;
        
        let interpretation = "";
        if (ifeScore < 2.0) {
          interpretation = "Weak internal position. Strategic improvements are urgently needed.";
        } else if (ifeScore < 2.5) {
          interpretation = "Below average internal position. There is significant room for improvement.";
        } else if (ifeScore < 3.0) {
          interpretation = "Average internal position. The organization is holding its own but should seek improvements.";
        } else if (ifeScore < 3.5) {
          interpretation = "Above average internal position. The organization is performing well but can still strengthen its position.";
        } else {
          interpretation = "Strong internal position. The organization is well-positioned for success.";
        }
        
        const interpretationLines = doc.splitTextToSize(`Interpretation: ${interpretation}`, 170);
        doc.text(interpretationLines, 20, yPosition);
        yPosition += interpretationLines.length * 7 + 10;
        
        // Add rating scale
        doc.setFontSize(12);
        doc.text("Rating Scale for Internal Factors:", 20, yPosition);
        yPosition += 7;
        doc.text("1 = Major Weakness", 25, yPosition);
        yPosition += 7;
        doc.text("2 = Minor Weakness", 25, yPosition);
        yPosition += 7;
        doc.text("3 = Minor Strength", 25, yPosition);
        yPosition += 7;
        doc.text("4 = Major Strength", 25, yPosition);
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("No IFE Matrix data available.", 20, yPosition);
      }
      
      // Add new page - EFE Matrix
      doc.addPage();
      yPosition = 20;
      
      // Section 4: EFE Matrix
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("4. EFE Matrix (External Factor Evaluation)", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("The External Factor Evaluation Matrix summarizes and evaluates economic, social, cultural,", 20, yPosition);
      yPosition += 7;
      doc.text("demographic, environmental, political, governmental, legal, technological, and competitive information.", 20, yPosition);
      yPosition += 15;
      
      if (efeFactors.length > 0) {
        // Prepare EFE Matrix data
        const opportunityFactors = efeFactors.filter(f => f.category === "opportunity");
        const threatFactors = efeFactors.filter(f => f.category === "threat");
        
        // Create EFE Matrix table
        (doc as any).autoTable({
          startY: yPosition,
          head: [["Factor", "Type", "Weight", "Rating", "Weighted Score"]],
          body: [
            ...opportunityFactors.map(factor => [
              factor.description,
              "Opportunity",
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ]),
            ...threatFactors.map(factor => [
              factor.description,
              "Threat",
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ])
          ],
          foot: [["Total", "", efeFactors.reduce((sum, f) => sum + f.weight, 0).toFixed(2), "", efeScore.toFixed(2)]],
          theme: 'grid',
          headStyles: {
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            fontSize: 10
          },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 30 },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 30, halign: 'center' },
            4: { cellWidth: 40, halign: 'center' }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 15;
        
        // Add EFE Score interpretation
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text("EFE Score Interpretation", 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total EFE Score: ${efeScore.toFixed(2)}`, 20, yPosition);
        yPosition += 7;
        
        let interpretation = "";
        if (efeScore < 2.0) {
          interpretation = "Low external response. The organization is not effectively capitalizing on opportunities or avoiding threats.";
        } else if (efeScore < 2.5) {
          interpretation = "Below average external response. The organization needs to improve its strategies to address external factors.";
        } else if (efeScore < 3.0) {
          interpretation = "Average external response. The organization is adequately addressing external factors but could improve.";
        } else if (efeScore < 3.5) {
          interpretation = "Above average external response. The organization is effectively capitalizing on opportunities and mitigating threats.";
        } else {
          interpretation = "High external response. The organization is exceptionally effective at capitalizing on opportunities and avoiding threats.";
        }
        
        const interpretationLines = doc.splitTextToSize(`Interpretation: ${interpretation}`, 170);
        doc.text(interpretationLines, 20, yPosition);
        yPosition += interpretationLines.length * 7 + 10;
        
        // Add rating scale
        doc.setFontSize(12);
        doc.text("Rating Scale for External Factors:", 20, yPosition);
        yPosition += 7;
        doc.text("1 = Poor Response", 25, yPosition);
        yPosition += 7;
        doc.text("2 = Average Response", 25, yPosition);
        yPosition += 7;
        doc.text("3 = Above Average Response", 25, yPosition);
        yPosition += 7;
        doc.text("4 = Superior Response", 25, yPosition);
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("No EFE Matrix data available.", 20, yPosition);
      }
      
      // Add new page - IE Matrix
      doc.addPage();
      yPosition = 20;
      
      // Section 5: IE Matrix
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text("5. IE Matrix Positioning & Strategy Recommendation", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("The Internal-External (IE) Matrix positions an organization based on its IFE and EFE scores,", 20, yPosition);
      yPosition += 7;
      doc.text("helping to determine appropriate strategic approaches.", 20, yPosition);
      yPosition += 15;
      
      // Draw IE Matrix grid
      const startX = 50;
      const startY = yPosition;
      const cellSize = 30;
      
      // Draw grid
      for (let i = 0; i <= 3; i++) {
        doc.line(startX, startY + i * cellSize, startX + 3 * cellSize, startY + i * cellSize);
        doc.line(startX + i * cellSize, startY, startX + i * cellSize, startY + 3 * cellSize);
      }
      
      // Label axes
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("IFE Scores", startX + 1.5 * cellSize, startY + 3 * cellSize + 15, { align: "center" });
      doc.text("EFE", startX - 15, startY + 1.5 * cellSize, { align: "center" });
      doc.text("Scores", startX - 15, startY + 1.5 * cellSize + 10, { align: "center" });
      
      // Label cells
      doc.setFontSize(8);
      
      // Row 1
      doc.text("I", startX + 2.5 * cellSize, startY + 0.5 * cellSize);
      doc.text("II", startX + 1.5 * cellSize, startY + 0.5 * cellSize);
      doc.text("III", startX + 0.5 * cellSize, startY + 0.5 * cellSize);
      
      // Row 2
      doc.text("IV", startX + 2.5 * cellSize, startY + 1.5 * cellSize);
      doc.text("V", startX + 1.5 * cellSize, startY + 1.5 * cellSize);
      doc.text("VI", startX + 0.5 * cellSize, startY + 1.5 * cellSize);
      
      // Row 3
      doc.text("VII", startX + 2.5 * cellSize, startY + 2.5 * cellSize);
      doc.text("VIII", startX + 1.5 * cellSize, startY + 2.5 * cellSize);
      doc.text("IX", startX + 0.5 * cellSize, startY + 2.5 * cellSize);
      
      // Add axis values
      doc.text("4.0", startX + 3 * cellSize, startY - 5);
      doc.text("3.0", startX + 2 * cellSize, startY - 5);
      doc.text("2.0", startX + 1 * cellSize, startY - 5);
      doc.text("1.0", startX, startY - 5);
      
      doc.text("4.0", startX - 10, startY);
      doc.text("3.0", startX - 10, startY + 1 * cellSize);
      doc.text("2.0", startX - 10, startY + 2 * cellSize);
      doc.text("1.0", startX - 10, startY + 3 * cellSize);
      
      // Color code the cells
      // Grow and Build (I, II, IV)
      doc.setFillColor(76, 175, 80, 0.3); // Green with transparency
      doc.rect(startX + 2 * cellSize, startY, cellSize, cellSize, 'F'); // I
      doc.rect(startX + cellSize, startY, cellSize, cellSize, 'F'); // II
      doc.rect(startX + 2 * cellSize, startY + cellSize, cellSize, cellSize, 'F'); // IV
      
      // Hold and Maintain (V)
      doc.setFillColor(251, 191, 36, 0.3); // Yellow with transparency
      doc.rect(startX + cellSize, startY + cellSize, cellSize, cellSize, 'F'); // V
      
      // Harvest or Exit (III, VI, VII, VIII, IX)
      doc.setFillColor(244, 67, 54, 0.3); // Red with transparency
      doc.rect(startX, startY, cellSize, cellSize, 'F'); // III
      doc.rect(startX, startY + cellSize, cellSize, cellSize, 'F'); // VI
      doc.rect(startX + 2 * cellSize, startY + 2 * cellSize, cellSize, cellSize, 'F'); // VII
      doc.rect(startX + cellSize, startY + 2 * cellSize, cellSize, cellSize, 'F'); // VIII
      doc.rect(startX, startY + 2 * cellSize, cellSize, cellSize, 'F'); // IX
      
      // Plot company position
      const posX = startX + (ifeScore - 1) * cellSize;
      const posY = startY + (4 - efeScore) * cellSize;
      
      doc.setFillColor(59, 130, 246); // Blue
      doc.circle(posX, posY, 5, 'F');
      
      yPosition = startY + 3 * cellSize + 30;
      
      // Add legend
      doc.setFontSize(10);
      doc.text("Legend:", 20, yPosition);
      yPosition += 10;
      
      doc.setFillColor(76, 175, 80, 0.3); // Green
      doc.rect(20, yPosition - 5, 10, 10, 'F');
      doc.text("Grow and Build (I, II, IV)", 35, yPosition);
      yPosition += 15;
      
      doc.setFillColor(251, 191, 36, 0.3); // Yellow
      doc.rect(20, yPosition - 5, 10, 10, 'F');
      doc.text("Hold and Maintain (V)", 35, yPosition);
      yPosition += 15;
      
      doc.setFillColor(244, 67, 54, 0.3); // Red
      doc.rect(20, yPosition - 5, 10, 10, 'F');
      doc.text("Harvest or Exit (III, VI, VII, VIII, IX)", 35, yPosition);
      yPosition += 20;
      
      // Add company position and recommendation
      const { cellId, strategy } = getStrategyRecommendation();
      
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("Company Position Analysis", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`IFE Score: ${ifeScore.toFixed(2)}`, 20, yPosition);
      yPosition += 7;
      doc.text(`EFE Score: ${efeScore.toFixed(2)}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Position: Cell ${cellId}`, 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("Strategy Recommendation", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const strategyLines = doc.splitTextToSize(strategy, 170);
      doc.text(strategyLines, 20, yPosition);
      
      // Add AI-Generated Strategies if available
      if (hasStrategies) {
        doc.addPage();
        yPosition = 20;
        
        // Section 6: AI-Generated Strategies
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text("6. AI-Generated Strategic Recommendations", 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("Based on your SWOT analysis, the following strategic recommendations have been generated", 20, yPosition);
        doc.text("to help guide your organization's strategic planning process.", 20, yPosition + 7);
        yPosition += 20;
        
        // SO Strategies
        if (soStrategies.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(76, 175, 80); // Green
          doc.text("SO Strategies (Strengths-Opportunities)", 20, yPosition);
          yPosition += 7;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Strategies that use internal strengths to take advantage of external opportunities", 20, yPosition);
          yPosition += 10;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          soStrategies.forEach((strategy, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. `, 20, yPosition);
            
            const strategyLines = doc.splitTextToSize(strategy.content, 165);
            doc.text(strategyLines, 30, yPosition);
            yPosition += strategyLines.length * 7 + 5;
          });
          
          yPosition += 5;
        }
        
        // ST Strategies
        if (stStrategies.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(33, 150, 243); // Blue
          doc.text("ST Strategies (Strengths-Threats)", 20, yPosition);
          yPosition += 7;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Strategies that use internal strengths to minimize external threats", 20, yPosition);
          yPosition += 10;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          stStrategies.forEach((strategy, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. `, 20, yPosition);
            
            const strategyLines = doc.splitTextToSize(strategy.content, 165);
            doc.text(strategyLines, 30, yPosition);
            yPosition += strategyLines.length * 7 + 5;
          });
          
          yPosition += 5;
        }
        
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }
        
        // WO Strategies
        if (woStrategies.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(251, 191, 36); // Amber
          doc.text("WO Strategies (Weaknesses-Opportunities)", 20, yPosition);
          yPosition += 7;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Strategies that improve internal weaknesses by taking advantage of external opportunities", 20, yPosition);
          yPosition += 10;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          woStrategies.forEach((strategy, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. `, 20, yPosition);
            
            const strategyLines = doc.splitTextToSize(strategy.content, 165);
            doc.text(strategyLines, 30, yPosition);
            yPosition += strategyLines.length * 7 + 5;
          });
          
          yPosition += 5;
        }
        
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }
        
        // WT Strategies
        if (wtStrategies.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(244, 67, 54); // Red
          doc.text("WT Strategies (Weaknesses-Threats)", 20, yPosition);
          yPosition += 7;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Strategies that minimize internal weaknesses and avoid external threats", 20, yPosition);
          yPosition += 10;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          wtStrategies.forEach((strategy, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. `, 20, yPosition);
            
            const strategyLines = doc.splitTextToSize(strategy.content, 165);
            doc.text(strategyLines, 30, yPosition);
            yPosition += strategyLines.length * 7 + 5;
          });
          
          yPosition += 5;
        }
        
        // Check if we need a new page
        if (yPosition > 230 && prioritizedStrategies.length > 0) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Prioritized Strategies
        if (prioritizedStrategies.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(44, 62, 80);
          doc.text("Prioritized Strategic Recommendations", 20, yPosition);
          yPosition += 7;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Based on your IE Matrix position, these strategies have been prioritized for implementation", 20, yPosition);
          yPosition += 10;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          prioritizedStrategies.forEach((strategy, index) => {
            doc.setFontSize(12);
            doc.text(`${index + 1}. `, 20, yPosition);
            
            const strategyLines = doc.splitTextToSize(strategy.content, 165);
            doc.text(strategyLines, 30, yPosition);
            yPosition += strategyLines.length * 7 + 5;
          });
        }
      }
      
      // Save the PDF
      doc.save("Strategic_Analysis_Report.pdf");
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const printReport = () => {
    setIsExporting(true);
    
    try {
      window.print();
    } catch (error) {
      console.error("Print error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Full Strategic Analysis Report</h3>
      <p className="text-slate-500 mb-6">
        Generate a comprehensive report with all analysis sections including Company Profile, SWOT Analysis, 
        IFE Matrix, EFE Matrix, and IE Matrix positioning.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="h-6 w-6" />
          <div className="text-left">
            <span className="font-medium block">Download as PDF</span>
            <span className="text-xs text-blue-100">Complete report in A4 format</span>
          </div>
        </button>
        
        <button
          onClick={printReport}
          disabled={isExporting}
          className="flex items-center justify-center gap-3 p-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Printer className="h-6 w-6" />
          <div className="text-left">
            <span className="font-medium block">Print Report</span>
            <span className="text-xs text-slate-300">Open browser print dialog</span>
          </div>
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-4 flex items-center justify-center py-3 bg-blue-50 text-blue-700 rounded-lg">
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full"></div>
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" style={{ animationDelay: "0.2s" }}></div>
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" style={{ animationDelay: "0.4s" }}></div>
          <span>Processing report...</span>
        </div>
      )}
      
      {/* Hidden print-only section that will be visible when printing */}
      <div className="hidden print:block">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Strategic Analysis Report</h1>
          <p className="text-center text-slate-500 mb-8">Generated: {new Date().toLocaleDateString()}</p>
          
          {/* Company Profile Section */}
          {companyProfile && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4">Company Profile</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Company Name</p>
                  <p>{companyProfile.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Industry Sector</p>
                  <p>{companyProfile.industry}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Company Description</p>
                <p>{companyProfile.description}</p>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Vision</p>
                <p>{companyProfile.vision}</p>
              </div>
              <div>
                <p className="font-semibold">Mission</p>
                <p>{companyProfile.mission}</p>
              </div>
            </div>
          )}
          
          {/* SWOT Analysis Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4">SWOT Analysis</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">Strengths</h3>
                <ul className="list-disc pl-5">
                  {swotItems
                    .filter(item => item.category === "strength")
                    .map((item, index) => (
                      <li key={index} className="mb-2">
                        {item.description}
                        {item.significance && (
                          <p className="text-sm text-slate-500 mt-1">Significance: {item.significance}</p>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Weaknesses</h3>
                <ul className="list-disc pl-5">
                  {swotItems
                    .filter(item => item.category === "weakness")
                    .map((item, index) => (
                      <li key={index} className="mb-2">
                        {item.description}
                        {item.significance && (
                          <p className="text-sm text-slate-500 mt-1">Significance: {item.significance}</p>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Opportunities</h3>
                <ul className="list-disc pl-5">
                  {swotItems
                    .filter(item => item.category === "opportunity")
                    .map((item, index) => (
                      <li key={index} className="mb-2">
                        {item.description}
                        {item.significance && (
                          <p className="text-sm text-slate-500 mt-1">Significance: {item.significance}</p>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Threats</h3>
                <ul className="list-disc pl-5">
                  {swotItems
                    .filter(item => item.category === "threat")
                    .map((item, index) => (
                      <li key={index} className="mb-2">
                        {item.description}
                        {item.significance && (
                          <p className="text-sm text-slate-500 mt-1">Significance: {item.significance}</p>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* IFE Matrix Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4">IFE Matrix</h2>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left">Factor</th>
                  <th className="border border-slate-300 p-2 text-left">Type</th>
                  <th className="border border-slate-300 p-2 text-center">Weight</th>
                  <th className="border border-slate-300 p-2 text-center">Rating</th>
                  <th className="border border-slate-300 p-2 text-center">Weighted Score</th>
                </tr>
              </thead>
              <tbody>
                {ifeFactors
                  .filter(factor => factor.category === "strength")
                  .map((factor, index) => (
                    <tr key={index} className="bg-green-50">
                      <td className="border border-slate-300 p-2">{factor.description}</td>
                      <td className="border border-slate-300 p-2">Strength</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>
                  ))}
                {ifeFactors
                  .filter(factor => factor.category === "weakness")
                  .map((factor, index) => (
                    <tr key={index} className="bg-red-50">
                      <td className="border border-slate-300 p-2">{factor.description}</td>
                      <td className="border border-slate-300 p-2">Weakness</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>
                  ))}
                <tr className="bg-slate-100 font-bold">
                  <td className="border border-slate-300 p-2" colSpan={2}>Total</td>
                  <td className="border border-slate-300 p-2 text-center">
                    {ifeFactors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2"></td>
                  <td className="border border-slate-300 p-2 text-center">{ifeScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4">
              <p className="font-semibold">Rating Scale:</p>
              <p>1 = Major Weakness, 2 = Minor Weakness, 3 = Minor Strength, 4 = Major Strength</p>
            </div>
          </div>
          
          {/* EFE Matrix Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4">EFE Matrix</h2>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left">Factor</th>
                  <th className="border border-slate-300 p-2 text-left">Type</th>
                  <th className="border border-slate-300 p-2 text-center">Weight</th>
                  <th className="border border-slate-300 p-2 text-center">Rating</th>
                  <th className="border border-slate-300 p-2 text-center">Weighted Score</th>
                </tr>
              </thead>
              <tbody>
                {efeFactors
                  .filter(factor => factor.category === "opportunity")
                  .map((factor, index) => (
                    <tr key={index} className="bg-blue-50">
                      <td className="border border-slate-300 p-2">{factor.description}</td>
                      <td className="border border-slate-300 p-2">Opportunity</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>
                  ))}
                {efeFactors
                  .filter(factor => factor.category === "threat")
                  .map((factor, index) => (
                    <tr key={index} className="bg-orange-50">
                      <td className="border border-slate-300 p-2">{factor.description}</td>
                      <td className="border border-slate-300 p-2">Threat</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>
                  ))}
                <tr className="bg-slate-100 font-bold">
                  <td className="border border-slate-300 p-2" colSpan={2}>Total</td>
                  <td className="border border-slate-300 p-2 text-center">
                    {efeFactors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2"></td>
                  <td className="border border-slate-300 p-2 text-center">{efeScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4">
              <p className="font-semibold">Rating Scale:</p>
              <p>1 = Poor Response, 2 = Average Response, 3 = Above Average Response, 4 = Superior Response</p>
            </div>
          </div>
          
          {/* IE Matrix Section */}
          <div>
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4">IE Matrix Positioning</h2>
            <div className="mb-4">
              <p><span className="font-semibold">IFE Score:</span> {ifeScore.toFixed(2)}</p>
              <p><span className="font-semibold">EFE Score:</span> {efeScore.toFixed(2)}</p>
              <p><span className="font-semibold">Position:</span> Cell {getStrategyRecommendation().cellId}</p>
            </div>
            <div>
              <p className="font-semibold">Strategy Recommendation:</p>
              <p>{getStrategyRecommendation().strategy}</p>
            </div>
          </div>
          
          {/* AI-Generated Strategies Section */}
          {(soStrategies.length > 0 || stStrategies.length > 0 || woStrategies.length > 0 || wtStrategies.length > 0) && (
            <div className="page-break-before">
              <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4">AI-Generated Strategic Recommendations</h2>
              
              {soStrategies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">SO Strategies (Strengths-Opportunities)</h3>
                  <p className="text-sm text-slate-600 mb-3">Strategies that use internal strengths to take advantage of external opportunities</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    {soStrategies.map((strategy, index) => (
                      <li key={index} className="mb-2">{strategy.content}</li>
                    ))}
                  </ol>
                </div>
              )}
              
              {stStrategies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">ST Strategies (Strengths-Threats)</h3>
                  <p className="text-sm text-slate-600 mb-3">Strategies that use internal strengths to minimize external threats</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    {stStrategies.map((strategy, index) => (
                      <li key={index} className="mb-2">{strategy.content}</li>
                    ))}
                  </ol>
                </div>
              )}
              
              {woStrategies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-700 mb-2">WO Strategies (Weaknesses-Opportunities)</h3>
                  <p className="text-sm text-slate-600 mb-3">Strategies that improve internal weaknesses by taking advantage of external opportunities</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    {woStrategies.map((strategy, index) => (
                      <li key={index} className="mb-2">{strategy.content}</li>
                    ))}
                  </ol>
                </div>
              )}
              
              {wtStrategies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-700 mb-2">WT Strategies (Weaknesses-Threats)</h3>
                  <p className="text-sm text-slate-600 mb-3">Strategies that minimize internal weaknesses and avoid external threats</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    {wtStrategies.map((strategy, index) => (
                      <li key={index} className="mb-2">{strategy.content}</li>
                    ))}
                  </ol>
                </div>
              )}
              
              {prioritizedStrategies.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Prioritized Strategic Recommendations</h3>
                  <p className="text-sm text-slate-600 mb-3">Based on your IE Matrix position, these strategies have been prioritized for implementation</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    {prioritizedStrategies.map((strategy, index) => (
                      <li key={index} className="mb-2">{strategy.content}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
