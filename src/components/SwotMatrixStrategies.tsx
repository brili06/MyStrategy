"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Send, Lightbulb, Edit3, Save, X, AlertCircle, Cpu, Globe } from "lucide-react";
import { SwotItem } from "@/types/matrix";
import { generateText, getTextProviders } from "@/lib/api/util";
import { supportedLanguages } from "@/types/language";

interface SwotMatrixStrategiesProps {
  swotItems: SwotItem[];
  ieQuadrant: string | null;
  ieStrategy: string | null;
  selectedLanguage?: string;
}

type StrategyType = "SO" | "ST" | "WO" | "WT";
type StrategyItem = {
  id: string;
  content: string;
  isEditing: boolean;
  editContent: string;
};

export default function SwotMatrixStrategies({
  swotItems,
  ieQuadrant,
  ieStrategy,
  selectedLanguage: propSelectedLanguage,
}: SwotMatrixStrategiesProps) {
  const [soStrategies, setSoStrategies] = useState<StrategyItem[]>([]);
  const [stStrategies, setStStrategies] = useState<StrategyItem[]>([]);
  const [woStrategies, setWoStrategies] = useState<StrategyItem[]>([]);
  const [wtStrategies, setWtStrategies] = useState<StrategyItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<StrategyType | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prioritizedStrategies, setPrioritizedStrategies] = useState<StrategyItem[]>([]);
  const [isGeneratingPriorities, setIsGeneratingPriorities] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'info' | 'success', message: string} | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("azure-gpt-4o-o3-mini");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [recentlyGeneratedType, setRecentlyGeneratedType] = useState<StrategyType | null>(null);

  // Load available models
  useEffect(() => {
    try {
      const models = getTextProviders();
      console.log("Available models:", models);
      setAvailableModels(models);
      if (models.length > 0) {
        // If current model isn't available, select the first available one
        if (!models.includes(selectedModel)) {
          setSelectedModel(models[0]);
        }
      } else {
        // If no models available, set a default model
        setSelectedModel("azure-gpt-4o-o3-mini");
        setAvailableModels(["azure-gpt-4o-o3-mini"]);
      }
    } catch (error) {
      console.error("Error loading available models:", error);
      // Set fallback model if error occurs
      setSelectedModel("azure-gpt-4o-o3-mini");
      setAvailableModels(["azure-gpt-4o-o3-mini"]);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load available AI models, using default model'
      });
    }
  }, [selectedModel]);

  // Load from localStorage if available and detect language from SWOT items
  useEffect(() => {
    const loadStrategies = () => {
      try {
        const savedSO = localStorage.getItem("soStrategies");
        const savedST = localStorage.getItem("stStrategies");
        const savedWO = localStorage.getItem("woStrategies");
        const savedWT = localStorage.getItem("wtStrategies");
        const savedPrioritized = localStorage.getItem("prioritizedStrategies");
        const savedModel = localStorage.getItem("selectedAIModel");
        const savedLanguage = localStorage.getItem("selectedLanguage");

        if (savedSO) setSoStrategies(JSON.parse(savedSO));
        if (savedST) setStStrategies(JSON.parse(savedST));
        if (savedWO) setWoStrategies(JSON.parse(savedWO));
        if (savedWT) setWtStrategies(JSON.parse(savedWT));
        if (savedPrioritized) setPrioritizedStrategies(JSON.parse(savedPrioritized));
        if (savedModel && availableModels.includes(savedModel)) setSelectedModel(savedModel);
        
        // Use prop selectedLanguage if provided, otherwise use saved language
        if (propSelectedLanguage) {
          setSelectedLanguage(propSelectedLanguage);
          setDetectedLanguage(propSelectedLanguage);
        } else if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading strategies from localStorage:", error);
      }
    };

    loadStrategies();
    
    // Detect language from SWOT items if no language is explicitly set
    if (swotItems.length > 0 && !propSelectedLanguage) {
      // Combine all SWOT descriptions to detect language
      const allText = swotItems.map(item => item.description).join(' ');
      detectLanguage(allText);
    }
  }, [availableModels, swotItems, propSelectedLanguage]);
  
  // Function to detect language from text
  const detectLanguage = (text: string) => {
    if (!text || text.trim().length < 10) return;
    
    try {
      // Simple language detection heuristics
      // This is a simplified approach - in a real app, you'd use a proper language detection library
      const lowerText = text.toLowerCase();
      
      // Check for common words in different languages
      if (lowerText.match(/\b(the|and|is|in|to|of|for)\b/gi)?.length > 3) {
        setDetectedLanguage('en');
      } else if (lowerText.match(/\b(dan|yang|untuk|dari|dengan|ini|itu)\b/gi)?.length > 2) {
        setDetectedLanguage('id');
      } else if (lowerText.match(/\b(el|la|los|las|es|en|y|de|para)\b/gi)?.length > 3) {
        setDetectedLanguage('es');
      } else if (lowerText.match(/\b(le|la|les|et|en|dans|pour|de|du)\b/gi)?.length > 3) {
        setDetectedLanguage('fr');
      } else if (lowerText.match(/\b(der|die|das|und|in|zu|für|von)\b/gi)?.length > 3) {
        setDetectedLanguage('de');
      } else {
        // Default to English if detection fails
        setDetectedLanguage('en');
      }
      
      // Set selected language if not already set
      if (!selectedLanguage) {
        setSelectedLanguage(detectedLanguage);
        localStorage.setItem("selectedLanguage", detectedLanguage);
      }
    } catch (error) {
      console.error("Error detecting language:", error);
      setDetectedLanguage('en');
    }
  };

  // Save to localStorage and database when strategies change
  useEffect(() => {
    const saveStrategiesToDatabase = async (
      strategyType: string, 
      strategies: StrategyItem[]
    ) => {
      if (strategies.length === 0) return;
      
      try {
        // Get company profile from localStorage to get the ID
        const savedProfileStr = localStorage.getItem("companyProfile");
        if (!savedProfileStr) return;
        
        const savedProfile = JSON.parse(savedProfileStr);
        const companyProfileId = savedProfile.id;
        
        if (!companyProfileId) return;
        
        // Save to database
        await fetch('/api/strategies', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyProfileId,
            strategyType,
            strategies,
            aiModel: selectedModel
          }),
        });
      } catch (error) {
        console.error(`Error saving ${strategyType} strategies:`, error);
      }
    };
    
    // Save to localStorage first (as backup)
    if (soStrategies.length > 0) {
      localStorage.setItem("soStrategies", JSON.stringify(soStrategies));
      saveStrategiesToDatabase("SO", soStrategies);
    }
    if (stStrategies.length > 0) {
      localStorage.setItem("stStrategies", JSON.stringify(stStrategies));
      saveStrategiesToDatabase("ST", stStrategies);
    }
    if (woStrategies.length > 0) {
      localStorage.setItem("woStrategies", JSON.stringify(woStrategies));
      saveStrategiesToDatabase("WO", woStrategies);
    }
    if (wtStrategies.length > 0) {
      localStorage.setItem("wtStrategies", JSON.stringify(wtStrategies));
      saveStrategiesToDatabase("WT", wtStrategies);
    }
    if (prioritizedStrategies.length > 0) {
      localStorage.setItem("prioritizedStrategies", JSON.stringify(prioritizedStrategies));
      saveStrategiesToDatabase("prioritized", prioritizedStrategies);
    }
    
    localStorage.setItem("selectedAIModel", selectedModel);
    if (selectedLanguage) {
      localStorage.setItem("selectedLanguage", selectedLanguage);
    }
  }, [soStrategies, stStrategies, woStrategies, wtStrategies, prioritizedStrategies, selectedModel, selectedLanguage]);

  // Get display name for model
  const getModelDisplayName = (modelId: string) => {
    switch (modelId) {
      case "azure-gpt-4o-mini":
        return "GPT-4o Mini";
      case "gemini-2.0-flash-exp":
        return "Gemini 2.0";
      case "gemini-1.5-pro":
        return "Gemini 1.5 Pro";
      default:
        return modelId;
    }
  };
  
  // Debug function to help diagnose issues
  const debugAIResponse = async () => {
    try {
      setStatusMessage({type: 'info', message: 'Running diagnostic test...'});
      
      // Simple test prompt
      const testPrompt = "Generate a list of 3 business strategies. Format as 1., 2., 3.";
      
      // Test with current model
      const result = await generateText(testPrompt, selectedModel);
      
      console.log("Debug AI Response:", {
        model: selectedModel,
        prompt: testPrompt,
        result: result
      });
      
      setStatusMessage({
        type: 'success', 
        message: `Diagnostic complete. Check console for details.`
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Diagnostic error:", error);
      setStatusMessage({
        type: 'error', 
        message: `Diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  // Generate strategies for a specific quadrant
  const generateStrategies = async (type: StrategyType, customPromptText = "") => {
    setIsGenerating(type);
    setRecentlyGeneratedType(type);
    
    try {
      // Check if SWOT items are available
      if (!swotItems || swotItems.length === 0) {
        setStatusMessage({
          type: 'error',
          message: 'No SWOT items found. Please complete the SWOT analysis first.'
        });
        setIsGenerating(null);
        return;
      }
      
      // Extract relevant SWOT items with indices
      const strengths = swotItems
        .filter(item => item.category === "strength")
        .map((item, index) => ({ 
          index: index + 1, 
          id: item.id,
          description: item.description 
        }));
        
      const weaknesses = swotItems
        .filter(item => item.category === "weakness")
        .map((item, index) => ({ 
          index: index + 1, 
          id: item.id,
          description: item.description 
        }));
        
      const opportunities = swotItems
        .filter(item => item.category === "opportunity")
        .map((item, index) => ({ 
          index: index + 1, 
          id: item.id,
          description: item.description 
        }));
        
      const threats = swotItems
        .filter(item => item.category === "threat")
        .map((item, index) => ({ 
          index: index + 1, 
          id: item.id,
          description: item.description 
        }));
      
      // Check if we have the necessary items for this strategy type
      if ((type === "SO" || type === "ST") && strengths.length === 0) {
        setStatusMessage({
          type: 'error',
          message: 'No strengths found in your SWOT analysis. Please add strengths first.'
        });
        setIsGenerating(null);
        return;
      }
      
      if ((type === "WO" || type === "WT") && weaknesses.length === 0) {
        setStatusMessage({
          type: 'error',
          message: 'No weaknesses found in your SWOT analysis. Please add weaknesses first.'
        });
        setIsGenerating(null);
        return;
      }
      
      if ((type === "SO" || type === "WO") && opportunities.length === 0) {
        setStatusMessage({
          type: 'error',
          message: 'No opportunities found in your SWOT analysis. Please add opportunities first.'
        });
        setIsGenerating(null);
        return;
      }
      
      if ((type === "ST" || type === "WT") && threats.length === 0) {
        setStatusMessage({
          type: 'error',
          message: 'No threats found in your SWOT analysis. Please add threats first.'
        });
        setIsGenerating(null);
        return;
      }
      
      // Get language for instructions
      const language = selectedLanguage || detectedLanguage || 'en';
      const languageName = supportedLanguages.find(l => l.code === language)?.name || 'English';
      
      // Create prompt based on strategy type and language
      let prompt = "";
      const languageInstruction = language !== 'en' ? 
        `Please respond in ${languageName}. ` : 
        "";
      
      const strengthsText = strengths.map(s => `S${s.index}: ${s.description}`).join("; ");
      const weaknessesText = weaknesses.map(w => `W${w.index}: ${w.description}`).join("; ");
      const opportunitiesText = opportunities.map(o => `O${o.index}: ${o.description}`).join("; ");
      const threatsText = threats.map(t => `T${t.index}: ${t.description}`).join("; ");
      
      switch (type) {
        case "SO":
          prompt = `${languageInstruction}Generate 3 strategic recommendations for a business based on these strengths: ${strengthsText} and these opportunities: ${opportunitiesText}. These should be SO (Strengths-Opportunities) strategies that leverage internal strengths to capitalize on external opportunities. Format each strategy as a clear, actionable statement followed by the specific SWOT references in parentheses like: "Strategy description (S1, O2)" - where the numbers correspond to the item indexes I provided. Be specific and practical. Number each strategy as 1., 2., 3.`;
          break;
        case "ST":
          prompt = `${languageInstruction}Generate 3 strategic recommendations for a business based on these strengths: ${strengthsText} and these threats: ${threatsText}. These should be ST (Strengths-Threats) strategies that use internal strengths to mitigate external threats. Format each strategy as a clear, actionable statement followed by the specific SWOT references in parentheses like: "Strategy description (S2, T1)" - where the numbers correspond to the item indexes I provided. Be specific and practical. Number each strategy as 1., 2., 3.`;
          break;
        case "WO":
          prompt = `${languageInstruction}Generate 3 strategic recommendations for a business based on these weaknesses: ${weaknessesText} and these opportunities: ${opportunitiesText}. These should be WO (Weaknesses-Opportunities) strategies that improve internal weaknesses by leveraging external opportunities. Format each strategy as a clear, actionable statement followed by the specific SWOT references in parentheses like: "Strategy description (W1, O3)" - where the numbers correspond to the item indexes I provided. Be specific and practical. Number each strategy as 1., 2., 3.`;
          break;
        case "WT":
          prompt = `${languageInstruction}Generate 3 strategic recommendations for a business based on these weaknesses: ${weaknessesText} and these threats: ${threatsText}. These should be WT (Weaknesses-Threats) strategies that minimize internal weaknesses and avoid external threats. Format each strategy as a clear, actionable statement followed by the specific SWOT references in parentheses like: "Strategy description (W2, T3)" - where the numbers correspond to the item indexes I provided. Be specific and practical. Number each strategy as 1., 2., 3.`;
          break;
      }
      
      // Add custom prompt if provided
      if (customPromptText) {
        prompt += ` Additional context: ${customPromptText}`;
      }
      
      setStatusMessage({
        type: 'info', 
        message: `Generating ${type} strategies in ${languageName} using ${getModelDisplayName(selectedModel)}...`
      });
      
      try {
        // Call the AI service through the util.ts proxy
        const result = await generateText(prompt, selectedModel);
        
        if (!result || !result.text) {
          throw new Error("Received empty response from AI service");
        }
        
        console.log("AI Response:", result);
        
        // Parse the response and create strategy items
        const responseText = result.text.trim();
        let strategies: StrategyItem[] = [];
        
        // Try multiple parsing approaches in sequence
        
        // Approach 1: Look for numbered items (1., 2., 3.)
        const numberedRegex = /(\d+\.\s*)(.*?)(?=\d+\.\s*|$)/gs;
        const numberedMatches = [...responseText.matchAll(numberedRegex)];
        
        if (numberedMatches.length > 0) {
          strategies = numberedMatches.map(match => ({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            content: match[2].trim(),
            isEditing: false,
            editContent: match[2].trim()
          }));
        } 
        // Approach 2: Split by double newlines (paragraphs)
        else if (responseText.includes("\n\n")) {
          strategies = responseText
            .split(/\n\n|\r\n\r\n/)
            .filter(text => text.trim().length > 0)
            .map(text => ({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              content: text.trim(),
              isEditing: false,
              editContent: text.trim()
            }));
        }
        // Approach 3: Split by single newlines if there are at least 3
        else if (responseText.split("\n").length >= 3) {
          strategies = responseText
            .split("\n")
            .filter(text => text.trim().length > 0)
            .map(text => ({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              content: text.trim(),
              isEditing: false,
              editContent: text.trim()
            }));
        }
        // Approach 4: Use the whole text as one strategy
        else {
          strategies = [{
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            content: responseText,
            isEditing: false,
            editContent: responseText
          }];
        }
        
        // Ensure we have at least one strategy
        if (strategies.length === 0) {
          strategies = [{
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            content: responseText,
            isEditing: false,
            editContent: responseText
          }];
        }
        
        // Update the appropriate strategy state
        switch (type) {
          case "SO":
            setSoStrategies(strategies);
            break;
          case "ST":
            setStStrategies(strategies);
            break;
          case "WO":
            setWoStrategies(strategies);
            break;
          case "WT":
            setWtStrategies(strategies);
            break;
        }
        
        // Reset UI state
        setCustomPrompt("");
        setShowPromptInput(false);
        setStatusMessage({
          type: 'success', 
          message: `Successfully generated ${type} strategies using ${getModelDisplayName(selectedModel)}.`
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
        
        // Clear the recently generated type indicator after 5 seconds
        setTimeout(() => {
          if (recentlyGeneratedType === type) {
            setRecentlyGeneratedType(null);
          }
        }, 5000);
      } catch (apiError) {
        console.error(`API error generating ${type} strategies:`, apiError);
        setStatusMessage({
          type: 'error', 
          message: `Failed to generate strategies: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error(`Error preparing ${type} strategies:`, error);
      setStatusMessage({
        type: 'error',
        message: `Error preparing strategies: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsGenerating(null);
    }
  };

  // Generate all strategies at once
  const generateAllStrategies = async () => {
    setIsGeneratingAll(true);
    setStatusMessage({
      type: 'info',
      message: 'Generating all SWOT strategies. This may take a moment...'
    });
    
    try {
      // Clear recently generated type to avoid showing individual notifications
      setRecentlyGeneratedType(null);
      
      // Generate strategies for each quadrant sequentially
      await generateStrategies("SO");
      await generateStrategies("ST");
      await generateStrategies("WO");
      await generateStrategies("WT");
      
      setStatusMessage({
        type: 'success',
        message: 'Successfully generated all SWOT strategies!'
      });
      
      // If we have IE Matrix data, also generate prioritized strategies
      if (ieQuadrant && ieStrategy) {
        await generatePrioritizedStrategies();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      
      // Clear recently generated type since we've shown a global success message
      setRecentlyGeneratedType(null);
    } catch (error) {
      console.error("Error generating all strategies:", error);
      setStatusMessage({
        type: 'error',
        message: `Failed to generate all strategies: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // Generate prioritized strategies based on IE Matrix position
  const generatePrioritizedStrategies = async () => {
    if (!ieQuadrant || !ieStrategy) return;
    
    setIsGeneratingPriorities(true);
    
    try {
      // Collect all strategies
      const allStrategies = [
        ...soStrategies.map(s => ({ ...s, type: "SO" as const })),
        ...stStrategies.map(s => ({ ...s, type: "ST" as const })),
        ...woStrategies.map(s => ({ ...s, type: "WO" as const })),
        ...wtStrategies.map(s => ({ ...s, type: "WT" as const }))
      ];
      
      if (allStrategies.length === 0) {
        setIsGeneratingPriorities(false);
        setStatusMessage({
          type: 'error',
          message: 'Please generate strategies in all quadrants first before prioritizing.'
        });
        return;
      }
      
      // Get language for instructions
      const language = selectedLanguage || detectedLanguage || 'en';
      const languageName = supportedLanguages.find(l => l.code === language)?.name || 'English';
      const languageInstruction = language !== 'en' ? 
        `Please respond in ${languageName}. ` : 
        "";
      
      // Create prompt based on IE Matrix position
      let prompt = `${languageInstruction}Based on the company's position in the IE Matrix (Cell ${ieQuadrant}, which suggests a "${ieStrategy}" approach), prioritize and recommend the most appropriate strategies from this list:\n\n`;
      
      // Add all strategies to the prompt
      allStrategies.forEach((strategy, index) => {
        prompt += `- ${strategy.type} Strategy ${index + 1}: ${strategy.content}\n`;
      });
      
      prompt += `\nProvide a ranked list of the top 3-5 most appropriate strategies given the "${ieStrategy}" approach, with a brief explanation for each recommendation. Format as a numbered list with 1., 2., 3., etc.`;
      
      setStatusMessage({
        type: 'info', 
        message: `Generating prioritized strategies in ${languageName} using ${getModelDisplayName(selectedModel)}...`
      });
      
      try {
        // Call the AI service through the util.ts proxy
        const result = await generateText(prompt, selectedModel);
        
        if (!result || !result.text) {
          throw new Error("Received empty response from AI service");
        }
        
        console.log("Prioritized AI Response:", result);
        
        // Parse the response and create prioritized strategy items
        const responseText = result.text.trim();
        let strategies: StrategyItem[] = [];
        
        // Try multiple parsing approaches in sequence
        
        // Approach 1: Look for numbered items (1., 2., 3.)
        const numberedRegex = /(\d+\.\s*)(.*?)(?=\d+\.\s*|$)/gs;
        const numberedMatches = [...responseText.matchAll(numberedRegex)];
        
        if (numberedMatches.length > 0) {
          strategies = numberedMatches.map(match => ({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            content: match[2].trim(),
            isEditing: false,
            editContent: match[2].trim()
          }));
        } 
        // Approach 2: Split by double newlines (paragraphs)
        else if (responseText.includes("\n\n")) {
          strategies = responseText
            .split(/\n\n|\r\n\r\n/)
            .filter(text => text.trim().length > 0)
            .map(text => ({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              content: text.trim(),
              isEditing: false,
              editContent: text.trim()
            }));
        }
        // Approach 3: Split by single newlines if there are at least 3
        else if (responseText.split("\n").length >= 3) {
          strategies = responseText
            .split("\n")
            .filter(text => text.trim().length > 0)
            .map(text => ({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              content: text.trim(),
              isEditing: false,
              editContent: text.trim()
            }));
        }
        // Approach 4: Use the whole text as one strategy
        else {
          strategies = [{
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            content: responseText,
            isEditing: false,
            editContent: responseText
          }];
        }
        
        // Ensure we have at least one strategy
        if (strategies.length === 0) {
          strategies = [{
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            content: responseText,
            isEditing: false,
            editContent: responseText
          }];
        }
        
        setPrioritizedStrategies(strategies);
        setStatusMessage({
          type: 'success', 
          message: `Successfully generated prioritized strategies using ${getModelDisplayName(selectedModel)}.`
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      } catch (apiError) {
        console.error("API error generating prioritized strategies:", apiError);
        setStatusMessage({
          type: 'error', 
          message: `Failed to generate prioritized strategies: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error("Error preparing prioritized strategies:", error);
      setStatusMessage({
        type: 'error',
        message: `Error preparing prioritized strategies: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsGeneratingPriorities(false);
    }
  };

  // Handle editing strategies
  const toggleEdit = (id: string, strategyType: StrategyType) => {
    const updateStrategy = (strategies: StrategyItem[]) => 
      strategies.map(strategy => 
        strategy.id === id 
          ? { ...strategy, isEditing: !strategy.isEditing, editContent: strategy.content } 
          : strategy
      );
    
    switch (strategyType) {
      case "SO":
        setSoStrategies(updateStrategy(soStrategies));
        break;
      case "ST":
        setStStrategies(updateStrategy(stStrategies));
        break;
      case "WO":
        setWoStrategies(updateStrategy(woStrategies));
        break;
      case "WT":
        setWtStrategies(updateStrategy(wtStrategies));
        break;
    }
  };

  const updateEditContent = (id: string, content: string, strategyType: StrategyType) => {
    const updateStrategy = (strategies: StrategyItem[]) => 
      strategies.map(strategy => 
        strategy.id === id ? { ...strategy, editContent: content } : strategy
      );
    
    switch (strategyType) {
      case "SO":
        setSoStrategies(updateStrategy(soStrategies));
        break;
      case "ST":
        setStStrategies(updateStrategy(stStrategies));
        break;
      case "WO":
        setWoStrategies(updateStrategy(woStrategies));
        break;
      case "WT":
        setWtStrategies(updateStrategy(wtStrategies));
        break;
    }
  };

  const saveEdit = (id: string, strategyType: StrategyType) => {
    const updateStrategy = (strategies: StrategyItem[]) => 
      strategies.map(strategy => 
        strategy.id === id 
          ? { ...strategy, content: strategy.editContent, isEditing: false } 
          : strategy
      );
    
    switch (strategyType) {
      case "SO":
        setSoStrategies(updateStrategy(soStrategies));
        break;
      case "ST":
        setStStrategies(updateStrategy(stStrategies));
        break;
      case "WO":
        setWoStrategies(updateStrategy(woStrategies));
        break;
      case "WT":
        setWtStrategies(updateStrategy(wtStrategies));
        break;
    }
  };

  const cancelEdit = (id: string, strategyType: StrategyType) => {
    const updateStrategy = (strategies: StrategyItem[]) => 
      strategies.map(strategy => 
        strategy.id === id ? { ...strategy, isEditing: false } : strategy
      );
    
    switch (strategyType) {
      case "SO":
        setSoStrategies(updateStrategy(soStrategies));
        break;
      case "ST":
        setStStrategies(updateStrategy(stStrategies));
        break;
      case "WO":
        setWoStrategies(updateStrategy(woStrategies));
        break;
      case "WT":
        setWtStrategies(updateStrategy(wtStrategies));
        break;
    }
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      setStatusMessage({type: 'info', message: `Testing connection to ${getModelDisplayName(selectedModel)}...`});
      
      // Use a simple, clear prompt for testing
      const testPrompt = "Reply with 'API connection successful' if you receive this message.";
      
      const result = await generateText(testPrompt, selectedModel);
      
      if (!result || !result.text) {
        throw new Error("Received empty response from AI service");
      }
      
      console.log("Test API Response:", result);
      
      setStatusMessage({
        type: 'success', 
        message: `Connection to ${getModelDisplayName(selectedModel)} successful: ${result.text.substring(0, 50)}...`
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (error) {
      console.error("API test error:", error);
      setStatusMessage({
        type: 'error', 
        message: `Connection to ${getModelDisplayName(selectedModel)} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  // Render strategy items
  const renderStrategyItems = (strategies: StrategyItem[], type: StrategyType) => {
    return strategies.map((strategy) => (
      <motion.div
        key={strategy.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-3 bg-white rounded-lg border border-slate-200 p-4 shadow-sm"
      >
        {strategy.isEditing ? (
          <div>
            <textarea
              value={strategy.editContent}
              onChange={(e) => updateEditContent(strategy.id, e.target.value, type)}
              className="w-full p-2 border border-slate-300 rounded-md mb-2"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => cancelEdit(strategy.id, type)}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={() => saveEdit(strategy.id, type)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-slate-700">{strategy.content}</p>
            <button
              onClick={() => toggleEdit(strategy.id, type)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" /> Edit
            </button>
          </div>
        )}
      </motion.div>
    ));
  };

  // Render strategy quadrant
  const renderStrategyQuadrant = (
    title: string,
    description: string,
    type: StrategyType,
    strategies: StrategyItem[],
    colorClass: string
  ) => {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className={`p-4 ${colorClass}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm mt-1">{description}</p>
        </div>
        
        <div className="p-4">
          {strategies.length > 0 ? (
            <>
              {recentlyGeneratedType === type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>New strategies generated</span>
                </motion.div>
              )}
              <div className="mb-4">{renderStrategyItems(strategies, type)}</div>
            </>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No strategies generated yet</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => generateStrategies(type)}
              className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${
                isGenerating === type
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-700 text-white hover:bg-slate-800"
              }`}
              disabled={isGenerating !== null || isGeneratingAll}
            >
              {isGenerating === type ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  {strategies.length > 0 ? "Regenerate" : "Generate"} Strategies
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                if (showPromptInput && type === isGenerating) {
                  setShowPromptInput(false);
                } else {
                  setShowPromptInput(true);
                  setIsGenerating(type);
                }
              }}
              className="px-3 py-2 text-sm rounded-md flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
              disabled={isGenerating !== null || isGeneratingAll}
            >
              <Send className="h-3.5 w-3.5" />
              Custom Prompt
            </button>
          </div>
          
          {showPromptInput && isGenerating === type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add custom instructions..."
                  className="flex-1 p-2 border border-slate-300 rounded-md"
                />
                <button
                  onClick={() => generateStrategies(type, customPrompt)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                  disabled={isGenerating !== null}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      
      <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-indigo-800 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI-Powered Strategy Generation
        </h3>
        <p className="text-indigo-700 mt-1">
          Generate strategic recommendations using AI models based on your SWOT analysis and IE Matrix position.
          The system will analyze your inputs and suggest tailored strategies for your organization.
        </p>
      </div>
      
      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          {statusMessage.type === 'error' && <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
          {statusMessage.type === 'success' && <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />}
          {statusMessage.type === 'info' && <RefreshCw className="h-5 w-5 mt-0.5 flex-shrink-0" />}
          <div>
            <p className="font-medium">{statusMessage.type === 'error' ? 'Error' : statusMessage.type === 'success' ? 'Success' : 'Information'}</p>
            <p>{statusMessage.message}</p>
          </div>
        </motion.div>
      )}

      <div className="mb-6">
        <button
          onClick={generateAllStrategies}
          disabled={isGeneratingAll || isGenerating !== null || isGeneratingPriorities}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
            isGeneratingAll 
              ? "bg-slate-100 text-slate-700" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isGeneratingAll ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Generating All Strategies...
            </>
          ) : (
            <>
              <Lightbulb className="h-5 w-5" />
              Generate All SWOT Strategies
            </>
          )}
        </button>
        <p className="text-xs text-slate-500 text-center mt-2">
          This will generate strategies for all four quadrants of the SWOT Matrix
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {renderStrategyQuadrant(
          "SO Strategies",
          "Use strengths to take advantage of opportunities",
          "SO",
          soStrategies,
          "bg-green-50 text-green-800"
        )}
        
        {renderStrategyQuadrant(
          "ST Strategies",
          "Use strengths to minimize threats",
          "ST",
          stStrategies,
          "bg-blue-50 text-blue-800"
        )}
        
        {renderStrategyQuadrant(
          "WO Strategies",
          "Improve weaknesses by taking advantage of opportunities",
          "WO",
          woStrategies,
          "bg-amber-50 text-amber-800"
        )}
        
        {renderStrategyQuadrant(
          "WT Strategies",
          "Minimize weaknesses and avoid threats",
          "WT",
          wtStrategies,
          "bg-red-50 text-red-800"
        )}
      </div>

      {/* IE Matrix Integration */}
      {ieQuadrant && ieStrategy && (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Strategic Recommendations Based on IE Matrix
          </h3>
          <div className="bg-slate-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
                {ieQuadrant}
              </div>
              <div>
                <p className="text-slate-600">
                  Your position in the IE Matrix (Cell {ieQuadrant}) suggests a{" "}
                  <span className="font-semibold">{ieStrategy}</span> approach.
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {ieStrategy === "Grow and Build"
                    ? "Focus on SO and WO strategies that leverage opportunities"
                    : ieStrategy === "Hold and Maintain"
                    ? "Balance SO and ST strategies to sustain market position"
                    : "Prioritize ST and WT strategies to minimize risk"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-slate-800">Prioritized Strategies</h4>
              <button
                onClick={generatePrioritizedStrategies}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                disabled={isGeneratingPriorities || isGeneratingAll || 
                  (soStrategies.length === 0 && 
                   stStrategies.length === 0 && 
                   woStrategies.length === 0 && 
                   wtStrategies.length === 0)}
              >
                {isGeneratingPriorities ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    {prioritizedStrategies.length > 0 ? "Regenerate" : "Generate"} Recommendations
                  </>
                )}
              </button>
            </div>

            {prioritizedStrategies.length > 0 ? (
              <div className="space-y-4">
                {prioritizedStrategies.map((strategy, index) => (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-slate-700">{strategy.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                <Lightbulb className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                <p className="text-slate-600">
                  Generate strategies in the quadrants above, then click "Generate Recommendations"
                  to get prioritized strategies based on your IE Matrix position.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
