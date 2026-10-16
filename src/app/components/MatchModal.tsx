import { useState } from 'react';
import { motion } from 'motion/react';
import { Profile } from '../App';
import { X, Sparkles, RotateCcw, ChevronDown, HelpCircle, Heart } from 'lucide-react';

interface MatchModalProps {
  profile: Profile;
  onClose: () => void;
  onSendMessage: () => void;
}

type Tone = 'Match their vibe' | 'Playful' | 'Sincere' | 'Curious' | 'Bold';

const STARTER_DATA: Record<string, string[][]> = {
  adventurous: [
    ["Okay, be honest: what's the scariest trail you've actually finished?", "Match their vibe"],
    ["I need to know — is there a view that made you think 'worth every blister'?", "Curious"],
    ["Adventure buddy wanted. First date: pick a random hiking trail and see who gets lost first. You in?", "Playful"],
  ],
  creative: [
    ["Your bio mentioned watercolor — what's the last thing you painted that surprised you?", "Sincere"],
    ["I feel like a person who does art after work has to have a chaotic inner life. Prove me wrong?", "Playful"],
    ["What's the creative project you keep starting but never finishing?", "Curious"],
  ],
  tech: [
    ["Coffee snob AND backend engineer? I bet your commit messages are immaculate.", "Playful"],
    ["Genuine question — do you actually enjoy debugging, or is that a coping mechanism?", "Curious"],
    ["What's the code you've written that you're most proud of that nobody will ever see?", "Sincere"],
  ],
};

function getStarters(profile: Profile) {
  const has = (kw: string) =>
    profile.interests.some(i => i.toLowerCase().includes(kw)) ||
    profile.bio.toLowerCase().includes(kw) ||
    profile.highlights.some(h => h.toLowerCase().includes(kw));

  if (has('hik') || has('trail') || has('adven') || has('outdoor')) return { key: 'adventurous', label: 'Adventurous, outdoorsy', starters: STARTER_DATA.adventurous };
  if (has('art') || has('design') || has('creat') || has('photo')) return { key: 'creative', label: 'Creative, artistic', starters: STARTER_DATA.creative };
  return { key: 'tech', label: 'Tech-savvy, analytical', starters: STARTER_DATA.tech };
}

const TONES: Tone[] = ['Match their vibe', 'Playful', 'Sincere', 'Curious', 'Bold'];

export function MatchModal({ profile, onClose, onSendMessage }: MatchModalProps) {
  const [selectedStarter, setSelectedStarter] = useState<string | null>(null);
  const [activeTone, setActiveTone] = useState<Tone>('Match their vibe');
  const [showWhy, setShowWhy] = useState<number | null>(null);
  const { label, starters } = getStarters(profile);

  const filteredStarters = activeTone === 'Match their vibe'
    ? starters
    : starters.filter(([, t]) => t === activeTone).concat(starters.filter(([, t]) => t !== activeTone)).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F36F21] via-[#e55a0e] to-[#0F4C81] z-50 flex flex-col overflow-hidden">
      {/* Confetti dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: `${(i * 8.3) + Math.random() * 8}vw`, opacity: 1, scale: 1 }}
          animate={{ y: '110vh', opacity: 0, scale: 0.5 }}
          transition={{ duration: 2.5 + Math.random(), delay: i * 0.1, ease: 'easeIn' }}
          className="absolute top-0 w-3 h-3 rounded-full"
          style={{ backgroundColor: ['#fff', '#FFD700', '#FFB347', '#87CEEB'][i % 4] }}
        />
      ))}

      <button onClick={onClose} className="absolute top-12 right-5 sm:top-5 p-2.5 bg-white/20 rounded-full z-10">
        <X className="size-5 text-white" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-start pt-16 sm:pt-10 px-6 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-white text-4xl font-bold mb-1">It's a Match!</h1>
          <p className="text-white/80 text-sm">You and {profile.name} liked each other</p>
        </motion.div>

        {/* Photo pair */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-3 border-white shadow-xl bg-muted">
            <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <Heart className="size-8 text-white" fill="white" />
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-3 border-white shadow-xl bg-gradient-to-br from-[#F36F21] to-[#C9972B] flex items-center justify-center">
            <span className="text-white text-3xl font-bold">You</span>
          </div>
        </motion.div>

        {/* AI conversation starters */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-white/10 backdrop-blur-sm rounded-3xl p-4 mb-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-yellow-300" />
            <p className="text-white font-semibold text-sm">Not sure what to say?</p>
          </div>
          <p className="text-white/70 text-xs mb-3">
            Tailored to {profile.name.split(' ')[0]}&apos;s profile: <span className="text-white/90">{label}</span>
          </p>

          {/* Tone selector */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 mb-3">
            {TONES.map(tone => (
              <button
                key={tone}
                onClick={() => setActiveTone(tone)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${activeTone === tone ? 'bg-white text-[#F36F21]' : 'bg-white/15 text-white hover:bg-white/25'}`}
              >
                {tone}
              </button>
            ))}
          </div>

          {/* Starters */}
          <div className="space-y-2">
            {filteredStarters.map(([text, tone], i) => (
              <div key={i} className={`rounded-2xl p-3 border-2 transition-all cursor-pointer ${selectedStarter === text ? 'border-white bg-white/20' : 'border-white/20 bg-white/10 hover:border-white/40'}`}
                onClick={() => setSelectedStarter(text)}
              >
                <p className="text-white text-sm leading-relaxed mb-2">{text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[10px]">{tone}</span>
                  <div className="flex gap-2">
                    <button onClick={e => { e.stopPropagation(); setShowWhy(showWhy === i ? null : i); }} className="text-white/60 hover:text-white/90 transition-colors">
                      <HelpCircle className="size-3.5" />
                    </button>
                    <button onClick={e => e.stopPropagation()} className="text-white/60 hover:text-white/90 transition-colors">
                      <RotateCcw className="size-3.5" />
                    </button>
                  </div>
                </div>
                {showWhy === i && (
                  <p className="text-white/70 text-xs mt-2 pt-2 border-t border-white/20">
                    Suggested because {profile.name.split(' ')[0]}&apos;s profile highlights {label.toLowerCase()} traits, which respond well to {tone.toLowerCase()} openers.
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full space-y-2.5 pb-8"
        >
          <button
            onClick={onSendMessage}
            className="w-full bg-white text-[#F36F21] py-4 rounded-2xl font-bold text-base hover:bg-white/90 transition-colors"
          >
            {selectedStarter ? 'Send this message' : 'Send a message'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/15 text-white py-3.5 rounded-2xl font-semibold hover:bg-white/25 transition-colors"
          >
            Keep Swiping
          </button>
        </motion.div>
      </div>
    </div>
  );
}
