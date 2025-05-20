'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { send } from '@emailjs/browser';
interface FeedbackFormData {
  name: string;
  email: string;
  message: string;
}
export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    // Reset form state when closing
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setErrors({});
      setSubmitStatus('idle');
    }, 300);
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackFormData> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    if (!formData.message) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FeedbackFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // EmailJS configuration with provided credentials
    const serviceId = 'service_33f1gm3';
    const templateId = 'template_umd1op3';
    const publicKey = 'ECikutdcmOAlazMQT';
    try {
      const templateParams = {
        to_email: 'briliansetiaproject@gmail.com',
        from_name: formData.name || 'Anonymous',
        from_email: formData.email,
        message: formData.message
      };
      await send(serviceId, templateId, templateParams, publicKey);
      setSubmitStatus('success');

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }, 1500);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <>
      {/* Feedback Button */}
      <motion.button onClick={openModal} className="fixed z-40 bottom-8 left-8 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700" whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} data-unique-id="3fc71f3d-0649-4b77-a61b-dfc3b8afb0cc" data-file-name="components/FeedbackButton.tsx">
        <MessageSquare size={20} />
        <span data-unique-id="a0e1ce28-0d8a-40f9-8037-4228c08aef13" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="f4570f1c-2914-424a-aefe-8b6d1133febc" data-file-name="components/FeedbackButton.tsx">Send Feedback</span></span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={closeModal} data-unique-id="e68cab70-988f-4b34-82a5-b10ac982816b" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">
            {/* Modal Content */}
            <motion.div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-unique-id="e2384a01-a767-48d6-a3ab-83c1b7b4e51c" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center" data-unique-id="55578d8c-3e28-4205-a806-1d067e75f6b2" data-file-name="components/FeedbackButton.tsx">
                <h3 className="text-xl font-semibold text-slate-800" data-unique-id="a94f9353-223f-46ea-9108-9383ba1b9e95" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="dbafafd7-69a6-472e-a2fe-1b5cc965b9f9" data-file-name="components/FeedbackButton.tsx">Send Feedback</span></h3>
                <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100" data-unique-id="0ea6c044-d0b9-4c65-90f0-4f898e77c124" data-file-name="components/FeedbackButton.tsx">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-5" data-unique-id="8f4db187-cb57-4ebf-acc3-f85fc194c6c3" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">
                {submitStatus === 'success' ? <div className="py-6 text-center" data-unique-id="50b9062c-e52a-4e2b-a3af-825df0d14553" data-file-name="components/FeedbackButton.tsx">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4" data-unique-id="8cd41aa5-a345-4fca-9922-7223896f7f8f" data-file-name="components/FeedbackButton.tsx">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor" data-unique-id="b7ecfcd5-0696-49cc-95f5-334bb521756b" data-file-name="components/FeedbackButton.tsx">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-green-700" data-unique-id="d58f60d2-b44b-4fdb-82bf-aaa264858a08" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="bada47ee-84cf-4f45-b49b-73f82dc4d5e9" data-file-name="components/FeedbackButton.tsx">Thank you!</span></h4>
                    <p className="mt-2 text-slate-600" data-unique-id="f440371f-d31c-4f4f-9908-2d10c61df284" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="a60002a3-8d2a-4c7c-936d-41a782d0a8f0" data-file-name="components/FeedbackButton.tsx">Your feedback has been sent successfully.</span></p>
                  </div> : submitStatus === 'error' ? <div className="py-6 text-center" data-unique-id="450d4476-78cc-42ff-adf9-eee2b71cbd2f" data-file-name="components/FeedbackButton.tsx">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4" data-unique-id="0959f802-cb66-4729-8112-5b51b6e3c75c" data-file-name="components/FeedbackButton.tsx">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-unique-id="bccebfae-16a6-4f69-ae07-31074f97549f" data-file-name="components/FeedbackButton.tsx">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-red-700" data-unique-id="fa82c294-f838-4b88-9d05-8056230b7db2" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="ed150f09-4574-4557-87cb-c436ac22cad8" data-file-name="components/FeedbackButton.tsx">Submission failed</span></h4>
                    <p className="mt-2 text-slate-600" data-unique-id="a4b50d9f-6b8a-49a0-8006-6b0a7c0ebd19" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="c86343fc-9c7e-48b3-a9cc-a91024adcb95" data-file-name="components/FeedbackButton.tsx">There was an error sending your feedback. Please try again.</span></p>
                    <button onClick={() => setSubmitStatus('idle')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" data-unique-id="0d1605a1-58d7-4185-adf7-766d6df34a3b" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="fe2f6aef-8ec8-420d-9431-847e774b60c4" data-file-name="components/FeedbackButton.tsx">
                      Try Again
                    </span></button>
                  </div> : <form onSubmit={handleSubmit} className="space-y-4" data-unique-id="10ba0b9c-b4b2-4e4f-adc5-5805c935d956" data-file-name="components/FeedbackButton.tsx">
                    <div data-unique-id="0d404fa9-4d53-4d45-ad7a-9c149bfb43da" data-file-name="components/FeedbackButton.tsx">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1" data-unique-id="6813b2e0-0679-4858-b52b-457bf4a77e79" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="0b3927d7-ff83-4e3b-9ddb-ecd7ed4889f9" data-file-name="components/FeedbackButton.tsx">
                        Name (Optional)
                      </span></label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Your name" data-unique-id="7c915982-0af0-4875-a122-4f1f32ad24fb" data-file-name="components/FeedbackButton.tsx" />
                    </div>
                    
                    <div data-unique-id="3a213d82-24eb-429b-a87d-d059f7bef597" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1" data-unique-id="98728c05-cc09-4555-98b7-4e9ca3d43373" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="92c4e5be-b415-4c8e-8a04-fcf92114f4b6" data-file-name="components/FeedbackButton.tsx">
                        Email </span><span className="text-red-500" data-unique-id="b5421b14-0857-428c-8843-e82b4b2e18d0" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="adf98bab-036a-4bc8-9e03-a0f021d5c972" data-file-name="components/FeedbackButton.tsx">*</span></span>
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`} placeholder="your.email@example.com" data-unique-id="22f49556-f10e-4b3a-8290-a6eca8dc7e8c" data-file-name="components/FeedbackButton.tsx" />
                      {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="3f195350-f81a-45bc-aeb6-16b8efa6317d" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">{errors.email}</p>}
                    </div>
                    
                    <div data-unique-id="d4321f92-e0fa-4a49-beeb-ca19f32ddabb" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1" data-unique-id="f13d8ae8-b365-4989-a6d5-fe3bb6ffbaf9" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="aca23707-c431-4d54-b8c4-99e3711bf2c6" data-file-name="components/FeedbackButton.tsx">
                        Message </span><span className="text-red-500" data-unique-id="1c2c9642-c191-434a-a606-39e510372160" data-file-name="components/FeedbackButton.tsx"><span className="editable-text" data-unique-id="e53dd88b-0a6c-47de-8f06-3842e09630ee" data-file-name="components/FeedbackButton.tsx">*</span></span>
                      </label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none`} placeholder="Your feedback message..." data-unique-id="1b6f48d1-7387-41c6-959e-ca34e60aa961" data-file-name="components/FeedbackButton.tsx" />
                      {errors.message && <p className="mt-1 text-sm text-red-600" data-unique-id="0f01d036-9a18-4db0-8931-6ec326f37e0e" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">{errors.message}</p>}
                    </div>
                    
                    <div className="pt-2" data-unique-id="2a1ac281-58e4-455c-8d26-477e8077f6f5" data-file-name="components/FeedbackButton.tsx">
                      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center" data-unique-id="92977200-01c4-4bb6-913e-dc389dd4fe40" data-file-name="components/FeedbackButton.tsx" data-dynamic-text="true">
                        {isSubmitting ? <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Sending...
                          </> : <>
                            <Send size={18} className="mr-2" />
                            Submit Feedback
                          </>}
                      </button>
                    </div>
                  </form>}
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </>;
}