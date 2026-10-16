import { useState, useRef, useEffect } from 'react';
import { Match, Message } from '../App';
import { MessageCircle, Send, ArrowLeft, Sparkles, MoreVertical, Flag, Ban, UserMinus, X } from 'lucide-react';

interface MessagesViewProps {
  matches: Match[];
  isPremium: boolean;
}

const AI_REPLY_SUGGESTIONS = [
  "That sounds amazing! Tell me more 😊",
  "Haha I was thinking the same thing!",
  "Oh really? I'd love to try that too",
];

const SPONSORED_CHAT = {
  name: 'FPT Play',
  avatar: '🎬',
  preview: 'Premium subscription — 3 months free for FPT employees',
};

type SafetyAction = 'report' | 'block' | 'unmatch';

function SafetyMenu({ onAction, onClose }: { onAction: (a: SafetyAction) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card w-full max-w-sm rounded-t-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mt-4 mb-5" />
        {[
          { id: 'report' as SafetyAction, label: 'Report', icon: <Flag className="size-5" />, color: 'text-yellow-600' },
          { id: 'block' as SafetyAction, label: 'Block', icon: <Ban className="size-5" />, color: 'text-destructive' },
          { id: 'unmatch' as SafetyAction, label: 'Unmatch', icon: <UserMinus className="size-5" />, color: 'text-destructive' },
        ].map(action => (
          <button
            key={action.id}
            onClick={() => { onAction(action.id); onClose(); }}
            className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-muted transition-colors ${action.color}`}
          >
            {action.icon}
            <span className="font-semibold">{action.label}</span>
          </button>
        ))}
        <button onClick={onClose} className="w-full flex items-center justify-center gap-2 py-4 border-t border-border text-muted-foreground mb-safe">
          <X className="size-4" /> Cancel
        </button>
      </div>
    </div>
  );
}

function EmptyChatPrompt({ name, highlights }: { name: string; highlights: string[] }) {
  const starters = [
    `What's the best part about working at FPT for you?`,
    `I noticed you love ${highlights[1]?.toLowerCase() ?? 'hiking'} — best spot you've found nearby?`,
    `${name.split(' ')[0]} — genuine opener: what are you most excited about at work lately?`,
  ];
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 text-center py-8">
      <div className="mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F36F21] to-[#C9972B] flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold ring-2 ring-[#F36F21] ring-offset-2 ring-offset-card">
          {name[0]}
        </div>
        <h3 className="font-bold text-foreground mb-1">Say hi to {name.split(' ')[0]}</h3>
        <p className="text-muted-foreground text-xs">You just matched — be the first to reach out!</p>
      </div>
      <div className="w-full max-w-xs bg-[#FFF5EE] dark:bg-[#2A1F0F] rounded-2xl p-4 text-left">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="size-3.5 text-[#F36F21]" />
          <p className="text-[#F36F21] text-xs font-semibold">AI Conversation Starters</p>
        </div>
        <div className="space-y-2">
          {starters.map((s, i) => (
            <button key={i} className="w-full text-left p-3 bg-card rounded-xl border border-border hover:border-[#F36F21] transition-colors text-sm text-foreground leading-relaxed">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Chat list panel (shared between mobile and desktop)
function ChatList({ matches, isPremium, selectedMatch, onSelectMatch }: {
  matches: Match[]; isPremium: boolean; selectedMatch: Match | null;
  onSelectMatch: (m: Match) => void;
}) {
  const [adDismissed, setAdDismissed] = useState(false);
  return (
    <div className="h-full overflow-y-auto">
      {matches.length === 0 && (
        <div className="flex flex-col items-center justify-center px-8 text-center h-full min-h-[200px]">
          <MessageCircle className="size-14 text-muted-foreground/40 mb-4" />
          <h3 className="font-bold text-foreground text-lg mb-2">No chats yet</h3>
          <p className="text-muted-foreground text-sm">Match with someone to start talking!</p>
        </div>
      )}

      {matches.map((match, i) => (
        <button
          key={match.id}
          onClick={() => onSelectMatch(match)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left border-b border-border ${
            selectedMatch?.id === match.id
              ? 'bg-[#FFF5EE] dark:bg-[#2A1F0F]'
              : 'hover:bg-muted/50'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted">
              <img src={match.profile.photos[0]} alt={match.profile.name} className="w-full h-full object-cover" />
            </div>
            {i < 2 && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="font-semibold text-foreground text-sm truncate">{match.profile.name}</p>
              {i < 3 && <span className="w-2 h-2 bg-[#F36F21] rounded-full flex-shrink-0 ml-1" />}
            </div>
            <p className="text-muted-foreground text-xs truncate">
              {i === 0 ? "You just matched! Say hi 👋" : "Say hi to your new match!"}
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{match.profile.city}</p>
          </div>
        </button>
      ))}

      {!isPremium && !adDismissed && matches.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-muted/30">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF2FA] dark:bg-[#1A2E42] flex items-center justify-center text-xl flex-shrink-0">
            {SPONSORED_CHAT.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-semibold text-foreground text-sm">{SPONSORED_CHAT.name}</p>
              <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-semibold">AD</span>
            </div>
            <p className="text-muted-foreground text-xs truncate">{SPONSORED_CHAT.preview}</p>
          </div>
          <button onClick={() => setAdDismissed(true)} className="text-muted-foreground p-1 flex-shrink-0">
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Chat pane (shared between mobile and desktop)
function ChatPane({ match, onBack, showBack = true }: { match: Match; onBack: () => void; showBack?: boolean }) {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSafety, setShowSafety] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const t = text ?? messageText;
    if (!t.trim()) return;
    const msg: Message = { id: `m-${Date.now()}`, matchId: match.id, text: t, sentAt: new Date(), isMe: true };
    setMessages(prev => [...prev, msg]);
    setMessageText('');
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Haha yes! That's exactly how I feel 😄",
        "Oh interesting, I never thought about it that way.",
        "That sounds like a plan! When are you free?",
        "You know what, you're right about that 😊",
      ];
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`, matchId: match.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        sentAt: new Date(), isMe: false,
      }]);
    }, 2000 + Math.random() * 1000);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        {showBack && (
          <button onClick={onBack} className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          <img src={match.profile.photos[0]} alt={match.profile.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">{match.profile.name}</p>
          <p className="text-muted-foreground text-xs">{match.profile.city} · {match.profile.role}</p>
        </div>
        <button onClick={() => setShowSafety(true)} className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="size-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <EmptyChatPrompt name={match.profile.name} highlights={match.profile.highlights} />
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isMe ? 'bg-[#F36F21] text-white rounded-br-md' : 'bg-muted text-foreground rounded-bl-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* AI reply suggestions */}
      {messages.length > 0 && showAiSuggestions && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-border overflow-x-auto scrollbar-none flex-shrink-0">
          <Sparkles className="size-3.5 text-[#F36F21] flex-shrink-0" />
          {AI_REPLY_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap text-xs bg-muted hover:bg-[#FFF5EE] hover:text-[#F36F21] text-muted-foreground px-3 py-1.5 rounded-full transition-all flex-shrink-0 border border-border"
            >
              {s}
            </button>
          ))}
          <button onClick={() => setShowAiSuggestions(false)} className="flex-shrink-0 p-1 text-muted-foreground">
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card flex-shrink-0">
        <input
          type="text"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={`Message ${match.profile.name.split(' ')[0]}...`}
          className="flex-1 px-4 py-2.5 bg-muted rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F36F21]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!messageText.trim()}
          className="w-10 h-10 bg-[#F36F21] rounded-2xl flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
        >
          <Send className="size-4 text-white" />
        </button>
      </div>

      {showSafety && (
        <SafetyMenu
          onAction={(a) => { if (a === 'unmatch') onBack(); }}
          onClose={() => setShowSafety(false)}
        />
      )}
    </div>
  );
}

export function MessagesView({ matches, isPremium }: MessagesViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <>
      {/* ── Mobile: single-pane, navigate between list and chat ── */}
      <div className="lg:hidden h-full">
        {!selectedMatch ? (
          <ChatList
            matches={matches} isPremium={isPremium}
            selectedMatch={null} onSelectMatch={setSelectedMatch}
          />
        ) : (
          <ChatPane
            match={selectedMatch}
            onBack={() => setSelectedMatch(null)}
            showBack={true}
          />
        )}
      </div>

      {/* ── Desktop: split-pane always visible ── */}
      <div className="hidden lg:flex h-full">
        {/* Left: chat list */}
        <div className="w-72 flex-shrink-0 border-r border-border h-full overflow-hidden">
          {/* List header */}
          <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
            <p className="font-bold text-foreground text-sm">All Conversations</p>
            {matches.length > 0 && (
              <span className="text-xs bg-[#F36F21] text-white px-2 py-0.5 rounded-full font-semibold">{matches.length}</span>
            )}
          </div>
          <ChatList
            matches={matches} isPremium={isPremium}
            selectedMatch={selectedMatch} onSelectMatch={setSelectedMatch}
          />
        </div>

        {/* Right: chat pane or empty state */}
        <div className="flex-1 overflow-hidden">
          {selectedMatch ? (
            <ChatPane match={selectedMatch} onBack={() => setSelectedMatch(null)} showBack={false} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="size-10 text-muted-foreground/40" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">
                {matches.length === 0 ? 'No chats yet' : 'Select a conversation'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                {matches.length === 0
                  ? 'Go to Discover and swipe right to match with colleagues.'
                  : 'Choose a match from the sidebar to start chatting.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
