"use client"
import React, { useEffect, useState } from "react";
import { useNotifications } from "@/lib/notification-context";
import { X } from "lucide-react";

export default function NotificationCenter() {
  const { notifications, remove } = useNotifications();

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999999999999999999999999999999999999999999999999] flex flex-col items-end gap-2 p-4 sm:p-6">
      <div className="ml-auto w-full max-w-sm space-y-2">
        {notifications.map((n) => (
          <SlideIn key={n.id} n={n} remove={remove} />
        ))}
      </div>
    </div>
  );
}

type Notification = {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "feedback" | "info";
  actionLabel?: string;
  onAction?: () => void;
};


interface SlideInProps {
  n: Notification;
  remove: (id: string) => void;
}

function SlideIn({ n, remove }: SlideInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={
        "pointer-events-auto relative z-[9999999999999999999999999999999999999999999999999999] overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur transition-transform duration-300 ease-out " +
        (n.type === "success"
          ? "border-emerald-200/40 dark:border-emerald-500/20 bg-emerald-900/60 text-emerald-50"
          : n.type === "error"
          ? "border-rose-200/40 dark:border-rose-500/20 bg-rose-900/40 text-rose-50"
          : n.type === "warning"
          ? "border-amber-200/40 dark:border-amber-500/20 bg-amber-900/40 text-amber-50"
          : n.type === "feedback"
          ? "border-indigo-200/40 dark:border-indigo-500/20 bg-indigo-900/60 dark:bg-indigo-900/40 text-indigo-50"
          : "border-slate-200/40 dark:border-slate-500/20 bg-slate-900/70 text-slate-50") +
        (visible ? " translate-x-0" : " translate-x-full")
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
  );
}
