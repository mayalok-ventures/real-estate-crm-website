/**
 * SAHYAK CRM — Crawlable Breadcrumbs & BreadcrumbList Structured Data Component
 */

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "./types";
import { buildBreadcrumbSchema } from "./structured-data";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const schema = buildBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-medium text-slate-500 overflow-x-auto py-2 ${className}`}
      >
        <ol className="flex items-center space-x-1.5 whitespace-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.item || index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 flex-shrink-0" />
                )}
                {isLast ? (
                  <span
                    className="text-slate-900 font-semibold truncate max-w-[200px]"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.item}
                    className="hover:text-blue-600 transition-colors flex items-center"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
