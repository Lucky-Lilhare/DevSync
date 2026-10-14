import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Button } from '../../common/Button';
import { 
  Users, 
  UserPlus, 
  Mic, 
  MicOff, 
  Crown, 
  Shield, 
  Eye, 
  Wifi, 
  FileCode,
  Radio
} from 'lucide-react';

interface ParticipantsTabProps {
  onOpenInvite: () => void;
}

export const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ onOpenInvite }) => {
  const { 
    collaborators, 
    toggleCollaboratorMute, 
    isAudioCallActive, 
    toggleAudioCall,
    colorTheme
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
      isBexer ? 'bg-[#151c27]' : 'bg-[#080a15]'
    }`}>
      {/* Header */}
      <div className={`p-3 border-b flex items-center justify-between flex-shrink-0 transition-colors ${
        isBexer ? 'bg-[#1a2331] border-[#252f3f]' : 'bg-[#0c0f20] border-white/10'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${
            isBexer ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]' : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
          }`}>
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              Peers ({collaborators.length})
            </h4>
            <p className="text-[11px] text-zinc-400 font-mono">P2P presence & cursors</p>
          </div>
        </div>

        <Button
          variant={isBexer ? 'bexer' : 'primary'}
          size="xs"
          onClick={onOpenInvite}
          leftIcon={<UserPlus className="w-3 h-3" />}
        >
          Invite
        </Button>
      </div>

      {/* Voice Status Banner */}
      <div className={`p-2.5 px-3 border-b flex items-center justify-between text-xs flex-shrink-0 transition-colors ${
        isBexer ? 'bg-[#18212e] border-[#252f3f]' : 'bg-[#0a0d1e] border-white/10'
      }`}>
        <div className="flex items-center gap-1.5">
          <Radio className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
          <span className="text-zinc-200 font-medium font-mono text-[11px]">
            Voice Room: {isAudioCallActive ? 'Connected' : 'Offline'}
          </span>
        </div>
        <button
          onClick={toggleAudioCall}
          className={`text-[11px] font-semibold transition-colors ${
            isBexer ? 'text-[#86c33a] hover:text-[#a3ec4c]' : 'text-indigo-300 hover:text-white'
          }`}
        >
          {isAudioCallActive ? 'Leave Voice' : 'Join Voice'}
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {collaborators.map((c) => {
          const isSelf = c.id === 'user-self';
          const RoleIcon = c.role === 'Host' ? Crown : c.role === 'Editor' ? Shield : Eye;

          return (
            <div
              key={c.id}
              className={`p-3 rounded-xl border transition-all space-y-2.5 shadow-sm ${
                isBexer
                  ? 'bg-[#1e2634] border-[#2d384b] hover:border-[#86c33a]/50'
                  : 'bg-[#0e1224] border-white/10 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-9 h-9 rounded-full border-2 object-cover shadow-sm"
                      style={{ borderColor: c.color }}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${
                        isBexer ? 'border-[#1e2634]' : 'border-[#080a15]'
                      }`}
                      style={{
                        backgroundColor: c.status === 'in-call' ? '#a855f7' : c.status === 'online' ? '#86c33a' : '#eab308'
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-100">
                        {c.name}
                      </span>
                      {isSelf && (
                        <span className={`text-[10px] font-mono ${isBexer ? 'text-[#86c33a]' : 'text-indigo-300'}`}>(You)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {c.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    c.role === 'Host'
                      ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                      : c.role === 'Editor'
                      ? (isBexer ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30' : 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30')
                      : 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                  }`}>
                    <RoleIcon className="w-3 h-3 inline" />
                    {c.role}
                  </span>
                </div>
              </div>

              {/* Status details: Active File, Line number, Ping latency */}
              <div className={`pt-2 border-t flex items-center justify-between text-[11px] text-zinc-400 font-mono ${
                isBexer ? 'border-[#2d384b]' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <FileCode className={`w-3 h-3 flex-shrink-0 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                  <span className="truncate text-zinc-300">{c.currentFile}</span>
                  {c.cursorLine && (
                    <span className={`font-semibold ${isBexer ? 'text-[#86c33a]' : 'text-indigo-300'}`}>:L{c.cursorLine}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 text-[10px] ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`}>
                    <Wifi className="w-3 h-3" />
                    {c.latencyMs}ms
                  </span>

                  <button
                    onClick={() => toggleCollaboratorMute(c.id)}
                    title={c.isMuted ? 'Unmute' : 'Mute'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      c.isMuted
                        ? 'text-rose-400 bg-rose-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {c.isMuted ? (
                      <MicOff className="w-3 h-3" />
                    ) : (
                      <Mic className="w-3 h-3 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Invite Action Button */}
      <div className={`p-2.5 border-t flex-shrink-0 transition-colors ${
        isBexer ? 'bg-[#18212e] border-[#252f3f]' : 'bg-[#0a0d1d] border-white/10'
      }`}>
        <Button
          variant={isBexer ? 'lime' : 'secondary'}
          size="sm"
          className="w-full"
          onClick={onOpenInvite}
          leftIcon={<UserPlus className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />}
        >
          Share Room Invite Link
        </Button>
      </div>
    </div>
  );
};

