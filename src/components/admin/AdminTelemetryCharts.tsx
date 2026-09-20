"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Activity, Compass, Clock } from "lucide-react";

interface DailyTraffic {
  date: string;
  views: number;
  visitors: number;
}

interface SectionDwell {
  section: string;
  seconds: number;
}

interface SourceShare {
  name: string;
  value: number;
  color: string;
}

interface Props {
  trafficData?: DailyTraffic[];
  sectionData?: SectionDwell[];
  sourceData?: SourceShare[];
  timeRange?: "7D" | "30D" | "6M" | "1Y";
  onTimeRangeChange?: (range: "7D" | "30D" | "6M" | "1Y") => void;
}

export default function AdminTelemetryCharts({
  trafficData = [],
  sectionData = [],
  sourceData = [],
  timeRange = "7D",
  onTimeRangeChange
}: Props) {
  const hasTraffic = trafficData.length > 0 && trafficData.some((d) => d.views > 0 || d.visitors > 0);
  const hasSources = sourceData.length > 0 && sourceData.some((s) => s.value > 0);
  const hasSections = sectionData.length > 0 && sectionData.some((s) => s.seconds > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Traffic Velocity Area Chart */}
      <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0077ff]" />
              Visitor &amp; Page View Velocity
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real first-party telemetry recorded at edge</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 self-start sm:self-auto">
            {(["7D", "30D", "6M", "1Y"] as const).map((r) => (
              <button
                key={r}
                onClick={() => onTimeRangeChange?.(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timeRange === r
                    ? "bg-[#0077ff] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {hasTraffic ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0077ff" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a3ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00a3ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#0077ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#trafficGradient)"
                  name="Page Views"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#00a3ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visitorGradient)"
                  name="Unique Visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center">
            <Activity className="w-8 h-8 text-slate-400 mb-2.5" />
            <p className="text-xs font-bold text-slate-800">No Visitor Velocity Recorded Yet</p>
            <p className="text-[11px] text-slate-500 max-w-sm mt-1">
              Live telemetry is active. As prospective buyers and brokers visit the site, daily views and visitor counts will appear here.
            </p>
          </div>
        )}
      </div>

      {/* 2. Inbound Channel Mix Pie Chart */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#0077ff]" />
            Inbound Channel Mix
          </h3>
          <p className="text-xs text-slate-500 mb-4">Traffic attribution breakdown</p>

          {hasSources ? (
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 w-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
              <Compass className="w-7 h-7 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-800">No Attribution Recorded Yet</span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Direct, Organic Search, WhatsApp referrals, and Meta campaigns will appear upon inbound visits.
              </p>
            </div>
          )}
        </div>

        {hasSources ? (
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            {sourceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">{item.value}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            UTM parameter ingestion active
          </div>
        )}
      </div>

      {/* 3. Section Dwell Times Bar Chart */}
      <div className="lg:col-span-12 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0077ff]" />
              Homepage Section Dwell Time (Avg Seconds)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              IntersectionObserver telemetry indicating highest-engagement components (&ge; 2s threshold)
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            Dwell Telemetry Active
          </span>
        </div>

        {hasSections ? (
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="section" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)"
                  }}
                />
                <Bar dataKey="seconds" fill="#0077ff" radius={[6, 6, 0, 0]} name="Avg Seconds" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-52 w-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center">
            <Clock className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-800">No Section Dwell Time Recorded Yet</p>
            <p className="text-[11px] text-slate-500 max-w-md mt-1">
              Scroll depth and section-level dwell durations are tracked via IntersectionObserver to pinpoint where prospective buyers spend their attention.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
