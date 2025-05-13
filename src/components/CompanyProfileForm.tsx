"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Briefcase, FileText, Eye, Target } from "lucide-react";
import { CompanyProfile } from "@/types/matrix";

const companyProfileSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(1, "Description is required"),
  vision: z.string().min(1, "Vision statement is required"),
  mission: z.string().min(1, "Mission statement is required"),
}) as z.ZodType<CompanyProfile>;

interface CompanyProfileFormProps {
  onComplete: (profile: CompanyProfile) => void;
  initialProfile?: CompanyProfile;
}

export default function CompanyProfileForm({ onComplete, initialProfile }: CompanyProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<CompanyProfile>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: initialProfile || {
      name: "",
      industry: "",
      description: "",
      vision: "",
      mission: "",
    },
  });

  useEffect(() => {
    // Load from localStorage if available
    const savedProfile = localStorage.getItem("companyProfile");
    if (savedProfile && !initialProfile) {
      reset(JSON.parse(savedProfile));
    }
  }, [reset, initialProfile]);

  const onSubmit = async (data: CompanyProfile) => {
    try {
      // First try to save to the database
      const response = await fetch('/api/company-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save company profile to database');
      }
      
      const savedProfile = await response.json();
      
      // Also save to localStorage as a backup
      localStorage.setItem("companyProfile", JSON.stringify(savedProfile));
      
      // Pass the saved profile (with ID) to the parent component
      onComplete(savedProfile);
    } catch (error) {
      console.error('Error saving company profile:', error);
      
      // Fallback to localStorage only if database save fails
      localStorage.setItem("companyProfile", JSON.stringify(data));
      onComplete(data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Company Profile</h2>
      <p className="text-slate-500 mb-6">
        Please provide basic information about your company before proceeding with the strategic analysis.
      </p>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                Company Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Acme Corporation"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                Industry Sector
              </label>
              <input
                {...register("industry")}
                type="text"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Technology, Healthcare, Finance"
              />
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Brief Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your company's products or services"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
              <Eye className="h-4 w-4 mr-2 text-blue-600" />
              Vision Statement
            </label>
            <textarea
              {...register("vision")}
              rows={2}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company's vision for the future"
            ></textarea>
            {errors.vision && (
              <p className="mt-1 text-sm text-red-600">{errors.vision.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Mission Statement
            </label>
            <textarea
              {...register("mission")}
              rows={2}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company's purpose and goals"
            ></textarea>
            {errors.mission && (
              <p className="mt-1 text-sm text-red-600">{errors.mission.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
}
