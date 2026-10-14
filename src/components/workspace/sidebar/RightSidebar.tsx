import React, { useState } from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { AiReviewTab } from './AiReviewTab';
import { LiveChatTab } from './LiveChatTab';
import { ParticipantsTab } from './ParticipantsTab';
import { ShareRoomModal } from '../modals/ShareRoomModal';
import { Sparkles, MessageSquare, Users, ChevronRight } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { 
    rightSidebarTab, 
    setRightSidebarTab, 
    isSidebarOpen, 
    setIsSidebarOpen,
    aiReviews,
    collaborators,
    chatMessages,
    colorTheme
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isSidebarOpen) return null;

  const unappliedIssues = aiReviews.filter((r) => !r.applied).length;

  return (
    <>
      <aside className={`w-80 sm:w-96 border-l flex flex-col h-full select-none flex-shrink-0 z-20 backdrop-blur-xl transition-colors ${
        isBexer ? 'bg-[#151c27] border-[#252f3f]' : 'bg-[#080a15] border-white/10'
      }`}>
        {/* Tab Headers */}
        <div className={`h-10 border-b px-2 flex items-center justify-between flex-shrink-0 transition-colors ${
          isBexer ? 'bg-[#1a2331] border-[#252f3f]' : 'bg-[#0a0d1e] border-white/10'
        }`}>
          <div className="flex items-center gap-1">
            {/* Tab 1: AI Assistant */}
            <button
              onClick={() => setRightSidebarTab('ai')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                rightSidebarTab === 'ai'
                  ? (isBexer
                      ? 'bg-[#86c33a] text-[#121922] border-[#86c33a] font-bold shadow-sm shadow-[#86c33a]/30'
                      : 'bg-indigo-600/25 text-white border-indigo-500/50 shadow-sm shadow-indigo-500/20')
                  : (isBexer
                      ? 'text-zinc-300 hover:text-white border-transparent hover:bg-white/[0.04]'
                      : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/[0.04]')
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${
                rightSidebarTab === 'ai' && isBexer ? 'text-[#121922]' : isBexer ? 'text-[#86c33a]' : 'text-cyan-400'
              }`} />
              <span>AI Review</span>
              {unappliedIssues > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {unappliedIssues}
                </span>
              )}
            </button>

            {/* Tab 2: Live Chat */}
            <button
              onClick={() => setRightSidebarTab('chat')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                rightSidebarTab === 'chat'
                  ? (isBexer
                      ? 'bg-[#86c33a] text-[#121922] border-[#86c33a] font-bold shadow-sm shadow-[#86c33a]/30'
                      : 'bg-indigo-600/25 text-white border-indigo-500/50 shadow-sm shadow-indigo-500/20')
                  : (isBexer
                      ? 'text-zinc-300 hover:text-white border-transparent hover:bg-white/[0.04]'
                      : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/[0.04]')
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 ${
                rightSidebarTab === 'chat' && isBexer ? 'text-[#121922]' : isBexer ? 'text-[#86c33a]' : 'text-indigo-400'
              }`} />
              <span>Chat</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                rightSidebarTab === 'chat' && isBexer
                  ? 'bg-black/20 text-[#121922] border-black/20 font-bold'
                  : isBexer
                  ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                  : 'text-indigo-300 bg-indigo-950/60 border-indigo-500/30'
              }`}>
                {chatMessages.length}
              </span>
            </button>

            {/* Tab 3: Participants */}
            <button
              onClick={() => setRightSidebarTab('participants')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                rightSidebarTab === 'participants'
                  ? (isBexer
                      ? 'bg-[#86c33a] text-[#121922] border-[#86c33a] font-bold shadow-sm shadow-[#86c33a]/30'
                      : 'bg-indigo-600/25 text-white border-indigo-500/50 shadow-sm shadow-indigo-500/20')
                  : (isBexer
                      ? 'text-zinc-300 hover:text-white border-transparent hover:bg-white/[0.04]'
                      : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/[0.04]')
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${
                rightSidebarTab === 'participants' && isBexer ? 'text-[#121922]' : isBexer ? 'text-[#86c33a]' : 'text-emerald-400'
              }`} />
              <span>Peers</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                rightSidebarTab === 'participants' && isBexer
                  ? 'bg-black/20 text-[#121922] border-black/20 font-bold'
                  : isBexer
                  ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                  : 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30'
              }`}>
                {collaborators.length}
              </span>
            </button>
          </div>

          {/* Close Sidebar button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            title="Collapse Sidebar"
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {rightSidebarTab === 'ai' && <AiReviewTab />}
          {rightSidebarTab === 'chat' && <LiveChatTab />}
          {rightSidebarTab === 'participants' && (
            <ParticipantsTab onOpenInvite={() => setIsShareModalOpen(true)} />
          )}
        </div>
      </aside>

      {/* Modals */}
      <ShareRoomModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
};
