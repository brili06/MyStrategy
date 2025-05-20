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
  mission: z.string().min(1, "Mission statement is required")
}) as z.ZodType<CompanyProfile>;
interface CompanyProfileFormProps {
  onComplete: (profile: CompanyProfile) => void;
  initialProfile?: CompanyProfile;
}
export default function CompanyProfileForm({
  onComplete,
  initialProfile
}: CompanyProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isDirty
    },
    reset
  } = useForm<CompanyProfile>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: initialProfile || {
      name: "",
      industry: "",
      description: "",
      vision: "",
      mission: ""
    }
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="bg-white shadow-lg rounded-xl p-6" data-unique-id="43be00c4-adb6-499e-ad28-f1ac20697d95" data-loc="81:4-86:5" data-file-name="components/CompanyProfileForm.tsx">
      <h2 className="text-2xl font-bold text-slate-800 mb-6" data-unique-id="9fcca3dd-55fd-4962-bc90-0c30fe12411a" data-loc="87:6-87:61" data-file-name="components/CompanyProfileForm.tsx">Company Profile</h2>
      <p className="text-slate-500 mb-6" data-unique-id="e3d32ee0-db0a-4a50-bae1-1cd365521ad7" data-loc="88:6-88:41" data-file-name="components/CompanyProfileForm.tsx">
        Please provide basic information about your company before proceeding with the strategic analysis.
      </p>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6" data-unique-id="bda913aa-87d0-425c-be9a-f84fcc3c51f8" data-loc="92:6-92:75" data-file-name="components/CompanyProfileForm.tsx">
        <div className="space-y-4" data-unique-id="dc84e446-4d3b-458f-aab6-3aeb4a3c2fbc" data-loc="93:8-93:35" data-file-name="components/CompanyProfileForm.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="2fffa55a-0bbb-4296-81ca-4e9f7723fe99" data-loc="94:10-94:65" data-file-name="components/CompanyProfileForm.tsx">
            <div data-unique-id="e6245dbe-a8cf-4029-b3a8-e3b858e558e2" data-loc="95:12-95:17" data-file-name="components/CompanyProfileForm.tsx">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="3c879f21-eaa3-42c5-af8f-73583d2dc380" data-loc="96:14-96:91" data-file-name="components/CompanyProfileForm.tsx">
                <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                Company Name
              </label>
              <input {...register("name")} type="text" className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Acme Corporation" data-unique-id="d5a671e6-082c-4a0a-aed4-4eddbaf16288" data-loc="100:14-105:16" data-file-name="components/CompanyProfileForm.tsx" />
              {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="e0e801c7-0b1b-4747-bf10-227737ecb24f" data-loc="107:16-107:57" data-file-name="components/CompanyProfileForm.tsx">{errors.name.message}</p>}
            </div>

            <div data-unique-id="0085602c-6ba1-46b4-bd29-c85d322ba8bf" data-loc="111:12-111:17" data-file-name="components/CompanyProfileForm.tsx">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="e7c31cd1-b2ef-4de5-85c5-6cb9da5478a9" data-loc="112:14-112:91" data-file-name="components/CompanyProfileForm.tsx">
                <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                Industry Sector
              </label>
              <input {...register("industry")} type="text" className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Technology, Healthcare, Finance" data-unique-id="685fc49c-b9f8-437a-a80c-e6c2fd08bc33" data-loc="116:14-121:16" data-file-name="components/CompanyProfileForm.tsx" />
              {errors.industry && <p className="mt-1 text-sm text-red-600" data-unique-id="da817e99-fbe2-489c-a051-34c9f64629a7" data-loc="123:16-123:57" data-file-name="components/CompanyProfileForm.tsx">{errors.industry.message}</p>}
            </div>
          </div>

          <div data-unique-id="13c1eb02-daf1-4c8b-b4b9-1be75469da17" data-loc="128:10-128:15" data-file-name="components/CompanyProfileForm.tsx">
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="67870eb1-cc51-4a9c-922b-dcd4c1b0a767" data-loc="129:12-129:89" data-file-name="components/CompanyProfileForm.tsx">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Brief Description
            </label>
            <textarea {...register("description")} rows={3} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe your company's products or services" data-unique-id="51a5ece8-c98f-477a-9c17-bda2f2dc5432" data-loc="133:12-138:13" data-file-name="components/CompanyProfileForm.tsx"></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600" data-unique-id="d3e54990-a0b2-4da9-9705-ed30bde1a109" data-loc="140:14-140:55" data-file-name="components/CompanyProfileForm.tsx">{errors.description.message}</p>}
          </div>

          <div data-unique-id="7f6a0ef6-e885-4cac-9462-8852dc750c0f" data-loc="144:10-144:15" data-file-name="components/CompanyProfileForm.tsx">
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="d8fed9d4-d8f3-4276-805b-73465f53230d" data-loc="145:12-145:89" data-file-name="components/CompanyProfileForm.tsx">
              <Eye className="h-4 w-4 mr-2 text-blue-600" />
              Vision Statement
            </label>
            <textarea {...register("vision")} rows={2} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your company's vision for the future" data-unique-id="7afc828f-eb99-42b5-bc87-dd30f22efaa4" data-loc="149:12-154:13" data-file-name="components/CompanyProfileForm.tsx"></textarea>
            {errors.vision && <p className="mt-1 text-sm text-red-600" data-unique-id="c8cb03d9-57fd-445c-b832-2f6f015675dc" data-loc="156:14-156:55" data-file-name="components/CompanyProfileForm.tsx">{errors.vision.message}</p>}
          </div>

          <div data-unique-id="8d52d768-84d8-4795-8a53-f14c0341bee5" data-loc="160:10-160:15" data-file-name="components/CompanyProfileForm.tsx">
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="53f78b9f-bc2d-4520-adde-3e2c6e4cecc3" data-loc="161:12-161:89" data-file-name="components/CompanyProfileForm.tsx">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Mission Statement
            </label>
            <textarea {...register("mission")} rows={2} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your company's purpose and goals" data-unique-id="0786c025-c24d-493c-8641-c51803b50626" data-loc="165:12-170:13" data-file-name="components/CompanyProfileForm.tsx"></textarea>
            {errors.mission && <p className="mt-1 text-sm text-red-600" data-unique-id="11959119-968e-4154-a1f4-eff33dfc1df1" data-loc="172:14-172:55" data-file-name="components/CompanyProfileForm.tsx">{errors.mission.message}</p>}
          </div>
        </div>

        <div className="pt-4" data-unique-id="109f5f90-c691-4f21-91b2-001cb4d154e8" data-loc="177:8-177:30" data-file-name="components/CompanyProfileForm.tsx">
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="8aec8f43-578b-4790-b38d-78f5d479dfbc" data-loc="178:10-181:11" data-file-name="components/CompanyProfileForm.tsx">
            Save & Continue
          </button>
        </div>
      </form>
    </motion.div>;
}