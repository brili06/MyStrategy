"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { FileText, Download, Printer, FileSpreadsheet } from "lucide-react";
import { Factor, MatrixType, CompanyProfile, SwotItem } from "@/types/matrix";

interface ExportOptionsProps {
  factors: Factor[];
  score: number;
  type: MatrixType;
}

export default function ExportOptions({ factors, score, type }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [ifeScore, setIfeScore] = useState(0);
  const [efeScore, setEfeScore] = useState(0);
  
  useEffect(() => {
    // Load company profile and SWOT data for comprehensive reports
    const savedProfile = localStorage.getItem("companyProfile");
    const savedSwot = localStorage.getItem("swotItems");
    const savedIfeFactors = localStorage.getItem("ifeFactors");
    const savedEfeFactors = localStorage.getItem("efeFactors");
    
    if (savedProfile) {
      setCompanyProfile(JSON.parse(savedProfile));
    }
    
    if (savedSwot) {
      setSwotItems(JSON.parse(savedSwot));
    }
    
    // Calculate scores for IE Matrix inclusion
    if (savedIfeFactors && type !== "ife") {
      const ifeFactors = JSON.parse(savedIfeFactors) as Factor[];
      const calculatedScore = ifeFactors.reduce((sum, factor) => sum + (factor.weight * factor.rating), 0);
      setIfeScore(parseFloat(calculatedScore.toFixed(2)));
    } else if (type === "ife") {
      setIfeScore(score);
    }
    
    if (savedEfeFactors && type !== "efe") {
      const efeFactors = JSON.parse(savedEfeFactors) as Factor[];
      const calculatedScore = efeFactors.reduce((sum, factor) => sum + (factor.weight * factor.rating), 0);
      setEfeScore(parseFloat(calculatedScore.toFixed(2)));
    } else if (type === "efe") {
      setEfeScore(score);
    }
  }, [score, type]);
  
  const getScoreInterpretation = (score: number) => {
    if (score < 2.0) return "Weak position";
    if (score < 2.5) return "Below average position";
    if (score < 3.0) return "Average position";
    if (score < 3.5) return "Above average position";
    return "Strong position";
  };
  
  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      
      // Add title and header
      doc.setFontSize(20);
      doc.text(`Strategic Management Analysis`, 105, yPosition, { align: "center" });
      yPosition += 10;
      
      doc.setFontSize(16);
      doc.text(`${type === "ife" ? "Internal" : type === "efe" ? "External" : "Internal-External"} Factor Evaluation Matrix`, 105, yPosition, { align: "center" });
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, yPosition, { align: "center" });
      yPosition += 15;
      
      // Add company profile if available
      if (companyProfile) {
        doc.setFontSize(14);
        doc.text("Company Profile", 14, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.text(`Company Name: ${companyProfile.name}`, 14, yPosition);
        yPosition += 6;
        
        doc.text(`Industry: ${companyProfile.industry}`, 14, yPosition);
        yPosition += 6;
        
        doc.text("Description:", 14, yPosition);
        yPosition += 5;
        
        const descriptionLines = doc.splitTextToSize(companyProfile.description, 180);
        doc.text(descriptionLines, 14, yPosition);
        yPosition += descriptionLines.length * 5 + 5;
        
        doc.text("Vision:", 14, yPosition);
        yPosition += 5;
        
        const visionLines = doc.splitTextToSize(companyProfile.vision, 180);
        doc.text(visionLines, 14, yPosition);
        yPosition += visionLines.length * 5 + 5;
        
        doc.text("Mission:", 14, yPosition);
        yPosition += 5;
        
        const missionLines = doc.splitTextToSize(companyProfile.mission, 180);
        doc.text(missionLines, 14, yPosition);
        yPosition += missionLines.length * 5 + 10;
      }
      
      // Add SWOT analysis if available and requested
      if (swotItems.length > 0 && type === "ie") {
        doc.setFontSize(14);
        doc.text("SWOT Analysis", 14, yPosition);
        yPosition += 10;
        
        // Create SWOT table
        const swotData = [
          ["Strengths", "Weaknesses"],
          [
            swotItems.filter(item => item.category === "strength").map(item => item.description).join("\n\n"),
            swotItems.filter(item => item.category === "weakness").map(item => item.description).join("\n\n")
          ],
          ["Opportunities", "Threats"],
          [
            swotItems.filter(item => item.category === "opportunity").map(item => item.description).join("\n\n"),
            swotItems.filter(item => item.category === "threat").map(item => item.description).join("\n\n")
          ]
        ];
        
        (doc as any).autoTable({
          startY: yPosition,
          head: [swotData[0]],
          body: [swotData[1], swotData[2], swotData[3]],
          theme: 'grid',
          styles: {
            cellPadding: 5,
            fontSize: 10,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          columnStyles: {
            0: { cellWidth: 90 },
            1: { cellWidth: 90 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }
      
      // Create matrix table data
      if (type === "ife" || type === "efe") {
        const tableColumn = ["#", `${type === "ife" ? "Internal" : "External"} Factors`, "Weight", "Rating", "Weighted Score"];
        
        // For IFE, separate strengths and weaknesses
        if (type === "ife") {
          // Strengths section
          const strengthRows = factors
            .filter(factor => factor.category === "strength")
            .map((factor, index) => [
              index + 1,
              factor.description,
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ]);
          
          (doc as any).autoTable({
            head: [["", "Strengths", "", "", ""]],
            body: strengthRows,
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [76, 175, 80],
              textColor: [255, 255, 255]
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 5;
          
          // Weaknesses section
          const weaknessRows = factors
            .filter(factor => factor.category === "weakness")
            .map((factor, index) => [
              index + 1,
              factor.description,
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ]);
          
          (doc as any).autoTable({
            head: [["", "Weaknesses", "", "", ""]],
            body: weaknessRows,
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [244, 67, 54],
              textColor: [255, 255, 255]
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 5;
          
          // Total row
          (doc as any).autoTable({
            head: [["", "TOTAL", factors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2), "", score.toFixed(2)]],
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [24, 24, 27],
              textColor: [255, 255, 255]
            }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 10;
        } 
        // For EFE, separate opportunities and threats
        else if (type === "efe") {
          // Opportunities section
          const opportunityRows = factors
            .filter(factor => factor.category === "opportunity")
            .map((factor, index) => [
              index + 1,
              factor.description,
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ]);
          
          (doc as any).autoTable({
            head: [["", "Opportunities", "", "", ""]],
            body: opportunityRows,
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [33, 150, 243],
              textColor: [255, 255, 255]
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 5;
          
          // Threats section
          const threatRows = factors
            .filter(factor => factor.category === "threat")
            .map((factor, index) => [
              index + 1,
              factor.description,
              factor.weight.toFixed(2),
              factor.rating,
              (factor.weight * factor.rating).toFixed(2)
            ]);
          
          (doc as any).autoTable({
            head: [["", "Threats", "", "", ""]],
            body: threatRows,
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [255, 152, 0],
              textColor: [255, 255, 255]
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 5;
          
          // Total row
          (doc as any).autoTable({
            head: [["", "TOTAL", factors.reduce((sum, factor) => sum + factor.weight, 0).toFixed(2), "", score.toFixed(2)]],
            startY: yPosition,
            theme: 'grid',
            headStyles: {
              fillColor: [24, 24, 27],
              textColor: [255, 255, 255]
            }
          });
          
          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
      }
      
      // Add interpretation
      doc.setFontSize(12);
      doc.text("Score Interpretation:", 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      if (type === "ife" || type === "ie") {
        doc.text(`IFE Score: ${ifeScore.toFixed(2)} - ${getScoreInterpretation(ifeScore)}`, 14, yPosition);
        yPosition += 6;
      }
      
      if (type === "efe" || type === "ie") {
        doc.text(`EFE Score: ${efeScore.toFixed(2)} - ${getScoreInterpretation(efeScore)}`, 14, yPosition);
        yPosition += 6;
      }
      
      yPosition += 8;
      
      // Add rating scale
      doc.setFontSize(12);
      if (type === "ife" || type === "ie") {
        doc.text("Rating Scale for Internal Factors:", 14, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.text("1 = Major Weakness", 20, yPosition);
        yPosition += 5;
        doc.text("2 = Minor Weakness", 20, yPosition);
        yPosition += 5;
        doc.text("3 = Minor Strength", 20, yPosition);
        yPosition += 5;
        doc.text("4 = Major Strength", 20, yPosition);
        yPosition += 10;
      }
      
      if (type === "efe" || type === "ie") {
        doc.setFontSize(12);
        doc.text("Rating Scale for External Factors:", 14, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.text("1 = Poor Response", 20, yPosition);
        yPosition += 5;
        doc.text("2 = Average Response", 20, yPosition);
        yPosition += 5;
        doc.text("3 = Above Average Response", 20, yPosition);
        yPosition += 5;
        doc.text("4 = Superior Response", 20, yPosition);
        yPosition += 10;
      }
      
      // Add IE Matrix if applicable
      if (type === "ie" && ifeScore > 0 && efeScore > 0) {
        doc.addPage();
        
        doc.setFontSize(16);
        doc.text("Internal-External (IE) Matrix", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`IFE Score: ${ifeScore.toFixed(2)} | EFE Score: ${efeScore.toFixed(2)}`, 105, 30, { align: "center" });
        
        // Draw IE Matrix grid
        const startX = 50;
        const startY = 50;
        const cellSize = 30;
        
        // Draw grid
        for (let i = 0; i <= 3; i++) {
          doc.line(startX, startY + i * cellSize, startX + 3 * cellSize, startY + i * cellSize);
          doc.line(startX + i * cellSize, startY, startX + i * cellSize, startY + 3 * cellSize);
        }
        
        // Label axes
        doc.setFontSize(10);
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
        
        // Plot company position
        const posX = startX + (ifeScore - 1) * cellSize;
        const posY = startY + (4 - efeScore) * cellSize;
        
        doc.setFillColor(59, 130, 246); // Blue
        doc.circle(posX, posY, 5, 'F');
        
        // Add legend
        doc.setFontSize(10);
        doc.text("Legend:", 14, startY + 3 * cellSize + 30);
        doc.setFontSize(9);
        
        doc.setFillColor(76, 175, 80); // Green
        doc.rect(20, startY + 3 * cellSize + 35, 10, 10, 'F');
        doc.text("Grow and Build (I, II, IV)", 35, startY + 3 * cellSize + 42);
        
        doc.setFillColor(251, 191, 36); // Yellow
        doc.rect(20, startY + 3 * cellSize + 50, 10, 10, 'F');
        doc.text("Hold and Maintain (III, V, VII)", 35, startY + 3 * cellSize + 57);
        
        doc.setFillColor(248, 113, 113); // Red
        doc.rect(20, startY + 3 * cellSize + 65, 10, 10, 'F');
        doc.text("Harvest or Exit (VI, VIII, IX)", 35, startY + 3 * cellSize + 72);
        
        // Add company position and recommendation
        doc.setFontSize(12);
        doc.text("Company Position Analysis", 14, startY + 3 * cellSize + 90);
        
        doc.setFontSize(10);
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
        
        doc.text(`Your organization is positioned in Cell ${cellId}.`, 14, startY + 3 * cellSize + 100);
        
        const strategyLines = doc.splitTextToSize(`Recommended Strategy: ${strategy}`, 180);
        doc.text(strategyLines, 14, startY + 3 * cellSize + 110);
      }
      
      // Save the PDF
      doc.save(`${type.toUpperCase()}_Matrix_Analysis.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const workbook = XLSX.utils.book_new();
      
      // Create company profile worksheet if available
      if (companyProfile) {
        const profileWorksheet = XLSX.utils.aoa_to_sheet([
          ["Company Profile"],
          [],
          ["Company Name", companyProfile.name],
          ["Industry", companyProfile.industry],
          ["Description", companyProfile.description],
          ["Vision", companyProfile.vision],
          ["Mission", companyProfile.mission]
        ]);
        
        XLSX.utils.book_append_sheet(workbook, profileWorksheet, "Company Profile");
      }
      
      // Create SWOT worksheet if available
      if (swotItems.length > 0) {
        const strengths = swotItems.filter(item => item.category === "strength");
        const weaknesses = swotItems.filter(item => item.category === "weakness");
        const opportunities = swotItems.filter(item => item.category === "opportunity");
        const threats = swotItems.filter(item => item.category === "threat");
        
        const maxLength = Math.max(
          strengths.length,
          weaknesses.length,
          opportunities.length,
          threats.length
        );
        
        const swotData = [["Strengths", "Weaknesses", "Opportunities", "Threats"]];
        
        for (let i = 0; i < maxLength; i++) {
          swotData.push([
            strengths[i]?.description || "",
            weaknesses[i]?.description || "",
            opportunities[i]?.description || "",
            threats[i]?.description || ""
          ]);
        }
        
        const swotWorksheet = XLSX.utils.aoa_to_sheet(swotData);
        XLSX.utils.book_append_sheet(workbook, swotWorksheet, "SWOT Analysis");
      }
      
      // Create matrix worksheet
      let matrixData: any[][] = [];
      
      if (type === "ife") {
        matrixData = [
          ["Internal Factor Evaluation (IFE) Matrix"],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [],
          ["Strengths"],
          ["#", "Factor Description", "Weight", "Rating", "Weighted Score"]
        ];
        
        // Add strengths
        const strengthFactors = factors.filter(f => f.category === "strength");
        strengthFactors.forEach((factor, index) => {
          matrixData.push([
            index + 1,
            factor.description,
            factor.weight,
            factor.rating,
            factor.weight * factor.rating
          ]);
        });
        
        matrixData.push([]);
        matrixData.push(["Weaknesses"]);
        matrixData.push(["#", "Factor Description", "Weight", "Rating", "Weighted Score"]);
        
        // Add weaknesses
        const weaknessFactors = factors.filter(f => f.category === "weakness");
        weaknessFactors.forEach((factor, index) => {
          matrixData.push([
            index + 1,
            factor.description,
            factor.weight,
            factor.rating,
            factor.weight * factor.rating
          ]);
        });
        
        // Add total
        matrixData.push([]);
        matrixData.push([
          "",
          "TOTAL",
          factors.reduce((sum, factor) => sum + factor.weight, 0),
          "",
          score
        ]);
      } else if (type === "efe") {
        matrixData = [
          ["External Factor Evaluation (EFE) Matrix"],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [],
          ["Opportunities"],
          ["#", "Factor Description", "Weight", "Rating", "Weighted Score"]
        ];
        
        // Add opportunities
        const opportunityFactors = factors.filter(f => f.category === "opportunity");
        opportunityFactors.forEach((factor, index) => {
          matrixData.push([
            index + 1,
            factor.description,
            factor.weight,
            factor.rating,
            factor.weight * factor.rating
          ]);
        });
        
        matrixData.push([]);
        matrixData.push(["Threats"]);
        matrixData.push(["#", "Factor Description", "Weight", "Rating", "Weighted Score"]);
        
        // Add threats
        const threatFactors = factors.filter(f => f.category === "threat");
        threatFactors.forEach((factor, index) => {
          matrixData.push([
            index + 1,
            factor.description,
            factor.weight,
            factor.rating,
            factor.weight * factor.rating
          ]);
        });
        
        // Add total
        matrixData.push([]);
        matrixData.push([
          "",
          "TOTAL",
          factors.reduce((sum, factor) => sum + factor.weight, 0),
          "",
          score
        ]);
      } else if (type === "ie") {
        matrixData = [
          ["Internal-External (IE) Matrix"],
          [`Generated: ${new Date().toLocaleDateString()}`],
          [],
          ["Matrix Position"],
          ["IFE Score", "EFE Score", "Cell Position", "Strategic Implication"],
        ];
        
        // Determine cell position and strategy
        let cellId = "";
        let strategy = "";
        
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
        
        if (["I", "II", "IV"].includes(cellId)) {
          strategy = "Grow and Build";
        } else if (["III", "V", "VII"].includes(cellId)) {
          strategy = "Hold and Maintain";
        } else {
          strategy = "Harvest or Exit";
        }
        
        matrixData.push([ifeScore, efeScore, cellId, strategy]);
        
        matrixData.push([]);
        matrixData.push(["Strategic Implications"]);
        matrixData.push(["Cell", "Strategy", "Description"]);
        matrixData.push(["I, II, IV", "Grow and Build", "Intensive strategies (market penetration, market development, product development) or integrative strategies"]);
        matrixData.push(["III, V, VII", "Hold and Maintain", "Market penetration and product development strategies"]);
        matrixData.push(["VI, VIII, IX", "Harvest or Exit", "Don't expand; divest; retrench; diversify; improve weaknesses; or form joint ventures"]);
      }
      
      const matrixWorksheet = XLSX.utils.aoa_to_sheet(matrixData);
      XLSX.utils.book_append_sheet(workbook, matrixWorksheet, `${type.toUpperCase()} Matrix`);
      
      // Add interpretation worksheet
      const interpretationData = [
        ["Score Interpretation"],
        [],
        ["IFE Score", ifeScore.toFixed(2), getScoreInterpretation(ifeScore)],
        ["EFE Score", efeScore.toFixed(2), getScoreInterpretation(efeScore)],
        [],
        ["Rating Scale for Internal Factors:"],
        ["1", "Major Weakness"],
        ["2", "Minor Weakness"],
        ["3", "Minor Strength"],
        ["4", "Major Strength"],
        [],
        ["Rating Scale for External Factors:"],
        ["1", "Poor Response"],
        ["2", "Average Response"],
        ["3", "Above Average Response"],
        ["4", "Superior Response"]
      ];
      
      const interpretationWorksheet = XLSX.utils.aoa_to_sheet(interpretationData);
      XLSX.utils.book_append_sheet(workbook, interpretationWorksheet, "Interpretation");
      
      // Generate and download Excel file
      XLSX.writeFile(workbook, `Strategic_Analysis_Report.xlsx`);
    } catch (error) {
      console.error("Excel export error:", error);
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
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-5"
    >
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Export Options</h3>
      <p className="text-slate-500 mb-6">Save or print your {type.toUpperCase()} matrix analysis</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <FileText className="h-8 w-8 text-blue-600 mb-2" />
          <span className="font-medium">Export as PDF</span>
          <span className="text-xs text-slate-500 mt-1">Document Format</span>
        </button>
        
        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <FileSpreadsheet className="h-8 w-8 text-green-600 mb-2" />
          <span className="font-medium">Export as Excel</span>
          <span className="text-xs text-slate-500 mt-1">Spreadsheet Format</span>
        </button>
        
        <button
          onClick={printReport}
          disabled={isExporting}
          className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Printer className="h-8 w-8 text-slate-600 mb-2" />
          <span className="font-medium">Print Report</span>
          <span className="text-xs text-slate-500 mt-1">Physical Copy</span>
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-4 flex items-center justify-center py-2 bg-blue-50 text-blue-700 rounded-lg">
          <Download className="animate-pulse h-5 w-5 mr-2" />
          <span>Processing export...</span>
        </div>
      )}
    </motion.div>
  );
}
