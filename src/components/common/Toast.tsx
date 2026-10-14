import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconConfig = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />,
          warn: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />,
          error: <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />,
        }[toast.type];

        const cardStyles = {
          success: 'border-emerald-500/30 bg-[#091510]/95 shadow-emerald-500/10',
          warn: 'border-amber-500/30 bg-[#181308]/95 shadow-amber-500/10',
          error: 'border-rose-500/30 bg-[#190a10]/95 shadow-rose-500/10',
          info: 'border-indigo-500/35 bg-[#0e1224]/95 shadow-indigo-500/15',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border ${cardStyles} backdrop-blur-xl shadow-xl transition-all animate-in slide-in-from-right-4 duration-200`}
          >
            {iconConfig}
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-semibold text-zinc-100">{toast.title}</h5>
              {toast.message && (
                <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
