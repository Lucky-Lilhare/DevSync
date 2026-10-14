import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Activity, ShieldCheck, Zap, Users } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const { colorTheme } = useWorkspace();
  const isBexer = colorTheme === 'bexer-clean';

  const stats = [
    {
      label: 'Sync Protocol Latency',
      value: '18ms',
      detail: 'P2P WebRTC mesh',
      icon: <Zap className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />,
      badge: 'Operational',
      badgeClass: isBexer
        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35'
        : 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
      cardClass: isBexer
        ? 'border-[#2d384b] hover:border-[#86c33a]/50 bg-[#1e2634]/95'
        : 'border-cyan-500/20 hover:border-cyan-400/40 bg-gradient-to-br from-cyan-950/30 via-[#101424]/80 to-[#0b0e1b]/90',
      iconBg: isBexer
        ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]'
        : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/20',
      valueColor: isBexer ? 'text-white' : 'text-cyan-200'
    },
    {
      label: 'Active Peers Online',
      value: '2,840+',
      detail: 'Across 480 rooms',
      icon: <Users className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />,
      badge: 'Live Mesh',
      badgeClass: isBexer
        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35'
        : 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
      cardClass: isBexer
        ? 'border-[#2d384b] hover:border-[#86c33a]/50 bg-[#1e2634]/95'
        : 'border-indigo-500/20 hover:border-indigo-400/40 bg-gradient-to-br from-indigo-950/30 via-[#12152a]/80 to-[#0b0e1b]/90',
      iconBg: isBexer
        ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]'
        : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-sm shadow-indigo-500/20',
      valueColor: isBexer ? 'text-white' : 'text-indigo-200'
    },
    {
      label: 'AST Vulnerabilities Fixed',
      value: '14,290',
      detail: 'Autonomous security AI',
      icon: <ShieldCheck className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />,
      badge: 'Shield Active',
      badgeClass: isBexer
        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35'
        : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      cardClass: isBexer
        ? 'border-[#2d384b] hover:border-[#86c33a]/50 bg-[#1e2634]/95'
        : 'border-emerald-500/20 hover:border-emerald-400/40 bg-gradient-to-br from-emerald-950/30 via-[#0f171d]/80 to-[#0b0e1b]/90',
      iconBg: isBexer
        ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]'
        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/20',
      valueColor: isBexer ? 'text-white' : 'text-emerald-200'
    },
    {
      label: 'Sync Conflict Rate',
      value: '99.98%',
      detail: 'Zero conflict drops',
      icon: <Activity className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-amber-400'}`} />,
      badge: 'Optimal',
      badgeClass: isBexer
        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/35'
        : 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      cardClass: isBexer
        ? 'border-[#2d384b] hover:border-[#86c33a]/50 bg-[#1e2634]/95'
        : 'border-amber-500/20 hover:border-amber-400/40 bg-gradient-to-br from-amber-950/25 via-[#161421]/80 to-[#0b0e1b]/90',
      iconBg: isBexer
        ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]'
        : 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/20',
      valueColor: isBexer ? 'text-white' : 'text-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-black/20 ${stat.cardClass}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg border ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stat.badgeClass}`}>
              {stat.badge}
            </span>
          </div>
          <div>
            <div className={`text-2xl font-bold tracking-tight font-mono ${stat.valueColor}`}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-zinc-200 mt-1">{stat.label}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{stat.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
