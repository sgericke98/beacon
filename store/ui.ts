"use client";

import { create } from "zustand";
import type { ConnectorId, NewsletterConfig } from "@/types";

type ConnectorSelection = {
  objects: string[];
  fields: Record<string, string[]>;
  status: "not_configured" | "configured" | "syncing";
};

type DedupDecision = "merge" | "ignore" | null;

type UIState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  selectedDataset: string;
  setSelectedDataset: (dataset: string) => void;
  connectorSelections: Record<ConnectorId, ConnectorSelection>;
  updateConnector: (id: ConnectorId, updates: Partial<ConnectorSelection>) => void;
  dedupDecisions: Record<string, DedupDecision>;
  setDedupDecision: (id: string, decision: DedupDecision) => void;
  resetDedup: () => void;
  newsletterDraft?: NewsletterConfig;
  setNewsletterDraft: (config: NewsletterConfig) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  selectedDataset: "opportunities",
  setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
  connectorSelections: {
    salesforce: { objects: [], fields: {}, status: "not_configured" },
    netsuite: { objects: [], fields: {}, status: "not_configured" },
  },
  updateConnector: (id, updates) =>
    set((state) => ({
      connectorSelections: {
        ...state.connectorSelections,
        [id]: {
          ...state.connectorSelections[id],
          ...updates,
        },
      },
    })),
  dedupDecisions: {},
  setDedupDecision: (id, decision) =>
    set((state) => ({
      dedupDecisions: {
        ...state.dedupDecisions,
        [id]: decision,
      },
    })),
  resetDedup: () => set({ dedupDecisions: {} }),
  newsletterDraft: undefined,
  setNewsletterDraft: (config) => set({ newsletterDraft: config }),
}));
