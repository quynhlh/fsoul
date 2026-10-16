import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface FloatingPointsProps {
  points: number;
  show: boolean;
}

export function FloatingPoints({ points, show }: FloatingPointsProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -50, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.5 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl">
            <span className="text-2xl">+{points} pts</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
