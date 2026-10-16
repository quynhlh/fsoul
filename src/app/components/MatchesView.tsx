import { useState } from 'react';
import { Match } from '../App';
import { Heart, Crown, Lock, X } from 'lucide-react';

// Real avatars for the "Likes You" blurred grid
import avatarDuc from '../../imports/image.png';
import avatarBao from '../../imports/image-1.png';
import avatarKhoa from '../../imports/image-2.png';
import avatarMinh from '../../imports/image-3.png';
import avatarLinh from '../../imports/image-4.png';
import avatarHieu from '../../imports/image-5.png';

interface MatchesViewProps {
  matches: Match[];
  isPremium: boolean;
  onShowPremium: () => void;
  onNavigateChat: () => void;
}

function formatTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Using the real uploaded avatars for the "Likes You" grid
const BLURRED_LIKES = [avatarLinh, avatarDuc, avatarMinh, avatarKhoa, avatarBao, avatarHieu];

export function MatchesView({ matches, isPremium, onShowPremium, onNavigateChat }: MatchesViewProps) {
  const [adDismissed, setAdDismissed] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      {/* New Matches — horizontal scroll row */}
      {matches.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">New Matches</h3>
            <span className="text-xs text-muted-foreground">{matches.length} total</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {matches.slice(0, 8).map(match => (
              <button
                key={match.id}
                onClick={onNavigateChat}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted ring-2 ring-[#F36F21] ring-offset-2 ring-offset-card">
                    <img src={match.profile.photos[0]} alt={match.profile.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                </div>
                <span className="text-xs text-foreground font-medium max-w-[60px] truncate text-center">{match.profile.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Likes You section */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-[#F36F21]" fill="#F36F21" />
            <h3 className="font-bold text-foreground">Likes You</h3>
            {!isPremium && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{BLURRED_LIKES.length} waiting</span>}
          </div>
          {!isPremium && (
            <button onClick={onShowPremium} className="flex items-center gap-1 text-xs text-[#C9972B] font-semibold">
              <Crown className="size-3.5" /> Unlock
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {BLURRED_LIKES.map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img src={photo} alt="" className={`w-full h-full object-cover ${!isPremium && i > 1 ? 'blur-md scale-110' : ''}`} />
              {!isPremium && i > 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                  {i === 2 && (
                    <button onClick={onShowPremium} className="flex flex-col items-center gap-1">
                      <Lock className="size-5 text-white drop-shadow-md" />
                      <span className="text-white text-xs font-bold drop-shadow-md">Premium</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {!isPremium && (
          <button
            onClick={onShowPremium}
            className="w-full mt-3 bg-gradient-to-r from-[#C9972B] to-[#F36F21] text-white py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Crown className="size-4" /> See all who liked you
          </button>
        )}
      </div>

      {/* All Matches grid */}
      {matches.length > 0 && (
        <div className="px-4 pt-4 pb-4">
          <h3 className="font-bold text-foreground mb-3">All Matches</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {matches.map(match => (
              <button
                key={match.id}
                onClick={onNavigateChat}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:scale-[1.02] transition-transform bg-muted"
              >
                <img src={match.profile.photos[0]} alt={match.profile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-left">
                  <p className="font-semibold text-sm">{match.profile.name}, {match.profile.age}</p>
                  <p className="text-white/70 text-xs">{match.profile.city}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">{formatTime(match.matchedAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && (
        <div className="flex flex-col items-center justify-center px-8 text-center py-16">
          <Heart className="size-14 text-muted-foreground/40 mb-4" />
          <h3 className="font-bold text-foreground text-xl mb-2">No matches yet</h3>
          <p className="text-muted-foreground text-sm">Keep swiping — your first match is just around the corner.</p>
        </div>
      )}

      {/* Banner Ad */}
      {!isPremium && !adDismissed && (
        <div className="mx-4 mb-4 rounded-2xl border border-border overflow-hidden bg-card">
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted">
            <span className="text-[10px] text-muted-foreground font-semibold">Sponsored · FPT Ecosystem</span>
            <button onClick={() => setAdDismissed(true)}><X className="size-3.5 text-muted-foreground" /></button>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-[#EBF2FA] dark:bg-[#1A2E42] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🛒</div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">FPT Shop</p>
              <p className="text-muted-foreground text-xs">Exclusive deals for FPT employees — up to 20% off</p>
            </div>
            <button className="bg-[#F36F21] text-white text-xs px-3 py-1.5 rounded-xl font-semibold">Shop</button>
          </div>
          <div className="flex gap-4 px-4 pb-3">
            <button className="text-[10px] text-muted-foreground underline">Why am I seeing this?</button>
            <button onClick={() => setAdDismissed(true)} className="text-[10px] text-muted-foreground underline">Hide this ad</button>
          </div>
        </div>
      )}
    </div>
  );
}
