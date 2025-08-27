"use client";

import React from "react";
import { useNotifications } from "@/lib/notification-context";
import { X } from "lucide-react";

export default function NotificationCenter() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999999999999999999999999999999] flex flex-col items-end gap-2 p-4 sm:p-6">
      <div className="ml-auto w-full max-w-sm space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={
              "pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur transition-all " +
              (n.type === "success"
                ? "border-emerald-200/40 bg-emerald-50/80 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-900/40 dark:text-emerald-50"
                : n.type === "error"
                ? "border-rose-200/40 bg-rose-50/80 text-rose-900 dark:border-rose-500/20 dark:bg-rose-900/40 dark:text-rose-50"
                : n.type === "warning"
                ? "border-amber-200/40 bg-amber-50/80 text-amber-900 dark:border-amber-500/20 dark:bg-amber-900/40 dark:text-amber-50"
                : n.type === "feedback"
                ? "border-indigo-200/40 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500/20 dark:bg-indigo-900/40 dark:text-indigo-50"
                : "border-slate-200/40 bg-white/80 text-slate-900 dark:border-slate-500/20 dark:bg-slate-900/40 dark:text-slate-50")
            }
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {n.title ? <div className="text-sm font-semibold">{n.title}</div> : null}
                <div className="text-sm opacity-90">{n.message}</div>
                {n.actionLabel && n.onAction ? (
                  <button
                    className="mt-2 inline-flex items-center rounded-md border border-current/20 px-2.5 py-1 text-xs font-medium opacity-90 transition hover:opacity-100"
                    onClick={() => n.onAction && n.onAction()}
                  >
                    {n.actionLabel}
                  </button>
                ) : null}
              </div>
              <button
                aria-label="Dismiss notification"
                className="rounded-md p-1 opacity-70 transition hover:opacity-100"
                onClick={() => remove(n.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


