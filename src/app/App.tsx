import { useState, useEffect } from 'react';
import { SwipeView } from './components/SwipeView';
import { MatchesView } from './components/MatchesView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { MatchModal } from './components/MatchModal';
import { RewardModal } from './components/RewardModal';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import {
  Compass, Heart, MessageCircle, User, Trophy, Sun, Moon, Crown, X, Check,
  Flame, Zap, Bell, Settings
} from 'lucide-react';
import { motion } from 'motion/react';
export type { FPTOffice, FPTCity } from './data/locations';
export { FPT_LOCATIONS } from './data/locations';

// ─── Shared Types ─────────────────────────────────────────────────────────────
export type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  city: string;
  cityId: string;
  office?: string;
  officeId?: string;
  locationVisibility: 'city' | 'city+office';
  verified: boolean;
  trustScore: 'High' | 'Medium' | 'Building';
  compatibilityScore: number;
  highlights: string[];
  role: string;
  distance: number;
  location: { lat: number; lng: number };
};

export type Match = {
  id: string;
  profile: Profile;
  matchedAt: Date;
};

export type Message = {
  id: string;
  matchId: string;
  text: string;
  sentAt: Date;
  isMe: boolean;
};

export type UserStats = {
  level: number;
  points: number;
  streak: number;
  swipesToday: number;
  matchesToday: number;
  achievements: string[];
};

export type FilterState = {
  selectedCityIds: string[];
  selectedOfficeIds: Record<string, string[]>;
  ageRange: [number, number];
  maxDistance: number;
  aiSortFirst: boolean;
};

export type AppScreen = 'discover' | 'matches' | 'messages' | 'profile' | 'rewards';
export type AppContext = { darkMode: boolean; language: 'en' | 'vi'; isPremium: boolean };

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-[#F36F21] flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <Heart className="size-12 text-white" fill="white" />
        </div>
        <h1 className="text-white text-5xl font-bold tracking-tight mb-2">fsoul</h1>
        <p className="text-white/80 text-sm tracking-widest uppercase">by FPT Software</p>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-16 text-white/70 text-sm"
      >
        Connect with colleagues who get you
      </motion.p>
    </div>
  );
}

// ─── Premium Modal ────────────────────────────────────────────────────────────
function PremiumModal({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) {
  const [yearly, setYearly] = useState(true);
  const features = [
    { icon: '💛', label: 'Unlimited Likes' },
    { icon: '👁', label: 'See Who Likes You' },
    { icon: '🛡', label: 'Safe Distance Alerts' },
    { icon: '🚫', label: 'Ad-Free Experience' },
    { icon: '🤖', label: 'Advanced AI Icebreakers' },
    { icon: '🚀', label: 'Weekly Profile Boost' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#C9972B] via-[#F36F21] to-[#0F4C81] p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full"><X className="size-4" /></button>
          <Crown className="size-10 mx-auto mb-2 text-yellow-300" />
          <h2 className="text-2xl font-bold mb-1">fsoul Premium</h2>
          <p className="text-white/80 text-sm">More connections, more safety</p>
        </div>
        <div className="p-5">
          <div className="flex rounded-xl bg-muted p-1 mb-5">
            <button onClick={() => setYearly(false)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!yearly ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${yearly ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
              Yearly <span className="text-[#F36F21]">−40%</span>
            </button>
          </div>
          <div className="text-center mb-5">
            <span className="text-4xl font-bold text-foreground">{yearly ? '149,000' : '249,000'}</span>
            <span className="text-muted-foreground ml-1 text-sm">VND / mo</span>
            {yearly && <p className="text-xs text-muted-foreground mt-1">Billed as 1,788,000 VND / year</p>}
          </div>
          <ul className="space-y-2 mb-5">
            {features.map(f => (
              <li key={f.label} className="flex items-center gap-3 text-sm">
                <span className="text-base">{f.icon}</span>
                <span className="text-foreground">{f.label}</span>
                <Check className="size-4 text-[#F36F21] ml-auto" />
              </li>
            ))}
          </ul>
          <button onClick={onUpgrade} className="w-full bg-gradient-to-r from-[#C9972B] to-[#F36F21] text-white py-3.5 rounded-2xl font-semibold text-base hover:opacity-90 transition-opacity">
            Start Free Trial — 7 days
          </button>
          <p className="text-xs text-muted-foreground text-center mt-3">Cancel anytime. No charge during trial.</p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function BottomNav({ screen, onNavigate, matchCount }: {
  screen: AppScreen; onNavigate: (s: AppScreen) => void; matchCount: number;
}) {
  const tabs: { id: AppScreen; icon: React.ReactNode; label: string }[] = [
    { id: 'discover', icon: <Compass className="size-6" />, label: 'Discover' },
    { id: 'matches', icon: <Heart className="size-6" />, label: 'Matches' },
    { id: 'messages', icon: <MessageCircle className="size-6" />, label: 'Chats' },
    { id: 'profile', icon: <User className="size-6" />, label: 'Profile' },
  ];
  return (
    <div className="border-t border-border bg-card px-2 py-2 flex justify-around">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all relative ${screen === tab.id ? 'text-[#F36F21]' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {tab.icon}
          <span className="text-[10px] font-semibold">{tab.label}</span>
          {tab.id === 'matches' && matchCount > 0 && (
            <span className="absolute top-1 right-4 bg-[#D4183D] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-bold">
              {matchCount > 9 ? '9+' : matchCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Desktop Sidebar Nav ──────────────────────────────────────────────────────
function DesktopSidebar({
  screen, onNavigate, matchCount, darkMode, onToggleDark, language, onLanguageChange,
  isPremium, onShowPremium, onShowRewards, userStats,
}: {
  screen: AppScreen; onNavigate: (s: AppScreen) => void; matchCount: number;
  darkMode: boolean; onToggleDark: () => void; language: 'en' | 'vi';
  onLanguageChange: (l: 'en' | 'vi') => void; isPremium: boolean;
  onShowPremium: () => void; onShowRewards: () => void; userStats: UserStats;
}) {
  const tabs: { id: AppScreen; icon: typeof Compass; label: string }[] = [
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'matches', icon: Heart, label: 'Matches' },
    { id: 'messages', icon: MessageCircle, label: 'Chats' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-56 flex-shrink-0 h-screen bg-card border-r border-border flex flex-col sticky top-0 z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#F36F21] rounded-xl flex items-center justify-center">
            <Heart className="size-4 text-white" fill="white" />
          </div>
          <span className="text-[#F36F21] text-xl font-bold tracking-tight">fsoul</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 ml-10">FPT Software</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left relative ${
              screen === id
                ? 'bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21]'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="size-5 flex-shrink-0" />
            <span className="font-semibold text-sm">{label}</span>
            {id === 'matches' && matchCount > 0 && (
              <span className="ml-auto bg-[#D4183D] text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                {matchCount > 9 ? '9+' : matchCount}
              </span>
            )}
            {screen === id && (
              <span className="absolute right-3 w-1.5 h-1.5 bg-[#F36F21] rounded-full" />
            )}
          </button>
        ))}

        <div className="pt-3 border-t border-border mt-3">
          {/* Streak pill */}
          <button
            onClick={onShowRewards}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Trophy className="size-5 flex-shrink-0 text-[#C9972B]" />
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground">{userStats.points.toLocaleString()} pts</p>
              <p className="text-[10px] text-muted-foreground">{userStats.streak}d streak · Lv.{userStats.level}</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <Bell className="size-5 flex-shrink-0" />
            <span className="font-semibold text-sm">Notifications</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <Settings className="size-5 flex-shrink-0" />
            <span className="font-semibold text-sm">Settings</span>
          </button>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-border space-y-2">
        {!isPremium && (
          <button
            onClick={onShowPremium}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[#C9972B] to-[#F36F21] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Crown className="size-4" /> Get Premium
          </button>
        )}

        {/* Dark + language row */}
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold flex-1 justify-center"
          >
            {darkMode ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <div className="flex rounded-xl bg-muted overflow-hidden flex-shrink-0">
            {(['en', 'vi'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-2 text-xs font-semibold transition-all ${language === lang ? 'bg-[#F36F21] text-white' : 'text-muted-foreground'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* User mini card */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F36F21] to-[#C9972B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            TL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Thu Linh P.</p>
            <p className="text-[10px] text-muted-foreground truncate">Frontend · HCM City</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Top Bar ──────────────────────────────────────────────────────────
function DesktopTopBar({ screen, userStats, onShowRewards }: {
  screen: AppScreen; userStats: UserStats; onShowRewards: () => void;
}) {
  const titles: Record<AppScreen, string> = {
    discover: 'Discover', matches: 'Matches', messages: 'Chats', profile: 'My Profile', rewards: 'Rewards',
  };
  return (
    <div className="h-14 flex items-center justify-between px-6 border-b border-border bg-card flex-shrink-0">
      <h2 className="font-bold text-foreground text-lg">{titles[screen]}</h2>
      <div className="flex items-center gap-3">
        {screen === 'discover' && (
          <button
            onClick={onShowRewards}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF3E0] dark:bg-[#2A1F0F] text-[#F36F21] rounded-full text-sm font-semibold"
          >
            <Flame className="size-4" /> {userStats.streak}d
            <Trophy className="size-4 ml-1" /> {userStats.points.toLocaleString()}
          </button>
        )}
        <button className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="size-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4183D] rounded-full" />
        </button>
      </div>
    </div>
  );
}

// ─── Desktop Discover Layout ──────────────────────────────────────────────────
function DesktopDiscover({
  onMatch, onSwipe, activeFilters, onFiltersChange, isPremium, onShowPremium, matches, userStats,
}: {
  onMatch: (p: Profile) => void; onSwipe: () => void; activeFilters: FilterState;
  onFiltersChange: (f: FilterState) => void; isPremium: boolean; onShowPremium: () => void;
  matches: Match[]; userStats: UserStats;
}) {
  return (
    <div className="h-full flex gap-0">
      {/* Card stack - centered column */}
      <div className="flex-1 flex items-start justify-center overflow-hidden">
        <div className="w-full max-w-sm h-full">
          <SwipeView
            onMatch={onMatch} onSwipe={onSwipe}
            activeFilters={activeFilters} onFiltersChange={onFiltersChange}
            isPremium={isPremium} onShowPremium={onShowPremium}
          />
        </div>
      </div>

      {/* Right activity panel */}
      <div className="w-72 flex-shrink-0 border-l border-border overflow-y-auto bg-card">
        {/* Today's stats */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Swipes', value: userStats.swipesToday, color: 'text-[#F36F21]' },
              { label: 'Matches', value: userStats.matchesToday, color: 'text-pink-500' },
              { label: 'Points', value: `+${userStats.swipesToday * 5 + userStats.matchesToday * 50}`, color: 'text-[#C9972B]' },
            ].map(s => (
              <div key={s.label} className="text-center p-2 bg-muted rounded-xl">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <Zap className="size-3 inline mr-1 text-[#F36F21]" />AI Insights
          </p>
          <div className="space-y-3">
            {[
              { icon: '🎯', text: 'Your profile gets 2× more right swipes on Tuesday evenings.' },
              { icon: '✨', text: 'Adding a second photo could increase your matches by 40%.' },
              { icon: '💬', text: '3 matches are waiting for your first message.' },
            ].map((tip, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-base flex-shrink-0">{tip.icon}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent matches */}
        {matches.length > 0 && (
          <div className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Matches</p>
            <div className="space-y-3">
              {matches.slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-muted ring-2 ring-[#F36F21]/40">
                    <img src={m.profile.photos[0]} alt={m.profile.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{m.profile.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.profile.city} · {m.profile.compatibilityScore}% match</p>
                  </div>
                  <button className="text-[10px] text-[#F36F21] font-semibold bg-[#FFF5EE] dark:bg-[#2A1F0F] px-2 py-1 rounded-lg flex-shrink-0">
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <div className="p-5 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Matches</p>
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Heart className="size-5 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground">Swipe right to get your first match!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [appPhase, setAppPhase] = useState<'splash' | 'onboarding' | 'main'>('splash');
  const [screen, setScreen] = useState<AppScreen>('discover');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState<Profile | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardType, setRewardType] = useState<'daily' | 'achievement' | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 5, points: 2450, streak: 7, swipesToday: 15, matchesToday: 3,
    achievements: ['first_match', 'week_streak', 'social_butterfly'],
  });
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    selectedCityIds: [], selectedOfficeIds: {}, ageRange: [21, 40], maxDistance: 50, aiSortFirst: true,
  });

  useEffect(() => {
    const t = setTimeout(() => setAppPhase('onboarding'), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleMatch = (profile: Profile) => {
    const match: Match = { id: `match-${Date.now()}`, profile, matchedAt: new Date() };
    setMatches(prev => [match, ...prev]);
    setNewMatch(profile);
    setShowMatchModal(true);
    setUserStats(prev => ({ ...prev, points: prev.points + 50, matchesToday: prev.matchesToday + 1 }));
  };

  const handleSwipe = () => {
    setUserStats(prev => ({ ...prev, swipesToday: prev.swipesToday + 1, points: prev.points + 5 }));
  };

  const showRewards = () => { setRewardType('daily'); setShowRewardModal(true); };

  if (appPhase === 'splash') return <SplashScreen />;
  if (appPhase === 'onboarding') return (
    <OnboardingTutorial onComplete={() => setAppPhase('main')} darkMode={darkMode} />
  );

  const sharedSwipeProps = {
    onMatch: handleMatch, onSwipe: handleSwipe,
    activeFilters, onFiltersChange: setActiveFilters,
    isPremium, onShowPremium: () => setShowPremium(true),
  };

  const sharedProfileProps = {
    darkMode, language, isPremium,
    onToggleDark: () => setDarkMode(d => !d),
    onLanguageChange: setLanguage,
    onShowPremium: () => setShowPremium(true),
    userStats, onShowRewards: showRewards,
  };

  return (
    <div className={darkMode ? 'dark' : ''} style={{ fontFamily: "'Be Vietnam Pro', 'Inter', sans-serif" }}>

      {/* ── MOBILE layout (< lg) ─────────────────────────────────────── */}
      <div className="lg:hidden min-h-screen bg-gradient-to-b from-[#FFF5EE] to-[#F0EDE8] dark:from-[#141210] dark:to-[#1A1714] flex items-center justify-center">
        <div className="relative w-full max-w-[390px] h-screen bg-card overflow-hidden flex flex-col">
          {/* Mobile header */}
          <div className="px-5 pt-12 pb-3 flex items-center justify-between border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-[#F36F21]" fill="#F36F21" />
              <span className="text-[#F36F21] text-xl font-bold tracking-tight">fsoul</span>
            </div>
            <div className="flex items-center gap-2">
              {screen === 'discover' && (
                <button onClick={showRewards} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FFF3E0] dark:bg-[#2A1F0F] text-[#F36F21] rounded-full text-xs font-semibold">
                  <Trophy className="size-3.5" /> {userStats.points.toLocaleString()}
                </button>
              )}
              <button onClick={() => setDarkMode(d => !d)} className="p-2 rounded-full bg-muted text-muted-foreground">
                {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              {!isPremium && (
                <button onClick={() => setShowPremium(true)} className="p-2 rounded-full bg-gradient-to-br from-[#C9972B] to-[#F36F21] text-white">
                  <Crown className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {screen === 'discover' && <SwipeView {...sharedSwipeProps} />}
            {screen === 'matches' && <MatchesView matches={matches} isPremium={isPremium} onShowPremium={() => setShowPremium(true)} onNavigateChat={() => setScreen('messages')} />}
            {screen === 'messages' && <MessagesView matches={matches} isPremium={isPremium} />}
            {screen === 'profile' && <ProfileView {...sharedProfileProps} />}
          </div>

          <BottomNav screen={screen} onNavigate={setScreen} matchCount={matches.length} />
        </div>
      </div>

      {/* ── DESKTOP layout (≥ lg) ─────────────────────────────────────── */}
      <div className="hidden lg:flex h-screen overflow-hidden bg-background">
        <DesktopSidebar
          screen={screen} onNavigate={setScreen} matchCount={matches.length}
          darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)}
          language={language} onLanguageChange={setLanguage}
          isPremium={isPremium} onShowPremium={() => setShowPremium(true)}
          onShowRewards={showRewards} userStats={userStats}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DesktopTopBar screen={screen} userStats={userStats} onShowRewards={showRewards} />

          <div className="flex-1 overflow-hidden">
            {screen === 'discover' && (
              <DesktopDiscover
                {...sharedSwipeProps} matches={matches} userStats={userStats}
              />
            )}
            {screen === 'matches' && (
              <div className="h-full overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  <MatchesView matches={matches} isPremium={isPremium} onShowPremium={() => setShowPremium(true)} onNavigateChat={() => setScreen('messages')} />
                </div>
              </div>
            )}
            {screen === 'messages' && (
              <MessagesView matches={matches} isPremium={isPremium} />
            )}
            {screen === 'profile' && (
              <div className="h-full overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                  <ProfileView {...sharedProfileProps} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals (both layouts) ─────────────────────────────────────── */}
      {showMatchModal && newMatch && (
        <MatchModal
          profile={newMatch}
          onClose={() => setShowMatchModal(false)}
          onSendMessage={() => { setShowMatchModal(false); setScreen('messages'); }}
        />
      )}
      {showRewardModal && rewardType && (
        <RewardModal
          type={rewardType}
          onClose={() => setShowRewardModal(false)}
          onClaim={(pts) => { setUserStats(prev => ({ ...prev, points: prev.points + pts })); setShowRewardModal(false); }}
        />
      )}
      {showPremium && (
        <PremiumModal onClose={() => setShowPremium(false)} onUpgrade={() => { setIsPremium(true); setShowPremium(false); }} />
      )}
    </div>
  );
}
