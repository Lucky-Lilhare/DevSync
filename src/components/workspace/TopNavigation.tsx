import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../common/Button';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import type { SupportedLanguage, EditorTheme } from '../../types';
import { ShareRoomModal } from './modals/ShareRoomModal';
import { ShortcutsModal } from './modals/ShortcutsModal';
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Share2, 
  LogOut, 
  Keyboard, 
  Sun, 
  Moon, 
  Terminal, 
  FolderTree, 
  PanelRightOpen, 
  PanelRightClose,
  Wifi,
  Sparkles
} from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const {
    activeSession,
    activeFile,
    collaborators,
    changeLanguage,
    editorTheme,
    setEditorTheme,
    colorTheme,
    runCode,
    isRunningCode,
    runAiScan,
    isAiScanning,
    leaveSession,
    addToast,
    isTerminalOpen,
    setIsTerminalOpen,
    isFileExplorerOpen,
    setIsFileExplorerOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    isSocketConnected
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const roomIdFormatted = activeSession?.id.toUpperCase().startsWith('ROOM-')
    ? activeSession.id.toUpperCase()
    : `#${activeSession?.id.toUpperCase() || 'ROOM-8921'}`;

  const handleCopyId = () => {
    const rawId = activeSession?.id || 'ROOM-8921';
    navigator.clipboard.writeText(rawId);
    setCopiedLink(true);
    addToast('Room ID Copied', `${rawId} copied to clipboard`, 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleThemeToggle = () => {
    const nextTheme: EditorTheme = editorTheme === 'vs-dark' ? 'light' : 'vs-dark';
    setEditorTheme(nextTheme);
    addToast('Theme Switched', `Switched to ${nextTheme === 'vs-dark' ? 'Dark' : 'Light'} theme`, 'info');
  };

  return (
    <>
      <header className={`h-14 border-b px-4 flex items-center justify-between gap-3 select-none z-30 flex-shrink-0 backdrop-blur-xl transition-colors ${
        isBexer ? 'border-[#2d384b] bg-[#161d28]/95' : 'border-white/10 bg-[#080a15]/90'
      }`}>
        {/* Left Section: Clickable Logo to return to dashboard + Room Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo Click switches back to Dashboard */}
          <button
            onClick={leaveSession}
            title="DevSync - Return to Dashboard"
            className="flex items-center gap-2.5 p-1 -ml-1 rounded-xl hover:bg-white/[0.06] transition-all group"
          >
            <div className={`w-8 h-8 rounded-lg p-[1px] shadow-md ${
              isBexer 
                ? 'bg-[#86c33a] shadow-[#86c33a]/30' 
                : 'bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 shadow-indigo-500/25'
            }`}>
              <div className={`w-full h-full rounded-[7px] flex items-center justify-center text-white ${
                isBexer ? 'bg-[#1b2330]' : 'bg-[#0d1020]'
              }`}>
                <Code2 className={`w-4 h-4 stroke-[2.5] ${isBexer ? 'text-[#86c33a]' : 'text-white'}`} />
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                DevSync
              </span>
              <span className={`text-[10px] font-mono ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`}>Workspace</span>
            </div>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Project / Room Title */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate max-w-[150px] sm:max-w-[240px] lg:max-w-[340px]">
              DevSync Workspace - <span className={`font-mono ${isBexer ? 'text-[#a3ec4c]' : 'text-indigo-300'}`}>{roomIdFormatted}</span>
            </h1>

            {/* Room ID copy button with toast */}
            <button
              onClick={handleCopyId}
              title="Copy Room ID & Invite Link"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all group shadow-sm flex-shrink-0 border ${
                isBexer
                  ? 'bg-[#86c33a]/15 border-[#86c33a]/40 hover:border-[#86c33a] text-[#a3ec4c] hover:bg-[#86c33a]/25'
                  : 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400/60 text-indigo-200 hover:bg-indigo-900/40'
              }`}
            >
              <span>{roomIdFormatted}</span>
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a] group-hover:text-white' : 'text-indigo-400 group-hover:text-white'}`} />
              )}
            </button>

            {/* WebRTC & Socket.io Status */}
            <div className={`hidden xl:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full font-mono border ${
              isSocketConnected
                ? (isBexer
                    ? 'text-[#a3ec4c] bg-[#86c33a]/10 border-[#86c33a]/30'
                    : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25')
                : 'text-amber-400 bg-amber-500/10 border-amber-500/25'
            }`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSocketConnected ? (isBexer ? 'bg-[#86c33a]' : 'bg-cyan-400') : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  isSocketConnected ? (isBexer ? 'bg-[#86c33a]' : 'bg-cyan-400') : 'bg-amber-400'
                }`} />
              </span>
              <Wifi className={`w-3 h-3 ${isSocketConnected ? (isBexer ? 'text-[#86c33a]' : 'text-cyan-400') : 'text-amber-400'}`} />
              <span>{isSocketConnected ? 'Socket.io Mesh (18ms)' : 'Local Isolate'}</span>
            </div>
          </div>
        </div>

        {/* Center: Language dropdown & view toggles */}
        <div className="hidden lg:flex items-center gap-2">
          <select
            value={activeFile?.language || 'javascript'}
            onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
            className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.04] border border-white/10 text-zinc-200 font-mono focus:outline-none focus:border-[#86c33a] cursor-pointer backdrop-blur-sm"
          >
            <option value="javascript" className="bg-[#1b2330] text-zinc-200">JavaScript</option>
            <option value="typescript" className="bg-[#1b2330] text-zinc-200">TypeScript</option>
            <option value="python" className="bg-[#1b2330] text-zinc-200">Python</option>
            <option value="cpp" className="bg-[#1b2330] text-zinc-200">C++</option>
            <option value="rust" className="bg-[#1b2330] text-zinc-200">Rust</option>
            <option value="go" className="bg-[#1b2330] text-zinc-200">Go</option>
          </select>

          <button
            onClick={handleThemeToggle}
            title={`Toggle Editor Theme (Current: ${editorTheme})`}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors"
          >
            {editorTheme === 'vs-dark' ? (
              <Moon className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setIsFileExplorerOpen(!isFileExplorerOpen)}
            title="Toggle File Explorer"
            className={`p-1.5 rounded-lg transition-colors border ${
              isFileExplorerOpen 
                ? (isBexer ? 'text-[#86c33a] bg-[#86c33a]/15 border-[#86c33a]/30' : 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30')
                : 'text-zinc-400 hover:bg-white/[0.06] border-transparent'
            }`}
          >
            <FolderTree className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            title="Toggle Console / Output"
            className={`p-1.5 rounded-lg transition-colors border ${
              isTerminalOpen 
                ? (isBexer ? 'text-[#86c33a] bg-[#86c33a]/15 border-[#86c33a]/30' : 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30')
                : 'text-zinc-400 hover:bg-white/[0.06] border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        {/* Right Section: Palette Selector, Collaborators Avatar Stack & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Aesthetic Palette Switcher */}
          <ThemeSwitcher compact />

          {/* Active Collaborators list with colored ring borders */}
          <div className="flex items-center -space-x-1.5 mr-1 pl-1">
            {collaborators.map((c) => (
              <div
                key={c.id}
                title={`${c.name} (${c.role}) • Active on ${c.currentFile} (Line ${c.cursorLine})`}
                className="relative group cursor-pointer"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-7 h-7 rounded-full border-2 object-cover transition-transform group-hover:scale-110 group-hover:z-20 shadow-sm"
                  style={{ borderColor: c.color }}
                />
                <span
                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black"
                  style={{ backgroundColor: c.status === 'in-call' ? '#a855f7' : '#86c33a' }}
                />
              </div>
            ))}
          </div>

          {/* Action Button: Run Code */}
          <Button
            variant={isBexer ? 'bexer' : 'emerald'}
            size="sm"
            onClick={runCode}
            isLoading={isRunningCode}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            <span>Run Code</span>
          </Button>

          {/* Action Button: AI Security Scan */}
          <Button
            variant={isBexer ? 'lime' : 'secondary'}
            size="sm"
            onClick={runAiScan}
            isLoading={isAiScanning}
            leftIcon={<Sparkles className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />}
            className="hidden sm:inline-flex"
          >
            <span className="hidden md:inline">AI Security Scan</span>
            <span className="md:hidden">AI Scan</span>
          </Button>

          {/* Action Button: Share Workspace */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2 className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />}
          >
            <span className="hidden sm:inline">Share Workspace</span>
            <span className="sm:hidden">Share</span>
          </Button>

          {/* Action Button: Leave Session */}
          <button
            onClick={leaveSession}
            title="Leave Collaborative Session"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-medium transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Leave Session</span>
          </button>

          {/* Shortcuts Modal Trigger */}
          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            title="Keyboard Shortcuts"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors hidden xl:block border border-transparent hover:border-white/10"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Toggle Right Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/10"
          >
            {isSidebarOpen ? (
              <PanelRightClose className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-300'}`} />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Modals */}
      <ShareRoomModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      <ShortcutsModal isOpen={isShortcutsModalOpen} onClose={() => setIsShortcutsModalOpen(false)} />
    </>
  );
};
