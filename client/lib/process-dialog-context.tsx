"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ProcessStepStatus = "pending" | "active" | "done" | "error";

export interface ProcessStep {
  label: string;
  status: ProcessStepStatus;
}

interface ProcessDialogState {
  isOpen: boolean;
  title?: string;
  steps: ProcessStep[];
}

interface ProcessDialogContextType {
  state: ProcessDialogState;
  open: (opts: { title?: string; steps: string[] }) => void;
  updateStep: (index: number, updates: Partial<ProcessStep>) => void;
  setActiveStep: (index: number) => void;
  close: () => void;
}

const ProcessDialogContext = createContext<ProcessDialogContextType | undefined>(undefined);

export function ProcessDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProcessDialogState>({ isOpen: false, steps: [] });

  const open = useCallback((opts: { title?: string; steps: string[] }) => {
    const steps: ProcessStep[] = opts.steps.map((label, idx) => ({ label, status: idx === 0 ? "active" : "pending" }));
    setState({ isOpen: true, title: opts.title, steps });
  }, []);

  const updateStep = useCallback((index: number, updates: Partial<ProcessStep>) => {
    setState(prev => {
      const next = [...prev.steps];
      if (next[index]) next[index] = { ...next[index], ...updates };
      return { ...prev, steps: next };
    });
  }, []);

  const setActiveStep = useCallback((index: number) => {
    setState(prev => {
      const next = prev.steps.map((s, i) => ({ ...s, status: i < index ? s.status : i === index ? "active" : s.status === "done" ? "done" : "pending" }));
      // Ensure all previous steps marked done remain done
      for (let i = 0; i < index; i++) if (next[i] && next[i].status !== "error") next[i].status = "done";
      if (next[index] && next[index].status !== "error") next[index].status = "active";
      return { ...prev, steps: next };
    });
  }, []);

  const close = useCallback(() => {
    setTimeout(() => {
      setState({ isOpen: false, steps: [] });
    }, 2000); // 1000 ms = 1 second
  }, [setState]);

  const value = useMemo(() => ({ state, open, updateStep, setActiveStep, close }), [state, open, updateStep, setActiveStep, close]);

  return (
    <ProcessDialogContext.Provider value={value}>
      {children}
    </ProcessDialogContext.Provider>
  );
}

export function useProcessDialog() {
  const ctx = useContext(ProcessDialogContext);
  if (!ctx) throw new Error("useProcessDialog must be used within ProcessDialogProvider");
  return ctx;
}


