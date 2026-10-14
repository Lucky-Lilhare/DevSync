import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Users, 
  Clock, 
  Lock, 
  Globe, 
  ArrowRight, 
  Copy, 
  Search, 
  SlidersHorizontal,
  ShieldCheck,
  FileCode2,
  Sparkles
} from 'lucide-react';

export const RecentSessionsList: React.FC = () => {
  const { sessions, joinSession, addToast, colorTheme } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const isBexer = colorTheme === 'bexer-clean';

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = 
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLanguage = selectedLanguage === 'all' || session.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    addToast('Copied Room ID', `${id} copied to clipboard`, 'success');
  };

  const getLanguageDetails = (lang: string) => {
    if (isBexer) {
      return {
        badgeClass: 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35 shadow-sm shadow-[#86c33a]/10',
        hoverBorder: 'hover:border-[#86c33a]/50 hover:shadow-[#86c33a]/10',
        accentColor: '#86c33a',
        label: lang === 'typescript' ? 'TypeScript' : lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : lang.toUpperCase()
      };
    }

    switch (lang) {
      case 'typescript':
        return {
          badgeClass: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30 shadow-sm shadow-indigo-500/10',
          hoverBorder: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
          accentColor: '#818cf8',
          label: 'TypeScript'
        };
      case 'javascript':
        return {
          badgeClass: 'text-amber-300 bg-amber-500/15 border-amber-500/30 shadow-sm shadow-amber-500/10',
          hoverBorder: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
          accentColor: '#f59e0b',
          label: 'JavaScript'
        };
      case 'python':
        return {
          badgeClass: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30 shadow-sm shadow-cyan-500/10',
          hoverBorder: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
          accentColor: '#06b6d4',
          label: 'Python'
        };
      case 'rust':
        return {
          badgeClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
          hoverBorder: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
          accentColor: '#10b981',
          label: 'Rust'
        };
      default:
        return {
          badgeClass: 'text-purple-300 bg-purple-500/15 border-purple-500/30 shadow-sm shadow-purple-500/10',
          hoverBorder: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
          accentColor: '#a855f7',
          label: lang.toUpperCase()
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
            isBexer ? 'text-[#86c33a]' : 'text-indigo-400'
          }`}>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collaborative rooms by name, tag, or ID..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm placeholder-zinc-400 backdrop-blur-md transition-all ${
              isBexer
                ? 'bg-[#1b2331] border border-[#2d384b] hover:border-[#86c33a]/50 text-white focus:outline-none focus:border-[#86c33a] focus:ring-2 focus:ring-[#86c33a]/20'
                : 'bg-white/[0.04] border border-white/10 hover:border-white/20 text-zinc-100 focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 flex-shrink-0 mr-1">
            <SlidersHorizontal className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
            Filter:
          </span>
          {[
            { id: 'all', label: 'All Stacks' },
            { id: 'javascript', label: 'JavaScript' },
            { id: 'typescript', label: 'TypeScript' },
            { id: 'python', label: 'Python' },
            { id: 'rust', label: 'Rust' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedLanguage(item.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex-shrink-0 font-medium ${
                selectedLanguage === item.id
                  ? (isBexer
                      ? 'bg-[#86c33a] border-[#86c33a] text-[#121922] font-bold shadow-md shadow-[#86c33a]/30'
                      : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/50 text-white shadow-sm shadow-indigo-500/20')
                  : (isBexer
                      ? 'bg-[#1b2331] border-[#2d384b] text-zinc-300 hover:border-[#86c33a]/40 hover:text-white'
                      : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200')
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Sessions */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-md">
          <FileCode2 className={`w-9 h-9 mx-auto mb-3 ${isBexer ? 'text-[#86c33a]/80' : 'text-indigo-400/70'}`} />
          <h4 className="text-sm font-semibold text-zinc-200">No collaborative sessions found</h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new session to begin real-time pair programming.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredSessions.map((session) => {
            const langDetails = getLanguageDetails(session.language);
            return (
              <div
                key={session.id}
                onClick={() => joinSession(session.id)}
                className={`group p-4 sm:p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer flex flex-col justify-between backdrop-blur-md relative overflow-hidden ${
                  isBexer
                    ? `bg-gradient-to-b from-[#1f2837] via-[#1a2331] to-[#141b26] border border-[#2d384b] ${langDetails.hoverBorder}`
                    : `bg-gradient-to-b from-[#141829]/70 via-[#101323]/80 to-[#0c0f1d]/90 border border-white/10 ${langDetails.hoverBorder}`
                }`}
              >
                {/* Subtle top accent gradient line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-75 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, ${langDetails.accentColor}, transparent)`
                  }}
                />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${langDetails.badgeClass}`}>
                        {langDetails.label}
                      </span>

                      {session.isPrivate ? (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10">
                          <Lock className="w-3 h-3 text-zinc-400" />
                          Private
                        </span>
                      ) : (
                        <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                          isBexer
                            ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35'
                            : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                        }`}>
                          <Globe className="w-3 h-3" />
                          Public Room
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border shadow-sm ${
                      isBexer
                        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35'
                        : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                    }`}>
                      <ShieldCheck className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
                      {session.healthScore}% Health
                    </div>
                  </div>

                  {/* Title and ID */}
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors flex items-center gap-2">
                    {session.name}
                    {session.id === 'ROOM-8921' && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.2 rounded-full border ${
                        isBexer
                          ? 'text-[#a3ec4c] bg-[#86c33a]/20 border-[#86c33a]/40 font-semibold'
                          : 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                      }`}>
                        <Sparkles className="w-2.5 h-2.5" />
                        Featured Demo
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                      isBexer
                        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35 font-semibold'
                        : 'text-indigo-300 bg-indigo-950/40 border-indigo-500/25'
                    }`}>
                      #{session.id}
                    </span>
                    <button
                      onClick={(e) => handleCopyId(e, session.id)}
                      title="Copy Room ID"
                      className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  {session.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {session.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                          isBexer
                            ? 'text-zinc-300 bg-[#151c27] border-[#2d384b]'
                            : 'text-zinc-300 bg-white/[0.04] border-white/10'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className={`flex items-center justify-between pt-3.5 mt-4 border-t ${
                  isBexer ? 'border-[#2d384b]' : 'border-white/10'
                }`}>
                  <div className="flex items-center gap-3.5 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Users className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                      <span>{session.participantCount} peers live</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{session.updatedAt}</span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    isBexer
                      ? 'text-[#86c33a] group-hover:text-[#a3ec4c]'
                      : 'text-indigo-300 group-hover:text-indigo-200'
                  }`}>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

