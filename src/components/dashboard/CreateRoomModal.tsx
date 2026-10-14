import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ROOM_TEMPLATES } from '../../data/mockSessions';
import type { SupportedLanguage } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sparkles, Lock, Globe, Code2, Check } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { createSession, colorTheme } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';
  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('tpl-ts');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (tplId: string, tplLang: SupportedLanguage, tplName: string) => {
    setSelectedTemplate(tplId);
    setLanguage(tplLang);
    if (!roomName) {
      setRoomName(`${tplName} Workspace`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      createSession({
        name: roomName.trim() || 'New DevSync Session',
        language,
        isPrivate,
        description: description.trim() || undefined
      });
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Collaborative Room"
      description="Launch an instant shared coding session with real-time AI code review."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Room Name
          </label>
          <input
            type="text"
            required
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Auth Gateway Refactor, Data Ingestion Pipeline"
            className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm placeholder-zinc-500 transition-all ${
              isBexer
                ? 'bg-[#141b26] border border-[#2d384b] text-white focus:outline-none focus:border-[#86c33a] focus:ring-2 focus:ring-[#86c33a]/20'
                : 'bg-white/[0.04] border border-white/10 text-zinc-100 focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
        </div>

        {/* Templates Selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Starter Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ROOM_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl.id, tpl.language, tpl.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? (isBexer
                          ? 'bg-[#86c33a]/15 border-[#86c33a]/60 text-white shadow-md shadow-[#86c33a]/15'
                          : 'bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border-indigo-400/60 text-white shadow-md shadow-indigo-500/15')
                      : (isBexer
                          ? 'bg-[#141b26] border-[#2d384b] text-zinc-400 hover:border-[#86c33a]/40 hover:text-zinc-200'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200')
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className={`w-4 h-4 ${
                        isSelected && isBexer ? 'text-[#86c33a]' : isSelected ? 'text-cyan-400' : 'text-zinc-500'
                      }`} />
                      <span className="text-xs font-semibold">{tpl.name}</span>
                    </div>
                    {isSelected && (
                      <span className={`flex items-center justify-center w-4 h-4 rounded-full text-white shadow-sm ${
                        isBexer ? 'bg-[#86c33a] text-[#121922]' : 'bg-gradient-to-tr from-indigo-500 to-cyan-400'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{tpl.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Language & Privacy */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Primary Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer ${
                isBexer
                  ? 'bg-[#141b26] border border-[#2d384b] text-zinc-100 focus:outline-none focus:border-[#86c33a]'
                  : 'bg-[#0f1325] border border-white/10 text-zinc-100 focus:outline-none focus:border-indigo-400/60'
              }`}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Session Privacy
            </label>
            <div className="flex items-center gap-1.5 h-[38px]">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-xl border text-xs font-semibold transition-all ${
                  !isPrivate
                    ? (isBexer ? 'bg-[#86c33a]/15 border-[#86c33a]/40 text-[#a3ec4c]' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300')
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
                Public
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 h-full rounded-xl border text-xs font-semibold transition-all ${
                  isPrivate
                    ? (isBexer ? 'bg-[#86c33a]/20 border-[#86c33a]/40 text-[#a3ec4c]' : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300')
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <Lock className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                Private
              </button>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Session Goal / Notes (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Fixing timing vulnerability and deploying before code freeze"
            className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm placeholder-zinc-500 transition-colors ${
              isBexer
                ? 'bg-[#141b26] border border-[#2d384b] text-white focus:outline-none focus:border-[#86c33a]'
                : 'bg-white/[0.04] border border-white/10 text-zinc-100 focus:outline-none focus:border-indigo-400/60'
            }`}
          />
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
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Launch Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};

