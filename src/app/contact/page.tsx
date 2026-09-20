"use client";

import React, { useState, useTransition, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  Sparkles, 
  Clock
} from "lucide-react";
import { submitContactForm } from "@/lib/api";
import { siteConfig } from "@/lib/config";
import { trackGaEvent } from "@/lib/gtag";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: ""
  });

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formStartedRef = useRef<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackGaEvent("contact_form_start", {
        page_location: typeof window !== "undefined" ? window.location.href : "",
      });
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    if (!formData.name || !formData.phone || !formData.email) {
      setStatus("error");
      setErrorMessage("Please enter your name, phone number, and email.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await submitContactForm({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          requirement: formData.message,
          role: "Broker / Builder"
        });
        if (response.success) {
          // Send generate_lead ONLY after successful submission with zero PII
          trackGaEvent("generate_lead", {
            cta_name: "Schedule 20-Min Demo",
            page_location: typeof window !== "undefined" ? window.location.href : "",
          });
          setStatus("success");
          setFormData({
            name: "",
            phone: "",
            email: "",
            company: "",
            message: ""
          });
        } else {
          setStatus("error");
          setErrorMessage(response.error || "Failed to submit. Please message us directly on WhatsApp.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "An unexpected error occurred. Please message us on WhatsApp.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Conversation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight">
            Start a Conversation with <span className="brand-gradient-text">Sahyak.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Choose how you prefer to connect. Chat instantly on WhatsApp or schedule a focused 20-minute product demonstration.
          </p>
        </div>
      </section>

      {/* 2. Primary 2 Choices */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CHOICE 1: Direct WhatsApp Desk */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-emerald-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    FASTEST RESPONSE
                  </span>
                </div>

                {/* Luxury Property Concierge Desk Visual Anchor */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] shadow-xs group">
                  <Image
                    src="/images/contact-concierge-desk.jpg"
                    alt="Minimalist luxury residential concierge desk"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover object-center brightness-95 group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-3.5">
                    <span className="text-[10px] font-mono text-emerald-300 font-medium">
                      Dedicated Real Estate Onboarding &middot; WhatsApp Support Desk
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Chat on WhatsApp
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    Connect directly with our real estate CRM specialists. Get instant pricing guidance, walkthrough links, and setup answers.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-600 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{siteConfig.whatsappNumber}</span>
                </div>
              </div>

              <a
                href={siteConfig.whatsappSalesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Open WhatsApp Chat</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* CHOICE 2: Short 4-Field Demo Request Form */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0077ff] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-[#0077ff] block">
                    20-MINUTE SESSION
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Schedule a Demo
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    See live portal webhook ingress, floor plan delivery, and multi-tower inventory mapped to your exact sales flow.
                  </p>
                </div>

                {/* Form Notification Messages */}
                {status === "success" && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Demo request received! Our sales engineer will connect within 2 hours.</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 4 Minimal Inputs */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  <div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Full Name *"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0077ff] focus:border-transparent outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone (e.g. +91 98112...) *"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0077ff] focus:border-transparent outline-hidden"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Work Email *"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0077ff] focus:border-transparent outline-hidden"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Brokerage or Builder Name (Optional)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0077ff] focus:border-transparent outline-hidden"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What would you like to see? (e.g. WhatsApp Hub, Tower Inventory)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0077ff] focus:border-transparent outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <span>{isPending ? "Scheduling Demo..." : "Schedule 20-Min Demo"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              <div className="text-[11px] font-mono text-slate-400 text-center">
                Support desk: {siteConfig.supportEmail}
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
