"use client";
import React from "react";
import { useProcessDialog } from "@/lib/process-dialog-context";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function ProcessDialog() {
  const { state } = useProcessDialog();
  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999999999999999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border bg-[#f0f0f0] dark:border-gray-800 dark:bg-[#0b0b0b] p-6 shadow-2xl">
        {state.title ? <h3 className="mb-4 text-lg font-semibold ">{state.title}</h3> : null}
        <ul className="space-y-3">
          {state.steps.map((step, idx) => (
            <li key={idx} className="flex items-center gap-3">
              {step.status === "done" && <CheckCircle2 className="text-emerald-400" size={18} />}
              {step.status === "active" && <Loader2 className="animate-spin text-indigo-400" size={18} />}
              {step.status === "pending" && <div className="size-[18px] rounded-full border border-gray-700" />}
              {step.status === "error" && <XCircle className="text-rose-400" size={18} />}
              <span className={
                step.status === "done" ? "text-emerald-500" : step.status === "error" ? "text-rose-500" : step.status === "active" ? "text-indigo-600 dark:text-indigo-200" : "text-gray-700 dark:text-gray-300 "
              }>
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


