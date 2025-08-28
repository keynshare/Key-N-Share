"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type NotificationType = "info" | "success" | "warning" | "error" | "feedback";

export type Notification = {
  id: string;
  title?: string;
  message: string;
  type: NotificationType;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type NotificationContextType = {
  notifications: Notification[];
  remove: (id: string) => void;
  notify: (input: Omit<Notification, "id"> & { id?: string }) => string;
  reportError: (message: string, title?: string) => string;
  sendFeedback: (message: string, title?: string) => string;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const counterRef = useRef<number>(0);

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((input: Omit<Notification, "id"> & { id?: string }) => {
    const id = input.id ?? `${Date.now()}-${counterRef.current++}`;
    const durationMs = input.durationMs ?? (input.type === "error" ? 6000 : 3500);
    const notification: Notification = {
      id,
      title: input.title,
      message: input.message,
      type: input.type,
      durationMs,
      actionLabel: input.actionLabel,
      onAction: input.onAction,
    };
    setNotifications(prev => [...prev, notification]);

    if (durationMs > 0) {
      window.setTimeout(() => remove(id), durationMs);
    }

    return id;
  }, [remove]);

  const reportError = useCallback((message: string, title?: string) => {
    return notify({ message, title: title ?? "Something went wrong", type: "error", durationMs: 6000 });
  }, [notify]);

  const sendFeedback = useCallback((message: string, title?: string) => {
    return notify({ message, title: title ?? "Feedback", type: "feedback" });
  }, [notify]);

  const value = useMemo(() => ({ notifications, remove, notify, reportError, sendFeedback }), [notifications, remove, notify, reportError, sendFeedback]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}


