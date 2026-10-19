import React from "react";
import { useStore } from "../context/StoreContext";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#18181B] text-[#FAF9F5] border border-[#3F3F46] p-3.5 rounded-sm shadow-xl flex items-start gap-3 animate-fadeIn text-xs"
        >
          {toast.type === "success" && (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info size={16} className="text-[#D4C7B5] shrink-0 mt-0.5" />
          )}
          {toast.type === "error" && (
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 space-y-0.5">
            <p className="font-semibold text-white tracking-wide">{toast.title}</p>
            {toast.description && (
              <p className="text-[#A1A1AA] leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-[#71717A] hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
