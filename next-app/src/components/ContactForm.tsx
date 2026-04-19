"use client";

import { useState } from "react";
import { X, Send, User, Mail, MessageSquare, Briefcase } from "lucide-react";
import { submitContact } from "@/lib/api-client";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", plan: "pro", message: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitContact(formData);
      setStatus("success");
      setTimeout(() => { setStatus("idle"); onClose(); }, 3000);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Contact Sales</h2>
          <p className="text-gray-400 text-sm mb-8">Upgrade to Pro or Premium to unlock unlimited strategic intelligence.</p>

          {status === "success" ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Received</h3>
              <p className="text-gray-400">Our strategic team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required type="text" value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all" placeholder="Marty Cagan" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input required type="email" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all" placeholder="marty@svpg.com" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Plan Interest</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select value={formData.plan} onChange={e => setFormData(d => ({ ...d, plan: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white appearance-none focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all">
                    <option value="pro" className="bg-[#0a0a0a]">Pro (Strategist) - $29/mo</option>
                    <option value="premium" className="bg-[#0a0a0a]">Premium (Visionary) - $99/mo</option>
                    <option value="enterprise" className="bg-[#0a0a0a]">Enterprise - Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
                  <textarea required rows={3} value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none" placeholder="Tell us about your strategic goals..." />
                </div>
              </div>

              <button type="submit" disabled={status === "submitting"} className="w-full mt-6 bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {status === "submitting" ? "Sending..." : "Request Access"}
                {status !== "submitting" && <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
