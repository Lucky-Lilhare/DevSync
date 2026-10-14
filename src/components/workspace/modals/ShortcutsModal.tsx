import React from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useWorkspace } from '../../../context/WorkspaceContext';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { colorTheme } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';

  const shortcuts = [
    { action: 'Run Code in Sandbox', keys: ['Ctrl', 'Enter'] },
    { action: 'Quick AI Scan', keys: ['Ctrl', 'Shift', 'S'] },
    { action: 'Toggle Terminal / Console', keys: ['Ctrl', '`'] },
    { action: 'Toggle Right Sidebar', keys: ['Ctrl', 'B'] },
    { action: 'Format Document', keys: ['Shift', 'Alt', 'F'] },
    { action: 'Find & Replace', keys: ['Ctrl', 'F'] },
    { action: 'Multi-Cursor Insertion', keys: ['Alt', 'Click'] },
    { action: 'Toggle Voice Call Room', keys: ['Ctrl', 'Shift', 'M'] },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      description="Supercharge your real-time pair programming workflow."
      maxWidth="md"
    >
      <div className="space-y-2">
        {shortcuts.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
              isBexer
                ? 'bg-[#141b26] border-[#2d384b] hover:border-[#86c33a]/40'
                : 'bg-white/[0.03] border-white/10 hover:border-indigo-500/30'
            }`}
          >
            <span className="text-zinc-200 font-medium">{s.action}</span>
            <div className="flex items-center gap-1.5">
              {s.keys.map((k, j) => (
                <kbd
                  key={j}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono shadow-sm border ${
                    isBexer
                      ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#a3ec4c]'
                      : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-200'
                  }`}
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}

        <div className={`flex justify-end pt-3 border-t ${isBexer ? 'border-[#2d384b]' : 'border-white/10'}`}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
