import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Copy, Check, Shield, Globe, Users } from 'lucide-react';

interface ShareRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareRoomModal: React.FC<ShareRoomModalProps> = ({ isOpen, onClose }) => {
  const { activeSession, addToast, colorTheme } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [permission, setPermission] = useState<'editor' | 'viewer'>('editor');

  const shareUrl = `${window.location.origin}/#room=${activeSession?.id || 'ROOM-8921'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    addToast('Invite Link Copied', 'Share with your team to collaborate in real-time', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyId = () => {
    if (activeSession?.id) {
      navigator.clipboard.writeText(activeSession.id);
      setCopiedId(true);
      addToast('Room ID Copied', `${activeSession.id} copied to clipboard`, 'success');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team & Share Room"
      description="Collaborate in real time with shared cursors, live audio, and synchronized AI review."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Permission settings */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Default Collaborator Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPermission('editor')}
              className={`p-3 rounded-xl border text-left transition-all ${
                permission === 'editor'
                  ? (isBexer
                      ? 'bg-[#86c33a]/15 border-[#86c33a]/60 text-white shadow-md shadow-[#86c33a]/15'
                      : 'bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border-indigo-400/60 text-white shadow-md shadow-indigo-500/15')
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Users className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                <span>Can Edit & Run</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Real-time editing & terminal execution.</p>
            </button>

            <button
              type="button"
              onClick={() => setPermission('viewer')}
              className={`p-3 rounded-xl border text-left transition-all ${
                permission === 'viewer'
                  ? (isBexer
                      ? 'bg-[#86c33a]/15 border-[#86c33a]/60 text-white shadow-md shadow-[#86c33a]/15'
                      : 'bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border-cyan-400/60 text-white shadow-md shadow-cyan-500/15')
                  : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Globe className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
                <span>View Only</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Follow active files and view live chat.</p>
            </button>
          </div>
        </div>

        {/* Share Link */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Direct Invite Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={`flex-1 px-3.5 py-2 rounded-xl text-zinc-200 text-xs font-mono select-all focus:outline-none transition-colors ${
                isBexer
                  ? 'bg-[#141b26] border border-[#2d384b]'
                  : 'bg-white/[0.04] border border-white/10'
              }`}
            />
            <Button
              variant={isBexer ? 'bexer' : 'primary'}
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Room ID Badge */}
        <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
          isBexer
            ? 'bg-[#141b26] border-[#2d384b]'
            : 'bg-[#0f1325] border-indigo-500/30'
        }`}>
          <div>
            <div className={`text-[11px] font-semibold ${isBexer ? 'text-[#a3ec4c]' : 'text-indigo-300'}`}>Unique Room ID</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              #{activeSession?.id || 'ROOM-8921'}
            </div>
          </div>
          <Button
            variant={isBexer ? 'lime' : 'outline'}
            size="xs"
            onClick={handleCopyId}
            leftIcon={copiedId ? <Check className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} /> : <Copy className="w-3 h-3" />}
          >
            {copiedId ? 'Copied' : 'Copy ID'}
          </Button>
        </div>

        {/* Security badge note */}
        <div className={`flex items-start gap-2.5 p-3 rounded-xl text-xs border ${
          isBexer
            ? 'bg-[#86c33a]/10 border-[#86c33a]/25 text-[#a3ec4c]'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
        }`}>
          <Shield className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
          <span>
            DevSync end-to-end sessions are secured via WebRTC DTLS/SRTP with low-latency peer encryption.
          </span>
        </div>

        <div className="flex justify-end pt-1">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
