import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  Play, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';

export const TerminalConsole: React.FC = () => {
  const { 
    consoleLogs, 
    clearConsole, 
    runCode, 
    isRunningCode, 
    isTerminalOpen, 
    setIsTerminalOpen,
    activeFile,
    aiReviews,
    colorTheme
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';
  const [activeTab, setActiveTab] = useState<'output' | 'linter' | 'terminal'>('output');
  const [copied, setCopied] = useState(false);

  if (!isTerminalOpen) return null;

  const handleCopyLogs = () => {
    const text = consoleLogs.map((l) => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`h-52 border-t flex flex-col font-mono select-none flex-shrink-0 backdrop-blur-md transition-colors ${
      isBexer ? 'bg-[#151c27] border-[#252f3f]' : 'bg-[#070914] border-white/10'
    }`}>
      {/* Console Header Tabs */}
      <div className={`h-9 px-3 border-b flex items-center justify-between transition-colors ${
        isBexer ? 'bg-[#1a2331] border-[#252f3f]' : 'bg-[#0a0d1d] border-white/10'
      }`}>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('output')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 border ${
              activeTab === 'output'
                ? (isBexer
                    ? 'bg-[#86c33a] text-[#121922] border-[#86c33a] font-bold shadow-sm shadow-[#86c33a]/30'
                    : 'bg-indigo-600/20 text-white border-indigo-500/40 shadow-sm')
                : (isBexer
                    ? 'text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.04]'
                    : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/[0.04]')
            }`}
          >
            <TerminalIcon className={`w-3.5 h-3.5 ${
              activeTab === 'output' && isBexer ? 'text-[#121922]' : isBexer ? 'text-[#86c33a]' : 'text-indigo-400'
            }`} />
            <span>Output</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
              activeTab === 'output' && isBexer
                ? 'bg-black/20 text-[#121922] border-black/20 font-bold'
                : isBexer
                ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                : 'text-indigo-300 bg-indigo-950/60 border-indigo-500/30'
            }`}>
              {consoleLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('linter')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 border ${
              activeTab === 'linter'
                ? (isBexer
                    ? 'bg-[#86c33a] text-[#121922] border-[#86c33a] font-bold shadow-sm shadow-[#86c33a]/30'
                    : 'bg-indigo-600/20 text-white border-indigo-500/40 shadow-sm')
                : (isBexer
                    ? 'text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.04]'
                    : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/[0.04]')
            }`}
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${
              activeTab === 'linter' && isBexer ? 'text-[#121922]' : isBexer ? 'text-[#86c33a]' : 'text-cyan-400'
            }`} />
            <span>Security & Linter</span>
            <span className="text-[10px] bg-rose-950/60 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded-full">
              {aiReviews.filter((r) => !r.applied).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 border ${
              activeTab === 'terminal'
                ? (isBexer
                    ? 'bg-[#86c33a] text-[#121922] border-[#86c33a] font-bold shadow-sm shadow-[#86c33a]/30'
                    : 'bg-indigo-600/20 text-white border-indigo-500/40 shadow-sm')
                : (isBexer
                    ? 'text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.04]'
                    : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/[0.04]')
            }`}
          >
            <span className={`font-bold ${activeTab === 'terminal' && isBexer ? 'text-[#121922]' : 'text-emerald-400'}`}>$</span>
            <span>bash</span>
          </button>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={runCode}
            disabled={isRunningCode}
            title="Re-run active file"
            className="p-1.5 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            onClick={handleCopyLogs}
            title="Copy output"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={clearConsole}
            title="Clear output"
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-3.5 w-px bg-white/10 mx-1" />

          <button
            onClick={() => setIsTerminalOpen(false)}
            title="Close console"
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Body */}
      <div className={`flex-1 p-3 overflow-y-auto text-xs space-y-1.5 transition-colors ${
        isBexer ? 'bg-[#121822]' : 'bg-[#070914]'
      }`}>
        {activeTab === 'output' && (
          <>
            {consoleLogs.length === 0 ? (
              <div className="text-zinc-500 py-6 text-center italic text-xs">
                Console buffer is clear. Click "Run Code" to execute {activeFile?.name}.
              </div>
            ) : (
              consoleLogs.map((log) => {
                const colors = {
                  info: 'text-indigo-200',
                  success: 'text-emerald-300 font-medium',
                  warn: 'text-amber-300',
                  error: 'text-rose-300 font-medium',
                }[log.type];

                const icon = {
                  info: <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />,
                  success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />,
                  warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />,
                  error: <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />,
                }[log.type];

                return (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed font-mono">
                    <span className="text-[10px] text-cyan-400/70 select-none flex-shrink-0">
                      [{log.timestamp}]
                    </span>
                    {icon}
                    <span className={`flex-1 break-all ${colors}`}>{log.message}</span>
                    {log.executionDuration && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30 select-none">
                        {log.executionDuration}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'linter' && (
          <div className="space-y-2">
            <div className="text-[11px] text-indigo-300 font-mono pb-1 border-b border-white/10 flex items-center justify-between">
              <span>AST Static Security & Correctness Linter</span>
              <span className="text-cyan-400">{aiReviews.length} security checks completed</span>
            </div>
            {aiReviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-start justify-between gap-3 ${
                  rev.applied
                    ? 'bg-white/[0.02] border-white/10 text-zinc-500'
                    : 'bg-[#0f1325]/80 border-indigo-500/30 text-zinc-200 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-300">Line {rev.lineNumber}:</span>
                    <span className="font-medium text-white">{rev.title}</span>
                    {rev.applied && (
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.2 rounded-full border border-emerald-500/30 font-sans">
                        ✓ Fixed
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">{rev.description}</div>
                </div>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border flex-shrink-0 ${
                  rev.severity === 'critical'
                    ? 'text-rose-300 bg-rose-500/20 border-rose-500/30'
                    : rev.severity === 'warning'
                    ? 'text-amber-300 bg-amber-500/20 border-amber-500/30'
                    : 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30'
                }`}>
                  {rev.severity}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-zinc-300">
              <span className="text-cyan-400">devsync</span>
              <span className="text-zinc-500">@</span>
              <span className="text-indigo-400">workspace</span>
              <span className="text-zinc-500">:</span>
              <span className="text-purple-400">~</span>
              <span className="text-emerald-400">$</span> pnpm test
            </div>
            <div className="text-emerald-400 pl-4">✓ tests/auth.spec.ts (4 tests passed, 0 failed) [140ms]</div>
            <div className="text-emerald-400 pl-4">✓ tests/pipeline.spec.ts (8 tests passed, 0 failed) [210ms]</div>
            <div className="text-zinc-300 pt-1">
              <span className="text-cyan-400">devsync</span>
              <span className="text-zinc-500">@</span>
              <span className="text-indigo-400">workspace</span>
              <span className="text-zinc-500">:</span>
              <span className="text-purple-400">~</span>
              <span className="text-emerald-400">$</span> node --version
            </div>
            <div className="text-cyan-300 pl-4">v22.11.0 (v8 12.9.202)</div>
            <div className="flex items-center gap-1.5 text-zinc-300 pt-1">
              <span className="text-cyan-400">devsync</span>
              <span className="text-zinc-500">@</span>
              <span className="text-indigo-400">workspace</span>
              <span className="text-zinc-500">:</span>
              <span className="text-purple-400">~</span>
              <span className="text-emerald-400">$</span>
              <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block shadow-sm shadow-cyan-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
