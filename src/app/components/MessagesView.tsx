import { useState, useRef, useEffect } from 'react';
import { Match, Message } from '../App';
import {
  MessageCircle, Send, ArrowLeft, Sparkles, MoreVertical, Flag, Ban,
  UserMinus, X, Brain, MapPin, Gamepad2, ChevronRight,
  Star, RotateCcw, Navigation, Clock, Settings, HelpCircle, Users,
  Play, Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MessagesViewProps {
  matches: Match[];
  isPremium: boolean;
}

type SafetyAction = 'report' | 'block' | 'unmatch';
type AiTab = 'soul' | 'quansu' | 'dates' | 'games';

// ── Game message type ─────────────────────────────────────────────────────────
type GameChatMsg = {
  id: string;
  matchId: string;
  type: 'game';
  gameId: GameId;
  gameName: string;
  gameEmoji: string;
  gradientFrom: string;
  gradientTo: string;
  bgPattern: string;
  isMe: boolean;
  sentAt: Date;
};
type ChatMsg = (Message & { type?: undefined }) | GameChatMsg;

// ── per-profile AI data ───────────────────────────────────────────────────────
function getProfileAI(profile: Match['profile']) {
  const seed = profile.id.charCodeAt(0) % 4;
  const MBTI_TYPES = ['ENFP', 'INTJ', 'ISFJ', 'ENTP'];
  const LOVE_LANGS = ['Words of Affirmation', 'Quality Time', 'Acts of Service', 'Gift Giving'];
  const VIBES = [
    ['🌅 Early bird', '📚 Bookworm', '🍵 Tea person', '🎯 Goal-oriented'],
    ['🌙 Night owl', '🎮 Gamer', '☕ Coffee addict', '🧘 Mindful'],
    ['🏃 Active', '🍳 Home cook', '📷 Photographer', '🌿 Plant parent'],
    ['✈️ Wanderlust', '🎸 Music lover', '🤝 Connector', '💡 Idea person'],
  ];
  const CONVO_STYLES = ['Thoughtful & deep', 'Playful & witty', 'Warm & caring', 'Direct & curious'];
  const TOPICS = [
    ['FPT culture', 'side projects', 'travel in SEA', 'book recommendations'],
    ['gaming', 'tech news', 'café hopping', 'late-night ramen'],
    ['cooking experiments', 'weekend hiking', 'family stories', 'health tips'],
    ['startup ideas', 'live music', 'food tours', 'global nomad life'],
  ];
  return {
    mbti: MBTI_TYPES[seed],
    loveLanguage: LOVE_LANGS[seed],
    vibes: VIBES[seed],
    convoStyle: CONVO_STYLES[seed],
    topics: TOPICS[seed],
    compatibility: profile.compatibilityScore,
    traits: [
      { label: 'Openness', val: 65 + seed * 8 },
      { label: 'Energy', val: 72 - seed * 5 },
      { label: 'Empathy', val: 80 + seed * 3 },
      { label: 'Humor', val: 60 + seed * 7 },
    ],
  };
}

type PlaceCategory = 'all' | 'café' | 'restaurant' | 'activity' | 'nightlife';

const DATE_PLACES = [
  {
    cat: 'café' as PlaceCategory,
    name: 'The Workshop Coffee',
    type: 'Specialty Coffee',
    address: '27 Ngô Đức Kế, Bến Nghé, Q.1',
    district: 'District 1',
    rating: 4.7,
    reviewCount: 2841,
    price: '₫₫',
    open: true,
    hours: 'Open · Closes 11 PM',
    distance: '1.2 km',
    photo: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&q=70',
    tags: ['Pour-over', 'Great ambiance', 'Work-friendly'],
    review: '"Beautiful high-ceiling space. Perfect for long conversations over specialty coffee."',
    why: 'Both of you flagged café-hopping. Industrial chic vibes.',
  },
  {
    cat: 'restaurant' as PlaceCategory,
    name: 'Cục Gạch Quán',
    type: 'Vietnamese Home Cooking',
    address: '10 Đặng Tất, Tân Định, Q.1',
    district: 'District 1',
    rating: 4.6,
    reviewCount: 1203,
    price: '₫₫₫',
    open: true,
    hours: 'Open · Closes 10 PM',
    distance: '2.0 km',
    photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=70',
    tags: ['Garden seating', 'Authentic', 'Date-friendly'],
    review: '"Rustic garden feel, shared dishes — zero pretension, great food."',
    why: "Relaxed pacing — perfect for a first date that doesn't feel like one.",
  },
  {
    cat: 'nightlife' as PlaceCategory,
    name: 'Broma: Not a Bar',
    type: 'Cocktail Bar · Live Music',
    address: '41 Nguyễn Huệ, Bến Nghé, Q.1',
    district: 'District 1',
    rating: 4.5,
    reviewCount: 876,
    price: '₫₫',
    open: false,
    hours: 'Closed · Opens 6 PM',
    distance: '1.5 km',
    photo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&q=70',
    tags: ['Live music Fri–Sat', 'Craft cocktails', 'Rooftop'],
    review: '"Easy to talk between sets. Great craft drinks, never stuffy."',
    why: 'Shared music interest. Natural conversation between sets — no awkward silences.',
  },
  {
    cat: 'activity' as PlaceCategory,
    name: 'Saigon Escape Room',
    type: 'Escape Room · Team Activity',
    address: '78 Lê Lai, Bến Thành, Q.1',
    district: 'District 1',
    rating: 4.8,
    reviewCount: 512,
    price: '₫₫',
    open: true,
    hours: 'Open · Closes 10 PM',
    distance: '0.9 km',
    photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=70',
    tags: ['Team play', 'Adrenaline', 'Unique'],
    review: '"Nothing breaks the ice faster. You learn a lot about someone under pressure!"',
    why: 'You both scored high on "adventures". Escape rooms reveal personality fast.',
  },
  {
    cat: 'nightlife' as PlaceCategory,
    name: 'Landmark 81 SkyBar',
    type: 'Rooftop Bar',
    address: '461 Điện Biên Phủ, Bình Thạnh',
    district: 'Bình Thạnh',
    rating: 4.4,
    reviewCount: 3290,
    price: '₫₫₫',
    open: true,
    hours: 'Open · Closes 12 AM',
    distance: '3.1 km',
    photo: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=200&q=70',
    tags: ['City views', 'Sunset', 'Impressive'],
    review: '"Breathtaking view. Worth the price — sunset timing is perfect."',
    why: 'Impressive without being stuffy. Sunset drinks give you a natural end time.',
  },
  {
    cat: 'café' as PlaceCategory,
    name: 'Cellar Door',
    type: 'Wine Bar & Coffee',
    address: '79/14C Đặng Văn Ngữ, Phú Nhuận',
    district: 'Phú Nhuận',
    rating: 4.9,
    reviewCount: 398,
    price: '₫₫₫',
    open: true,
    hours: 'Open · Closes 11 PM',
    distance: '2.8 km',
    photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=70',
    tags: ['Hidden gem', 'Intimate', 'Natural wine'],
    review: '"Hidden gem. Tiny and intimate — feels like a secret only locals know."',
    why: "Hidden gem energy. Great if you want to feel like you're both in on something.",
  },
];

// Quân sư suggestion packs
function getQuantSuTips(profile: Match['profile'], msgCount: number) {
  const name = profile.name.split(' ')[0];
  if (msgCount === 0) return [
    { icon: '👋', label: 'Break the ice', text: `"Hey ${name}! Love that you're also at Ftown — have you tried the new pho spot near gate 3?"` },
    { icon: '🎯', label: 'Shared ground', text: `"I saw you're into ${profile.highlights[0]?.toLowerCase() ?? 'hiking'} — totally my thing too. What got you started?"` },
    { icon: '😄', label: 'Light & playful', text: `"Okay real question: Ftown canteen option A or option B? This is the trust test 😄"` },
  ];
  if (msgCount < 4) return [
    { icon: '📖', label: 'Go deeper', text: `"What part of your work at FPT do you actually love? Not the job-description part, the real part."` },
    { icon: '🗺️', label: 'Future plan', text: `"If you could work from any FPT office globally for a month, where would you pick?"` },
    { icon: '😂', label: 'Keep it light', text: `"Be honest — do you actually use all the FPT internal apps or just Fsoul? 😂"` },
  ];
  return [
    { icon: '☕', label: 'Suggest meeting', text: `"We should grab coffee sometime — there's this tiny café near the office you'd probably love."` },
    { icon: '🎮', label: 'Try a game', text: 'Send them a "This or That" game — tap Games below!' },
    { icon: '💡', label: 'Compliment real', text: `"Random but I like that you actually have opinions about things. Most people just say whatever."` },
  ];
}

// ── Instant Games data ────────────────────────────────────────────────────────
type GameId = 'wyr' | 'tot' | 'emoji' | 'trivia' | 'draw'
  | 'words' | 'pool' | 'basketball' | 'gofish' | 'songpop'
  | 'minigolf' | 'quiz' | 'chess' | 'yatzy' | 'kittens';

type InstantGame = {
  id: GameId;
  emoji: string;
  name: string;
  players: string;
  cat: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  bgPattern: string;
  coverBg: string;
  coverTitle: string;
  coverSub: string;
};

const INSTANT_GAMES: InstantGame[] = [
  { id: 'wyr',        emoji: '🤔', name: 'Would You Rather',   players: '2P', cat: 'Social',
    color: 'from-violet-500 to-purple-600', gradientFrom: '#7c3aed', gradientTo: '#4c1d95', bgPattern: '🃏',
    coverBg: 'linear-gradient(145deg,#7c3aed,#db2777)', coverTitle: 'WOULD YOU', coverSub: 'RATHER?' },
  { id: 'tot',        emoji: '⚡',  name: 'This or That',       players: '2P', cat: 'Social',
    color: 'from-amber-400 to-orange-500', gradientFrom: '#f59e0b', gradientTo: '#b45309', bgPattern: '⚡',
    coverBg: 'linear-gradient(145deg,#f59e0b,#f97316)', coverTitle: 'THIS OR', coverSub: 'THAT' },
  { id: 'emoji',      emoji: '🎭', name: 'Emoji Quiz',          players: '2P', cat: 'Brain',
    color: 'from-pink-500 to-rose-600', gradientFrom: '#ec4899', gradientTo: '#9f1239', bgPattern: '🎭',
    coverBg: 'linear-gradient(145deg,#ec4899,#8b5cf6)', coverTitle: 'EMOJI', coverSub: 'QUIZ' },
  { id: 'trivia',     emoji: '🧠', name: 'FPT Trivia',          players: '2P', cat: 'Brain',
    color: 'from-cyan-500 to-blue-600', gradientFrom: '#0891b2', gradientTo: '#1e3a8a', bgPattern: '❓',
    coverBg: 'linear-gradient(145deg,#0891b2,#1e40af)', coverTitle: 'FPT', coverSub: 'TRIVIA' },
  { id: 'draw',       emoji: '✏️', name: 'Quick Draw',          players: '2P', cat: 'Creative',
    color: 'from-green-500 to-emerald-600', gradientFrom: '#16a34a', gradientTo: '#14532d', bgPattern: '✏️',
    coverBg: 'linear-gradient(145deg,#16a34a,#0d9488)', coverTitle: 'QUICK', coverSub: 'DRAW' },
  { id: 'words',      emoji: '🔡', name: 'Words with Friends',  players: '2P', cat: 'Brain',
    color: 'from-blue-600 to-teal-700', gradientFrom: '#1e3a5f', gradientTo: '#1b6b3a', bgPattern: '🔡',
    coverBg: 'linear-gradient(145deg,#1d3461,#1a5c2e)', coverTitle: 'WORDS', coverSub: 'with friends' },
  { id: 'pool',       emoji: '🎱', name: '8 Ball Pool',         players: '2P', cat: 'Sport',
    color: 'from-green-800 to-green-950', gradientFrom: '#14532d', gradientTo: '#052e16', bgPattern: '🎱',
    coverBg: 'linear-gradient(145deg,#14532d,#1a3a1a)', coverTitle: '8 BALL', coverSub: 'POOL' },
  { id: 'basketball', emoji: '🏀', name: 'Basketball FRVR',     players: '2P', cat: 'Sport',
    color: 'from-orange-500 to-red-700', gradientFrom: '#c45c12', gradientTo: '#7c1a04', bgPattern: '🏀',
    coverBg: 'linear-gradient(145deg,#c45c12,#7c1a04)', coverTitle: 'BASKETBALL', coverSub: 'FRVR' },
  { id: 'gofish',     emoji: '🐟', name: 'Go Fish',             players: '2–4P', cat: 'Social',
    color: 'from-cyan-500 to-blue-700', gradientFrom: '#0891b2', gradientTo: '#1d4ed8', bgPattern: '🐟',
    coverBg: 'linear-gradient(145deg,#0e7490,#1d4ed8)', coverTitle: 'GO', coverSub: 'FISH' },
  { id: 'songpop',    emoji: '🎵', name: 'SongPop GO',          players: '2P', cat: 'Music',
    color: 'from-purple-600 to-pink-700', gradientFrom: '#7c3aed', gradientTo: '#be185d', bgPattern: '🎵',
    coverBg: 'linear-gradient(145deg,#6d28d9,#be185d)', coverTitle: 'SONG', coverSub: 'POP GO' },
  { id: 'minigolf',   emoji: '⛳', name: 'Mini Golf FRVR',      players: '2P', cat: 'Sport',
    color: 'from-green-500 to-lime-600', gradientFrom: '#15803d', gradientTo: '#4d7c0f', bgPattern: '⛳',
    coverBg: 'linear-gradient(145deg,#15803d,#4d7c0f)', coverTitle: 'MINI', coverSub: 'GOLF FRVR' },
  { id: 'quiz',       emoji: '🪐', name: 'Quiz Planet',         players: '2P', cat: 'Brain',
    color: 'from-indigo-900 to-slate-900', gradientFrom: '#1e1b4b', gradientTo: '#0f172a', bgPattern: '🪐',
    coverBg: 'linear-gradient(145deg,#1e1b4b,#312e81)', coverTitle: 'QUIZ', coverSub: 'PLANET' },
  { id: 'chess',      emoji: '♟️', name: 'Chess Quest',         players: '2P', cat: 'Strategy',
    color: 'from-slate-700 to-slate-900', gradientFrom: '#334155', gradientTo: '#0f172a', bgPattern: '♟️',
    coverBg: 'linear-gradient(145deg,#1e293b,#334155)', coverTitle: 'CHESS', coverSub: 'QUEST' },
  { id: 'yatzy',      emoji: '🎲', name: 'Yatzy FRVR',          players: '2P', cat: 'Strategy',
    color: 'from-yellow-500 to-amber-700', gradientFrom: '#d97706', gradientTo: '#92400e', bgPattern: '🎲',
    coverBg: 'linear-gradient(145deg,#d97706,#92400e)', coverTitle: 'YATZY', coverSub: 'FRVR' },
  { id: 'kittens',    emoji: '💥', name: 'Exploding Kittens',   players: '2–5P', cat: 'Social',
    color: 'from-red-600 to-rose-900', gradientFrom: '#dc2626', gradientTo: '#881337', bgPattern: '🐱',
    coverBg: 'linear-gradient(145deg,#dc2626,#7c2d12)', coverTitle: 'EXPLODING', coverSub: 'KITTENS 🐱' },
];

const TRIVIA_Q = [
  { q: 'In what year was FPT Corporation founded?', a: '1988', opts: ['1985', '1988', '1992', '1996'] },
  { q: 'FPT stands for?', a: 'Financing & Promoting Technology', opts: ['Future Process Tech', 'Financing & Promoting Technology', 'Fast Productive Team', 'Forward Progress Technology'] },
  { q: 'How many countries does FPT Software operate in?', a: '30+', opts: ['15+', '20+', '30+', '50+'] },
  { q: 'What is Ftown campus located near?', a: 'Thu Duc City (D9)', opts: ['District 7', 'Thu Duc City (D9)', 'Go Vap', 'Binh Thanh'] },
];

const WOULD_YOU_RATHER = [
  { a: 'Work from home forever', b: 'Always go to the office' },
  { a: 'Only eat pho for a year', b: 'Only eat banh mi for a year' },
  { a: 'Travel solo', b: 'Always travel with someone' },
  { a: 'Early morning shift', b: 'Late night shift' },
  { a: 'Perfect memory', b: 'Perfect imagination' },
];
const THIS_OR_THAT = [
  { a: '☕ Coffee', b: '🍵 Tea' },
  { a: '🌅 Sunrise', b: '🌙 Sunset' },
  { a: '🎵 Headphones in', b: '🔊 Music out loud' },
  { a: '🏖️ Beach', b: '🏔️ Mountains' },
  { a: '📚 Read', b: '🎬 Watch' },
];
const EMOJI_QUIZ = [
  { emoji: '🍜🇻🇳💕', answer: 'Pho love' },
  { emoji: '☕😴🙏', answer: 'Coffee addict' },
  { emoji: '🏢💻🔥', answer: 'Hustle culture' },
  { emoji: '🌙🎵🥂', answer: 'Night out' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className="size-3"
          fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          stroke={i <= Math.round(rating) ? '#F59E0B' : 'currentColor'}
        />
      ))}
    </div>
  );
}

function GamePanel({ onSendGameInvite, matchName }: { onSendGameInvite: (g: InstantGame) => void; matchName: string }) {
  const [navTab, setNavTab] = useState<'play' | 'watch' | 'share'>('play');

  return (
    <div className="flex flex-col rounded-xl overflow-hidden" style={{ background: '#1c1c1e', minHeight: '100%' }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 text-center">
        <p className="text-white text-xl font-black tracking-tight">Cùng chơi 🎮</p>
        <p className="text-[10px] mt-1" style={{ color: '#8e8e93' }}>
          Mời {matchName} chơi game ngay trong chat!
        </p>
      </div>

      {/* 3-column game grid */}
      <div className="px-3 pb-2">
        <div className="grid grid-cols-3 gap-2">
          {INSTANT_GAMES.map(g => (
            <button
              key={g.id}
              onClick={() => onSendGameInvite(g)}
              className="flex flex-col gap-1 group text-left"
            >
              {/* Cover art tile */}
              <div
                className="w-full rounded-2xl overflow-hidden relative flex flex-col items-center justify-center shadow-lg group-active:scale-95 transition-transform"
                style={{ background: g.coverBg, aspectRatio: '4/5' }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-[0.06] text-[32px] flex flex-wrap gap-2 overflow-hidden pointer-events-none select-none leading-none p-1">
                  {Array(12).fill(g.bgPattern).join('')}
                </div>
                {/* Main emoji */}
                <span className="relative text-4xl drop-shadow-lg z-10">{g.emoji}</span>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 pt-4 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                  <p className="text-white text-[9px] font-black leading-tight text-center tracking-wide">{g.coverTitle}</p>
                  <p className="text-[8px] font-medium leading-tight text-center" style={{ color: 'rgba(255,255,255,0.65)' }}>{g.coverSub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom tab bar — iOS Messenger style */}
      <div className="flex border-t mt-2" style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#1c1c1e' }}>
        {([
          { id: 'play' as const, icon: '▶', label: 'Chơi' },
          { id: 'watch' as const, icon: '👁', label: 'Xem' },
          { id: 'share' as const, icon: '↑', label: 'Chia sẻ' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setNavTab(tab.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-semibold transition-colors"
            style={{ color: navTab === tab.id ? '#0a84ff' : '#8e8e93' }}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // game screens render as GameShellCard inside the chat thread
  /* START_DEAD_BLOCK
  const GameHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => setActiveGame(null)}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
      >
        <ArrowLeft className="size-4 text-muted-foreground" />
      </button>
      <p className="text-sm font-bold text-foreground">{title}</p>
      <button
        onClick={resetGame}
        className="ml-auto w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
      >
        <RotateCcw className="size-3.5 text-muted-foreground" />
      </button>
    </div>
  );

  if (activeGame === 'wyr') {
    const q = WOULD_YOU_RATHER[idx % WOULD_YOU_RATHER.length];
    return (
      <div>
        <GameHeader title="Would You Rather?" />
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            🤔 Pick one, then ask {matchName}!
          </div>
        </div>
        <div className="space-y-2.5 mb-4">
          {[{ label: q.a, side: 'A', emoji: '🅰️' }, { label: q.b, side: 'B', emoji: '🅱️' }].map(opt => (
            <button
              key={opt.side}
              onClick={() => setPicked(opt.side)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                picked === opt.side
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 scale-[1.02]'
                  : 'border-border hover:border-violet-300 text-foreground'
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
        {picked && (
          <div className="space-y-2">
            <button
              onClick={() => { onSendGame(`🤔 Would You Rather?\n\n🅰️ ${q.a}\n🅱️ ${q.b}\n\nI'm going with ${picked === 'A' ? '🅰️ ' + q.a : '🅱️ ' + q.b} — what about you? 😄`); }}
              className="w-full py-3 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-bold transition-colors"
            >
              Challenge {matchName} in chat 💬
            </button>
            <button onClick={() => { setIdx(i => i + 1); setPicked(null); }} className="w-full py-2.5 rounded-2xl border border-border text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-muted">
              <RotateCcw className="size-3.5" /> Next question
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeGame === 'tot') {
    const q = THIS_OR_THAT[idx % THIS_OR_THAT.length];
    return (
      <div>
        <GameHeader title="This or That" />
        <p className="text-xs text-muted-foreground text-center mb-4">Fast picks — see if you match!</p>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-1/2 w-px bg-border -translate-x-1/2 z-0" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-card border-2 border-border w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-muted-foreground">OR</span>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: q.a, side: 'A' }, { label: q.b, side: 'B' }].map(opt => (
              <button
                key={opt.side}
                onClick={() => setPicked(opt.side)}
                className={`py-8 rounded-2xl border-2 text-lg font-black text-center transition-all ${
                  picked === opt.side
                    ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F] scale-105 shadow-lg'
                    : 'border-border hover:border-[#F36F21]/40 hover:bg-muted/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {picked && (
          <div className="space-y-2">
            <button
              onClick={() => onSendGame(`⚡ This or That!\n\n${q.a}   vs   ${q.b}\n\nI picked ${picked === 'A' ? q.a : q.b} — which are you? 👀`)}
              className="w-full py-3 rounded-2xl bg-[#F36F21] text-white text-sm font-bold"
            >
              Send to {matchName} 💬
            </button>
            <button onClick={() => { setIdx(i => i + 1); setPicked(null); }} className="w-full py-2.5 rounded-2xl border border-border text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-muted">
              <RotateCcw className="size-3.5" /> Next round
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeGame === 'emoji') {
    const q = EMOJI_QUIZ[idx % EMOJI_QUIZ.length];
    return (
      <div>
        <GameHeader title="Emoji Quiz" />
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-200 dark:border-pink-800 rounded-2xl py-8 text-center mb-4">
          <p className="text-5xl mb-2">{q.emoji}</p>
          <p className="text-xs text-muted-foreground">What phrase is this?</p>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text" value={emojiGuess}
            onChange={e => setEmojiGuess(e.target.value)}
            placeholder="Type your guess..."
            className="flex-1 px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={() => setEmojiGuessed(true)}
            disabled={!emojiGuess.trim()}
            className="px-4 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-colors"
          >
            Guess
          </button>
        </div>
        {emojiGuessed && (
          <div className="space-y-2">
            <div className="bg-muted rounded-xl px-4 py-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Answer</p>
              <p className="text-base font-bold text-foreground">{q.answer}</p>
            </div>
            <button
              onClick={() => onSendGame(`🎭 Emoji Quiz! Can you guess this?\n\n${q.emoji}\n\nWhat's the phrase? 👀 Reply with your answer!`)}
              className="w-full py-3 rounded-2xl bg-pink-500 text-white text-sm font-bold"
            >
              Challenge {matchName} 💬
            </button>
            <button onClick={() => { setIdx(i => i + 1); setEmojiGuess(''); setEmojiGuessed(false); }} className="w-full py-2.5 rounded-2xl border border-border text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-muted">
              <RotateCcw className="size-3.5" /> Next puzzle
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeGame === 'trivia') {
    const q = TRIVIA_Q[idx % TRIVIA_Q.length];
    return (
      <div>
        <GameHeader title="FPT Trivia" />
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-800 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1.5">Question {(idx % TRIVIA_Q.length) + 1}/{TRIVIA_Q.length}</p>
          <p className="text-sm font-bold text-foreground leading-snug">{q.q}</p>
        </div>
        <div className="space-y-2 mb-4">
          {q.opts.map(opt => (
            <button
              key={opt}
              onClick={() => setTriviaAnswered(opt)}
              disabled={!!triviaAnswered}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                triviaAnswered
                  ? opt === q.a
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                    : opt === triviaAnswered
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600'
                    : 'border-border text-muted-foreground opacity-50'
                  : 'border-border hover:border-cyan-400 text-foreground'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {triviaAnswered && (
          <div className="space-y-2">
            <p className="text-center text-sm font-bold text-foreground">
              {triviaAnswered === q.a ? '✅ Correct!' : `❌ The answer was: ${q.a}`}
            </p>
            <button
              onClick={() => onSendGame(`🧠 FPT Trivia!\n\n"${q.q}"\n\nI ${triviaAnswered === q.a ? 'got it right ✅' : 'got it wrong 😅'} — can you do better? Try it!`)}
              className="w-full py-3 rounded-2xl bg-cyan-500 text-white text-sm font-bold"
            >
              Challenge {matchName} 💬
            </button>
            <button onClick={() => { setIdx(i => i + 1); setTriviaAnswered(null); }} className="w-full py-2.5 rounded-2xl border border-border text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-muted">
              <RotateCcw className="size-3.5" /> Next question
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeGame === 'draw') {
    const PROMPTS = ['Your dream office', 'FPT canteen food', 'Weekend plans', 'Your spirit animal'];
    const prompt = PROMPTS[idx % PROMPTS.length];
    return (
      <div>
        <GameHeader title="Quick Draw" />
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-4 text-center">
          <p className="text-3xl mb-2">✏️</p>
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Draw prompt</p>
          <p className="text-base font-black text-foreground">"{prompt}"</p>
        </div>
        <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
          Both of you draw this topic — share your sketches and compare! Works great on phone notes or paper.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => onSendGame(`✏️ Quick Draw challenge!\n\nWe both have to draw: "${prompt}"\n\nPhoto your sketch and send it back! 🎨 No cheating — 60 seconds max!`)}
            className="w-full py-3 rounded-2xl bg-green-500 text-white text-sm font-bold"
          >
            Send challenge to {matchName} 🎨
          </button>
          <button onClick={() => setIdx(i => i + 1)} className="w-full py-2.5 rounded-2xl border border-border text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-muted">
            <RotateCcw className="size-3.5" /> Different prompt
          </button>
        </div>
      </div>
    );
  }

  END_DEAD_BLOCK */
}

// ── AI Companion side panel ───────────────────────────────────────────────────
function AiCompanion({ match, msgCount, onSendGame, onSendGameInvite }: {
  match: Match; msgCount: number;
  onSendGame: (text: string) => void;
  onSendGameInvite: (g: InstantGame) => void;
}) {
  const [tab, setTab] = useState<AiTab>('quansu');
  const [placeFilter, setPlaceFilter] = useState<PlaceCategory>('all');
  const ai = getProfileAI(match.profile);
  const name = match.profile.name.split(' ')[0];
  const tips = getQuantSuTips(match.profile, msgCount);

  const tabs: { id: AiTab; icon: React.ReactNode; label: string }[] = [
    { id: 'quansu', icon: <Brain className="size-3.5" />, label: 'Quân Sư' },
    { id: 'soul',   icon: <Star className="size-3.5" />, label: 'Soul Map' },
    { id: 'dates',  icon: <MapPin className="size-3.5" />, label: 'Dates' },
    { id: 'games',  icon: <Gamepad2 className="size-3.5" />, label: 'Games' },
  ];

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#F36F21] to-[#C9972B] flex items-center justify-center">
            <Sparkles className="size-3 text-white" />
          </div>
          <p className="text-xs font-bold text-foreground">AI Companion</p>
          <span className="ml-auto text-[10px] bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21] font-semibold px-2 py-0.5 rounded-full">{ai.compatibility}% match</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-4 border-b border-border flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-all border-b-2 ${tab === t.id ? 'border-[#F36F21] text-[#F36F21]' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${tab === 'dates' || tab === 'games' ? '' : 'p-3.5'}`}>

        {/* ── Quân Sư ── */}
        {tab === 'quansu' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-[#FFF5EE] to-[#FFF8F0] dark:from-[#2A1F0F] dark:to-[#241A0D] rounded-2xl p-3 border border-[#F36F21]/20">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-base">🧠</span>
                <p className="text-[10px] font-bold text-[#F36F21] uppercase tracking-wide">Your Quân Sư says</p>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {msgCount === 0
                  ? `${name} is a ${ai.convoStyle.toLowerCase()} communicator. Start warm and specific — generic openers will get generic replies.`
                  : msgCount < 4
                  ? `Good momentum! ${name} is opening up. This is the moment to go one level deeper — ask something only someone paying attention would ask.`
                  : `You've built real rapport. ${name} feels comfortable. Time to make a concrete plan — suggest something low-stakes and local.`
                }
              </p>
            </div>

            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
              {msgCount === 0 ? 'Opening lines' : msgCount < 4 ? 'Keep the energy' : 'Level up'}
            </p>
            {tips.map((tip, i) => (
              <button
                key={i}
                onClick={() => onSendGame(tip.text.replace(/^"|"$/g, ''))}
                className="w-full text-left p-3 rounded-2xl border border-border hover:border-[#F36F21] hover:bg-[#FFF5EE] dark:hover:bg-[#2A1F0F] transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{tip.icon}</span>
                  <p className="text-[10px] font-semibold text-muted-foreground group-hover:text-[#F36F21] uppercase tracking-wide">{tip.label}</p>
                </div>
                <p className="text-xs text-foreground leading-relaxed italic">{tip.text}</p>
              </button>
            ))}

            <div className="bg-muted/50 rounded-2xl p-3">
              <p className="text-[10px] font-semibold text-muted-foreground mb-2">Topics {name} loves</p>
              <div className="flex flex-wrap gap-1.5">
                {ai.topics.map(t => (
                  <span key={t} className="text-[10px] bg-card border border-border px-2 py-1 rounded-full text-foreground">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Soul Map ── */}
        {tab === 'soul' && (
          <div className="space-y-3.5">
            {/* MBTI + love lang */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30 rounded-2xl p-3 border border-purple-200 dark:border-purple-800">
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Personality</p>
                <p className="text-lg font-black text-purple-700 dark:text-purple-300">{ai.mbti}</p>
                <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70">AI inferred</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/30 rounded-2xl p-3 border border-pink-200 dark:border-pink-800">
                <p className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold mb-0.5">Love Lang</p>
                <p className="text-xs font-bold text-pink-700 dark:text-pink-300 leading-tight">{ai.loveLanguage}</p>
              </div>
            </div>

            {/* Trait bars */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-2">Trait Profile</p>
              <div className="space-y-2.5">
                {ai.traits.map(trait => (
                  <div key={trait.label}>
                    <div className="flex justify-between mb-1">
                      <p className="text-[10px] text-foreground font-medium">{trait.label}</p>
                      <p className="text-[10px] text-muted-foreground">{trait.val}%</p>
                    </div>
                    <div className="bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-[#C9972B] to-[#F36F21] transition-all"
                        style={{ width: `${trait.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vibe tags */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-2">Their Vibe</p>
              <div className="flex flex-wrap gap-1.5">
                {ai.vibes.map(v => (
                  <span key={v} className="text-[10px] bg-muted px-2.5 py-1.5 rounded-full text-foreground font-medium border border-border">{v}</span>
                ))}
              </div>
            </div>

            {/* Conversation style */}
            <div className="bg-muted/50 rounded-2xl p-3">
              <p className="text-[10px] text-muted-foreground font-semibold mb-1">Conversation Style</p>
              <p className="text-xs text-foreground font-semibold">{ai.convoStyle}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                Match their energy — don't over-explain, and leave space for them to ask back.
              </p>
            </div>

            {/* Compatibility breakdown */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-2">Compatibility</p>
              {[
                { label: 'Values', val: Math.min(98, ai.compatibility + 8) },
                { label: 'Lifestyle', val: Math.max(60, ai.compatibility - 5) },
                { label: 'Humor', val: Math.min(95, ai.compatibility + 3) },
                { label: 'Ambition', val: Math.max(55, ai.compatibility - 12) },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-2 mb-1.5">
                  <p className="text-[10px] text-muted-foreground w-16 flex-shrink-0">{c.label}</p>
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-[#F36F21]" style={{ width: `${c.val}%` }} />
                  </div>
                  <p className="text-[10px] text-foreground font-semibold w-7 text-right">{c.val}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Date Ideas ── */}
        {/* ── Date Places ── */}
        {tab === 'dates' && (
          <div>
            {/* Mini map header */}
            <div className="relative h-28 bg-gradient-to-br from-blue-100 via-teal-50 to-green-100 dark:from-blue-950/60 dark:via-teal-950/40 dark:to-green-950/60 overflow-hidden mb-0 flex-shrink-0">
              {/* Stylized map grid */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 112" preserveAspectRatio="xMidYMid slice">
                {/* Roads */}
                <line x1="0" y1="56" x2="300" y2="56" stroke="#94a3b8" strokeWidth="3"/>
                <line x1="0" y1="30" x2="300" y2="30" stroke="#94a3b8" strokeWidth="1.5"/>
                <line x1="0" y1="85" x2="300" y2="85" stroke="#94a3b8" strokeWidth="1.5"/>
                <line x1="80" y1="0" x2="80" y2="112" stroke="#94a3b8" strokeWidth="3"/>
                <line x1="180" y1="0" x2="180" y2="112" stroke="#94a3b8" strokeWidth="1.5"/>
                <line x1="240" y1="0" x2="240" y2="112" stroke="#94a3b8" strokeWidth="1.5"/>
                {/* Blocks */}
                <rect x="10" y="10" width="60" height="15" rx="2" fill="#cbd5e1" opacity="0.5"/>
                <rect x="10" y="38" width="60" height="12" rx="2" fill="#cbd5e1" opacity="0.5"/>
                <rect x="90" y="10" width="80" height="15" rx="2" fill="#cbd5e1" opacity="0.5"/>
                <rect x="190" y="10" width="100" height="15" rx="2" fill="#cbd5e1" opacity="0.5"/>
                <rect x="190" y="62" width="45" height="18" rx="2" fill="#cbd5e1" opacity="0.5"/>
                <rect x="90" y="62" width="80" height="18" rx="2" fill="#cbd5e1" opacity="0.5"/>
                <rect x="10" y="65" width="60" height="40" rx="2" fill="#bfdbfe" opacity="0.6"/>
              </svg>
              {/* Place pins */}
              {DATE_PLACES.slice(0,4).map((p, i) => {
                const positions = [{x:'25%',y:'30%'},{x:'55%',y:'55%'},{x:'72%',y:'25%'},{x:'80%',y:'65%'}];
                const pos = positions[i];
                return (
                  <div key={i} className="absolute" style={{left: pos.x, top: pos.y, transform: 'translate(-50%,-100%)'}}>
                    <div className="bg-[#F36F21] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg shadow-lg whitespace-nowrap">
                      {p.name.split(' ').slice(0,2).join(' ')}
                    </div>
                    <div className="w-2 h-2 bg-[#F36F21] rotate-45 mx-auto -mt-0.5 shadow" />
                  </div>
                );
              })}
              <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                <MapPin className="size-3 text-[#F36F21]" />
                <span className="text-[9px] font-semibold text-foreground">Ho Chi Minh City</span>
              </div>
            </div>

            {/* AI reason banner */}
            <div className="flex items-center gap-2 bg-[#FFF5EE] dark:bg-[#2A1F0F] px-3 py-2 border-b border-border">
              <Sparkles className="size-3 text-[#F36F21] flex-shrink-0" />
              <p className="text-[10px] text-[#F36F21] font-medium">AI-matched to both your interests & {name}'s vibe</p>
            </div>

            {/* Category filter chips */}
            <div className="flex gap-1.5 px-3 py-2.5 border-b border-border overflow-x-auto scrollbar-none">
              {(['all','café','restaurant','activity','nightlife'] as PlaceCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setPlaceFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold capitalize whitespace-nowrap transition-all flex-shrink-0 ${placeFilter === cat ? 'bg-[#F36F21] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {cat === 'all' ? '🗺️ All' : cat === 'café' ? '☕ Café' : cat === 'restaurant' ? '🍽️ Food' : cat === 'activity' ? '🎯 Activity' : '🌙 Nightlife'}
                </button>
              ))}
            </div>

            {/* Place listings */}
            <div className="divide-y divide-border">
              {DATE_PLACES
                .filter(p => placeFilter === 'all' || p.cat === placeFilter)
                .map((place, i) => (
                  <div key={i} className="p-3">
                    {/* Photo + title row */}
                    <div className="flex gap-2.5 mb-2">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={place.photo}
                          alt={place.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight mb-0.5">{place.name}</p>
                        <p className="text-[10px] text-muted-foreground mb-1">{place.type}</p>
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={place.rating} />
                          <span className="text-[10px] font-bold text-amber-600">{place.rating}</span>
                          <span className="text-[10px] text-muted-foreground">({place.reviewCount.toLocaleString()})</span>
                          <span className="text-[10px] text-muted-foreground ml-1">· {place.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="size-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground">{place.address}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3 text-muted-foreground flex-shrink-0" />
                        <p className={`text-[10px] font-medium ${place.open ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{place.hours}</p>
                        <span className="text-[10px] text-muted-foreground">· {place.distance} away</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 flex-wrap mb-2">
                      {place.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">{tag}</span>
                      ))}
                    </div>

                    {/* Review snippet */}
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed mb-2.5">{place.review}</p>

                    {/* AI reason */}
                    <div className="flex items-start gap-1.5 bg-[#FFF5EE] dark:bg-[#2A1F0F] rounded-xl px-2.5 py-2 mb-2.5">
                      <Sparkles className="size-3 text-[#F36F21] flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-[#F36F21] leading-relaxed">{place.why}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSendGame(`Hey! I found this place I think we'd both love 👀\n\n📍 ${place.name}\n${place.type} · ${place.address}\n⭐ ${place.rating} (${place.reviewCount} reviews) · ${place.price}\n${place.hours}\n\n"${place.review.replace(/"/g, '')}"\n\nWorth checking out together? 😊`)}
                        className="flex-1 py-2 rounded-xl bg-[#F36F21] text-white text-[10px] font-bold hover:bg-[#E05E10] transition-colors"
                      >
                        Suggest to {name} 💬
                      </button>
                      <button className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-[10px] text-muted-foreground font-semibold hover:bg-muted transition-colors">
                        <Navigation className="size-3" /> Maps
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Games ── */}
        {tab === 'games' && (
          <GamePanel onSendGameInvite={onSendGameInvite} matchName={name} />
        )}
      </div>
    </div>
  );
}

// ── Safety bottom sheet ───────────────────────────────────────────────────────
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

// ── Empty state prompt ────────────────────────────────────────────────────────
function EmptyChatPrompt({ name, highlights, onSend }: { name: string; highlights: string[]; onSend: (t: string) => void }) {
  const starters = [
    `What's the best part about working at FPT for you?`,
    `I noticed you love ${highlights[1]?.toLowerCase() ?? 'hiking'} — best spot you've found nearby?`,
    `${name.split(' ')[0]} — genuine question: what are you most excited about at work lately?`,
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
            <button
              key={i}
              onClick={() => onSend(s)}
              className="w-full text-left p-3 bg-card rounded-xl border border-border hover:border-[#F36F21] transition-colors text-sm text-foreground leading-relaxed"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chat list ─────────────────────────────────────────────────────────────────
function ChatList({ matches, isPremium, selectedMatch, onSelectMatch }: {
  matches: Match[]; isPremium: boolean; selectedMatch: Match | null;
  onSelectMatch: (m: Match) => void;
}) {
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
            selectedMatch?.id === match.id ? 'bg-[#FFF5EE] dark:bg-[#2A1F0F]' : 'hover:bg-muted/50'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted">
              <img src={match.profile.photos[0]} alt={match.profile.name} className="w-full h-full object-cover object-top" />
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
    </div>
  );
}

// ── Game Shell Card (renders inline in the chat message thread) ───────────────
function GameShellCard({ msg, match }: { msg: GameChatMsg; match: Match }) {
  const [mode, setMode] = useState<'play' | 'spectate'>('play');
  const [phase, setPhase] = useState<'lobby' | 'playing' | 'done'>('lobby');
  const [opponentJoined, setOpponentJoined] = useState(false);

  // Simulate opponent joining after 2.5 s
  useEffect(() => {
    const t = setTimeout(() => setOpponentJoined(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // ── inline game state ────────────────────────────────────────────────────────
  const [wyrIdx, setWyrIdx] = useState(0);
  const [wyrPicked, setWyrPicked] = useState<string | null>(null);
  const [wyrOpponent, setWyrOpponent] = useState<string | null>(null);
  const [totIdx, setTotIdx] = useState(0);
  const [totPicked, setTotPicked] = useState<string | null>(null);
  const [totOpponent, setTotOpponent] = useState<string | null>(null);
  const [emojiIdx, setEmojiIdx] = useState(0);
  const [emojiGuess, setEmojiGuess] = useState('');
  const [emojiDone, setEmojiDone] = useState(false);
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaPicked, setTriviaPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [drawPromptIdx, setDrawPromptIdx] = useState(0);

  const opponentName = match.profile.name.split(' ')[0];
  const avatarSrc = match.profile.photos[0];

  const DRAW_PROMPTS = ['Your dream office', 'FPT canteen meal', 'Weekend plans', 'Your spirit animal', 'Perfect date spot'];

  const pickWyr = (side: 'A' | 'B') => {
    setWyrPicked(side);
    setTimeout(() => setWyrOpponent(Math.random() > 0.5 ? 'A' : 'B'), 800);
  };
  const pickTot = (side: 'A' | 'B') => {
    setTotPicked(side);
    setTimeout(() => setTotOpponent(Math.random() > 0.5 ? 'A' : 'B'), 800);
  };
  const answerTrivia = (opt: string) => {
    setTriviaPicked(opt);
    if (opt === TRIVIA_Q[triviaIdx % TRIVIA_Q.length].a) setScore(s => s + 1);
  };

  const bg = { background: `linear-gradient(135deg, ${msg.gradientFrom}, ${msg.gradientTo})` };

  // ── Lobby ────────────────────────────────────────────────────────────────────
  if (phase === 'lobby') return (
    <div className="rounded-2xl overflow-hidden w-72 shadow-xl" style={bg}>
      {/* Faint pattern overlay */}
      <div className="relative">
        <div className="absolute inset-0 opacity-5 text-[80px] flex flex-wrap gap-4 overflow-hidden pointer-events-none select-none leading-none p-2">
          {Array(20).fill(msg.gameEmoji).join('')}
        </div>

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-3 pt-3 pb-1">
          <div className="flex gap-1.5">
            <button className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
              <Settings className="size-3.5 text-white/70" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center">
              <HelpCircle className="size-3.5 text-white/70" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-sm tracking-tight drop-shadow">{msg.gameEmoji} {msg.gameName.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-1 bg-black/20 rounded-full px-2 py-0.5">
            <Users className="size-3 text-white/70" />
            <p className="text-white/80 text-[10px] font-semibold">{opponentJoined ? '2' : '1'}/2</p>
          </div>
        </div>

        {/* Avatars */}
        <div className="relative flex justify-center gap-6 pt-4 pb-3 px-4">
          {/* Host (you) */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-16 rounded-full bg-white/20 ring-3 ring-white/60 overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-[#F36F21] to-[#C9972B] flex items-center justify-center text-2xl font-black text-white">
                Me
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="bg-white/90 text-[10px] font-black text-gray-800 px-2 py-0.5 rounded-full uppercase tracking-wide">HOST</span>
              <p className="text-white/80 text-[10px]">You</p>
            </div>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-16 h-16 rounded-full ring-3 overflow-hidden flex-shrink-0 transition-all ${opponentJoined ? 'ring-white/60 bg-white/20' : 'ring-white/20 bg-black/20'}`}>
              {opponentJoined ? (
                <img src={avatarSrc} alt={opponentName} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              {opponentJoined ? (
                <span className="bg-green-400/90 text-[10px] font-black text-green-900 px-2 py-0.5 rounded-full uppercase tracking-wide">JOINED ✓</span>
              ) : (
                <span className="bg-black/30 text-[10px] font-semibold text-white/60 px-2 py-0.5 rounded-full">Waiting...</span>
              )}
              <p className="text-white/80 text-[10px]">{opponentName}</p>
            </div>
          </div>
        </div>

        {/* Play / Spectate toggle */}
        <div className="flex items-center justify-center gap-3 px-4 py-2">
          <div className="flex items-center gap-1">
            <Play className="size-3.5 text-white" />
            <span className="text-white text-xs font-bold">PLAY</span>
          </div>
          <button
            onClick={() => setMode(m => m === 'play' ? 'spectate' : 'play')}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{ background: mode === 'play' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
              style={{ left: mode === 'play' ? '2px' : '26px' }}
            />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-white text-xs font-bold">SPECTATE</span>
            <Eye className="size-3.5 text-white" />
          </div>
        </div>

        {/* Start button */}
        <div className="px-4 pb-4 pt-1">
          <button
            disabled={!opponentJoined && mode === 'play'}
            onClick={() => setPhase('playing')}
            className="w-full py-3.5 rounded-2xl font-black text-base tracking-widest uppercase transition-all disabled:opacity-40"
            style={{ background: opponentJoined ? '#22c55e' : 'rgba(255,255,255,0.15)', color: 'white', boxShadow: opponentJoined ? '0 4px 0 #15803d' : 'none' }}
          >
            {opponentJoined ? 'START GAME' : 'Waiting...'}
          </button>
          {!opponentJoined && (
            <p className="text-white/50 text-[10px] text-center mt-2">Waiting for {opponentName} to join…</p>
          )}
        </div>
      </div>
    </div>
  );

  // ── Playing phase ────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl overflow-hidden w-72 shadow-xl" style={bg}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <span className="text-white text-xs font-bold">{msg.gameEmoji} {msg.gameName}</span>
        <button onClick={() => setPhase('lobby')} className="text-white/60 text-[10px] hover:text-white">✕ Exit</button>
      </div>

      {/* Game content */}
      <div className="p-4">

        {/* Would You Rather */}
        {msg.gameId === 'wyr' && (() => {
          const q = WOULD_YOU_RATHER[wyrIdx % WOULD_YOU_RATHER.length];
          return (
            <div className="space-y-3">
              <p className="text-white/70 text-[10px] text-center uppercase tracking-widest font-semibold">Would you rather…</p>
              <div className="space-y-2.5">
                {([{label: q.a, side: 'A' as const}, {label: q.b, side: 'B' as const}]).map(opt => (
                  <button
                    key={opt.side}
                    disabled={!!wyrPicked}
                    onClick={() => pickWyr(opt.side)}
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 text-sm font-bold text-left transition-all ${wyrPicked === opt.side ? 'border-white bg-white/20 text-white scale-[1.02]' : wyrPicked ? 'border-white/10 bg-white/5 text-white/40' : 'border-white/30 bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {opt.side === 'A' ? '🅰️' : '🅱️'} {opt.label}
                    {wyrOpponent === opt.side && wyrPicked && (
                      <span className="ml-2 text-[10px] bg-white/20 rounded-full px-1.5 py-0.5 align-middle">{opponentName} ✓</span>
                    )}
                  </button>
                ))}
              </div>
              {wyrOpponent && wyrPicked && (
                <div className="space-y-2">
                  <div className={`text-center text-sm font-bold text-white py-2 rounded-xl ${wyrPicked === wyrOpponent ? 'bg-green-500/30' : 'bg-white/10'}`}>
                    {wyrPicked === wyrOpponent ? '🎉 You both picked the same!' : `You: ${wyrPicked} · ${opponentName}: ${wyrOpponent}`}
                  </div>
                  <button
                    onClick={() => { setWyrIdx(i => i + 1); setWyrPicked(null); setWyrOpponent(null); }}
                    className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="size-3.5" /> Next question
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* This or That */}
        {msg.gameId === 'tot' && (() => {
          const q = THIS_OR_THAT[totIdx % THIS_OR_THAT.length];
          return (
            <div className="space-y-3">
              <p className="text-white/70 text-[10px] text-center uppercase tracking-widest font-semibold">This or That?</p>
              <div className="grid grid-cols-2 gap-2.5">
                {([{label: q.a, side: 'A' as const}, {label: q.b, side: 'B' as const}]).map(opt => (
                  <button
                    key={opt.side}
                    disabled={!!totPicked}
                    onClick={() => pickTot(opt.side)}
                    className={`py-6 rounded-2xl border-2 text-xl font-black text-center transition-all flex flex-col items-center gap-1 ${totPicked === opt.side ? 'border-white bg-white/25 scale-105 shadow-lg' : totPicked ? 'border-white/10 bg-white/5 opacity-40' : 'border-white/30 bg-white/10 hover:bg-white/20'}`}
                  >
                    {opt.label}
                    {totOpponent === opt.side && totPicked && <span className="text-[10px] text-white/60 font-normal">{opponentName}</span>}
                  </button>
                ))}
              </div>
              {totOpponent && totPicked && (
                <div className="space-y-2">
                  <p className={`text-center text-sm font-bold text-white ${totPicked === totOpponent ? 'opacity-100' : 'opacity-80'}`}>
                    {totPicked === totOpponent ? '💛 Match!' : `Split decision!`}
                  </p>
                  <button onClick={() => { setTotIdx(i => i + 1); setTotPicked(null); setTotOpponent(null); }} className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                    <RotateCcw className="size-3.5" /> Next
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* Emoji Quiz */}
        {msg.gameId === 'emoji' && (() => {
          const q = EMOJI_QUIZ[emojiIdx % EMOJI_QUIZ.length];
          return (
            <div className="space-y-3">
              <p className="text-white/70 text-[10px] text-center uppercase tracking-widest font-semibold">What's the phrase?</p>
              <div className="bg-white/10 rounded-2xl py-6 text-center">
                <p className="text-5xl">{q.emoji}</p>
              </div>
              {!emojiDone ? (
                <div className="flex gap-2">
                  <input
                    value={emojiGuess}
                    onChange={e => setEmojiGuess(e.target.value)}
                    placeholder="Your guess…"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                  <button disabled={!emojiGuess.trim()} onClick={() => setEmojiDone(true)} className="px-4 rounded-xl bg-white/25 text-white text-sm font-bold disabled:opacity-30">Go</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-white/15 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-white/60">Answer</p>
                    <p className="text-white font-black">{q.answer}</p>
                  </div>
                  <button onClick={() => { setEmojiIdx(i => i + 1); setEmojiGuess(''); setEmojiDone(false); }} className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                    <RotateCcw className="size-3.5" /> Next puzzle
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* FPT Trivia */}
        {msg.gameId === 'trivia' && (() => {
          const q = TRIVIA_Q[triviaIdx % TRIVIA_Q.length];
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-[10px] uppercase font-semibold">Q {(triviaIdx % TRIVIA_Q.length) + 1}/{TRIVIA_Q.length}</p>
                <p className="text-white text-xs font-bold">Score: {score}</p>
              </div>
              <p className="text-white text-sm font-bold leading-snug">{q.q}</p>
              <div className="space-y-1.5">
                {q.opts.map(opt => (
                  <button
                    key={opt}
                    disabled={!!triviaPicked}
                    onClick={() => answerTrivia(opt)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      triviaPicked
                        ? opt === q.a ? 'border-green-400 bg-green-500/30 text-white'
                        : opt === triviaPicked ? 'border-red-400 bg-red-500/20 text-white/60'
                        : 'border-white/10 bg-white/5 text-white/30'
                        : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {triviaPicked && (
                <button onClick={() => { setTriviaIdx(i => i + 1); setTriviaPicked(null); }} className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                  <RotateCcw className="size-3.5" /> Next question
                </button>
              )}
            </div>
          );
        })()}

        {/* Quick Draw */}
        {msg.gameId === 'draw' && (
          <div className="space-y-3 text-center">
            <p className="text-white/70 text-[10px] uppercase tracking-widest font-semibold">Draw this topic!</p>
            <div className="bg-white/10 rounded-2xl py-5">
              <p className="text-4xl mb-1">✏️</p>
              <p className="text-white font-black text-base">"{DRAW_PROMPTS[drawPromptIdx % DRAW_PROMPTS.length]}"</p>
            </div>
            <p className="text-white/60 text-[10px] leading-relaxed">Sketch it on paper or your phone notes, then take a photo and send it in the chat!</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setDrawPromptIdx(i => i + 1)} className="py-2.5 rounded-xl bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                <RotateCcw className="size-3.5" /> New prompt
              </button>
              <button className="py-2.5 rounded-xl bg-white/25 text-white text-xs font-bold">📷 Send sketch</button>
            </div>
          </div>
        )}

        {/* Arcade / board game shells */}
        {(['words', 'pool', 'basketball', 'gofish', 'songpop', 'minigolf', 'quiz', 'chess', 'yatzy', 'kittens'] as GameId[]).includes(msg.gameId) && (
          <div className="space-y-3">
            <p className="text-white/70 text-[10px] uppercase tracking-widest font-semibold text-center">Game in progress</p>
            {/* Scoreboard */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-white/15 rounded-xl py-3">
                <p className="text-white font-black text-xl">0</p>
                <p className="text-white/60 text-[9px] mt-0.5">You</p>
              </div>
              <div className="rounded-xl py-3 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                <p className="text-4xl leading-none">{msg.gameEmoji}</p>
                <p className="text-white/50 text-[9px] font-bold mt-1">VS</p>
              </div>
              <div className="bg-white/15 rounded-xl py-3">
                <p className="text-white font-black text-xl">0</p>
                <p className="text-white/60 text-[9px] mt-0.5">{opponentName}</p>
              </div>
            </div>
            {/* Chess board mini preview for chess */}
            {msg.gameId === 'chess' && (
              <div className="rounded-xl overflow-hidden border border-white/20">
                <div className="grid grid-cols-8">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    const pieces: Record<string, string> = {
                      '0,0': '♜','0,1': '♞','0,2': '♝','0,3': '♛','0,4': '♚','0,5': '♝','0,6': '♞','0,7': '♜',
                      '1,0': '♟','1,1': '♟','1,2': '♟','1,3': '♟','1,4': '♟','1,5': '♟','1,6': '♟','1,7': '♟',
                      '6,0': '♙','6,1': '♙','6,2': '♙','6,3': '♙','6,4': '♙','6,5': '♙','6,6': '♙','6,7': '♙',
                      '7,0': '♖','7,1': '♘','7,2': '♗','7,3': '♕','7,4': '♔','7,5': '♗','7,6': '♘','7,7': '♖',
                    };
                    const piece = pieces[`${row},${col}`];
                    return (
                      <div
                        key={i}
                        className="aspect-square flex items-center justify-center text-xs"
                        style={{ background: isLight ? '#f0d9b5' : '#b58863', fontSize: '10px' }}
                      >
                        {piece && <span style={{ color: row < 4 ? '#000' : '#fff', textShadow: row < 4 ? '0 0 2px rgba(255,255,255,0.4)' : '0 0 2px rgba(0,0,0,0.8)' }}>{piece}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors">
              📱 Open full game
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Chat pane ─────────────────────────────────────────────────────────────────
function ChatPane({
  match, onBack, showBack = true, showAiPanel = false,
}: {
  match: Match; onBack: () => void; showBack?: boolean; showAiPanel?: boolean;
}) {
  // showAiPanel=true → render AI companion as a right column (desktop 3-pane)
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [showSafety, setShowSafety] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const name = match.profile.name.split(' ')[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const t = (text ?? messageText).trim();
    if (!t) return;
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
        "Okay, now I'm genuinely curious 👀",
        "Lol okay I'll admit that 😂",
      ];
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`, matchId: match.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        sentAt: new Date(), isMe: false,
      }]);
    }, 2000 + Math.random() * 1000);
  };

  const handleSendGameInvite = (g: InstantGame) => {
    const gameMsg: GameChatMsg = {
      id: `g-${Date.now()}`, matchId: match.id, type: 'game',
      gameId: g.id, gameName: g.name, gameEmoji: g.emoji,
      gradientFrom: g.gradientFrom, gradientTo: g.gradientTo, bgPattern: g.bgPattern,
      isMe: true, sentAt: new Date(),
    };
    setMessages(prev => [...prev, gameMsg]);
    setMobileAiOpen(false);
  };

  const aiSuggestions = [
    "That sounds amazing! Tell me more 😊",
    "Haha I was thinking the same thing!",
    "Oh really? I'd love to try that too",
  ];

  const pane = (
    <div className="h-full flex flex-col bg-card flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        {showBack && (
          <button onClick={onBack} className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          <img src={match.profile.photos[0]} alt={match.profile.name} className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">{match.profile.name}</p>
          <p className="text-muted-foreground text-xs">{match.profile.city} · {match.profile.role}</p>
        </div>
        {/* Mobile AI companion toggle */}
        {!showAiPanel && (
          <button
            onClick={() => setMobileAiOpen(true)}
            className="p-1.5 rounded-full bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21] hover:bg-[#FFE8D4] transition-colors"
          >
            <Sparkles className="size-4" />
          </button>
        )}
        <button onClick={() => setShowSafety(true)} className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="size-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <EmptyChatPrompt name={match.profile.name} highlights={match.profile.highlights} onSend={handleSend} />
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'game' ? (
                  <GameShellCard msg={msg} match={match} />
                ) : (
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isMe ? 'bg-[#F36F21] text-white rounded-br-md' : 'bg-muted text-foreground rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                )}
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

      {/* AI suggestions strip */}
      {messages.length > 0 && showAiSuggestions && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-border overflow-x-auto scrollbar-none flex-shrink-0">
          <Sparkles className="size-3.5 text-[#F36F21] flex-shrink-0" />
          {aiSuggestions.map((s, i) => (
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
          placeholder={`Message ${name}...`}
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

      {/* Safety menu */}
      {showSafety && (
        <SafetyMenu
          onAction={(a) => { if (a === 'unmatch') onBack(); }}
          onClose={() => setShowSafety(false)}
        />
      )}

      {/* Mobile AI companion drawer */}
      <AnimatePresence>
        {mobileAiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileAiOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 h-[75vh] bg-card rounded-t-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-2" />
              <AiCompanion match={match} msgCount={messages.length} onSendGame={(text) => { handleSend(text); setMobileAiOpen(false); }} onSendGameInvite={handleSendGameInvite} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (showAiPanel) {
    return (
      <div className="h-full flex">
        <div className="flex-1 min-w-0 h-full">{pane}</div>
        <div className="w-[480px] flex-shrink-0 h-full overflow-hidden">
          <AiCompanion match={match} msgCount={messages.length} onSendGame={handleSend} onSendGameInvite={handleSendGameInvite} />
        </div>
      </div>
    );
  }
  return pane;
}

// ── Main export ───────────────────────────────────────────────────────────────
export function MessagesView({ matches, isPremium }: MessagesViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <>
      {/* ── Mobile ── */}
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
            showAiPanel={false}
          />
        )}
      </div>

      {/* ── Desktop: 3-pane ── */}
      <div className="hidden lg:flex h-full">
        {/* Chat list */}
        <div className="w-64 flex-shrink-0 border-r border-border h-full overflow-hidden flex flex-col">
          <div className="px-4 py-3.5 border-b border-border flex items-center justify-between flex-shrink-0">
            <p className="font-bold text-foreground text-sm">Messages</p>
            {matches.length > 0 && (
              <span className="text-xs bg-[#F36F21] text-white px-2 py-0.5 rounded-full font-semibold">{matches.length}</span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatList
              matches={matches} isPremium={isPremium}
              selectedMatch={selectedMatch} onSelectMatch={setSelectedMatch}
            />
          </div>
        </div>

        {/* Chat pane + AI companion (handled inside ChatPane when showAiPanel=true) */}
        <div className="flex-1 overflow-hidden min-w-0">
          {selectedMatch ? (
            <ChatPane match={selectedMatch} onBack={() => setSelectedMatch(null)} showBack={false} showAiPanel={true} />
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
