"use client";

import { createContext, useContext } from "react";

interface ChartContextValue {
  data: Record<string, number | string>[];
  xKey?: string;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export interface ResponsiveContainerProps {
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
}

export function ResponsiveContainer({ width = "100%", height = 260, children }: ResponsiveContainerProps) {
  return (
    <div style={{ width, height }} className="relative">
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-xl bg-foreground/5 p-4">
        {children}
      </div>
    </div>
  );
}

interface BarChartProps {
  data: Record<string, number | string>[];
  children: React.ReactNode;
}

export function BarChart({ data, children }: BarChartProps) {
  return <ChartContext.Provider value={{ data }}>{children}</ChartContext.Provider>;
}

function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error("BarChart components must be used inside <BarChart>");
  }
  return ctx;
}

interface BarProps {
  dataKey: string;
  fill?: string;
  radius?: number | [number, number, number, number];
}

export function Bar({ dataKey, fill = "#6366f1" }: BarProps) {
  const { data } = useChart();
  const max = Math.max(...data.map((item) => Number(item[dataKey] ?? 0)));
  return (
    <div className="flex w-full items-end gap-4">
      {data.map((item, index) => {
        const value = Number(item[dataKey] ?? 0);
        const height = max === 0 ? 0 : Math.max(4, (value / max) * 100);
        return (
          <div key={index} className="flex flex-1 flex-col items-center gap-2 text-xs">
            <div className="flex h-40 w-full items-end justify-center rounded-full bg-foreground/10">
              <div
                className="w-4 rounded-full"
                style={{
                  height: `${height}%`,
                  background: fill,
                  boxShadow: "0 8px 20px rgba(99, 102, 241, 0.35)",
                }}
              />
            </div>
            <span className="font-medium text-foreground/80">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

interface XAxisProps {
  dataKey: string;
}

export function XAxis({ dataKey }: XAxisProps) {
  const { data } = useChart();
  return (
    <div className="mt-4 flex w-full justify-between text-[10px] uppercase tracking-wide text-foreground/60">
      {data.map((item, index) => (
        <span key={index} className="flex-1 text-center">
          {String(item[dataKey] ?? "")}
        </span>
      ))}
    </div>
  );
}

export function YAxis() {
  return null;
}

export function CartesianGrid() {
  return null;
}

export function Tooltip() {
  return null;
}
