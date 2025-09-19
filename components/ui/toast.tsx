"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
  push: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    setToasts((current) => [...current, { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const value = useMemo(() => ({ toasts, dismiss, push }), [toasts, dismiss, push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-md border border-border bg-background p-4 shadow-lg">
          <div className="font-semibold">{toast.title}</div>
          {toast.description ? <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p> : null}
          <button
            type="button"
            className="mt-3 inline-flex text-sm text-foreground underline"
            onClick={() => dismiss(toast.id)}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
