import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Wifi, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MonacoCodeEditor: React.FC = () => {
  const { 
    activeFile, 
    updateFileContent, 
    editorTheme, 
    collaborators,
    aiReviews,
    fontSize,
    colorTheme,
    handleCursorChange,
    isSocketConnected
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor movements in real time for peers
    editor.onDidChangeCursorPosition((e) => {
      handleCursorChange(e.position.lineNumber, e.position.column);
    });

    // Aesthetic Developer Obsidian theme
    monaco.editor.defineTheme('devsync-aesthetic', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f43f5e', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: '38bdf8' },
        { token: 'function', foreground: '818cf8' },
        { token: 'type', foreground: 'fbbf24' },
        { token: 'variable', foreground: 'e2e8f0' },
      ],
      colors: {
        'editor.background': '#080a15',
        'editor.foreground': '#f1f5f9',
        'editorCursor.foreground': '#6366f1',
        'editor.lineHighlightBackground': '#18203d40',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#818cf8',
        'editor.selectionBackground': '#6366f130',
        'editor.inactiveSelectionBackground': '#6366f115',
      }
    });

    // Bexer Clean Slate & Lime Theme
    monaco.editor.defineTheme('devsync-bexer', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '86c33a', fontStyle: 'bold' },
        { token: 'string', foreground: 'a3ec4c' },
        { token: 'number', foreground: '38bdf8' },
        { token: 'function', foreground: '93c5fd' },
        { token: 'type', foreground: 'fcd34d' },
        { token: 'variable', foreground: 'f8fafc' },
      ],
      colors: {
        'editor.background': '#151b26',
        'editor.foreground': '#f1f5f9',
        'editorCursor.foreground': '#86c33a',
        'editor.lineHighlightBackground': '#1e263480',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#86c33a',
        'editor.selectionBackground': '#86c33a30',
        'editor.inactiveSelectionBackground': '#86c33a15',
      }
    });

    const activeMonacoTheme = editorTheme === 'light' ? 'light' : isBexer ? 'devsync-bexer' : 'devsync-aesthetic';
    monaco.editor.setTheme(activeMonacoTheme);
  };

  const activeCollaboratorsInThisFile = collaborators.filter(
    (c) => c.id !== 'user-self' && c.currentFile === activeFile?.name
  );

  const unappliedIssuesCount = aiReviews.filter((r) => !r.applied).length;
  const currentEditorTheme = editorTheme === 'light' ? 'light' : isBexer ? 'devsync-bexer' : 'devsync-aesthetic';

  return (
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden transition-colors ${
      isBexer ? 'bg-[#151c26]' : 'bg-[#080a15]'
    }`}>
      {/* Collaborative file banner if other peers are present in this file */}
      {activeCollaboratorsInThisFile.length > 0 && (
        <div className={`px-3.5 py-1.5 border-b flex items-center justify-between text-xs text-zinc-300 select-none z-10 backdrop-blur-md transition-colors ${
          isBexer ? 'bg-[#1a2331] border-[#252f3f]' : 'bg-[#0e1224] border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full animate-pulse ${
              isBexer ? 'bg-[#86c33a]' : 'bg-emerald-400'
            }`} />
            <span>
              <strong className="text-white font-semibold">
                {activeCollaboratorsInThisFile.map((c) => c.name).join(', ')}
              </strong>{' '}
              {activeCollaboratorsInThisFile.length === 1 ? 'is' : 'are'} co-editing this file.
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {activeCollaboratorsInThisFile.map((c) => (
              <span
                key={c.id}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] border flex items-center gap-1 shadow-sm"
                style={{ borderColor: `${c.color}60`, color: c.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name.split(' ')[0]}</span>
                <span className="text-zinc-400 font-bold">L{c.cursorLine}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={activeFile?.language || 'javascript'}
          value={activeFile?.content || ''}
          theme={currentEditorTheme}
          onChange={(value) => {
            if (activeFile && value !== undefined) {
              updateFileContent(activeFile.id, value);
            }
          }}
          onMount={handleEditorDidMount}
          options={{
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            fontSize: fontSize,
            lineHeight: Math.round(fontSize * 1.6),
            minimap: { enabled: true, maxColumn: 80, renderCharacters: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            lineNumbersMinChars: 3,
            formatOnPaste: true,
          }}
        />

        {/* Floating AI Diagnostic Pill in corner of Editor */}
        {unappliedIssuesCount > 0 && (
          <div className={`absolute bottom-3 right-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xl text-xs pointer-events-auto backdrop-blur-md ${
            isBexer
              ? 'bg-[#1b2331]/95 border-[#86c33a]/40 text-slate-100 shadow-[#86c33a]/10'
              : 'bg-[#0f1325]/95 border-amber-500/40 text-amber-200 shadow-amber-500/10'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-amber-400'}`} />
            <span className="font-semibold text-white">{unappliedIssuesCount} Issue{unappliedIssuesCount > 1 ? 's' : ''} Detected</span>
            <span className="text-[11px] text-zinc-400">• Review in sidebar</span>
          </div>
        )}
      </div>

      {/* Monaco Bottom Status Bar */}
      <footer className={`h-6 border-t px-3 flex items-center justify-between text-[11px] font-mono select-none flex-shrink-0 transition-colors ${
        isBexer ? 'bg-[#10151f] border-[#252f3f] text-zinc-400' : 'bg-[#060812] border-white/10 text-zinc-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 ${isSocketConnected ? (isBexer ? 'text-[#86c33a]' : 'text-emerald-400') : 'text-amber-400'}`}>
            <Wifi className="w-3 h-3" />
            <span>{isSocketConnected ? 'Socket.io Live' : 'Local Sandbox'}</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span>Ln 14, Col 8</span>
          <span className="text-zinc-700">|</span>
          <span>Spaces: 2</span>
          <span className="text-zinc-700">|</span>
          <span>UTF-8</span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-bold uppercase ${isBexer ? 'text-[#86c33a]' : 'text-indigo-300'}`}>
            {activeFile?.language || 'JS'}
          </span>
          <span className="text-zinc-700">|</span>
          <span className={`flex items-center gap-1 ${isBexer ? 'text-[#a3ec4c]' : 'text-cyan-400'}`}>
            <ShieldCheck className="w-3 h-3" />
            <span>AI Guardian: Ready</span>
          </span>
        </div>
      </footer>
    </div>
  );
};
