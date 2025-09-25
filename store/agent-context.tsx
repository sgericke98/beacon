"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { AgentDefinition, AgentVertical, RunHistoryEntry } from "@/lib/types";
import { agentCatalog } from "@/lib/agents";

interface AgentContextValue {
  selectedVertical: AgentVertical;
  selectVertical: (vertical: AgentVertical) => void;
  selectedAgentId: string | null;
  selectAgent: (agentId: string | null) => void;
  runHistory: RunHistoryEntry[];
  registerRun: (entry: RunHistoryEntry) => void;
  getAgentById: (id: string) => AgentDefinition | undefined;
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [selectedVertical, setSelectedVertical] = useState<AgentVertical>("quote-to-cash");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>("revenue-leakage");
  const [runHistory, setRunHistory] = useState<RunHistoryEntry[]>([]);

  const selectVertical = useCallback((vertical: AgentVertical) => {
    setSelectedVertical(vertical);
    const verticalAgents = agentCatalog.filter((agent) => agent.vertical === vertical && agent.status === "core");
    if (verticalAgents.length > 0) {
      setSelectedAgentId((current) => (current && verticalAgents.some((agent) => agent.id === current) ? current : verticalAgents[0].id));
    }
  }, []);

  const selectAgent = useCallback((agentId: string | null) => {
    if (!agentId) {
      setSelectedAgentId(null);
      return;
    }
    const agent = agentCatalog.find((item) => item.id === agentId);
    if (agent) {
      setSelectedVertical(agent.vertical);
      setSelectedAgentId(agentId);
    }
  }, []);

  const registerRun = useCallback((entry: RunHistoryEntry) => {
    setRunHistory((history) => [entry, ...history].slice(0, 20));
  }, []);

  const getAgentById = useCallback((id: string) => agentCatalog.find((agent) => agent.id === id), []);

  const value = useMemo<AgentContextValue>(
    () => ({ selectedVertical, selectVertical, selectedAgentId, selectAgent, runHistory, registerRun, getAgentById }),
    [selectedVertical, selectVertical, selectedAgentId, selectAgent, runHistory, registerRun, getAgentById]
  );

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgentContext() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgentContext must be used within an AgentProvider");
  }
  return context;
}
