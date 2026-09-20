import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(val: number): string {
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, "")} Cr`;
  }
  if (val >= 100000) {
    const lk = (val / 100000).toFixed(2);
    return `₹${lk.replace(/\.00$/, "")} Lakh`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
}
