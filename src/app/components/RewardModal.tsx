import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles } from 'lucide-react';

interface RewardModalProps {
  type: 'daily' | 'achievement';
  onClose: () => void;
  onClaim: (points: number) => void;
}

const REWARDS = [
  { id: 1, name: '50 Points', icon: '💎', value: 50 },
  { id: 2, name: '100 Points', icon: '⭐', value: 100 },
  { id: 3, name: '150 Points', icon: '🎁', value: 150 },
  { id: 4, name: '200 Points', icon: '👑', value: 200 },
  { id: 5, name: '25 Points', icon: '💫', value: 25 },
  { id: 6, name: '75 Points', icon: '🔥', value: 75 },
];

export function RewardModal({ type, onClose, onClaim }: RewardModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<typeof REWARDS[0] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setShowConfetti(false);
    
    // Simulate spinning
    setTimeout(() => {
      const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      setSelectedReward(randomReward);
      setSpinning(false);
      setShowConfetti(true);
    }, 2000);
  };

  const handleClaim = () => {
    if (selectedReward) {
      onClaim(selectedReward.value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1 }}
                  animate={{ 
                    y: 500, 
                    x: Math.random() * 400 - 200 + (Math.random() - 0.5) * 100,
                    rotate: Math.random() * 360,
                    opacity: 0 
                  }}
                  transition={{ duration: 2, delay: i * 0.05 }}
                  className="absolute top-0 left-1/2"
                >
                  <div 
                    className="size-3 rounded-full"
                    style={{ 
                      backgroundColor: ['#f97316', '#ec4899', '#fbbf24', '#8b5cf6', '#10b981'][i % 5] 
                    }}
                  />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="size-5 text-gray-500" />
        </button>

        <div className="text-center">
          <motion.div
            animate={spinning ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, repeat: spinning ? Infinity : 0, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Gift className="size-16 text-orange-500" />
          </motion.div>

          <h2 className="text-gray-900 text-2xl mb-2">
            {type === 'daily' ? 'Daily Bonus' : 'Achievement Unlocked'}
          </h2>
          <p className="text-gray-600 mb-6">
            {selectedReward 
              ? 'Congratulations! 🎉' 
              : 'Spin the wheel to claim your reward!'}
          </p>

          {/* Reward Wheel */}
          <div className="mb-6">
            <div className="relative inline-block">
              <motion.div
                animate={spinning ? { rotate: 360 * 5 } : {}}
                transition={{ duration: 2, ease: "easeOut" }}
                className="grid grid-cols-3 gap-3 bg-gradient-to-br from-orange-100 to-pink-100 p-6 rounded-2xl"
              >
                {REWARDS.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    className={`bg-white rounded-xl p-4 shadow-lg ${
                      selectedReward?.id === reward.id && !spinning
                        ? 'ring-4 ring-orange-500 scale-110'
                        : ''
                    }`}
                    animate={
                      selectedReward?.id === reward.id && !spinning
                        ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-3xl mb-1">{reward.icon}</div>
                    <p className="text-gray-900 text-xs">{reward.name}</p>
                  </motion.div>
                ))}
              </motion.div>
              
              {selectedReward && !spinning && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-orange-500 text-white rounded-full size-20 flex items-center justify-center shadow-xl">
                    <Sparkles className="size-8" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {!selectedReward ? (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {spinning ? 'Spinning...' : 'Spin to Win!'}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-4">
                <p className="text-gray-700 mb-1">You won!</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl">{selectedReward.icon}</span>
                  <span className="text-3xl text-orange-500">+{selectedReward.value}</span>
                </div>
              </div>
              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Claim Reward
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
