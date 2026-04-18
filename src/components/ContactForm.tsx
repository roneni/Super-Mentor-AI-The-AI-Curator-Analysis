import React, { useState } from 'react';
import { X, Send, User, Mail, MessageSquare, Briefcase } from 'lucide-react';
import { translations } from '../i18n';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'he';
}

export const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  const t = translations[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className={`absolute top-6 ${lang === 'he' ? 'left-6' : 'right-6'} text-gray-500 hover:text-white transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">{t.contactSalesTitle}</h2>
          <p className="text-gray-400 text-sm mb-8">{t.upgradeToPro}</p>
          
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.messageReceived}</h3>
              <p className="text-gray-400">{t.contactShortly}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">{t.fullName}</label>
                <div className="relative">
                  <User className={`absolute ${lang === 'he' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500`} />
                  <input required type="text" className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${lang === 'he' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`} placeholder={t.namePlaceholder} />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">{t.workEmail}</label>
                <div className="relative">
                  <Mail className={`absolute ${lang === 'he' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500`} />
                  <input required type="email" className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${lang === 'he' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`} placeholder={t.emailPlaceholder} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">{t.planInterest}</label>
                <div className="relative">
                  <Briefcase className={`absolute ${lang === 'he' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500`} />
                  <select className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${lang === 'he' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white appearance-none focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}>
                    <option value="pro" className="bg-[#0a0a0a]">{t.proPlan}</option>
                    <option value="premium" className="bg-[#0a0a0a]">{t.premiumPlan}</option>
                    <option value="enterprise" className="bg-[#0a0a0a]">{t.enterprisePlan}</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">{t.message}</label>
                <div className="relative">
                  <MessageSquare className={`absolute ${lang === 'he' ? 'right-4' : 'left-4'} top-4 w-4 h-4 text-gray-500`} />
                  <textarea required rows={3} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${lang === 'he' ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none`} placeholder={t.messagePlaceholder}></textarea>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full mt-6 bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? t.sending : t.requestAccess}
                {status !== 'submitting' && <Send className={`w-4 h-4 ${lang === 'he' ? 'rotate-180' : ''}`} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
