import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import type { ColorTheme } from '../../types';
import { Palette, Check } from 'lucide-react';

interface ThemeOption {
  id: ColorTheme;
  name: string;
  tagline: string;
  colors: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'bexer-clean',
    name: 'Bexer Clean',
    tagline: 'Lime Green & Slate Navy',
    colors: ['#86c33a', '#252d39', '#ffffff'],
  },
  {
    id: 'cyber-iris',
    name: 'Cyber Iris',
    tagline: 'Indigo & Neon Cyan',
    colors: ['#6366f1', '#06b6d4', '#a855f7'],
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    tagline: 'Cyber Mint & Teal',
    colors: ['#10b981', '#34d399', '#06b6d4'],
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    tagline: 'Neon Rose & Warm Amber',
    colors: ['#f43f5e', '#fbbf24', '#d946ef'],
  },
  {
    id: 'deep-cosmic',
    name: 'Deep Cosmic',
    tagline: 'Sapphire & Violet',
    colors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  },
];

export const ThemeSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { colorTheme, setColorTheme, addToast } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEME_OPTIONS.find((t) => t.id === colorTheme) || THEME_OPTIONS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectTheme = (theme: ThemeOption) => {
    setColorTheme(theme.id);
    setIsOpen(false);
    addToast('Palette Activated', `${theme.name} palette applied`, 'info');
  };

  const isBexer = colorTheme === 'bexer-clean';

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Aesthetic Color Theme"
        className={`flex items-center gap-2 rounded-lg border backdrop-blur-md text-zinc-200 transition-all duration-200 shadow-sm ${
          isBexer
            ? 'border-[#2d384b] hover:border-[#86c33a]/50 bg-[#1e2634]/90 hover:bg-[#1e2634]'
            : 'border-white/10 hover:border-indigo-400/50 bg-white/[0.04] hover:bg-white/[0.08]'
        } ${
          compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs sm:text-sm'
        }`}
      >
        <Palette className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
        
        {/* Color preview dots */}
        <div className="flex items-center -space-x-1">
          {currentTheme.colors.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-black/60 shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {!compact && (
          <span className="font-medium hidden md:inline">{currentTheme.name}</span>
        )}
      </button>

      {/* Floating Theme Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-64 rounded-xl border backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
          isBexer ? 'border-[#2d384b] bg-[#1a2331]/98' : 'border-white/15 bg-[#0e1222]/95'
        }`}>
          <div className={`px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between border-b pb-2 mb-1 ${
            isBexer ? 'border-[#2d384b] text-zinc-300' : 'border-white/10 text-zinc-400'
          }`}>
            <span>Aesthetic Theme Palette</span>
            <span className={`text-[10px] font-mono ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`}>Live Sync</span>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = theme.id === colorTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-all ${
                    isSelected
                      ? (isBexer
                          ? 'bg-[#86c33a]/20 border border-[#86c33a]/50 text-white font-medium shadow-sm'
                          : 'bg-indigo-600/20 border border-indigo-500/40 text-white font-medium shadow-sm')
                      : 'hover:bg-white/[0.06] text-zinc-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Color dots preview stack */}
                    <div className="flex items-center -space-x-1.5 flex-shrink-0">
                      {theme.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/80 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="font-medium leading-none">{theme.name}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{theme.tagline}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className={`w-4 h-4 flex-shrink-0 ml-2 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
