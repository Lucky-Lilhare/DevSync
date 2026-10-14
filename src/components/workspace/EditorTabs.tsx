import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileCode, FileText, Plus, X } from 'lucide-react';
import type { CodeFile } from '../../types';

export const EditorTabs: React.FC = () => {
  const { files, activeFileId, setActiveFileId, closeFile, addNewFile, colorTheme } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';

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
    if (file.name.endsWith('.py')) {
      return <FileCode className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
    }
    if (file.name.endsWith('.css')) {
      return <FileText className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />;
    }
    return <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
  };

  const handleQuickAdd = () => {
    const defaultName = `scratch-${Date.now().toString().slice(-4)}.js`;
    addNewFile(defaultName, 'javascript');
  };

  return (
    <div className={`h-9 border-b flex items-center justify-between select-none overflow-x-auto flex-shrink-0 transition-colors ${
      isBexer ? 'bg-[#151c27] border-[#252f3f]' : 'bg-[#0a0c18] border-white/10'
    }`}>
      <div className="flex items-center h-full">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`group flex items-center gap-2 h-full px-3.5 text-xs font-mono cursor-pointer transition-colors relative ${
                isBexer ? 'border-r border-[#252f3f]' : 'border-r border-white/10'
              } ${
                isActive
                  ? (isBexer
                      ? 'bg-[#1e2634] text-white font-medium border-t-2 border-t-[#86c33a] shadow-sm'
                      : 'bg-gradient-to-b from-indigo-950/40 to-[#0e1224] text-white font-medium border-t-2 border-t-indigo-400 shadow-sm')
                  : (isBexer
                      ? 'bg-[#151c27] text-zinc-400 hover:text-white hover:bg-[#1b2330]'
                      : 'bg-[#080a14] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]')
              }`}
            >
              {getFileIcon(file)}
              <span className="truncate max-w-[130px]">{file.name}</span>

              {file.isDirty ? (
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse group-hover:hidden ${
                  isBexer ? 'bg-[#86c33a]' : 'bg-amber-400'
                }`} />
              ) : null}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                title="Close Tab"
                className={`p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-rose-300 transition-colors ${
                  file.isDirty ? 'hidden group-hover:block' : ''
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        <button
          onClick={handleQuickAdd}
          title="New Scratch File"
          className={`h-full px-3 transition-colors flex items-center justify-center ${
            isBexer
              ? 'text-zinc-400 hover:text-[#86c33a] hover:bg-[#1b2330] border-r border-[#252f3f]'
              : 'text-zinc-400 hover:text-indigo-300 hover:bg-white/[0.04] border-r border-white/10'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
