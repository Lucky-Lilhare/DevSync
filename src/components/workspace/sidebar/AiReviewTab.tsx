import React, { useState } from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { 
  Sparkles, 
  Check, 
  Send, 
  Bot, 
  User, 
  Wand2, 
  RefreshCw,
  HelpCircle 
} from 'lucide-react';

export const AiReviewTab: React.FC = () => {
  const { 
    aiReviews, 
    applyAiFix, 
    runAiScan, 
    isAiScanning, 
    activeFile,
    colorTheme
  } = useWorkspace();

  const isBexer = colorTheme === 'bexer-clean';
  const [aiPrompt, setAiPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string; code?: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am DevSync AI Guardian. I've analyzed ${activeFile?.name || 'your workspace'}. I detected a critical SQL injection vulnerability in index.js and an unused variable warning in App.jsx.`
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const unappliedCount = aiReviews.filter((r) => !r.applied).length;
  const appliedCount = aiReviews.filter((r) => r.applied).length;
  const healthScore = Math.min(100, 75 + appliedCount * 12);

  const handleSendPrompt = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || aiPrompt).trim();
    if (!query) return;

    setChatHistory((prev) => [...prev, { sender: 'user', text: query }]);
    setAiPrompt('');
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponse = '';
      let codeSnippet: string | undefined = undefined;

      if (query.toLowerCase().includes('sql') || query.toLowerCase().includes('injection')) {
        aiResponse = `SQL Injection Explanation (Line 14 in index.js):\nThe query string concatenates req.query.role directly. An attacker can pass "admin' OR '1'='1" to bypass authentication and dump the entire users table.\n\nFix: Replace string concatenation with parameterized tokens ($1) and pass [role] as a query parameter array.`;
        codeSnippet = `const query = "SELECT id, username, email, role FROM users WHERE role = $1 AND active = true";\nconst result = await dbPool.query(query, [role]);`;
      } else if (query.toLowerCase().includes('unused') || query.toLowerCase().includes('variable')) {
        aiResponse = `Unused Variable Warning:\nVariable 'unusedDebugPayload' is allocated in memory but never read or evaluated in App.jsx. Removing it eliminates dead code and optimizes component render performance.`;
      } else if (query.toLowerCase().includes('test') || query.toLowerCase().includes('jest')) {
        aiResponse = `Here is a complete Jest / Vitest test suite for ${activeFile?.name}:`;
        codeSnippet = `describe('User Search API', () => {\n  it('should escape malicious role parameters safely', async () => {\n    const res = await request(app).get('/api/users/search?role=dev');\n    expect(res.status).toBe(200);\n  });\n});`;
      } else {
        aiResponse = `I've analyzed your request regarding "${query}". The code conforms to modern security standards once the parameterized queries are applied.`;
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse, code: codeSnippet }]);
      setIsAiThinking(false);
    }, 700);
  };

  const quickPrompts = [
    'Explain SQL injection risk',
    'Generate unit tests',
    'Check memory leaks'
  ];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
      isBexer ? 'bg-[#151c27]' : 'bg-[#080a15]'
    }`}>
      {/* Top Health & Summary Header */}
      <div className={`p-3.5 border-b flex-shrink-0 transition-colors ${
        isBexer ? 'border-[#252f3f] bg-[#1a2331]' : 'border-white/10 bg-[#0c0f20]'
      }`}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border ${
              isBexer ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]' : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
            }`}>
              <Sparkles className={`w-4 h-4 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                AI Review & Diagnostics
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">AST vulnerability scanner</p>
            </div>
          </div>

          <Button
            variant={isBexer ? 'lime' : 'outline'}
            size="xs"
            onClick={runAiScan}
            isLoading={isAiScanning}
            leftIcon={<RefreshCw className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />}
          >
            Scan Now
          </Button>
        </div>

        {/* Code Health Metric Card with Glowing Gradient */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between shadow-sm ${
          isBexer
            ? 'bg-[#1e2634] border-[#2d384b]'
            : 'bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 border-indigo-500/30'
        }`}>
          <div>
            <div className={`text-[11px] font-semibold ${isBexer ? 'text-[#a3ec4c]' : 'text-indigo-300'}`}>Workspace Health Score</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-lg font-bold font-mono ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`}>{healthScore}/100</span>
              <span className="text-[11px] text-zinc-400">
                {unappliedCount === 0 ? 'All clean' : `${unappliedCount} alerts pending`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
              1 Crit
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
              1 Warn
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Center: Review Items & AI Chat */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* Review Items Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isBexer ? 'text-[#86c33a]' : 'text-indigo-300'
            }`}>
              Diagnostic Alerts ({aiReviews.length})
            </span>
            <span className={`text-[10px] font-mono ${isBexer ? 'text-[#a3ec4c]' : 'text-cyan-400'}`}>AST Engine Active</span>
          </div>

          {aiReviews.map((review) => {
            const isApplied = review.applied;
            const severityBadge = {
              critical: 'rose' as const,
              warning: 'amber' as const,
              info: 'cyan' as const,
            }[review.severity];

            return (
              <div
                key={review.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isApplied
                    ? (isBexer ? 'border-[#2d384b] bg-[#1a2331]/50 opacity-60' : 'border-white/10 bg-white/[0.02] opacity-60')
                    : (isBexer
                        ? 'border-[#2d384b] bg-[#1e2634] hover:border-[#86c33a]/50 shadow-md'
                        : 'border-indigo-500/30 bg-[#0e1224]/80 hover:border-indigo-400/50 shadow-md')
                }`}
              >
                {/* Header: Title, Severity, Line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant={severityBadge} size="sm">
                      {review.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-semibold text-zinc-100">{review.title}</span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex-shrink-0 ${
                    isBexer
                      ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                      : 'text-indigo-300 bg-indigo-950/60 border-indigo-500/30'
                  }`}>
                    Line {review.lineNumber}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {review.description}
                </p>

                {/* Diff Preview */}
                <div className={`mt-2.5 rounded-lg border p-2 text-[11px] font-mono overflow-x-auto space-y-1 ${
                  isBexer ? 'border-[#2d384b] bg-[#141b26]' : 'border-white/10 bg-[#060812]'
                }`}>
                  <div className="text-rose-300 bg-rose-500/15 px-2 py-1 rounded flex items-center gap-1.5">
                    <span className="select-none font-bold text-rose-400">-</span>
                    <span className="truncate">{review.originalSnippet.split('\n')[0]}</span>
                  </div>
                  <div className="text-emerald-300 bg-emerald-500/15 px-2 py-1 rounded flex items-center gap-1.5">
                    <span className="select-none font-bold text-emerald-400">+</span>
                    <span className="truncate">{review.suggestedSnippet.split('\n')[0]}</span>
                  </div>
                </div>

                {/* Fix Explanation & Actions */}
                <div className={`mt-3 flex items-center justify-between gap-2 pt-2 border-t ${
                  isBexer ? 'border-[#2d384b]' : 'border-white/10'
                }`}>
                  <span className="text-[10px] text-zinc-400 truncate max-w-[130px]">
                    {review.explanation}
                  </span>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSendPrompt(undefined, `Explain bug: ${review.title}`)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 border ${
                        isBexer
                          ? 'text-zinc-300 hover:text-white bg-[#141b26] hover:bg-[#1f2937] border-[#2d384b]'
                          : 'text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                      }`}
                    >
                      <HelpCircle className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                      <span>Explain Bug</span>
                    </button>

                    {isApplied ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                        isBexer
                          ? 'text-[#a3ec4c] bg-[#86c33a]/20 border-[#86c33a]/40 font-bold'
                          : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                      }`}>
                        <Check className="w-3 h-3" />
                        Applied
                      </span>
                    ) : (
                      <Button
                        variant={isBexer ? 'bexer' : 'primary'}
                        size="xs"
                        onClick={() => applyAiFix(review.id)}
                        leftIcon={<Wand2 className="w-3 h-3" />}
                      >
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Interactive Chat Section */}
        <div className={`pt-3 border-t space-y-2.5 ${isBexer ? 'border-[#2d384b]' : 'border-white/10'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isBexer ? 'text-[#86c33a]' : 'text-indigo-300'
            }`}>
              <Bot className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
              Ask AI Reviewer
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">{activeFile?.name}</span>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(undefined, qp)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                  isBexer
                    ? 'bg-[#1e2634] hover:bg-[#86c33a]/20 border-[#2d384b] hover:border-[#86c33a]/50 text-zinc-200'
                    : 'bg-indigo-950/30 hover:bg-indigo-900/40 border-indigo-500/25 text-indigo-200 hover:text-white'
                }`}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat bubbles */}
          <div className="space-y-2">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? (isBexer
                        ? 'bg-[#1f2937] border border-[#86c33a]/40 text-zinc-100 ml-4 shadow-sm'
                        : 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 text-zinc-100 ml-4 shadow-sm')
                    : (isBexer
                        ? 'bg-[#18212e] border border-[#2d384b] text-zinc-200 mr-2 shadow-sm'
                        : 'bg-[#0e1224] border border-white/10 text-zinc-200 mr-2 shadow-sm')
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 font-semibold text-[11px]">
                  {msg.sender === 'user' ? (
                    <>
                      <User className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
                      <span className={isBexer ? 'text-[#a3ec4c]' : 'text-cyan-200'}>You</span>
                    </>
                  ) : (
                    <>
                      <Bot className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
                      <span className={isBexer ? 'text-zinc-200' : 'text-indigo-200'}>DevSync AI Guardian</span>
                    </>
                  )}
                </div>
                <p className="whitespace-pre-line text-zinc-200">{msg.text}</p>
                {msg.code && (
                  <pre className={`mt-2 p-2 rounded-lg font-mono text-[10px] overflow-x-auto ${
                    isBexer
                      ? 'bg-black/60 border border-[#86c33a]/30 text-[#a3ec4c]'
                      : 'bg-black/60 border border-indigo-500/25 text-cyan-200'
                  }`}>
                    {msg.code}
                  </pre>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                isBexer
                  ? 'bg-[#1b2331] border-[#86c33a]/30 text-[#a3ec4c]'
                  : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 animate-spin ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
                <span>DevSync AI is analyzing AST...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Chat Input */}
      <form
        onSubmit={handleSendPrompt}
        className={`p-2.5 border-t flex items-center gap-2 flex-shrink-0 transition-colors ${
          isBexer ? 'border-[#252f3f] bg-[#18212e]' : 'border-white/10 bg-[#0a0d1d]'
        }`}
      >
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder={`Ask about ${activeFile?.name || 'this file'}...`}
          className={`flex-1 px-3 py-1.5 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors ${
            isBexer
              ? 'bg-[#141b26] border border-[#2d384b] focus:border-[#86c33a]'
              : 'bg-white/[0.04] border border-white/10 focus:border-indigo-400/60'
          }`}
        />
        <Button
          type="submit"
          variant={isBexer ? 'bexer' : 'primary'}
          size="sm"
          disabled={!aiPrompt.trim() || isAiThinking}
          leftIcon={<Send className="w-3 h-3" />}
        >
          Ask
        </Button>
      </form>
    </div>
  );
};
