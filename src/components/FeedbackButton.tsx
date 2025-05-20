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
    }} data-unique-id="d5b99fd7-aa81-4292-8314-c40561cbb74b" data-loc="102:6-107:7" data-file-name="components/FeedbackButton.tsx">
        <MessageSquare size={20} />
        <span data-unique-id="ac5f5272-86b7-482c-a3fe-91451d99fcd1" data-loc="109:8-109:14" data-file-name="components/FeedbackButton.tsx">Send Feedback</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={closeModal} data-unique-id="93cd901b-cdcf-4ceb-87d2-edd7b91c56df" data-loc="115:10-121:11" data-file-name="components/FeedbackButton.tsx">
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
        }} onClick={e => e.stopPropagation()} data-unique-id="8ed80d55-6bde-425c-afc3-663ba64a4989" data-loc="123:12-129:13" data-file-name="components/FeedbackButton.tsx">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center" data-unique-id="f00ae751-77e8-4d5d-98e3-9659f5ab81bb" data-loc="131:14-131:101" data-file-name="components/FeedbackButton.tsx">
                <h3 className="text-xl font-semibold text-slate-800" data-unique-id="4d873d3c-0ceb-4608-b12f-721f82209cae" data-loc="132:16-132:69" data-file-name="components/FeedbackButton.tsx">Send Feedback</h3>
                <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100" data-unique-id="c18a7517-fa48-46fd-a43c-282d748622b9" data-loc="133:16-133:93" data-file-name="components/FeedbackButton.tsx">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-5" data-unique-id="ef06473a-5c81-4ff5-a414-64099ee798aa" data-loc="139:14-139:41" data-file-name="components/FeedbackButton.tsx">
                {submitStatus === 'success' ? <div className="py-6 text-center" data-unique-id="38dc89b4-f35c-418a-a6cd-f89bae193bfa" data-loc="141:18-141:52" data-file-name="components/FeedbackButton.tsx">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4" data-unique-id="e94f334a-2eac-47b7-9677-bd5d85ae0e74" data-loc="142:20-142:119" data-file-name="components/FeedbackButton.tsx">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor" data-unique-id="16d88504-18ca-4dce-a096-ee14ef86304e" data-loc="143:22-143:137" data-file-name="components/FeedbackButton.tsx">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-green-700" data-unique-id="1da0675e-87f4-43d2-b340-5ebb4dad9351" data-loc="147:20-147:71" data-file-name="components/FeedbackButton.tsx">Thank you!</h4>
                    <p className="mt-2 text-slate-600" data-unique-id="ffc17169-5ae7-430e-8585-9ee120893349" data-loc="148:20-148:55" data-file-name="components/FeedbackButton.tsx">Your feedback has been sent successfully.</p>
                  </div> : submitStatus === 'error' ? <div className="py-6 text-center" data-unique-id="9e0365b5-3bbf-4ba5-a2d1-d80e953fd042" data-loc="151:18-151:52" data-file-name="components/FeedbackButton.tsx">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4" data-unique-id="62780417-b667-427b-89d8-0e1fec3ca348" data-loc="152:20-152:117" data-file-name="components/FeedbackButton.tsx">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-unique-id="c8f78195-2d7d-4368-80e6-372d1e40663a" data-loc="153:22-153:149" data-file-name="components/FeedbackButton.tsx">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-red-700" data-unique-id="eecff7b8-1eba-441f-ac2c-b1f773eb3482" data-loc="157:20-157:69" data-file-name="components/FeedbackButton.tsx">Submission failed</h4>
                    <p className="mt-2 text-slate-600" data-unique-id="88e02175-23a7-46d2-bf5c-c9e0968dd954" data-loc="158:20-158:55" data-file-name="components/FeedbackButton.tsx">There was an error sending your feedback. Please try again.</p>
                    <button onClick={() => setSubmitStatus('idle')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" data-unique-id="369ac907-c75a-4970-a536-67f188f0ac60" data-loc="159:20-162:21" data-file-name="components/FeedbackButton.tsx">
                      Try Again
                    </button>
                  </div> : <form onSubmit={handleSubmit} className="space-y-4" data-unique-id="beceaa81-8ece-4ac3-93f4-f5f820486a76" data-loc="167:18-167:70" data-file-name="components/FeedbackButton.tsx">
                    <div data-unique-id="bd7d5c9e-e00c-47d3-9e44-79f919018894" data-loc="168:20-168:25" data-file-name="components/FeedbackButton.tsx">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1" data-unique-id="f4ca9f8b-583f-4292-a40a-e3cada093871" data-loc="169:22-169:102" data-file-name="components/FeedbackButton.tsx">
                        Name (Optional)
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Your name" data-unique-id="f5692c6e-60a0-4b6e-971c-fbdf9071d8d6" data-loc="172:22-180:24" data-file-name="components/FeedbackButton.tsx" />
                    </div>
                    
                    <div data-unique-id="337e7e97-9a3f-42c8-9661-e941542488be" data-loc="183:20-183:25" data-file-name="components/FeedbackButton.tsx">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1" data-unique-id="caca17ff-e1fd-4dae-8318-be0c2ce3a697" data-loc="184:22-184:103" data-file-name="components/FeedbackButton.tsx">
                        Email <span className="text-red-500" data-unique-id="b4c0ea0b-c80f-4f33-a018-57a0a9311c1f" data-loc="185:30-185:61" data-file-name="components/FeedbackButton.tsx">*</span>
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`} placeholder="your.email@example.com" data-unique-id="7e2e5cfd-7f4b-4d49-a800-be1ebc693b76" data-loc="187:22-197:24" data-file-name="components/FeedbackButton.tsx" />
                      {errors.email && <p className="mt-1 text-sm text-red-600" data-unique-id="91123d6a-1f70-44d3-9882-407bb457c275" data-loc="199:24-199:65" data-file-name="components/FeedbackButton.tsx">{errors.email}</p>}
                    </div>
                    
                    <div data-unique-id="2f955bbe-12d4-471c-b326-93fbdedf86cd" data-loc="203:20-203:25" data-file-name="components/FeedbackButton.tsx">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1" data-unique-id="f1fe8f3e-16bd-4693-92a7-f7d81dab0213" data-loc="204:22-204:105" data-file-name="components/FeedbackButton.tsx">
                        Message <span className="text-red-500" data-unique-id="5232708c-334c-4a0d-bcd3-33d14b844940" data-loc="205:32-205:63" data-file-name="components/FeedbackButton.tsx">*</span>
                      </label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none`} placeholder="Your feedback message..." data-unique-id="066992e6-65c5-4de1-8f51-565d6ee47343" data-loc="207:22-217:24" data-file-name="components/FeedbackButton.tsx" />
                      {errors.message && <p className="mt-1 text-sm text-red-600" data-unique-id="2a4d9932-328f-4c15-93a1-1118d16cd9c4" data-loc="219:24-219:65" data-file-name="components/FeedbackButton.tsx">{errors.message}</p>}
                    </div>
                    
                    <div className="pt-2" data-unique-id="28077c48-7f7a-4d31-b5c8-bc81af462ed1" data-loc="223:20-223:42" data-file-name="components/FeedbackButton.tsx">
                      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center" data-unique-id="10773a94-75b1-4723-b1c2-a5c8af1fb140" data-loc="224:22-228:23" data-file-name="components/FeedbackButton.tsx">
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