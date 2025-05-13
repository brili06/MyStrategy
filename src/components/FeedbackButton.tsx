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
    message: '',
  });
  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    // Reset form state when closing
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FeedbackFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // Configure EmailJS with your service ID, template ID, and public key
    // You'll need to sign up at https://www.emailjs.com/
    const serviceId = 'YOUR_EMAILJS_SERVICE_ID';  // Replace with your Service ID
    const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';  // Replace with your Template ID
    const publicKey = 'YOUR_EMAILJS_PUBLIC_KEY';  // Replace with your Public Key
    
    try {
      const templateParams = {
        to_email: 'briliansetiaproject@gmail.com',
        from_name: formData.name || 'Anonymous',
        from_email: formData.email,
        message: formData.message,
      };
      
      await send(serviceId, templateId, templateParams, publicKey);
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
      }, 1500);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Feedback Button */}
      <motion.button
        onClick={openModal}
        className="fixed z-40 bottom-8 right-8 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare size={20} />
        <span>Send Feedback</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Modal Content */}
            <motion.div 
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-800">Send Feedback</h3>
                <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-5">
                {submitStatus === 'success' ? (
                  <div className="py-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-green-700">Thank you!</h4>
                    <p className="mt-2 text-slate-600">Your feedback has been sent successfully.</p>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div className="py-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-red-700">Submission failed</h4>
                    <p className="mt-2 text-slate-600">There was an error sending your feedback. Please try again.</p>
                    <button 
                      onClick={() => setSubmitStatus('idle')}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 border ${
                          errors.message ? 'border-red-500 bg-red-50' : 'border-slate-300'
                        } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none`}
                        placeholder="Your feedback message..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} className="mr-2" />
                            Submit Feedback
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
