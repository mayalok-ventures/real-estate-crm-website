"use client";

import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function FloatingWhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="WhatsApp Sales Assistance" className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 font-heading">
                Sahyak Real Estate Desk
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need a walkthrough for your brokerage or sales team? Chat directly with our product team on WhatsApp.
          </p>
          <a
            href={siteConfig.whatsappSalesUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-whatsapp="true"
            data-analytics-location="floating_whatsapp_modal"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer touch-target-44"
        aria-label="Chat with Sahyak on WhatsApp"
        aria-expanded={isOpen}
      >
        <MessageSquare className="w-5 h-5 fill-white shrink-0" />
        <span className="hidden sm:inline text-xs font-bold font-sans tracking-wide">
          WhatsApp Sales
        </span>
      </button>
    </aside>
  );
}
