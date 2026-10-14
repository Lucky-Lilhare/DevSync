import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Button } from '../../common/Button';
import { 
  Send, 
  Code, 
  MessageSquare, 
  Terminal, 
  Mic, 
  MicOff, 
  Radio 
} from 'lucide-react';

export const LiveChatTab: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    isAudioCallActive, 
    toggleAudioCall,
    colorTheme
  } = useWorkspace();
  
  const isBexer = colorTheme === 'bexer-clean';
  const [inputText, setInputText] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText, isCodeMode);
    setInputText('');
    setIsCodeMode(false);
  };

  const handleInsertSampleSnippet = () => {
    setIsCodeMode(true);
    setInputText(`// Parameterized SQL query:\nconst query = "SELECT * FROM users WHERE role = $1";`);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
      isBexer ? 'bg-[#151c27]' : 'bg-[#080a15]'
    }`}>
      {/* Live Chat & Audio Header */}
      <div className={`p-3 border-b flex items-center justify-between flex-shrink-0 transition-colors ${
        isBexer ? 'bg-[#1a2331] border-[#252f3f]' : 'bg-[#0c0f20] border-white/10'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${
            isBexer ? 'bg-[#86c33a]/15 border-[#86c33a]/30 text-[#86c33a]' : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
          }`}>
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              Live Team Chat
            </h4>
            <p className="text-[11px] text-zinc-400 font-mono">WebRTC channel</p>
          </div>
        </div>

        <button
          onClick={handleInsertSampleSnippet}
          title="Share code snippet"
          className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-colors ${
            isBexer
              ? 'bg-[#1e2634] hover:bg-[#86c33a]/20 text-[#a3ec4c] border-[#2d384b]'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-indigo-300 border-white/10'
          }`}
        >
          <Code className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
          <span>+ Snippet</span>
        </button>
      </div>

      {/* Mic / Audio State Toggle Bar */}
      <div className={`p-2 px-3 border-b flex items-center justify-between text-xs transition-colors flex-shrink-0 ${
        isBexer ? 'bg-[#18212e] border-[#252f3f]' : 'bg-[#0a0d1e] border-white/10'
      }`}>
        <div className="flex items-center gap-2">
          {isAudioCallActive ? (
            <span className={`flex items-center gap-1.5 font-medium font-mono text-[11px] px-2 py-0.5 rounded-full border ${
              isBexer
                ? 'text-[#a3ec4c] bg-[#86c33a]/15 border-[#86c33a]/30'
                : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isBexer ? 'bg-[#86c33a]' : 'bg-emerald-400'}`} />
              <Radio className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-emerald-400'}`} />
              <span>Voice Live (3 peers)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span>Spatial Audio: Offline</span>
            </span>
          )}
        </div>

        {/* Audio / Mic Toggle Button */}
        <button
          type="button"
          onClick={toggleAudioCall}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
            isAudioCallActive
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
              : (isBexer
                  ? 'bg-[#86c33a]/15 hover:bg-[#86c33a]/25 text-[#a3ec4c] border-[#86c33a]/40'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border-indigo-500/35')
          }`}
        >
          {isAudioCallActive ? (
            <>
              <MicOff className="w-3 h-3 text-rose-400" />
              <span>Leave Audio</span>
            </>
          ) : (
            <>
              <Mic className={`w-3 h-3 ${isBexer ? 'text-[#86c33a]' : 'text-indigo-400'}`} />
              <span>Join Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {chatMessages.map((msg) => {
          const isSelf = msg.senderId === 'user-self';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isSelf ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-7 h-7 rounded-full border-2 object-cover flex-shrink-0 shadow-sm"
                style={{ borderColor: msg.senderColor }}
              />

              <div className={`max-w-[85%] space-y-1 ${isSelf ? 'items-end text-right' : ''}`}>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-semibold text-zinc-200" style={{ color: msg.senderColor }}>
                    {msg.senderName}
                  </span>
                  <span className="text-zinc-500 text-[10px] font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed text-left shadow-sm ${
                    isSelf
                      ? (isBexer
                          ? 'bg-[#1f2937] text-zinc-100 border border-[#86c33a]/40'
                          : 'bg-gradient-to-r from-indigo-950/70 to-purple-950/70 text-zinc-100 border border-indigo-500/40')
                      : (isBexer
                          ? 'bg-[#18212e] text-zinc-200 border border-[#2d384b]'
                          : 'bg-[#0f1325] text-zinc-200 border border-white/10')
                  }`}
                >
                  {msg.isCodeSnippet ? (
                    <div>
                      <div className={`text-[10px] font-mono pb-1 mb-1 border-b flex items-center gap-1 ${
                        isBexer ? 'text-[#86c33a] border-[#2d384b]' : 'text-cyan-400 border-white/10'
                      }`}>
                        <Terminal className="w-3 h-3" />
                        <span>Code Snippet</span>
                      </div>
                      <pre className={`font-mono text-[11px] p-2 rounded-lg border overflow-x-auto whitespace-pre-wrap ${
                        isBexer
                          ? 'bg-black/60 border-[#86c33a]/30 text-[#a3ec4c]'
                          : 'bg-black/60 border border-white/10 text-cyan-200'
                      }`}>
                        {msg.text}
                      </pre>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className={`p-2.5 border-t space-y-2 flex-shrink-0 transition-colors ${
          isBexer ? 'bg-[#18212e] border-[#252f3f]' : 'bg-[#0a0d1d] border-white/10'
        }`}
      >
        {isCodeMode && (
          <div className={`flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg border font-mono ${
            isBexer
              ? 'text-[#a3ec4c] bg-[#1e2634] border-[#86c33a]/40'
              : 'text-indigo-200 bg-indigo-950/40 border border-indigo-500/30'
          }`}>
            <span className="flex items-center gap-1.5">
              <Code className={`w-3.5 h-3.5 ${isBexer ? 'text-[#86c33a]' : 'text-cyan-400'}`} />
              Snippet mode enabled
            </span>
            <button
              type="button"
              onClick={() => setIsCodeMode(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCodeMode(!isCodeMode)}
            title="Toggle Code Snippet Mode"
            className={`p-2 rounded-lg border transition-colors ${
              isCodeMode
                ? (isBexer
                    ? 'bg-[#86c33a]/20 border-[#86c33a] text-[#86c33a]'
                    : 'bg-indigo-600/30 border-indigo-500/60 text-white')
                : (isBexer
                    ? 'bg-[#1e2634] border-[#2d384b] text-zinc-400 hover:text-white'
                    : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-zinc-200')
            }`}
          >
            <Code className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isCodeMode ? 'Paste or write code snippet...' : 'Message collaborators...'}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans transition-colors ${
              isBexer
                ? 'bg-[#141b26] border border-[#2d384b] focus:border-[#86c33a]'
                : 'bg-white/[0.04] border border-white/10 focus:border-indigo-400/60'
            }`}
          />

          <Button
            type="submit"
            variant={isBexer ? 'bexer' : 'primary'}
            size="sm"
            disabled={!inputText.trim()}
            leftIcon={<Send className="w-3 h-3" />}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

