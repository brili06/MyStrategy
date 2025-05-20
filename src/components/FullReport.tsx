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
  }} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6" data-unique-id="4caed33e-d96b-4840-a5ce-2129a4a542e2" data-loc="920:4-925:5" data-file-name="components/FullReport.tsx">
      <h3 className="text-xl font-semibold text-slate-800 mb-4" data-unique-id="3bd480a3-90f0-4dd6-844e-c762009c0d9f" data-loc="926:6-926:64" data-file-name="components/FullReport.tsx">Full Strategic Analysis Report</h3>
      <p className="text-slate-500 mb-6" data-unique-id="d1916648-e590-4679-a8fe-6f63cef5a355" data-loc="927:6-927:41" data-file-name="components/FullReport.tsx">
        Generate a comprehensive report with all analysis sections including Company Profile, SWOT Analysis, 
        IFE Matrix, EFE Matrix, and IE Matrix positioning.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="46a91f59-2f91-48e8-a363-31cda22666c5" data-loc="932:6-932:61" data-file-name="components/FullReport.tsx">
        <button onClick={exportToPDF} disabled={isExporting} className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-unique-id="f5f61fe3-525a-475a-80bf-1e96c0c412d4" data-loc="933:8-937:9" data-file-name="components/FullReport.tsx">
          <FileText className="h-6 w-6" />
          <div className="text-left" data-unique-id="bc19bf7b-5ea8-45be-bcd1-b0306ece3b7f" data-loc="939:10-939:37" data-file-name="components/FullReport.tsx">
            <span className="font-medium block" data-unique-id="1e64e1a1-c6a5-4838-b49f-910ed6857cb6" data-loc="940:12-940:48" data-file-name="components/FullReport.tsx">Download as PDF</span>
            <span className="text-xs text-blue-100" data-unique-id="d5247ebf-fa51-452d-a128-c00fcef01d42" data-loc="941:12-941:52" data-file-name="components/FullReport.tsx">Complete report in A4 format</span>
          </div>
        </button>
        
        <button onClick={printReport} disabled={isExporting} className="flex items-center justify-center gap-3 p-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors" data-unique-id="366b19a5-7ca7-4ccd-ac54-165ae427dc22" data-loc="945:8-949:9" data-file-name="components/FullReport.tsx">
          <Printer className="h-6 w-6" />
          <div className="text-left" data-unique-id="35b3ce6a-7247-42c5-b466-3f0244e5af8b" data-loc="951:10-951:37" data-file-name="components/FullReport.tsx">
            <span className="font-medium block" data-unique-id="c948aef9-a83c-4ade-9b3b-b52e98484722" data-loc="952:12-952:48" data-file-name="components/FullReport.tsx">Print Report</span>
            <span className="text-xs text-slate-300" data-unique-id="8e6ed7aa-2470-4a60-b621-b84ae5b69a2b" data-loc="953:12-953:53" data-file-name="components/FullReport.tsx">Open browser print dialog</span>
          </div>
        </button>
      </div>
      
      {isExporting && <div className="mt-4 flex items-center justify-center py-3 bg-blue-50 text-blue-700 rounded-lg" data-unique-id="642bfc91-2119-486a-9870-6ffc5075aabf" data-loc="959:8-959:104" data-file-name="components/FullReport.tsx">
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" data-unique-id="00de4ff8-69e1-4e81-aeee-6bcec92e8562" data-loc="960:10-960:79" data-file-name="components/FullReport.tsx"></div>
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" style={{
        animationDelay: "0.2s"
      }} data-unique-id="77169d33-e063-434a-88fa-5e65c94dbf07" data-loc="961:10-961:114" data-file-name="components/FullReport.tsx"></div>
          <div className="animate-pulse mr-2 h-2 w-2 bg-blue-600 rounded-full" style={{
        animationDelay: "0.4s"
      }} data-unique-id="d58c97fd-66ab-4122-a338-2a6f778dfe5f" data-loc="962:10-962:114" data-file-name="components/FullReport.tsx"></div>
          <span data-unique-id="5a32201c-a417-43b7-8413-af8df8eb1f33" data-loc="963:10-963:16" data-file-name="components/FullReport.tsx">Processing report...</span>
        </div>}
      
      {/* Hidden print-only section that will be visible when printing */}
      <div className="hidden print:block" data-unique-id="40e84e5c-b443-40c5-a1b9-4d263e313673" data-loc="968:6-968:42" data-file-name="components/FullReport.tsx">
        <div className="p-8" data-unique-id="5d67c514-20a5-405e-b70e-d65a47b523df" data-loc="969:8-969:29" data-file-name="components/FullReport.tsx">
          <h1 className="text-3xl font-bold text-center mb-6" data-unique-id="e9081eb5-b48c-4720-b818-f288c3684a93" data-loc="970:10-970:62" data-file-name="components/FullReport.tsx">Strategic Analysis Report</h1>
          <p className="text-center text-slate-500 mb-8" data-unique-id="9969144b-4773-40af-b98a-dfa35ec147b5" data-loc="971:10-971:57" data-file-name="components/FullReport.tsx">Generated: {new Date().toLocaleDateString()}</p>
          
          {/* Company Profile Section */}
          {companyProfile && <div className="mb-10" data-unique-id="ab98f004-82e3-4e85-bd8b-1ca77d54e9f3" data-loc="975:12-975:35" data-file-name="components/FullReport.tsx">
              <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="056abae0-29cd-474f-8460-ce2ce726d2f8" data-loc="976:14-976:87" data-file-name="components/FullReport.tsx">Company Profile</h2>
              <div className="grid grid-cols-2 gap-4 mb-4" data-unique-id="f17ec228-53e2-43cc-b9f5-fca9e56cc66e" data-loc="977:14-977:59" data-file-name="components/FullReport.tsx">
                <div data-unique-id="49474b56-8dfd-4c4f-a78d-28b592516b87" data-loc="978:16-978:21" data-file-name="components/FullReport.tsx">
                  <p className="font-semibold" data-unique-id="d634ffe0-aee8-43c0-967a-99c057b0297f" data-loc="979:18-979:47" data-file-name="components/FullReport.tsx">Company Name</p>
                  <p data-unique-id="d2adb4aa-eb30-48f9-af42-2b2a7c4d963d" data-loc="980:18-980:21" data-file-name="components/FullReport.tsx">{companyProfile.name}</p>
                </div>
                <div data-unique-id="cc84ab82-de51-43fa-b5c9-ee6bd79f5079" data-loc="982:16-982:21" data-file-name="components/FullReport.tsx">
                  <p className="font-semibold" data-unique-id="ef219064-b977-4064-bb91-6fb2dc2f959d" data-loc="983:18-983:47" data-file-name="components/FullReport.tsx">Industry Sector</p>
                  <p data-unique-id="defd1459-5a59-45b0-ae00-92f82fcaf388" data-loc="984:18-984:21" data-file-name="components/FullReport.tsx">{companyProfile.industry}</p>
                </div>
              </div>
              <div className="mb-4" data-unique-id="7a649383-e4d4-4707-8f25-79da8dff1fa2" data-loc="987:14-987:36" data-file-name="components/FullReport.tsx">
                <p className="font-semibold" data-unique-id="22eef04a-fa02-48d7-bdd2-5a352830d872" data-loc="988:16-988:45" data-file-name="components/FullReport.tsx">Company Description</p>
                <p data-unique-id="1b2287e0-ef2e-43d6-a0fc-16b68e959e2e" data-loc="989:16-989:19" data-file-name="components/FullReport.tsx">{companyProfile.description}</p>
              </div>
              <div className="mb-4" data-unique-id="50904960-9ae2-492b-b8f2-5d7215825f9f" data-loc="991:14-991:36" data-file-name="components/FullReport.tsx">
                <p className="font-semibold" data-unique-id="2232dea1-aeeb-4afa-be6e-415985cf331b" data-loc="992:16-992:45" data-file-name="components/FullReport.tsx">Vision</p>
                <p data-unique-id="dd4542c2-0ebc-4afa-9862-8ef38f914373" data-loc="993:16-993:19" data-file-name="components/FullReport.tsx">{companyProfile.vision}</p>
              </div>
              <div data-unique-id="9a792001-2ed4-4771-8032-2ddc8e003cc7" data-loc="995:14-995:19" data-file-name="components/FullReport.tsx">
                <p className="font-semibold" data-unique-id="06d7ab54-badb-4e10-97fb-06faf35e0917" data-loc="996:16-996:45" data-file-name="components/FullReport.tsx">Mission</p>
                <p data-unique-id="2ecd46dc-8f45-41c6-8e05-48a24dee8162" data-loc="997:16-997:19" data-file-name="components/FullReport.tsx">{companyProfile.mission}</p>
              </div>
            </div>}
          
          {/* SWOT Analysis Section */}
          <div className="mb-10" data-unique-id="b978fcea-9381-4d97-b063-baab2a384163" data-loc="1003:10-1003:33" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="166823da-7df0-4944-a996-869516186382" data-loc="1004:12-1004:85" data-file-name="components/FullReport.tsx">SWOT Analysis</h2>
            <div className="grid grid-cols-2 gap-6" data-unique-id="a935cf2d-8e38-4cc3-a738-cf4ee770139e" data-loc="1005:12-1005:52" data-file-name="components/FullReport.tsx">
              <div data-unique-id="558e3a1a-dd2c-4bc8-9030-31340bc09f87" data-loc="1006:14-1006:19" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-green-700 mb-2" data-unique-id="283ea6c7-217a-4717-99cc-3bd884f38f7c" data-loc="1007:16-1007:74" data-file-name="components/FullReport.tsx">Strengths</h3>
                <ul className="list-disc pl-5" data-unique-id="c3b50e15-19c5-4729-aa91-52a1fa231097" data-loc="1008:16-1008:47" data-file-name="components/FullReport.tsx">
                  {swotItems.filter(item => item.category === "strength").map((item, index) => <li key={index} className="mb-2" data-unique-id="map_ef8dbc5d-9843-4b74-944b-3f71fbd54e61" data-loc="1012:22-1012:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-unique-id="map_2c388d40-e58e-4398-b023-95a481ed51c7" data-loc="1015:26-1015:69" data-file-name="components/FullReport.tsx" data-is-mapped="true">Significance: {item.significance}</p>}
                      </li>)}
                </ul>
              </div>
              <div data-unique-id="696637d7-ff88-4ea5-80d7-05119a50b382" data-loc="1021:14-1021:19" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-red-700 mb-2" data-unique-id="cf9a4668-21d6-44e8-b3a5-d9743f72ba83" data-loc="1022:16-1022:72" data-file-name="components/FullReport.tsx">Weaknesses</h3>
                <ul className="list-disc pl-5" data-unique-id="3617d319-1de6-4771-8436-0767f4dea9fa" data-loc="1023:16-1023:47" data-file-name="components/FullReport.tsx">
                  {swotItems.filter(item => item.category === "weakness").map((item, index) => <li key={index} className="mb-2" data-unique-id="map_db6147df-449f-4ea9-a088-e5075313420a" data-loc="1027:22-1027:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-unique-id="map_cd4bb9fe-066d-4259-9e2c-8feb8cb236f4" data-loc="1030:26-1030:69" data-file-name="components/FullReport.tsx" data-is-mapped="true">Significance: {item.significance}</p>}
                      </li>)}
                </ul>
              </div>
              <div data-unique-id="f67dd585-cfc6-4e0f-a234-99a858cd408b" data-loc="1036:14-1036:19" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-blue-700 mb-2" data-unique-id="7310ba6c-f4e9-4024-bbaa-9f9eede3fea5" data-loc="1037:16-1037:73" data-file-name="components/FullReport.tsx">Opportunities</h3>
                <ul className="list-disc pl-5" data-unique-id="6c159bb0-6763-475f-bf5d-205d3384c762" data-loc="1038:16-1038:47" data-file-name="components/FullReport.tsx">
                  {swotItems.filter(item => item.category === "opportunity").map((item, index) => <li key={index} className="mb-2" data-unique-id="map_2928f5ef-b3ee-4326-ab6d-233925f2ac22" data-loc="1042:22-1042:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-unique-id="map_af95ed3c-d3b7-4503-ab4f-d5c1f8201254" data-loc="1045:26-1045:69" data-file-name="components/FullReport.tsx" data-is-mapped="true">Significance: {item.significance}</p>}
                      </li>)}
                </ul>
              </div>
              <div data-unique-id="d256464e-e84c-4ca3-bb4f-92d088b527fc" data-loc="1051:14-1051:19" data-file-name="components/FullReport.tsx">
                <h3 className="text-lg font-semibold text-orange-700 mb-2" data-unique-id="59884a80-a987-497f-9f1e-7942b6378d0a" data-loc="1052:16-1052:75" data-file-name="components/FullReport.tsx">Threats</h3>
                <ul className="list-disc pl-5" data-unique-id="3a08c2bb-63d9-4ab8-936b-a86f6808dd0d" data-loc="1053:16-1053:47" data-file-name="components/FullReport.tsx">
                  {swotItems.filter(item => item.category === "threat").map((item, index) => <li key={index} className="mb-2" data-unique-id="map_f034bce6-9150-4314-989b-a64f5957e6cb" data-loc="1057:22-1057:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                        {item.description}
                        {item.significance && <p className="text-sm text-slate-500 mt-1" data-unique-id="map_8d03a86f-6cdf-4fb1-9821-af5dde3b4e42" data-loc="1060:26-1060:69" data-file-name="components/FullReport.tsx" data-is-mapped="true">Significance: {item.significance}</p>}
                      </li>)}
                </ul>
              </div>
            </div>
          </div>
          
          {/* IFE Matrix Section */}
          <div className="mb-10" data-unique-id="286f24fc-5db3-4920-8e76-83fb67af516e" data-loc="1070:10-1070:33" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="b1246726-bd99-4ac1-b422-16a6fb21836c" data-loc="1071:12-1071:85" data-file-name="components/FullReport.tsx">IFE Matrix</h2>
            <table className="w-full border-collapse mb-4" data-unique-id="ca638a4b-5bd6-4af4-89ad-0a5b93b6dcd1" data-loc="1072:12-1072:59" data-file-name="components/FullReport.tsx">
              <thead data-unique-id="4438df0a-c9cc-4c11-825f-1345c2cf7ed9" data-loc="1073:14-1073:21" data-file-name="components/FullReport.tsx">
                <tr className="bg-slate-100" data-unique-id="1cf864fe-ab7f-4f51-a6e7-db3a9c51d3e9" data-loc="1074:16-1074:45" data-file-name="components/FullReport.tsx">
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="b55ca169-ffae-40b6-9dfd-1518c98ef22c" data-loc="1075:18-1075:72" data-file-name="components/FullReport.tsx">Factor</th>
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="d816bb97-b3ed-46ee-ade3-a32d88a4d050" data-loc="1076:18-1076:72" data-file-name="components/FullReport.tsx">Type</th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="321949b7-0ffa-493e-a03a-d41c9a23a8b1" data-loc="1077:18-1077:74" data-file-name="components/FullReport.tsx">Weight</th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="eb01adb7-29bc-4bdb-a82a-b4337d3b7500" data-loc="1078:18-1078:74" data-file-name="components/FullReport.tsx">Rating</th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="d6e7c0f8-c0ad-461f-bd37-29c20c7b7110" data-loc="1079:18-1079:74" data-file-name="components/FullReport.tsx">Weighted Score</th>
                </tr>
              </thead>
              <tbody data-unique-id="4f4e6e82-63b7-4cdd-93c9-2af732062321" data-loc="1082:14-1082:21" data-file-name="components/FullReport.tsx">
                {ifeFactors.filter(factor => factor.category === "strength").map((factor, index) => <tr key={index} className="bg-green-50" data-unique-id="map_7775024c-6b2f-4deb-a075-ef8fb28c6412" data-loc="1086:20-1086:60" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                      <td className="border border-slate-300 p-2" data-unique-id="map_ae42da3e-0b7e-4ba2-b6ad-0fdf7c4531a4" data-loc="1087:22-1087:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-unique-id="map_c729d387-4d8f-4b2a-aeee-26c6b8fbf67a" data-loc="1088:22-1088:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">Strength</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_250af9ac-f318-4fc9-8254-a453e67f4f1f" data-loc="1089:22-1089:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_61f508b2-dd41-4cc1-a827-59f0051b80ea" data-loc="1090:22-1090:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_2eeee934-ca61-4f5a-983b-c6c416386b8a" data-loc="1091:22-1091:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                {ifeFactors.filter(factor => factor.category === "weakness").map((factor, index) => <tr key={index} className="bg-red-50" data-unique-id="map_12e187b2-ad2c-4567-917e-5caff8afabdc" data-loc="1097:20-1097:58" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                      <td className="border border-slate-300 p-2" data-unique-id="map_0c6c5268-ccbe-49cc-9720-c4897e14740e" data-loc="1098:22-1098:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-unique-id="map_16431c39-0981-473b-96be-6d6ee29b60c5" data-loc="1099:22-1099:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">Weakness</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_de72603d-0953-458a-8397-2dd2d4df33b0" data-loc="1100:22-1100:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_d6c41a6a-349b-4c1e-b2bc-e50945e307b5" data-loc="1101:22-1101:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_92c1acba-b612-43b9-ba7c-76756508634f" data-loc="1102:22-1102:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                <tr className="bg-slate-100 font-bold" data-unique-id="bef03d45-7430-4aa0-99c5-21ac33d71be8" data-loc="1105:16-1105:55" data-file-name="components/FullReport.tsx">
                  <td className="border border-slate-300 p-2" colSpan={2} data-unique-id="878de71f-e331-48c4-b808-a06200856055" data-loc="1106:18-1106:74" data-file-name="components/FullReport.tsx">Total</td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="2ffe4cfe-9641-4e1a-a13d-3d90c193e17b" data-loc="1107:18-1107:74" data-file-name="components/FullReport.tsx">
                    {ifeFactors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2" data-unique-id="ba75d253-0879-4f3d-a774-ac8b3275589f" data-loc="1110:18-1110:62" data-file-name="components/FullReport.tsx"></td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="ef296409-2366-405e-8cc9-6a88ed76f19c" data-loc="1111:18-1111:74" data-file-name="components/FullReport.tsx">{ifeScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4" data-unique-id="37e71a1b-d968-4c63-8227-3141d1cd36d8" data-loc="1115:12-1115:34" data-file-name="components/FullReport.tsx">
              <p className="font-semibold" data-unique-id="383e4bf5-fd58-472e-99c2-454ebb687024" data-loc="1116:14-1116:43" data-file-name="components/FullReport.tsx">Rating Scale:</p>
              <p data-unique-id="37628252-37e0-4a52-8bf7-955c5b8d26ac" data-loc="1117:14-1117:17" data-file-name="components/FullReport.tsx">1 = Major Weakness, 2 = Minor Weakness, 3 = Minor Strength, 4 = Major Strength</p>
            </div>
          </div>
          
          {/* EFE Matrix Section */}
          <div className="mb-10" data-unique-id="64bbf5ef-4f2d-47a3-a492-50ee13682e75" data-loc="1122:10-1122:33" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="0d453f47-decf-4d4e-bc6d-42a49aa75076" data-loc="1123:12-1123:85" data-file-name="components/FullReport.tsx">EFE Matrix</h2>
            <table className="w-full border-collapse mb-4" data-unique-id="3df9c4da-3501-4a2b-bbe5-1631ba2487ca" data-loc="1124:12-1124:59" data-file-name="components/FullReport.tsx">
              <thead data-unique-id="0c1bd70c-6413-443d-8040-28cfda0921d2" data-loc="1125:14-1125:21" data-file-name="components/FullReport.tsx">
                <tr className="bg-slate-100" data-unique-id="6675dcb5-d943-4e4a-ba37-c54f8a8d0397" data-loc="1126:16-1126:45" data-file-name="components/FullReport.tsx">
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="f2f2df80-3d5e-473e-8f45-bee695f430ff" data-loc="1127:18-1127:72" data-file-name="components/FullReport.tsx">Factor</th>
                  <th className="border border-slate-300 p-2 text-left" data-unique-id="159158ff-731b-413c-a35d-88dfddefd3fd" data-loc="1128:18-1128:72" data-file-name="components/FullReport.tsx">Type</th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="39670d05-9027-4268-9ab4-c7b302df4628" data-loc="1129:18-1129:74" data-file-name="components/FullReport.tsx">Weight</th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="7b7b3820-ceaa-4018-ae9e-5e827d222038" data-loc="1130:18-1130:74" data-file-name="components/FullReport.tsx">Rating</th>
                  <th className="border border-slate-300 p-2 text-center" data-unique-id="f65a5c25-6431-4d64-828a-095069dfba03" data-loc="1131:18-1131:74" data-file-name="components/FullReport.tsx">Weighted Score</th>
                </tr>
              </thead>
              <tbody data-unique-id="ee35b2b3-a1be-45a8-b381-35ca0b133ff3" data-loc="1134:14-1134:21" data-file-name="components/FullReport.tsx">
                {efeFactors.filter(factor => factor.category === "opportunity").map((factor, index) => <tr key={index} className="bg-blue-50" data-unique-id="map_4efc1235-391c-4cbd-99fb-702e8acfb995" data-loc="1138:20-1138:59" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                      <td className="border border-slate-300 p-2" data-unique-id="map_1b7bc900-1a08-4819-b5ee-303102692452" data-loc="1139:22-1139:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-unique-id="map_28db4af5-b7aa-4218-996e-abfd39f796bc" data-loc="1140:22-1140:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">Opportunity</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_aad6de84-bf2a-4a33-85fe-ca3278ae81fc" data-loc="1141:22-1141:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_02441d6d-7dec-4e82-9112-868258556841" data-loc="1142:22-1142:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_87db7f87-c624-4faf-a0d3-5babd7defa99" data-loc="1143:22-1143:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                {efeFactors.filter(factor => factor.category === "threat").map((factor, index) => <tr key={index} className="bg-orange-50" data-unique-id="map_1a9d29c3-3f53-4c3b-ac94-bc36fdab95e4" data-loc="1149:20-1149:61" data-file-name="components/FullReport.tsx" data-is-mapped="true">
                      <td className="border border-slate-300 p-2" data-unique-id="map_b639dfb1-897a-47f4-910c-fadcde592460" data-loc="1150:22-1150:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.description}</td>
                      <td className="border border-slate-300 p-2" data-unique-id="map_b91a668a-1ac6-4332-bec7-f7daaeb2d846" data-loc="1151:22-1151:66" data-file-name="components/FullReport.tsx" data-is-mapped="true">Threat</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_85c73667-1981-4db7-b9b5-4fdf28e47612" data-loc="1152:22-1152:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.weight.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_03bf78ff-c63e-407f-88a1-7e6e67b50042" data-loc="1153:22-1153:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{factor.rating}</td>
                      <td className="border border-slate-300 p-2 text-center" data-unique-id="map_5e1e0924-3937-483b-b62b-ed162fc9d172" data-loc="1154:22-1154:78" data-file-name="components/FullReport.tsx" data-is-mapped="true">{(factor.weight * factor.rating).toFixed(2)}</td>
                    </tr>)}
                <tr className="bg-slate-100 font-bold" data-unique-id="e4cbfa5e-d790-4ef1-b7ef-58d5b537b677" data-loc="1157:16-1157:55" data-file-name="components/FullReport.tsx">
                  <td className="border border-slate-300 p-2" colSpan={2} data-unique-id="f55574b3-ed78-4f2f-8dfc-dc96d8ad404c" data-loc="1158:18-1158:74" data-file-name="components/FullReport.tsx">Total</td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="1c914a54-a5b3-40c8-833d-17f0eecde1b5" data-loc="1159:18-1159:74" data-file-name="components/FullReport.tsx">
                    {efeFactors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2" data-unique-id="9818ba90-4aed-4bb6-9ddb-f213ce362e55" data-loc="1162:18-1162:62" data-file-name="components/FullReport.tsx"></td>
                  <td className="border border-slate-300 p-2 text-center" data-unique-id="47a62297-12b8-431d-84cc-d8f987c71b5f" data-loc="1163:18-1163:74" data-file-name="components/FullReport.tsx">{efeScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-4" data-unique-id="f89f216f-f5fa-4dbc-8b34-8b8fcfe25ffd" data-loc="1167:12-1167:34" data-file-name="components/FullReport.tsx">
              <p className="font-semibold" data-unique-id="b5f273cd-a471-4223-9f55-5620e2aaa62e" data-loc="1168:14-1168:43" data-file-name="components/FullReport.tsx">Rating Scale:</p>
              <p data-unique-id="d16a6725-b2ea-4b08-bbb8-c8f678fd7919" data-loc="1169:14-1169:17" data-file-name="components/FullReport.tsx">1 = Poor Response, 2 = Average Response, 3 = Above Average Response, 4 = Superior Response</p>
            </div>
          </div>
          
          {/* IE Matrix Section */}
          <div data-unique-id="49d78b65-8448-4781-9d1f-1abf26e15019" data-loc="1174:10-1174:15" data-file-name="components/FullReport.tsx">
            <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="8edb4e1d-88d1-4aec-9574-149b5e4ef118" data-loc="1175:12-1175:85" data-file-name="components/FullReport.tsx">IE Matrix Positioning</h2>
            <div className="mb-4" data-unique-id="7b1f0204-b509-423f-ad01-f383693ecdc0" data-loc="1176:12-1176:34" data-file-name="components/FullReport.tsx">
              <p data-unique-id="67d2d7f4-74d5-47d1-bb38-b4cf2f8022dd" data-loc="1177:14-1177:17" data-file-name="components/FullReport.tsx"><span className="font-semibold" data-unique-id="824276cf-d2ae-479c-b3d5-9fad2e0271c9" data-loc="1177:17-1177:49" data-file-name="components/FullReport.tsx">IFE Score:</span> {ifeScore.toFixed(2)}</p>
              <p data-unique-id="57204fba-3300-4a64-9b28-2b6cf57b6490" data-loc="1178:14-1178:17" data-file-name="components/FullReport.tsx"><span className="font-semibold" data-unique-id="349d790c-e1ea-4cfb-9768-5640fa73229a" data-loc="1178:17-1178:49" data-file-name="components/FullReport.tsx">EFE Score:</span> {efeScore.toFixed(2)}</p>
              <p data-unique-id="2b747140-bc56-4ca6-864d-df84900e2a4e" data-loc="1179:14-1179:17" data-file-name="components/FullReport.tsx"><span className="font-semibold" data-unique-id="c81b46b0-59dc-4ec7-b5b1-a7d1af7b53bd" data-loc="1179:17-1179:49" data-file-name="components/FullReport.tsx">Position:</span> Cell {getStrategyRecommendation().cellId}</p>
            </div>
            <div data-unique-id="868404d7-960c-469b-b8d7-60bee5b97e0b" data-loc="1181:12-1181:17" data-file-name="components/FullReport.tsx">
              <p className="font-semibold" data-unique-id="d5dfee38-3e5a-4108-8208-4ab45c83c020" data-loc="1182:14-1182:43" data-file-name="components/FullReport.tsx">Strategy Recommendation:</p>
              <p data-unique-id="3d7ebcc0-cf98-48ec-a0bb-0930616d517e" data-loc="1183:14-1183:17" data-file-name="components/FullReport.tsx">{getStrategyRecommendation().strategy}</p>
            </div>
          </div>
          
          {/* AI-Generated Strategies Section */}
          {(soStrategies.length > 0 || stStrategies.length > 0 || woStrategies.length > 0 || wtStrategies.length > 0) && <div className="page-break-before" data-unique-id="413af9da-99b2-4ed6-85e7-82768c4d21c1" data-loc="1189:12-1189:47" data-file-name="components/FullReport.tsx">
              <h2 className="text-2xl font-bold border-b-2 border-slate-200 pb-2 mb-4" data-unique-id="80e03850-f7f0-49e5-b3dd-7be0eca92d71" data-loc="1190:14-1190:87" data-file-name="components/FullReport.tsx">AI-Generated Strategic Recommendations</h2>
              
              {soStrategies.length > 0 && <div className="mb-6" data-unique-id="5a7e7a07-f4f4-4d96-8834-8929db9da75e" data-loc="1193:16-1193:38" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-green-700 mb-2" data-unique-id="b738a621-ed23-4fd9-9519-dd2a2be8f1c9" data-loc="1194:18-1194:76" data-file-name="components/FullReport.tsx">SO Strategies (Strengths-Opportunities)</h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="0058284d-483b-4bbe-8c61-f983bc3ef6b3" data-loc="1195:18-1195:61" data-file-name="components/FullReport.tsx">Strategies that use internal strengths to take advantage of external opportunities</p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="099d2a2e-c7eb-4222-9f64-3b66de0fb9e6" data-loc="1196:18-1196:62" data-file-name="components/FullReport.tsx">
                    {soStrategies.map((strategy, index) => <li key={index} className="mb-2" data-unique-id="map_39132097-c3a2-4aa1-8eb1-a4882db2e47d" data-loc="1198:22-1198:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {stStrategies.length > 0 && <div className="mb-6" data-unique-id="1583dc72-6198-4620-96c8-dafd45d7d30f" data-loc="1205:16-1205:38" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2" data-unique-id="642732fd-e60f-4e1d-a729-debfa9c7fdf7" data-loc="1206:18-1206:75" data-file-name="components/FullReport.tsx">ST Strategies (Strengths-Threats)</h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="962d2e55-6b7c-4a54-a66c-dd6feb65b5d3" data-loc="1207:18-1207:61" data-file-name="components/FullReport.tsx">Strategies that use internal strengths to minimize external threats</p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="113bc573-f112-4b5d-9889-701c63ae7129" data-loc="1208:18-1208:62" data-file-name="components/FullReport.tsx">
                    {stStrategies.map((strategy, index) => <li key={index} className="mb-2" data-unique-id="map_621f9cc4-454e-4221-880b-d47a489ac7b8" data-loc="1210:22-1210:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {woStrategies.length > 0 && <div className="mb-6" data-unique-id="4558e36b-46f2-498f-9e12-5b016d4ba1d7" data-loc="1217:16-1217:38" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-amber-700 mb-2" data-unique-id="fd45b094-2964-4deb-9b36-80ab16eb3bef" data-loc="1218:18-1218:76" data-file-name="components/FullReport.tsx">WO Strategies (Weaknesses-Opportunities)</h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="ca21db58-4db0-4094-bc48-9f8a80f0a44b" data-loc="1219:18-1219:61" data-file-name="components/FullReport.tsx">Strategies that improve internal weaknesses by taking advantage of external opportunities</p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="3bad57df-009d-4dd2-8272-9e5088747361" data-loc="1220:18-1220:62" data-file-name="components/FullReport.tsx">
                    {woStrategies.map((strategy, index) => <li key={index} className="mb-2" data-unique-id="map_cb3b5a0f-acda-4b7d-bebc-575d5c5c2a6c" data-loc="1222:22-1222:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {wtStrategies.length > 0 && <div className="mb-6" data-unique-id="93e92ea8-c16f-49f4-8f80-5e3008e291c5" data-loc="1229:16-1229:38" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-red-700 mb-2" data-unique-id="541bf1e5-1b03-4dd2-b8a3-1565178446ae" data-loc="1230:18-1230:74" data-file-name="components/FullReport.tsx">WT Strategies (Weaknesses-Threats)</h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="49997e58-ea58-4b0c-a085-5b69bb6814f5" data-loc="1231:18-1231:61" data-file-name="components/FullReport.tsx">Strategies that minimize internal weaknesses and avoid external threats</p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="92736eb9-0c11-4707-b290-75dbff503541" data-loc="1232:18-1232:62" data-file-name="components/FullReport.tsx">
                    {wtStrategies.map((strategy, index) => <li key={index} className="mb-2" data-unique-id="map_6a6d06f4-d649-43c5-87d2-4f9266e92e15" data-loc="1234:22-1234:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">{strategy.content}</li>)}
                  </ol>
                </div>}
              
              {prioritizedStrategies.length > 0 && <div className="mt-8" data-unique-id="273a1cb0-f9f8-49e5-baee-e8f9b044d1e1" data-loc="1241:16-1241:38" data-file-name="components/FullReport.tsx">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2" data-unique-id="da652790-1ad1-4310-8edd-9b4d25750f68" data-loc="1242:18-1242:76" data-file-name="components/FullReport.tsx">Prioritized Strategic Recommendations</h3>
                  <p className="text-sm text-slate-600 mb-3" data-unique-id="6124decc-0085-48ab-b8ae-fa666b43cb07" data-loc="1243:18-1243:61" data-file-name="components/FullReport.tsx">Based on your IE Matrix position, these strategies have been prioritized for implementation</p>
                  <ol className="list-decimal pl-5 space-y-2" data-unique-id="c71bd167-3cd0-45a2-8e98-c9c767d37c0c" data-loc="1244:18-1244:62" data-file-name="components/FullReport.tsx">
                    {prioritizedStrategies.map((strategy, index) => <li key={index} className="mb-2" data-unique-id="map_a7600a41-946f-495e-ac27-a0865afe8af4" data-loc="1246:22-1246:55" data-file-name="components/FullReport.tsx" data-is-mapped="true">{strategy.content}</li>)}
                  </ol>
                </div>}
            </div>}
        </div>
      </div>
    </motion.div>;
}