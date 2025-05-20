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
  efeScore
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
      setHasStrategies(savedSO && JSON.parse(savedSO).length > 0 || savedST && JSON.parse(savedST).length > 0 || savedWO && JSON.parse(savedWO).length > 0 || savedWT && JSON.parse(savedWT).length > 0);
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
      if (efeScore >= 3) cellId = "I";else if (efeScore >= 2) cellId = "IV";else cellId = "VII";
    } else if (ifeScore >= 2) {
      if (efeScore >= 3) cellId = "II";else if (efeScore >= 2) cellId = "V";else cellId = "VIII";
    } else {
      if (efeScore >= 3) cellId = "III";else if (efeScore >= 2) cellId = "VI";else cellId = "IX";
    }

    // Determine strategy
    if (["I", "II", "IV"].includes(cellId)) {
      strategy = "Grow and Build - Focus on intensive strategies like market penetration, market development, and product development. Consider integrative strategies such as backward, forward, or horizontal integration.";
    } else if (["III", "V", "VII"].includes(cellId)) {
      strategy = "Hold and Maintain - Focus on market penetration and product development strategies. These are two commonly employed strategies for this position.";
    } else {
      strategy = "Harvest or Exit - Don't expand; consider divesting, retrenching, or diversifying. If costs for rejuvenating the business are low, attempt to revitalize the business. Consider forming joint ventures to improve weaknesses.";
    }
    return {
      cellId,
      strategy
    };
  };
  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title page
      doc.setFontSize(24);
      doc.setTextColor(44, 62, 80);
      doc.text("Strategic Analysis Report", 105, yPosition, {
        align: "center"
      });
      yPosition += 15;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, yPosition, {
        align: "center"
      });
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
        doc.text(`${companyProfile.name}`, 105, yPosition, {
          align: "center"
        });
        yPosition += 7;
        doc.text(`${companyProfile.industry}`, 105, yPosition, {
          align: "center"
        });
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
          body: [...strengthFactors.map(factor => [factor.description, "Strength", factor.weight.toFixed(2), factor.rating, (factor.weight * factor.rating).toFixed(2)]), ...weaknessFactors.map(factor => [factor.description, "Weakness", factor.weight.toFixed(2), factor.rating, (factor.weight * factor.rating).toFixed(2)])],
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
            0: {
              cellWidth: 'auto'
            },
            1: {
              cellWidth: 30
            },
            2: {
              cellWidth: 30,
              halign: 'center'
            },
            3: {
              cellWidth: 30,
              halign: 'center'
            },
            4: {
              cellWidth: 40,
              halign: 'center'
            }
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
          body: [...opportunityFactors.map(factor => [factor.description, "Opportunity", factor.weight.toFixed(2), factor.rating, (factor.weight * factor.rating).toFixed(2)]), ...threatFactors.map(factor => [factor.description, "Threat", factor.weight.toFixed(2), factor.rating, (factor.weight * factor.rating).toFixed(2)])],
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
            0: {
              cellWidth: 'auto'
            },
            1: {
              cellWidth: 30
            },
            2: {
              cellWidth: 30,
              halign: 'center'
            },
            3: {
              cellWidth: 30,
              halign: 'center'
            },
            4: {
              cellWidth: 40,
              halign: 'center'
            }
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
      doc.text("IFE Scores", startX + 1.5 * cellSize, startY + 3 * cellSize + 15, {
        align: "center"
      });
      doc.text("EFE", startX - 15, startY + 1.5 * cellSize, {
        align: "center"
      });
      doc.text("Scores", startX - 15, startY + 1.5 * cellSize + 10, {
        align: "center"
      });

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
      const {
        cellId,
        strategy
      } = getStrategyRecommendation();
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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6" data-unique-id="1734434a-4a13-4595-b0a3-a20775cec7fd" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
      <h3 className="text-xl font-semibold text-slate-800 mb-4" data-unique-id="0a20c7ee-20b7-4840-8fc5-36a1f0089ef6" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="14bff8bd-1024-42ff-a98c-b065c787e565" data-file-name="components/FullReport.tsx">Full Strategic Analysis Report</span></h3>
      <p className="text-slate-500 mb-6" data-unique-id="1e7dad10-c389-4dd8-a2c6-96ba42e6c58c" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="ad49ac5a-1331-4486-9f88-145dc5c71b69" data-file-name="components/FullReport.tsx">
        Generate a comprehensive report with all analysis sections including Company Profile, SWOT Analysis, 
        IFE Matrix, EFE Matrix, and IE Matrix positioning.
      </span></p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="21b45da0-de4f-4c0a-ac48-c480ed27746c" data-file-name="components/FullReport.tsx">
        <button onClick={exportToPDF} disabled={isExporting} className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-unique-id="5fe1026e-db28-457c-afc5-f3a4b1434bc5" data-file-name="components/FullReport.tsx">
          <FileText className="h-6 w-6" />
          <div className="text-left" data-unique-id="492dbd47-e0ab-411a-9e99-0692c6477ea6" data-file-name="components/FullReport.tsx">
            <span className="font-medium block" data-unique-id="d10aa22b-872b-47a3-b804-19879e21818c" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="899ea833-16c8-478b-bf5b-dff847b01fd1" data-file-name="components/FullReport.tsx">Download as PDF</span></span>
            <span className="text-xs text-blue-100" data-unique-id="295dd4fa-3c5b-4ccd-bd29-ff9dafb614b9" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="0f89444f-8d4d-4461-a596-1a28330c2e6b" data-file-name="components/FullReport.tsx">Complete report in A4 format</span></span>
          </div>
        </button>
        
        <button onClick={printReport} disabled={isExporting} className="flex items-center justify-center gap-3 p-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors" data-unique-id="7f51a71c-fd8e-41f0-b34e-bb3d6df41bb9" data-file-name="components/FullReport.tsx">
          <Printer className="h-6 w-6" />
          <div className="text-left" data-unique-id="18b4f2d5-ebec-4499-957a-0714309993a9" data-file-name="components/FullReport.tsx">
            <span className="font-medium block" data-unique-id="96642c7d-99de-42bb-b228-a257c4c2cf1b" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="282db65e-cb28-4b22-9531-7b405abb88f7" data-file-name="components/FullReport.tsx">Print Report</span></span>
            <span className="text-xs text-slate-300" data-unique-id="5ff68961-4443-4ef4-93fc-b535abcfbbe0" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="dc9ed4aa-3bf8-409a-9076-14c2f6889995" data-file-name="components/FullReport.tsx">Open browser print dialog</span></span>
          </div>
        </button>
      </div>
      
      {isExporting && <div className="mt-4 flex items-center justify-center py-3 bg-blue-50 text-blue-700 rounded-lg" data-unique-id="ca768809-1d1f-484c-99fa-e3e9d7b043cd" data-file-name="components/FullReport.tsx">
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" data-unique-id="906c7206-c2d7-46ca-983e-07b0084d829e" data-file-name="components/FullReport.tsx"></div>
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" style={{
        animationDelay: "0.2s"
      }} data-unique-id="b19c2488-395d-4511-8072-1fc3d9fadf33" data-file-name="components/FullReport.tsx"></div>
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" style={{
        animationDelay: "0.4s"
      }} data-unique-id="aaa1713a-c73a-44b7-b97c-b70ba4e870c4" data-file-name="components/FullReport.tsx"></div>
          <span data-unique-id="2a1d2263-e54f-4036-8dfc-05de05fd9699" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="34ab7fe1-a53d-4e62-b3e2-c017691aba77" data-file-name="components/FullReport.tsx">Processing report...</span></span>
        </div>}
      
      {/* Hidden print-only section that will be visible when printing */}
      <div className="hidden print:block" data-unique-id="b847fbd3-fcd6-4ac3-b1cd-80715406933f" data-file-name="components/FullReport.tsx">
        <div className="p-8" data-unique-id="8e250726-ef17-415a-99b9-46f31ff2062b" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
          <h1 className="text-3xl font-bold text-center mb-6" data-unique-id="ca64cfc1-e81a-4fb6-9570-4779944622ab" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="783809dd-d105-46e4-a70a-c3df2596d025" data-file-name="components/FullReport.tsx">Strategic Analysis Report</span></h1>
          <p className="text-center text-slate-500 mb-8" data-unique-id="a8ecbc9d-db8e-42d1-ac2d-6bcb5cc7561c" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="150743d0-a298-408a-9d88-792ba9c40add" data-file-name="components/FullReport.tsx">Generated: </span>{new Date().toLocaleDateString()}</p>
          
          {/* Company Profile Section */}
          {companyProfile && <div className="mb-10" data-unique-id="aa40e11b-0688-42e7-b2b8-c88a2b19f939" data-file-name="components/FullReport.tsx">
              <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="9a9e575d-c4c7-4317-8116-2d396052e8fe" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="55dc7cef-d9e5-4014-b4db-a03bd53dfc93" data-file-name="components/FullReport.tsx">Company Profile</span></h2>
              <div className="grid grid-cols-2 gap-4 mb-4" data-unique-id="cfbcc3b9-a5aa-4a2c-ad05-232c8314182b" data-file-name="components/FullReport.tsx">
                <div data-unique-id="5def469a-019a-4c7d-bff8-ab0068be856d" data-file-name="components/FullReport.tsx">
                  <p className="font-semibold" data-unique-id="e4e989ab-522b-4f90-8d0e-b9b642f3e4cb" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="1be04fd5-7817-4037-be96-4b320cfabf4f" data-file-name="components/FullReport.tsx">Company Name</span></p>
                  <p data-unique-id="0c82738f-9288-4d93-a524-15d0db8d7aa3" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{companyProfile.name}</p>
                </div>
                <div data-unique-id="e2d10451-b200-47b2-b5dd-11579fc78f5c" data-file-name="components/FullReport.tsx">
                  <p className="font-semibold" data-unique-id="9bc98e08-9bcf-4a54-bc5a-bd4da0a06474" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="0dcc121b-c1f5-4b5b-b799-91b6070efb39" data-file-name="components/FullReport.tsx">Industry Sector</span></p>
                  <p data-unique-id="101c7978-4d8d-45c3-b121-055f7bd2c414" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{companyProfile.industry}</p>
                </div>
              </div>
              <div className="mb-4" data-unique-id="254cb1b9-6090-4924-9201-86eb3038b1fe" data-file-name="components/FullReport.tsx">
                <p className="font-semibold" data-unique-id="e7f04e80-6a83-4290-93b6-5543b8fe9f6f" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="7c03905a-b25c-433d-893c-c30e82d911d1" data-file-name="components/FullReport.tsx">Company Description</span></p>
                <p data-unique-id="a853e192-171f-4e5a-9b9e-59a9800b343a" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{companyProfile.description}</p>
              </div>
              <div className="mb-4" data-unique-id="b6ecd544-9d0f-4f16-b697-53e60de0fe99" data-file-name="components/FullReport.tsx">
                <p className="font-semibold" data-unique-id="e840e035-b070-405b-a35e-663e643662df" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="007328bc-092b-49c3-a02d-7ff9899a556b" data-file-name="components/FullReport.tsx">Vision</span></p>
                <p data-unique-id="1634ec6a-99bb-4ce9-9521-d9923260ac58" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{companyProfile.vision}</p>
              </div>
              <div data-unique-id="bd949463-ceb8-49bf-97f4-7e7bedf03071" data-file-name="components/FullReport.tsx">
                <p className="font-semibold" data-unique-id="8a26fd1d-afab-4e53-a625-503173ee7a83" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="622116ae-86c1-468a-8de5-24e10235b076" data-file-name="components/FullReport.tsx">Mission</span></p>
                <p data-unique-id="e07989f3-883a-4d39-8c64-f1d07b107393" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{companyProfile.mission}</p>
              </div>
            </div>}
          
          {/* SWOT Analysis Section */}
          <div className="mb-10" data-unique-id="ddc23884-1531-4b81-b883-373d4ec4d6c6" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="29f5b815-a02a-40cb-b4e3-02f8d73fcb93" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="76301bbe-bc87-4576-926a-4f47becc7b3c" data-file-name="components/FullReport.tsx">SWOT Analysis</span></h2>
            <div className="grid grid-cols-2 gap-6" data-unique-id="b055b201-9252-445f-adb9-4ce8f5459678" data-file-name="components/FullReport.tsx">
              <div data-unique-id="16a11f1f-0d31-4fc1-9ba9-2dbe7a1d4e53" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-green-700 mb-2" data-unique-id="5ddba0b4-6cb9-451e-a5c3-be648e57a523" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="56c0d9ff-512c-4bcd-ad7f-ff72da30706b" data-file-name="components/FullReport.tsx">Strengths</span></h3>
                <ul className="list-disc pl-5" data-unique-id="0529f210-21df-409b-809c-925710bd132a" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                  {swotItems.filter(item => item.category === "strength").map((item, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="4104d739-a427-4d35-9874-c9b266f20add" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-is-mapped="true" data-unique-id="1eab3047-5155-4628-a8db-fbadba601c95" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="442f9d8b-2fe4-4a77-a7cb-f34c72496609" data-file-name="components/FullReport.tsx">Significance: </span>{item.significance}</p>}
                      </li>)}
                </ul>
              </div>
              <div data-unique-id="87071847-b7d4-41fc-99c7-5a757088b2ff" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-red-700 mb-2" data-unique-id="f35dfe22-7312-4cd1-93e8-b79ad9374bc1" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="6b877097-bde1-4353-ba87-4bfc94e961cb" data-file-name="components/FullReport.tsx">Weaknesses</span></h3>
                <ul className="list-disc pl-5" data-unique-id="ef7997c6-c575-4587-b0df-66d01edfac13" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                  {swotItems.filter(item => item.category === "weakness").map((item, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="87ba4e4b-890f-4014-a93c-7188388d6d22" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-is-mapped="true" data-unique-id="2bdd4772-5b91-4569-8757-4867d276c31c" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="041ba231-d986-4bc1-8ac2-6bab495d8f80" data-file-name="components/FullReport.tsx">Significance: </span>{item.significance}</p>}
                      </li>)}
                </ul>
              </div>
              <div data-unique-id="fa8a0a8a-8c56-4f74-9bab-de2b239bac55" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-blue-700 mb-2" data-unique-id="24a2bc0a-eb9e-4c82-9a4c-dbe8c0f1bdc2" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="97117392-f159-48e3-8bac-59446580cb76" data-file-name="components/FullReport.tsx">Opportunities</span></h3>
                <ul className="list-disc pl-5" data-unique-id="62cc2df9-7755-4c6b-bb78-d1ed6b2c17f9" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                  {swotItems.filter(item => item.category === "opportunity").map((item, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="34dced65-d9c5-4934-8b41-a18dd29b2bf3" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-is-mapped="true" data-unique-id="82d6685a-57ab-4b1a-bc84-107b3d0d7126" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="92eeecc8-5522-4bc7-9011-2a11d4e595e4" data-file-name="components/FullReport.tsx">Significance: </span>{item.significance}</p>}
                      </li>)}
                </ul>
              </div>
              <div data-unique-id="6e588134-4a70-4717-a3b8-74a7a394f008" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-orange-700 mb-2" data-unique-id="eb1dbfab-215b-4516-9894-2fabcc75ae53" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="f01bcd12-df9c-42d4-86b3-6dff609b2180" data-file-name="components/FullReport.tsx">Threats</span></h3>
                <ul className="list-disc pl-5" data-unique-id="52e9ea26-2a81-47df-9e5d-f6a80b9ef9b9" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                  {swotItems.filter(item => item.category === "threat").map((item, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="bd42fc17-fde7-4011-9021-a792359aef4e" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-is-mapped="true" data-unique-id="8c785901-c260-4a14-89ee-142407e40f2e" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="68abb2cd-b51e-4825-aff5-7cc985610592" data-file-name="components/FullReport.tsx">Significance: </span>{item.significance}</p>}
                      </li>)}
                </ul>
              </div>
            </div>
          </div>
          
          {/* IFE Matrix Section */}
          <div className="mb-10" data-unique-id="6a7bc793-37f2-45fd-94b6-8f9cfa18e6f1" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="b2a2b878-93b0-42bf-bf37-0f493e117e01" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="422bfc6d-4f6a-46af-a378-a1901172fca3" data-file-name="components/FullReport.tsx">IFE Matrix</span></h2>
            <table className="w-full border-collapse mb-4" data-unique-id="46d39e88-8b36-46de-a99c-79129bf9fcc8" data-file-name="components/FullReport.tsx">
              <thead data-unique-id="8d964a22-9ce8-4893-96db-691ca3ee37d7" data-file-name="components/FullReport.tsx">
                <tr className="bg-slate-100" data-unique-id="db308e90-cd14-4ccc-ab22-59950f831280" data-file-name="components/FullReport.tsx">
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="cabd8735-ee57-41c8-a4f5-724328f14e5e" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="90e1f125-cf72-423f-aaff-df5139a59740" data-file-name="components/FullReport.tsx">Factor</span></th>
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="62174d0a-5b71-4f6c-bb53-fa1380a9cdeb" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="6f1edb4c-a1f5-4d99-9beb-125a6a23a024" data-file-name="components/FullReport.tsx">Type</span></th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="a149a470-4e0e-477b-90c1-12efe70ab6ef" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="4b45758e-912f-46c1-b7de-03ce4d79434f" data-file-name="components/FullReport.tsx">Weight</span></th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="93d97891-4ae5-4d25-8bcf-42a8aa5aff9c" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="0a20f42e-1e00-42cb-9618-ac37cd0513ee" data-file-name="components/FullReport.tsx">Rating</span></th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="cf4c2d5c-95e2-426d-a7ce-8729f10058b5" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="e46949db-7681-4fdb-bb68-5930df6df7c3" data-file-name="components/FullReport.tsx">Weighted Score</span></th>
                </tr>
              </thead>
              <tbody data-unique-id="b80a483e-1156-45ab-85b4-cb3b1bedd650" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                {ifeFactors.filter(factor => factor.category === "strength").map((factor, index) => <tr key={index} className="bg-green-50" data-is-mapped="true" data-unique-id="f9aab18a-3f88-4417-8431-b497b304a761" data-file-name="components/FullReport.tsx">
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="c7b14c5c-5869-4993-8b42-4c3a80b94dbb" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="752b23ca-eaca-4e46-9974-ac6d1b076565" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="3be415ba-b35a-4151-b117-1247016a11ef" data-file-name="components/FullReport.tsx">Strength</span></td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="0e9d96f3-b69d-4a5e-aa35-6abc662f93ec" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="f293c422-dce1-4f82-ae91-1ca2977ed761" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="a7606694-09f7-45bf-82ba-bb46ac64c090" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                {ifeFactors.filter(factor => factor.category === "weakness").map((factor, index) => <tr key={index} className="bg-red-50" data-is-mapped="true" data-unique-id="23a505d1-a907-4e23-bdcd-f3b64a6b6d02" data-file-name="components/FullReport.tsx">
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="0454e33d-6272-458d-b36d-5ac5fd264a49" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="710d3901-743a-40de-a5ae-43452ac79939" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="f51e0845-c37b-4362-aaad-d9537be4cdd1" data-file-name="components/FullReport.tsx">Weakness</span></td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="de185c09-0f28-4a36-bfad-115a197dae1f" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="a07ba072-0fad-4c3b-91a2-2cdcd177cbdd" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="782840fd-eb45-4305-866d-26a9281e3cb6" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                <tr className="bg-slate-100 font-bold" data-unique-id="2fd14f9b-dd9c-4644-b0dd-4d045f8c9366" data-file-name="components/FullReport.tsx">
                  <td className="border border-slate-300 p-2" colSpan={2} data-unique-id="ad47fdc7-4159-42f8-b197-aaf9ae8a4468" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="1c629970-7200-4a27-9f6f-4478f087f6ea" data-file-name="components/FullReport.tsx">Total</span></td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="64c398c9-de87-413e-bb70-6d3a9f4020b5" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {ifeFactors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2" data-unique-id="ed2fb74d-f6d1-4cd2-95f5-61692e4028ec" data-file-name="components/FullReport.tsx"></td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="8e4f5944-b12e-4fff-9161-90e584bf4d0c" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{ifeScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4" data-unique-id="c7381750-bef5-467b-ab84-af18da6eaa1c" data-file-name="components/FullReport.tsx">
              <p className="font-semibold" data-unique-id="0478d071-153e-4149-b765-22fb62752eec" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="75f4f1ba-0458-4001-b734-999b1ba89933" data-file-name="components/FullReport.tsx">Rating Scale:</span></p>
              <p data-unique-id="78f1a397-f08b-4855-ab19-922b3d1b98ee" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="d08419b2-2e9e-4afa-b3ae-c10a19f8b19b" data-file-name="components/FullReport.tsx">1 = Major Weakness, 2 = Minor Weakness, 3 = Minor Strength, 4 = Major Strength</span></p>
            </div>
          </div>
          
          {/* EFE Matrix Section */}
          <div className="mb-10" data-unique-id="d15d18d5-c33f-4911-a643-f3314960784f" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="d5593c47-f8fb-476a-b2d8-3cac1c0927ba" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="b58d8b35-449a-47f4-bddb-902fbd9b9422" data-file-name="components/FullReport.tsx">EFE Matrix</span></h2>
            <table className="w-full border-collapse mb-4" data-unique-id="0c77c72d-2fc3-4432-8c5b-1514362dee1a" data-file-name="components/FullReport.tsx">
              <thead data-unique-id="0896d38c-7083-41ae-90be-ac2255cd3611" data-file-name="components/FullReport.tsx">
                <tr className="bg-slate-100" data-unique-id="be8c7281-d59f-463a-8ab1-87442803912e" data-file-name="components/FullReport.tsx">
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="f2a7440c-fbb8-4331-9b67-4d71c2862709" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="c97276cc-16d9-477b-b16b-ce8870fb496f" data-file-name="components/FullReport.tsx">Factor</span></th>
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="76ac267d-7bb1-4a43-b684-a98a3b15d526" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="29c7e3cf-ae9a-4d75-b4f5-f099c0b9db8c" data-file-name="components/FullReport.tsx">Type</span></th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="af89b677-3309-4576-9223-804b40432feb" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="ceb40163-251e-46ab-99eb-aa9cf3b77ffc" data-file-name="components/FullReport.tsx">Weight</span></th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="c7bb22a4-160f-4094-baf0-7e866d6f5c61" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="07ef971c-0eb2-43c7-8f12-66324b8c029a" data-file-name="components/FullReport.tsx">Rating</span></th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="4544da86-6929-4858-8d72-5096afdecc1a" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="385ee2d8-379c-4fc6-a24d-0b8d35fd02c5" data-file-name="components/FullReport.tsx">Weighted Score</span></th>
                </tr>
              </thead>
              <tbody data-unique-id="149aa53a-246c-4f6e-9553-e0a80ab62f8b" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                {efeFactors.filter(factor => factor.category === "opportunity").map((factor, index) => <tr key={index} className="bg-blue-50" data-is-mapped="true" data-unique-id="0e9f737a-6550-4042-841c-96f2d7a3034b" data-file-name="components/FullReport.tsx">
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="25e10a59-e8f0-45e0-9cfb-8c6c05d42979" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="d0010a57-3ec6-474c-b5c0-b043b11a15f8" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="28002285-a696-4276-b96f-a987bd4f5a37" data-file-name="components/FullReport.tsx">Opportunity</span></td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="dedc42cf-10e2-4ac6-a1ac-fd16d2020173" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="6088d38c-f509-4e97-85ab-368a84ea2ebd" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="ca03424a-7f00-4264-a92c-1f3914d0ee75" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                {efeFactors.filter(factor => factor.category === "threat").map((factor, index) => <tr key={index} className="bg-orange-50" data-is-mapped="true" data-unique-id="7f02870d-f682-4a00-9905-2428ff58a9a4" data-file-name="components/FullReport.tsx">
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="831ba09b-1096-4254-b004-547997d28b42" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-is-mapped="true" data-unique-id="f4a8b46f-dcf9-4c45-9e92-e1152ec772e7" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="908b8036-0c4e-4035-b53d-eb1693ead12b" data-file-name="components/FullReport.tsx">Threat</span></td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="5bda4f0a-43cd-4a0d-84a9-961fece32c74" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="6a2cc86b-eaf7-4f20-97f0-6c0cdb87830e" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-is-mapped="true" data-unique-id="8b177263-e8d1-4489-a8a3-fa4a09e86977" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                <tr className="bg-slate-100 font-bold" data-unique-id="cff548cc-264f-444c-b511-c8e1163ecfd0" data-file-name="components/FullReport.tsx">
                  <td className="border border-slate-300 p-2" colSpan={2} data-unique-id="afc13ea2-b4bb-41dd-98c8-42a6887bfabc" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="5acad6a9-c1c7-4003-9952-d07e9df9c4b1" data-file-name="components/FullReport.tsx">Total</span></td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="2d4d3931-8384-46c8-bab4-f3cd3517dc25" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {efeFactors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2" data-unique-id="29897d04-3831-4039-9c92-b6c68ebcc8b2" data-file-name="components/FullReport.tsx"></td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="a974775c-f033-4715-ab51-a7d43f1392fd" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{efeScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4" data-unique-id="33325efb-2404-4cae-8483-39109f1a5ce2" data-file-name="components/FullReport.tsx">
              <p className="font-semibold" data-unique-id="bb335ab5-3419-4a99-aafa-e8a6b75a3601" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="f7e9d7cd-3f6a-491f-93c3-a7c7d7e26aa7" data-file-name="components/FullReport.tsx">Rating Scale:</span></p>
              <p data-unique-id="66f2f7e4-0ac6-4f52-be2b-66f332695598" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="3c21bf85-2c92-43c5-a50c-cedd8af14f47" data-file-name="components/FullReport.tsx">1 = Poor Response, 2 = Average Response, 3 = Above Average Response, 4 = Superior Response</span></p>
            </div>
          </div>
          
          {/* IE Matrix Section */}
          <div data-unique-id="11b3fa0c-bbe9-4cde-a2d3-e35fbb9369f0" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="bd6d870e-3e0c-4911-834d-d71a1f73c6fa" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="34acc56e-103f-4105-b1db-0366b4971d99" data-file-name="components/FullReport.tsx">IE Matrix Positioning</span></h2>
            <div className="mb-4" data-unique-id="b3b7038d-a1e9-48ec-91dc-fbd595a9cbfd" data-file-name="components/FullReport.tsx">
              <p data-unique-id="e3e2e79c-2222-42f9-94f6-16e5b64cfefc" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="font-semibold" data-unique-id="3edf1a5a-d4a1-414e-935f-0158a9657b03" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="2217ba2a-9056-45d8-9d31-9308577be7e5" data-file-name="components/FullReport.tsx">IFE Score:</span></span> {ifeScore.toFixed(2)}</p>
              <p data-unique-id="651efb0d-97d1-4f52-8f08-2c8adf6a5c7a" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="font-semibold" data-unique-id="142ed20c-c7e1-4695-96f2-6dbed9f1411d" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="b28f30ae-a57a-498c-be3a-1a4ad94b4259" data-file-name="components/FullReport.tsx">EFE Score:</span></span> {efeScore.toFixed(2)}</p>
              <p data-unique-id="78c181a1-a946-4318-9f0d-12d1770ae659" data-file-name="components/FullReport.tsx" data-dynamic-text="true"><span className="font-semibold" data-unique-id="ddd1dd91-fb9d-4cf5-98a0-2f9f1eb3ae3b" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="4120fd95-d89b-4723-a103-c7eb2177c292" data-file-name="components/FullReport.tsx">Position:</span></span><span className="editable-text" data-unique-id="5ccfa4c4-79bc-42bb-8f28-7c4f7c461360" data-file-name="components/FullReport.tsx"> Cell </span>{getStrategyRecommendation().cellId}</p>
            </div>
            <div data-unique-id="2ee21367-d038-421a-ac7f-cc38c156a465" data-file-name="components/FullReport.tsx">
              <p className="font-semibold" data-unique-id="d68e3996-2d06-44c2-82da-d4febe97bdfb" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="686a562f-9fe4-4f6e-824f-ae308980ee8f" data-file-name="components/FullReport.tsx">Strategy Recommendation:</span></p>
              <p data-unique-id="6201fb0b-b25d-46a5-99a9-a27b677888cf" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{getStrategyRecommendation().strategy}</p>
            </div>
          </div>
          
          {/* AI-Generated Strategies Section */}
          {(soStrategies.length > 0 || stStrategies.length > 0 || woStrategies.length > 0 || wtStrategies.length > 0) && <div className="page-break-before" data-unique-id="ed72f4ec-3a51-4494-b222-eb5acbb795b0" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
              <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="a421bb8b-3edf-4793-8a49-bd59032d91b8" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="7833ec7a-fd49-4d12-b348-2ff4b21f9f08" data-file-name="components/FullReport.tsx">AI-Generated Strategic Recommendations</span></h2>
              
              {soStrategies.length > 0 && <div className="mb-6" data-unique-id="ef53e25f-4570-43ab-b411-e69d9f3f796c" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-green-700 mb-2" data-unique-id="9371d05c-a914-41cc-ac44-914d9e6b1436" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="e38df323-4a0b-4f27-b160-6cf98ddcc91f" data-file-name="components/FullReport.tsx">SO Strategies (Strengths-Opportunities)</span></h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="d40addf2-fd4f-4e90-bd4a-906294e54af2" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="733f9a83-1d2d-4d0d-9479-2767ce3418bb" data-file-name="components/FullReport.tsx">Strategies that use internal strengths to take advantage of external opportunities</span></p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="e336281c-8370-4f21-a79d-2e0b89047e2c" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {soStrategies.map((strategy, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="c7420798-f808-494c-aced-d177da2f31fe" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {stStrategies.length > 0 && <div className="mb-6" data-unique-id="3f5b6776-4951-481a-a132-f6d7420ab8e9" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2" data-unique-id="8000a7c0-3e67-474a-bb74-e345d938dbbe" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="25088893-fc24-438d-921d-58f064c231f9" data-file-name="components/FullReport.tsx">ST Strategies (Strengths-Threats)</span></h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="7e2befed-c7f6-4f81-a37e-29794df31920" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="a984c560-cfd4-4fc3-babd-26820ed2308e" data-file-name="components/FullReport.tsx">Strategies that use internal strengths to minimize external threats</span></p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="c7e59490-425a-4e19-abdb-ce6d8145fa8c" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {stStrategies.map((strategy, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="8b55866d-400f-4780-89a9-c28512ba481f" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {woStrategies.length > 0 && <div className="mb-6" data-unique-id="ef9f7faa-b669-40e3-8cb6-b2b0bdcc08c0" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-amber-700 mb-2" data-unique-id="152412de-e913-41f8-9400-709b2ee920e6" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="03f5b504-a65f-4870-a5d3-f85a2fdc779c" data-file-name="components/FullReport.tsx">WO Strategies (Weaknesses-Opportunities)</span></h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="7863d8a4-a330-4c86-98df-f1174824afcb" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="9410e0dc-1364-4532-9c9d-4eb1f21c125d" data-file-name="components/FullReport.tsx">Strategies that improve internal weaknesses by taking advantage of external opportunities</span></p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="50c46ad8-95b0-4840-9612-ba740f93563d" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {woStrategies.map((strategy, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="6e4c1ecc-7217-410a-86e9-30a2546767f5" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {wtStrategies.length > 0 && <div className="mb-6" data-unique-id="e7a6983d-f914-4a58-a2a4-329ff5f4644f" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-red-700 mb-2" data-unique-id="372828b4-fee1-4a01-a440-2aa74690f21e" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="bf3084e8-8c2f-4afc-9b5b-7a7d7d8643cd" data-file-name="components/FullReport.tsx">WT Strategies (Weaknesses-Threats)</span></h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="851c7c5d-358a-4d30-8139-2cc85ba3f969" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="d54d1525-cc2d-4d60-b6ac-10b71715b630" data-file-name="components/FullReport.tsx">Strategies that minimize internal weaknesses and avoid external threats</span></p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="e7996667-9bcd-4f55-8697-93ed4f880271" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {wtStrategies.map((strategy, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="f794f948-db43-46ad-aa88-bf6fb4ad2e9d" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {prioritizedStrategies.length > 0 && <div className="mt-8" data-unique-id="0c83bf16-1f69-4436-8f99-925467d61147" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2" data-unique-id="7f2dcf26-5f71-44c1-baea-fd7ae67a930b" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="46d13019-da9a-4ec6-84e8-2055aa077695" data-file-name="components/FullReport.tsx">Prioritized Strategic Recommendations</span></h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="4bdde0b1-690c-4aad-be79-f7a61e7d7cf6" data-file-name="components/FullReport.tsx"><span className="editable-text" data-unique-id="a722b2f8-0357-40ad-913e-00336524ce1b" data-file-name="components/FullReport.tsx">Based on your IE Matrix position, these strategies have been prioritized for implementation</span></p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="7da80ab9-741e-436c-983f-0efa7ce2086d" data-file-name="components/FullReport.tsx" data-dynamic-text="true">
                    {prioritizedStrategies.map((strategy, index) => <li key={index} className="mb-2" data-is-mapped="true" data-unique-id="e09f84b4-f3cf-4795-b380-8cf3f5f66ec2" data-file-name="components/FullReport.tsx" data-dynamic-text="true">{strategy.content}</li>)}
                  </ol>
                </div>}
            </div>}
        </div>
      </div>
    </motion.div>;
}