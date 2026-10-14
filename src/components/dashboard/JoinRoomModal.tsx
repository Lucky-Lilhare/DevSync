import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWorkspace } from '../../context/WorkspaceContext';
import { LogIn, Hash, Radio, Users } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const { joinSession, sessions, colorTheme } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError('Please provide a valid Room ID');
      return;
    }
    setError('');
    setIsJoining(true);
    setTimeout(() => {
      joinSession(roomId.trim());
      setIsJoining(false);
      onClose();
    }, 350);
  };

  const handleQuickSelect = (id: string) => {
    setRoomId(id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Collaborative Session"
      description="Enter a Room ID or select an ongoing active session to collaborate in real time."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room ID Input */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Room ID / Share Code
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
              isBexer ? 'text-[#86c33a]' : 'text-indigo-400'
            }`}>
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. ROOM-8921 or paste invite code"
              className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all ${
                isBexer
                  ? 'bg-[#141b26] border border-[#2d384b] text-white focus:outline-none focus:border-[#86c33a] focus:ring-2 focus:ring-[#86c33a]/20'
                  : 'bg-white/[0.04] border border-white/10 text-zinc-100 focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        </div>

        {/* Quick Join Suggestions */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Radio className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
            Active Rooms Nearby
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
            {sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                onClick={() => handleQuickSelect(session.id)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  roomId === session.id
                    ? (isBexer
                        ? 'bg-[#86c33a]/20 border-[#86c33a]/60 text-white shadow-md shadow-[#86c33a]/15'
                        : 'bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border-indigo-400/60 text-white shadow-md shadow-indigo-500/15')
                    : (isBexer
                        ? 'bg-[#141b26] border-[#2d384b] text-zinc-300 hover:border-[#86c33a]/40 hover:bg-[#1c2432]'
                        : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/[0.06]')
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-100">{session.name}</div>
                  <div className={`text-[11px] font-mono mt-0.5 ${isBexer ? 'text-[#a3ec4c]' : 'text-indigo-300'}`}>#{session.id}</div>
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md border ${
                  isBexer
                    ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                    : 'text-zinc-300 bg-white/[0.04] border-white/10'
                }`}>
                  <Users className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
                  {session.participantCount} peers
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-end gap-2.5 pt-3 border-t ${
          isBexer ? 'border-[#2d384b]' : 'border-white/10'
        }`}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={isBexer ? 'bexer' : 'primary'}
            isLoading={isJoining}
            leftIcon={<LogIn className="w-3.5 h-3.5" />}
          >
            Connect & Join
          </Button>
        </div>
      </form>
    </Modal>
  );
};
