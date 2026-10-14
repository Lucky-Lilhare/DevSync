import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import type { CodeFile, SupportedLanguage } from '../../types';
import { 
  FileCode, 
  FileText, 
  FilePlus, 
  ChevronDown, 
  ChevronRight, 
  GitBranch, 
  Folder, 
  FolderOpen,
  Check,
  X,
  Settings,
  Type,
  Code2
} from 'lucide-react';

export const FileExplorer: React.FC = () => {
  const { 
    files, 
    activeFileId, 
    setActiveFileId, 
    addNewFile, 
    isFileExplorerOpen,
    activeSession,
    activeFile,
    changeLanguage,
    fontSize,
    setFontSize,
    colorTheme
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';
  const [isFilesSectionOpen, setIsFilesSectionOpen] = useState(true);
  const [isSettingsSectionOpen, setIsSettingsSectionOpen] = useState(true);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  if (!isFileExplorerOpen) return null;

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let lang: SupportedLanguage = 'javascript';
    if (newFileName.endsWith('.ts')) lang = 'typescript';
    else if (newFileName.endsWith('.py')) lang = 'python';
    else if (newFileName.endsWith('.cpp') || newFileName.endsWith('.cc')) lang = 'cpp';
    else if (newFileName.endsWith('.rs')) lang = 'rust';
    else if (newFileName.endsWith('.go')) lang = 'go';
    else if (newFileName.endsWith('.json')) lang = 'json';
    else if (newFileName.endsWith('.css') || newFileName.endsWith('.html')) lang = 'html';

    addNewFile(newFileName.trim(), lang);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const getFileIcon = (file: CodeFile) => {
    if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      return <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />;
    }
    if (file.name.endsWith('.jsx')) {
      return <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
    }
    if (file.name.endsWith('.js')) {
      return <FileCode className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
    }
    if (file.name.endsWith('.css')) {
      return <FileText className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />;
    }
    if (file.name.endsWith('.py')) {
      return <FileCode className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
    }
    return <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
  };

  return (
    <aside className={`w-56 border-r flex flex-col h-full select-none flex-shrink-0 backdrop-blur-md transition-colors ${
      isBexer ? 'bg-[#151c27] border-[#252f3f]' : 'bg-[#080a15] border-white/10'
    }`}>
      {/* Explorer Header */}
      <div className={`h-9 px-3 border-b flex items-center justify-between text-xs font-semibold ${
        isBexer ? 'border-[#252f3f]' : 'border-white/10'
      }`}>
        <span className={`tracking-wider uppercase text-[10px] font-mono ${
          isBexer ? 'text-[#86c33a]' : 'text-indigo-300'
        }`}>Workspace Files</span>
        <button
          onClick={() => setIsCreatingFile(true)}
          title="Create New File"
          className="p-1 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
        >
          <FilePlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Directory Section Header */}
      <div className="flex-1 overflow-y-auto py-2 space-y-3">
        <div>
          <div
            onClick={() => setIsFilesSectionOpen(!isFilesSectionOpen)}
            className="px-2.5 py-1 flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer uppercase tracking-wider"
          >
            {isFilesSectionOpen ? (
              <ChevronDown className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            ) : (
              <ChevronRight className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            )}
            {isFilesSectionOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-400/90 ml-0.5" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-400/80 ml-0.5" />
            )}
            <span className="truncate ml-1 font-mono text-zinc-200">{activeSession?.name || 'Workspace'}</span>
          </div>

          {/* File items list */}
          {isFilesSectionOpen && (
            <div className="mt-1 space-y-0.5">
              {files.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    className={`group flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer border-l-2 transition-all ${
                      isActive
                        ? (isBexer
                            ? 'bg-[#86c33a]/15 text-white border-l-[#86c33a] font-semibold shadow-sm'
                            : 'bg-indigo-500/15 text-white border-indigo-400 font-semibold shadow-sm')
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(file)}
                      <span className="truncate font-mono">{file.name}</span>
                    </div>

                    {file.isDirty && (
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        isBexer ? 'bg-[#86c33a]' : 'bg-amber-400'
                      }`} title="Unsaved changes" />
                    )}
                  </div>
                );
              })}

              {/* Inline New File Form */}
              {isCreatingFile && (
                <form onSubmit={handleCreateFile} className="px-2 py-1">
                  <div className={`flex items-center gap-1 border rounded-lg px-2 py-1 shadow-md ${
                    isBexer ? 'bg-[#1b2331] border-[#86c33a]/50' : 'bg-[#101426] border-indigo-500/40'
                  }`}>
                    <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                    <input
                      type="text"
                      autoFocus
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="filename.js"
                      className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                    />
                    <button type="submit" className={isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}>
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingFile(false);
                        setNewFileName('');
                      }}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Language & Settings Section */}
        <div className={`px-3 pt-2 border-t ${isBexer ? 'border-[#252f3f]' : 'border-white/10'}`}>
          <div
            onClick={() => setIsSettingsSectionOpen(!isSettingsSectionOpen)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer uppercase tracking-wider mb-2"
          >
            {isSettingsSectionOpen ? (
              <ChevronDown className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            ) : (
              <ChevronRight className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            )}
            <Settings className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            <span>Preferences</span>
          </div>

          {isSettingsSectionOpen && (
            <div className="space-y-3 pl-1 pr-1">
              {/* Language Selector */}
              <div>
                <label className={`block text-[10px] uppercase font-semibold tracking-wider mb-1 flex items-center gap-1 ${
                  isBexer ? 'text-[#86c33a]' : 'text-indigo-300/80'
                }`}>
                  <Code2 className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                  Language
                </label>
                <select
                  value={activeFile?.language || 'javascript'}
                  onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
                  className={`w-full px-2 py-1 text-xs rounded-lg border font-mono cursor-pointer ${
                    isBexer
                      ? 'bg-[#1b2331] border-[#252f3f] text-zinc-200 focus:outline-none focus:border-[#86c33a]'
                      : 'bg-white/[0.04] border-white/10 text-zinc-200 focus:outline-none focus:border-indigo-400/60'
                  }`}
                >
                  <option value="javascript" className="bg-[#1b2331] text-zinc-200">JavaScript</option>
                  <option value="typescript" className="bg-[#1b2331] text-zinc-200">TypeScript</option>
                  <option value="python" className="bg-[#1b2331] text-zinc-200">Python</option>
                  <option value="cpp" className="bg-[#1b2331] text-zinc-200">C++</option>
                  <option value="rust" className="bg-[#1b2331] text-zinc-200">Rust</option>
                  <option value="go" className="bg-[#1b2331] text-zinc-200">Go</option>
                </select>
              </div>

              {/* Font Size Selector */}
              <div>
                <label className={`block text-[10px] uppercase font-semibold tracking-wider mb-1 flex items-center gap-1 ${
                  isBexer ? 'text-[#86c33a]' : 'text-indigo-300/80'
                }`}>
                  <Type className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                  Font Size
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[12, 14, 16, 18].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFontSize(size)}
                      className={`py-1 text-xs font-mono rounded-lg border transition-colors ${
                        fontSize === size
                          ? (isBexer
                              ? 'bg-[#86c33a] border-[#86c33a] text-[#121922] font-bold shadow-sm shadow-[#86c33a]/30'
                              : 'bg-indigo-600/30 border-indigo-500/60 text-white font-semibold')
                          : (isBexer
                              ? 'bg-[#1b2331] border-[#252f3f] text-zinc-400 hover:text-white'
                              : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20')
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Git Branch & Status footer */}
      <div className={`h-8 border-t px-3 flex items-center justify-between text-[11px] font-mono ${
        isBexer ? 'bg-[#10151f] border-[#252f3f]' : 'bg-[#060812] border-white/10'
      }`}>
        <div className="flex items-center gap-1.5 truncate">
          <GitBranch className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
          <span className="truncate text-zinc-300">main</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
          isBexer
            ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        }`}>clean</span>
      </div>
    </aside>
  );
};

