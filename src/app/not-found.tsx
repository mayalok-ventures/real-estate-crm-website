import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0077ff] border border-blue-200 flex items-center justify-center mb-6">
        <Building2 className="w-6 h-6" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0077ff] mb-2">
        404 — PAGE NOT FOUND
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading mb-4">
        This property listing or page cannot be found.
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8 leading-relaxed">
        The link you followed may be outdated or the page has moved. Return to the Sahyak homepage to continue.
      </p>
      <Link
        href="/"
        className="btn-pill-brand text-white text-xs py-3 px-6 font-semibold flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Homepage</span>
      </Link>
    </div>
  );
}
