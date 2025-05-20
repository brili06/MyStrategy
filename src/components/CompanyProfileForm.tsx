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
  }} className="bg-white shadow-lg rounded-xl p-6" data-unique-id="607f8c8a-1076-4abb-8624-0a07982755ca" data-file-name="components/CompanyProfileForm.tsx">
      <h2 className="text-2xl font-bold text-slate-800 mb-6" data-unique-id="bbea92b1-be0c-4bd4-b440-d95517491b8b" data-file-name="components/CompanyProfileForm.tsx"><span className="editable-text" data-unique-id="f25afc84-4292-4e9b-8818-9f1504b8e8ea" data-file-name="components/CompanyProfileForm.tsx">Company Profile</span></h2>
      <p className="text-slate-500 mb-6" data-unique-id="5d4b7be3-ba42-4571-85fd-0dac39040c3b" data-file-name="components/CompanyProfileForm.tsx"><span className="editable-text" data-unique-id="287c48e5-7c7f-4f89-ac08-7f54029855a4" data-file-name="components/CompanyProfileForm.tsx">
        Please provide basic information about your company before proceeding with the strategic analysis.
      </span></p>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6" data-unique-id="a26348ab-3879-4594-836d-ee349f8452c0" data-file-name="components/CompanyProfileForm.tsx">
        <div className="space-y-4" data-unique-id="269afe32-67ce-4eb6-8ac5-b00a979059c6" data-file-name="components/CompanyProfileForm.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="6f7836b6-0115-4b56-8147-cbb2675cd778" data-file-name="components/CompanyProfileForm.tsx">
            <div data-unique-id="a5c832d2-50ee-4095-9b80-3b3362c05d10" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="de8bf6e4-5960-4658-b6cc-be41ca814dd0" data-file-name="components/CompanyProfileForm.tsx">
                <Building2 className="h-4 w-4 mr-2 text-blue-600" /><span className="editable-text" data-unique-id="c777fd0f-23ba-41c4-9140-7bae168e190e" data-file-name="components/CompanyProfileForm.tsx">
                Company Name
              </span></label>
              <input {...register("name")} type="text" className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Acme Corporation" data-unique-id="2e673181-02c1-4762-b894-0e7851af9b9a" data-file-name="components/CompanyProfileForm.tsx" />
              {errors.name && <p className="mt-1 text-sm text-red-600" data-unique-id="947adaba-6088-4cee-9876-fc172c1b2e17" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">{errors.name.message}</p>}
            </div>

            <div data-unique-id="2a6e9ed2-51c8-4a79-98e1-41ee12e06d8e" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="86f80379-b1bc-4ad4-9185-ac2aef7d89cb" data-file-name="components/CompanyProfileForm.tsx">
                <Briefcase className="h-4 w-4 mr-2 text-blue-600" /><span className="editable-text" data-unique-id="3f4f3ff3-cac2-4ccc-bbd1-a3a5cbcbeadd" data-file-name="components/CompanyProfileForm.tsx">
                Industry Sector
              </span></label>
              <input {...register("industry")} type="text" className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Technology, Healthcare, Finance" data-unique-id="e289f445-905f-4b53-aeff-28db5c9eecc1" data-file-name="components/CompanyProfileForm.tsx" />
              {errors.industry && <p className="mt-1 text-sm text-red-600" data-unique-id="bc61ba8e-3b59-4e7b-a560-c7cf34bd9352" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">{errors.industry.message}</p>}
            </div>
          </div>

          <div data-unique-id="645ee7d2-8be0-4204-9127-f3a76370c709" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="ab13fcd7-2285-4b03-95c4-00acbab8c4d9" data-file-name="components/CompanyProfileForm.tsx">
              <FileText className="h-4 w-4 mr-2 text-blue-600" /><span className="editable-text" data-unique-id="5fe364ac-2060-4139-9d13-951596ce9655" data-file-name="components/CompanyProfileForm.tsx">
              Brief Description
            </span></label>
            <textarea {...register("description")} rows={3} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe your company's products or services" data-unique-id="30de22dd-a60b-4e2a-b321-e69527e3d82c" data-file-name="components/CompanyProfileForm.tsx"></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600" data-unique-id="5d27722e-d76b-4dca-a4f0-9a7e4116e525" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">{errors.description.message}</p>}
          </div>

          <div data-unique-id="4e66d4cb-cc31-4ea0-9f08-8f60a4cd2874" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="8071fbf0-8b1f-47b4-ad8e-c9513669c3f1" data-file-name="components/CompanyProfileForm.tsx">
              <Eye className="h-4 w-4 mr-2 text-blue-600" /><span className="editable-text" data-unique-id="89bd9655-cef9-44cf-acb6-309829cbbc8c" data-file-name="components/CompanyProfileForm.tsx">
              Vision Statement
            </span></label>
            <textarea {...register("vision")} rows={2} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your company's vision for the future" data-unique-id="7ad8e28c-08dc-445d-88f2-1048d3d8d49b" data-file-name="components/CompanyProfileForm.tsx"></textarea>
            {errors.vision && <p className="mt-1 text-sm text-red-600" data-unique-id="3b52fc85-c3ef-40ce-a5bd-26140fffdc14" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">{errors.vision.message}</p>}
          </div>

          <div data-unique-id="12e387b9-6f4a-49c5-b161-f2aeba019064" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1" data-unique-id="adb24f25-0af0-4eef-852d-c28eb100b603" data-file-name="components/CompanyProfileForm.tsx">
              <Target className="h-4 w-4 mr-2 text-blue-600" /><span className="editable-text" data-unique-id="09810510-d53b-4f20-97b9-816f66f96e84" data-file-name="components/CompanyProfileForm.tsx">
              Mission Statement
            </span></label>
            <textarea {...register("mission")} rows={2} className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your company's purpose and goals" data-unique-id="32b38f71-f65c-4f01-b7a2-6d369d21fcc6" data-file-name="components/CompanyProfileForm.tsx"></textarea>
            {errors.mission && <p className="mt-1 text-sm text-red-600" data-unique-id="6f10f7b6-16cf-4ab8-a0d7-e941628f092f" data-file-name="components/CompanyProfileForm.tsx" data-dynamic-text="true">{errors.mission.message}</p>}
          </div>
        </div>

        <div className="pt-4" data-unique-id="86a8d001-a19f-4b52-bb1c-da044c5a1d1f" data-file-name="components/CompanyProfileForm.tsx">
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="7b017836-c68e-49bb-bef5-a09699767290" data-file-name="components/CompanyProfileForm.tsx"><span className="editable-text" data-unique-id="69119157-c4fb-4135-a38a-007c78f35933" data-file-name="components/CompanyProfileForm.tsx">
            Save & Continue
          </span></button>
        </div>
      </form>
    </motion.div>;
}