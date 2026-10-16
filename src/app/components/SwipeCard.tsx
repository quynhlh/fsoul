import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Profile } from '../App';
import { MapPin, X, Heart, Star, Info, CheckCircle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  isTop: boolean;
  stackIndex: number;
}

function CompatibilityGauge({ score }: { score: number }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#F36F21' : '#94a3b8';
  const circumference = 2 * Math.PI * 18;
  const dashOffset = circumference * (1 - score / 100);
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="text-white text-xs font-bold">{score}%</span>
    </div>
  );
}

function TrustBadge({ score }: { score: Profile['trustScore'] }) {
  const config = {
    High: { color: 'bg-green-500/90', label: 'High Trust' },
    Medium: { color: 'bg-yellow-500/90', label: 'Verified' },
    Building: { color: 'bg-blue-500/90', label: 'Building' },
  }[score];
  return (
    <span className={`${config.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
      <ShieldCheck className="size-2.5" /> {config.label}
    </span>
  );
}

function LocationTag({ profile }: { profile: Profile }) {
  const label = profile.locationVisibility === 'city+office' && profile.office
    ? `${profile.city} · ${profile.office}`
    : profile.city;
  return (
    <span className="flex items-center gap-1 text-white/80 text-xs">
      <MapPin className="size-3 flex-shrink-0" />
      <span className="truncate max-w-[160px]">{label}</span>
    </span>
  );
}

export function SwipeCard({ profile, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [showTrustSheet, setShowTrustSheet] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const cardOpacity = useTransform(x, [-220, -120, 0, 120, 220], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x > 90 || info.velocity.x > 500) onSwipe('right');
    else if (info.offset.x < -90 || info.velocity.x < -500) onSwipe('left');
  };

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-card rounded-[20px] overflow-hidden shadow-xl cursor-grab active:cursor-grabbing"
        style={{
          x: isTop ? x : 0,
          rotate: isTop ? rotate : 0,
          opacity: isTop ? cardOpacity : 1,
          zIndex: isTop ? 10 : 10 - stackIndex,
          scale: isTop ? 1 : 1 - stackIndex * 0.04,
          y: isTop ? 0 : stackIndex * 8,
        }}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
      >
        {/* Like/Nope stamps */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-10 left-6 border-4 border-green-400 text-green-400 px-3 py-1 rotate-[-20deg] z-20 text-lg font-black tracking-widest rounded-lg"
              style={{ opacity: likeOpacity }}
            >LIKE</motion.div>
            <motion.div
              className="absolute top-10 right-6 border-4 border-red-400 text-red-400 px-3 py-1 rotate-[20deg] z-20 text-lg font-black tracking-widest rounded-lg"
              style={{ opacity: nopeOpacity }}
            >NOPE</motion.div>
          </>
        )}

        {/* Photo */}
        <div className="relative h-full bg-muted">
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

          {/* Top row: compatibility + info button */}
          {isTop && (
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
              <CompatibilityGauge score={profile.compatibilityScore} />
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setShowTrustSheet(true)}
                  className="bg-black/30 backdrop-blur-sm rounded-full px-2 py-1"
                >
                  <TrustBadge score={profile.trustScore} />
                </button>
                <button
                  onClick={() => setShowFullInfo(!showFullInfo)}
                  className="bg-black/30 backdrop-blur-sm p-2 rounded-full"
                >
                  {showFullInfo ? <ChevronDown className="size-4 text-white" /> : <Info className="size-4 text-white" />}
                </button>
              </div>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            {/* AI highlights */}
            {isTop && (
              <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-none">
                {profile.highlights.map(h => (
                  <span key={h} className="whitespace-nowrap bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                    {h}
                  </span>
                ))}
              </div>
            )}

            <div className="px-4 pb-24">
              {/* Verified badge */}
              {profile.verified && (
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="size-3.5 text-[#F36F21]" fill="#F36F21" />
                  <span className="text-[#F36F21] text-[10px] font-bold uppercase tracking-wider">FPT Software</span>
                </div>
              )}

              <div className="flex items-baseline gap-2 mb-0.5">
                <h2 className="text-white text-2xl font-bold leading-tight">{profile.name}</h2>
                <span className="text-white/90 text-xl font-light">{profile.age}</span>
              </div>
              <p className="text-white/70 text-xs mb-1">{profile.role}</p>
              <LocationTag profile={profile} />

              {/* Expanded info */}
              {showFullInfo && isTop && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 space-y-2"
                >
                  <p className="text-white/90 text-sm leading-relaxed">{profile.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.map(i => (
                      <span key={i} className="bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                        {i}
                      </span>
                    ))}
                  </div>
                  <button className="text-white/60 text-xs underline mt-1">How is compatibility calculated?</button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isTop && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 px-6 z-20">
            <button
              onClick={() => onSwipe('left')}
              className="w-14 h-14 bg-white dark:bg-card rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-border"
            >
              <X className="size-7 text-red-400" />
            </button>
            <button
              onClick={() => onSwipe('up')}
              className="w-12 h-12 bg-[#EBF2FA] dark:bg-[#1A2E42] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-border"
            >
              <Star className="size-5 text-[#0F4C81]" fill="#0F4C81" />
            </button>
            <button
              onClick={() => onSwipe('right')}
              className="w-14 h-14 bg-gradient-to-br from-[#F36F21] to-[#e55a0e] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart className="size-7 text-white" fill="white" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Trust Score bottom sheet */}
      {showTrustSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowTrustSheet(false)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-card w-full max-w-sm rounded-t-3xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Profile Trust Score</h3>
              <TrustBadge score={profile.trustScore} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">This score is built from transparent, objective signals — never from your chat content or sensitive data.</p>
            {[
              { label: 'Verified FPT email', done: true },
              { label: 'Photo verification', done: profile.trustScore !== 'Building' },
              { label: 'Profile completeness', done: true },
              { label: 'Community standing', done: profile.trustScore === 'High' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${s.done ? 'bg-green-500' : 'bg-muted'}`}>
                  {s.done && <CheckCircle className="size-3 text-white" />}
                </div>
                <span className="text-sm text-foreground">{s.label}</span>
              </div>
            ))}
            <button className="text-xs text-muted-foreground underline mt-4">Report a problem with this score</button>
          </motion.div>
        </div>
      )}
    </>
  );
}
