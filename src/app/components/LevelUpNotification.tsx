import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Star } from 'lucide-react';

interface LevelUpNotificationProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpNotification({ show, level, onClose }: LevelUpNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md"
        >
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 100, x: Math.random() * 100 - 50, opacity: 0 }}
                  animate={{
                    y: -100,
                    x: Math.random() * 100 - 50 + (Math.random() - 0.5) * 50,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute"
                  style={{ left: `${Math.random() * 100}%` }}
                >
                  <Star className="size-4 text-yellow-300" />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative text-center text-white">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Crown className="size-16 mx-auto mb-3 text-yellow-300" />
              </motion.div>

              <h2 className="text-2xl mb-2">Level Up!</h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="size-5" />
                <span className="text-4xl">Level {level}</span>
                <Sparkles className="size-5" />
              </div>
              <p className="text-white/90 mb-4">
                You're on fire! Keep matching to unlock more rewards
              </p>

              <button
                onClick={onClose}
                className="bg-white text-purple-600 px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                Awesome!
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
