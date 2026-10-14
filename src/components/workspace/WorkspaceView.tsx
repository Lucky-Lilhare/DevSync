import React, { useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TopNavigation } from './TopNavigation';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { MonacoCodeEditor } from './MonacoCodeEditor';
import { TerminalConsole } from './TerminalConsole';
import { RightSidebar } from './sidebar/RightSidebar';

export const WorkspaceView: React.FC = () => {
  const { 
    runCode, 
    runAiScan, 
    setIsTerminalOpen, 
    setIsSidebarOpen, 
    isTerminalOpen, 
    isSidebarOpen,
    colorTheme
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';

  // Keyboard shortcut listener for developer ergonomics
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter -> Run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
      // Ctrl/Cmd + Shift + S -> Run AI scan
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        runAiScan();
      }
      // Ctrl/Cmd + ` -> Toggle terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(!isTerminalOpen);
      }
      // Ctrl/Cmd + B -> Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarOpen(!isSidebarOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runCode, runAiScan, isTerminalOpen, isSidebarOpen, setIsTerminalOpen, setIsSidebarOpen]);

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors ${
      isBexer ? 'bg-[#121822] text-slate-100' : 'bg-[#080a15] text-zinc-100'
    }`}>
      {/* Top Header Bar */}
      <TopNavigation />

      {/* Main Workspace Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Collapsible File Explorer */}
        <FileExplorer />

        {/* Center Code Editor & Bottom Terminal */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <EditorTabs />
          <MonacoCodeEditor />
          <TerminalConsole />
        </div>

        {/* Right Collapsible AI & Collaboration Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};
