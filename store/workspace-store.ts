"use client";

import { create } from "@/lib/zustand";
import {
  type AccountId,
  type BuyerPainId,
  type PersonaId,
  type TopTabId,
  type VerticalId,
  accountContexts,
  alerts as alertSeeds,
  buyerPains,
  goldenPath,
  personaProfiles,
  topTabs,
  verticals,
} from "@/lib/demo-data";

export type DemoLatency = "instant" | "normal" | "dramatic";

export interface NotificationEntry {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  linkLabel: string;
  targetTab: TopTabId;
  timestamp: string;
  read: boolean;
}

interface WorkspaceState {
  personaId: PersonaId;
  accountId: AccountId;
  activeTab: TopTabId;
  activeVertical: VerticalId;
  buyerPain: BuyerPainId | null;
  goldenPathStep: number;
  baselineMode: "industry" | "client";
  demoGuided: boolean;
  fastForward: boolean;
  fallbackMode: boolean;
  latency: DemoLatency;
  notifications: NotificationEntry[];
  language: "en" | "es";
  showImpactPanel: boolean;
  developerMode: boolean;
  markNotification: (id: string, read: boolean) => void;
  setPersona: (id: PersonaId) => void;
  setAccount: (id: AccountId) => void;
  setTab: (id: TopTabId) => void;
  setVertical: (id: VerticalId) => void;
  selectPain: (id: BuyerPainId) => void;
  advanceGoldenPath: (index: number) => void;
  toggleBaseline: () => void;
  toggleGuided: () => void;
  toggleFastForward: () => void;
  toggleFallback: () => void;
  cycleLatency: () => void;
  setLanguage: (lang: "en" | "es") => void;
  toggleDeveloperMode: () => void;
  resetDemo: () => void;
}

const initialNotifications: NotificationEntry[] = alertSeeds.map((alert, index) => ({
  ...alert,
  timestamp: ["5m ago", "26m ago", "1h ago"][index] ?? "Today",
  read: index > 0,
}));

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  personaId: "cfo",
  accountId: "globex",
  activeTab: "overview",
  activeVertical: "quote-to-cash",
  buyerPain: null,
  goldenPathStep: 0,
  baselineMode: "industry",
  demoGuided: true,
  fastForward: false,
  fallbackMode: false,
  latency: "normal",
  notifications: initialNotifications,
  language: "en",
  showImpactPanel: false,
  developerMode: false,
  markNotification: (id, read) =>
    set(({ notifications }) => ({
      notifications: notifications.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              read,
            }
          : entry
      ),
    })),
  setPersona: (id) => set({ personaId: id, showImpactPanel: true }),
  setAccount: (id) => set({ accountId: id, activeTab: "overview", goldenPathStep: 0, buyerPain: null }),
  setTab: (id) => set({ activeTab: id }),
  setVertical: (id) => set({ activeVertical: id }),
  selectPain: (id) => set({ buyerPain: id, showImpactPanel: true, activeTab: "overview" }),
  advanceGoldenPath: (index) =>
    set(() => ({
      goldenPathStep: Math.max(0, Math.min(goldenPath.length - 1, index)),
      showImpactPanel: true,
    })),
  toggleBaseline: () =>
    set((state) => ({ baselineMode: state.baselineMode === "industry" ? "client" : "industry" })),
  toggleGuided: () => set((state) => ({ demoGuided: !state.demoGuided })),
  toggleFastForward: () => set((state) => ({ fastForward: !state.fastForward })),
  toggleFallback: () => set((state) => ({ fallbackMode: !state.fallbackMode })),
  toggleDeveloperMode: () => set((state) => ({ developerMode: !state.developerMode })),
  cycleLatency: () => {
    const current = get().latency;
    const next = current === "instant" ? "normal" : current === "normal" ? "dramatic" : "instant";
    set({ latency: next });
  },
  setLanguage: (lang) => set({ language: lang }),
  resetDemo: () =>
    set({
      personaId: "cfo",
      accountId: "globex",
      activeTab: "overview",
      activeVertical: "quote-to-cash",
      buyerPain: null,
      goldenPathStep: 0,
      baselineMode: "industry",
      demoGuided: true,
      fastForward: false,
      fallbackMode: false,
      latency: "normal",
      notifications: initialNotifications,
      language: "en",
      showImpactPanel: false,
      developerMode: false,
    }),
}));

export const personaMap = Object.fromEntries(personaProfiles.map((persona) => [persona.id, persona]));
export const accountMap = Object.fromEntries(accountContexts.map((account) => [account.id, account] as const));
export const tabMap = Object.fromEntries(topTabs.map((tab) => [tab.id, tab] as const));
export const verticalMap = Object.fromEntries(verticals.map((vertical) => [vertical.id, vertical] as const));
export const painMap = Object.fromEntries(buyerPains.map((pain) => [pain.id, pain] as const));
export const maxGoldenStep = goldenPath.length - 1;
export const allGoldenSteps = goldenPath;
export const availableAlerts = alertSeeds;
