import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { StatsBanner } from './StatsBanner';
import { RecentSessionsList } from './RecentSessionsList';
import { CreateRoomModal } from './CreateRoomModal';
import { JoinRoomModal } from './JoinRoomModal';
import { ContactInquiryModal } from './ContactInquiryModal';
import { FeedbackModal } from '../workspace/modals/FeedbackModal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { api } from '../../services/api';
import { 
  Code2, 
  Plus, 
  LogIn, 
  Sparkles,
  Terminal, 
  ShieldAlert, 
  Play, 
  Layers,
  CheckCircle2,
  ArrowRight,
  Database,
  Building2,
  Mail,
  Send,
  MessageSquareHeart
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { joinSession, colorTheme, addToast } = useWorkspace();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isBexer = colorTheme === 'bexer-clean';

  const handleLaunchDemo = () => {
    joinSession('ROOM-8921');
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      addToast('Invalid Email', 'Please provide a valid work email.', 'warn');
      return;
    }
    setIsSubscribing(true);
    try {
      await api.subscribeNewsletter(newsletterEmail.trim(), 'dashboard_landing');
      setIsSubscribed(true);
      setNewsletterEmail('');
      addToast('Subscribed!', 'Your email was saved to Supabase newsletter_subscribers.', 'success');
    } catch (err: any) {
      addToast('Error', err.message || 'Subscription failed.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col relative overflow-hidden bg-grid-pattern">
      {/* Background Ambient Glow Orbs */}
      {isBexer ? (
        <>
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-[#86c33a]/20 via-[#252d39]/40 to-[#86c33a]/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-aurora" />
          <div className="absolute top-[280px] left-[-80px] w-[350px] h-[350px] bg-[#86c33a]/10 rounded-full blur-[110px] pointer-events-none -z-10" />
          <div className="absolute top-[340px] right-[-60px] w-[380px] h-[380px] bg-[#252d39]/50 rounded-full blur-[110px] pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-aurora" />
          <div className="absolute top-[280px] left-[-80px] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="absolute top-[340px] right-[-60px] w-[380px] h-[380px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        </>
      )}

      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl px-6 py-3.5 transition-colors ${
        isBexer 
          ? 'border-[#2d3748] bg-[#161d28]/85' 
          : 'border-white/10 bg-[#080913]/70'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl p-[1px] shadow-lg ${
              isBexer
                ? 'bg-[#86c33a] shadow-[#86c33a]/25'
                : 'bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 shadow-indigo-500/25'
            }`}>
              <div className={`w-full h-full rounded-[11px] flex items-center justify-center text-white ${
                isBexer ? 'bg-[#1b2330]' : 'bg-[#0d1020]'
              }`}>
                <Code2 className={`w-5 h-5 stroke-[2.5] ${isBexer ? 'text-[#86c33a]' : 'text-white'}`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  DevSync
                </span>
                <Badge variant={isBexer ? 'lime' : 'indigo'} size="sm" dot pulseDot>
                  v2.4 Live
                </Badge>
              </div>
              <p className="text-[10.5px] text-zinc-400 font-medium">Real-Time Collaborative Code & AI Review</p>
            </div>
          </div>

          {/* Action buttons & Theme Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Interactive Theme Switcher */}
            <ThemeSwitcher />

            <div className="h-5 w-px bg-white/10 hidden sm:block mx-0.5" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsContactOpen(true)}
              leftIcon={<Building2 className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />}
              className="hidden md:inline-flex"
            >
              Enterprise
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsJoinOpen(true)}
              leftIcon={<LogIn className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />}
            >
              Join Room
            </Button>
            <Button
              variant={isBexer ? 'bexer' : 'primary'}
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Room
            </Button>
            
            <div className="h-5 w-px bg-white/10 hidden sm:block mx-0.5" />

            <div className="flex items-center gap-2 pl-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Alex Rivera"
                  className={`w-8 h-8 rounded-full border-2 object-cover shadow-sm ${
                    isBexer ? 'border-[#86c33a]' : 'border-indigo-400/80'
                  }`}
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#161d28] ${
                  isBexer ? 'bg-[#86c33a]' : 'bg-emerald-400'
                }`} />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-zinc-200">Alex Rivera</div>
                <div className={`text-[10px] font-mono ${isBexer ? 'text-[#86c33a]' : 'text-indigo-300'}`}>Lead Dev • Online</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-10 z-10">
        {/* Aesthetic Hero Section with Code Preview Card */}
        <div className={`relative rounded-3xl p-7 sm:p-10 border backdrop-blur-2xl shadow-2xl overflow-hidden ${
          isBexer
            ? 'border-[#2d384b] bg-gradient-to-br from-[#1f2837]/90 via-[#192230]/95 to-[#141b26]/98'
            : 'border-white/10 bg-gradient-to-br from-[#12162b]/80 via-[#0e1224]/90 to-[#0a0d1b]/95'
        }`}>
          {/* Inner card glow accents */}
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isBexer ? 'bg-[#86c33a]/10' : 'bg-indigo-500/10'
          }`} />
          <div className={`absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isBexer ? 'bg-[#252d39]/50' : 'bg-cyan-500/10'
          }`} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline & Actions */}
            <div className="lg:col-span-7 space-y-5">
              {/* Bexer Signature Title Accent Border Bar */}
              {isBexer && (
                <div className="flex items-center gap-1.5">
                  <span className="w-8 h-1 rounded-full bg-[#86c33a]" />
                  <span className="w-2 h-1 rounded-full bg-[#86c33a]/60" />
                  <span className="w-1 h-1 rounded-full bg-[#86c33a]/30" />
                </div>
              )}

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                isBexer
                  ? 'bg-[#86c33a]/15 border border-[#86c33a]/40 text-[#a3ec4c]'
                  : 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 border border-indigo-400/30 text-indigo-200'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
                <span>Sub-25ms WebRTC Sync • Real-Time AST Bug Fixer</span>
                <span className={`flex h-1.5 w-1.5 rounded-full animate-ping ml-1 ${
                  isBexer ? 'bg-[#86c33a]' : 'bg-cyan-400'
                }`} />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Real-Time Code Collaboration <br />
                {isBexer ? (
                  <span className="text-[#86c33a]">
                    With Autonomous AI Review
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                    With Autonomous AI Review
                  </span>
                )}
              </h1>

              <p className="text-zinc-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-normal">
                DevSync blends high-precision Monaco multi-cursor editing, instant AST security guardrails, 
                team voice & chat, and in-browser execution into a fluid, aesthetic developer workspace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant={isBexer ? 'bexer' : 'primary'}
                  size="md"
                  onClick={() => setIsCreateOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create New Session
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsJoinOpen(true)}
                  leftIcon={<LogIn className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />}
                >
                  Join with Room ID
                </Button>

                <Button
                  variant={isBexer ? 'lime' : 'emerald'}
                  size="md"
                  onClick={handleLaunchDemo}
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
                >
                  Launch Live Demo Room
                </Button>
              </div>

              {/* Aesthetic status pills */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-300 font-mono">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  isBexer
                    ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                    : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isBexer ? 'bg-[#86c33a]' : 'bg-emerald-400'
                  }`} />
                  P2P Mesh Connected
                </span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  isBexer
                    ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20'
                    : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20'
                }`}>
                  <Terminal className="w-3.5 h-3.5" />
                  In-Browser Runner
                </span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  isBexer
                    ? 'text-[#86c33a] bg-[#86c33a]/10 border-[#86c33a]/30'
                    : 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  AST Security Shield
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Aesthetic Live Preview Mockup */}
            <div className="lg:col-span-5">
              <div className={`rounded-2xl border p-4 space-y-3 relative overflow-hidden group shadow-2xl backdrop-blur-xl ${
                isBexer
                  ? 'border-[#303c4f] bg-[#1a2331]/95'
                  : 'border-white/15 bg-[#090c1a]/90'
              }`}>
                {/* Window header with macOS buttons */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40" />
                    <span className="w-3 h-3 rounded-full bg-[#86c33a] border border-[#86c33a]/50" />
                    <span className="text-xs font-mono text-zinc-300 ml-2">auth.service.ts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isBexer
                        ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/40 font-semibold'
                        : 'text-indigo-300 bg-indigo-950/60 border-indigo-500/30'
                    }`}>
                      #ROOM-8921
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isBexer ? 'bg-[#86c33a]' : 'bg-emerald-400'}`} />
                  </div>
                </div>

                {/* Simulated Code Lines with Active Collaborators */}
                <div className="font-mono text-xs space-y-1.5 py-1 select-none">
                  <div className="flex items-center text-zinc-400">
                    <span className="w-6 text-right mr-3 text-zinc-500">11</span>
                    <span className="text-purple-400">export async function</span>{' '}
                    <span className={isBexer ? 'text-[#86c33a] ml-1' : 'text-cyan-300 ml-1'}>authenticateUser</span>
                    <span className="text-zinc-300">(creds) &#123;</span>
                  </div>

                  <div className="flex items-center text-zinc-400">
                    <span className="w-6 text-right mr-3 text-zinc-500">12</span>
                    <span className="ml-4 text-zinc-500">// Verify credentials safely</span>
                  </div>

                  {/* Highlighted vulnerability line with collaborator badge */}
                  <div className="relative flex items-center bg-rose-500/10 border-l-2 border-rose-500 py-1 -mx-2 px-2 rounded-r">
                    <span className="w-6 text-right mr-3 text-rose-400 font-bold">13</span>
                    <span className="ml-4 text-zinc-200">
                      const query = <span className="text-amber-300">`SELECT * FROM users WHERE email='${'${creds.email}'}'`</span>;
                    </span>
                    {/* Floating collaborator tag */}
                    <span className="absolute -top-3.5 right-4 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Sarah Chen (Line 13)
                    </span>
                  </div>

                  <div className="flex items-center text-zinc-400">
                    <span className="w-6 text-right mr-3 text-zinc-500">14</span>
                    <span className="ml-4 text-purple-400">return</span>
                    <span className={`ml-1 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-300'}`}>db.execute</span>
                    <span className="text-zinc-300">(query);</span>
                  </div>

                  <div className="flex items-center text-zinc-400">
                    <span className="w-6 text-right mr-3 text-zinc-500">15</span>
                    <span className="text-zinc-300">&#125;</span>
                  </div>
                </div>

                {/* AI Automated Review Bubble */}
                <div className={`mt-3 p-3 rounded-xl border shadow-md ${
                  isBexer
                    ? 'bg-[#151c27] border-[#86c33a]/30'
                    : 'bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-indigo-950/70 border-indigo-500/30'
                }`}>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <div className={`flex items-center gap-1.5 font-semibold ${
                      isBexer ? 'text-[#a3ec4c]' : 'text-indigo-300'
                    }`}>
                      <Sparkles className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
                      <span>AI Security Reviewer</span>
                    </div>
                    <span className="text-[10px] font-medium text-rose-300 bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 rounded">
                      Critical Risk
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    Potential SQL Injection vulnerability detected. Use parameterized queries with <code className={`px-1 rounded ${
                      isBexer ? 'text-[#86c33a] bg-[#86c33a]/15' : 'text-cyan-300 bg-cyan-950/50'
                    }`}>db.execute(sql, [email])</code>.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={handleLaunchDemo}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm ${
                        isBexer
                          ? 'bg-[#86c33a] hover:bg-[#74b02c] text-[#121922] font-bold'
                          : 'text-white bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      <CheckCircle2 className={`w-3 h-3 ${isBexer ? 'text-[#121922]' : 'text-emerald-300'}`} />
                      <span>Launch Room to Apply Fix</span>
                    </button>
                    <span className="text-[10px] text-zinc-400 font-mono">1-click automated patch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Telemetry & Stats with Combination Colors */}
        <StatsBanner />

        {/* Recent Collaborative Sessions */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${
                isBexer
                  ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]'
                  : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
              }`}>
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Recent Collaborative Sessions
              </h2>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border shadow-sm ${
                isBexer
                  ? 'bg-[#86c33a]/15 text-[#a3ec4c] border-[#86c33a]/30 font-semibold'
                  : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
              }`}>
                4 Active Rooms
              </span>
            </div>
            
            <button
              onClick={() => setIsCreateOpen(true)}
              className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm ${
                isBexer
                  ? 'text-[#86c33a] hover:text-[#121922] bg-[#86c33a]/15 hover:bg-[#86c33a] border-[#86c33a]/40 font-bold'
                  : 'text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/25'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>
          </div>

          <RecentSessionsList />
        </section>

        {/* Enterprise Inquiries & Supabase Live Forms Section */}
        <section className={`rounded-2xl border p-6 sm:p-8 mt-12 relative overflow-hidden backdrop-blur-xl ${
          isBexer
            ? 'bg-gradient-to-br from-[#18212e] via-[#151c27] to-[#1a2331] border-[#2d384b]'
            : 'bg-gradient-to-br from-[#0c0f24] via-[#090b1c] to-[#121633] border-white/10'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Enterprise Inquiry Pitch */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border flex items-center gap-1.5 font-bold ${
                  isBexer
                    ? 'bg-[#86c33a]/15 text-[#a3ec4c] border-[#86c33a]/30'
                    : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                }`}>
                  <Database className="w-3.5 h-3.5" />
                  Supabase Backend Live
                </span>
                <span className="text-xs text-zinc-400 font-mono">public.inquiries</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Scale Collaborative Engineering with DevSync Enterprise
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                Need private isolated AI model clusters, custom AST compliance rules, dedicated WebSocket relay mesh, or SSO authentication? Fill out an inquiry and our solutions architects will connect within 24 hours.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  variant={isBexer ? 'bexer' : 'primary'}
                  size="md"
                  onClick={() => setIsContactOpen(true)}
                  leftIcon={<Building2 className="w-4 h-4" />}
                >
                  Submit Enterprise Inquiry
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsFeedbackOpen(true)}
                  leftIcon={<MessageSquareHeart className="w-4 h-4" />}
                >
                  Share Feedback / Bug
                </Button>
              </div>
            </div>

            {/* Right: Newsletter / Early Access Form */}
            <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-3 shadow-xl ${
              isBexer ? 'bg-[#151c26]/90 border-[#2d384b]' : 'bg-[#080a15]/90 border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${
                  isBexer ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]' : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">DevSync Release Updates</h4>
                  <p className="text-[10px] text-zinc-400">Saved directly to Supabase newsletter_subscribers</p>
                </div>
              </div>

              {isSubscribed ? (
                <div className="py-4 text-center space-y-2">
                  <CheckCircle2 className={`w-8 h-8 mx-auto ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
                  <p className="text-xs text-zinc-200 font-semibold">You're on the priority list!</p>
                  <p className="text-[11px] text-zinc-400 font-mono">Record saved in Supabase database.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="engineer@company.com"
                      className={`w-full px-3 py-2 text-xs rounded-xl border bg-black/40 text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        isBexer ? 'border-[#2d384b] focus:border-[#86c33a]' : 'border-white/10 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  <Button
                    variant={isBexer ? 'bexer' : 'primary'}
                    size="sm"
                    type="submit"
                    isLoading={isSubscribing}
                    className="w-full justify-center"
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Subscribe to Developer Bulletins
                  </Button>
                </form>
              )}

              <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1">
                <span>⚡ Real-Time Postgres Sync</span>
                <span>🔒 Zero Spam Guarantee</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t backdrop-blur-md py-6 px-6 mt-16 text-center text-xs text-zinc-400 ${
        isBexer ? 'border-[#2d3748] bg-[#141b26]/90' : 'border-white/10 bg-[#080913]/90'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
              isBexer ? 'bg-[#86c33a] text-[#121922]' : 'bg-gradient-to-tr from-indigo-500 to-cyan-400'
            }`}>
              <Code2 className={`w-3.5 h-3.5 stroke-[2.5] ${isBexer ? 'text-[#121922]' : 'text-white'}`} />
            </div>
            <span className="font-semibold text-zinc-200">DevSync</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Next-Gen Real-Time Pair Programming & Autonomous AI Review</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsContactOpen(true)}
              className={`transition-colors ${isBexer ? 'hover:text-[#86c33a]' : 'hover:text-indigo-400'}`}
            >
              Enterprise Inquiry
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className={`transition-colors ${isBexer ? 'hover:text-[#86c33a]' : 'hover:text-indigo-400'}`}
            >
              Feedback & Bug Reports
            </button>
            <span className="text-zinc-700">•</span>
            <span className={`font-mono text-[11px] ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`}>
              Supabase DB: Active
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateRoomModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <JoinRoomModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <ContactInquiryModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};
