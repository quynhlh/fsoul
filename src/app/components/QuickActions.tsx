import { motion } from 'motion/react';
import { Zap, Award, Users, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (view: string) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions = [
    {
      icon: Zap,
      label: 'Daily Bonus',
      color: 'from-yellow-400 to-orange-500',
      view: 'rewards',
      badge: 'New!',
    },
    {
      icon: Users,
      label: 'Nearby Map',
      color: 'from-blue-400 to-cyan-500',
      view: 'map',
    },
    {
      icon: Award,
      label: 'Challenges',
      color: 'from-purple-400 to-pink-500',
      view: 'rewards',
      badge: '3',
    },
    {
      icon: TrendingUp,
      label: 'Your Stats',
      color: 'from-green-400 to-emerald-500',
      view: 'rewards',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onNavigate(action.view)}
            className={`relative bg-gradient-to-br ${action.color} p-4 rounded-2xl text-white hover:scale-105 transition-transform shadow-lg`}
          >
            {action.badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {action.badge}
              </span>
            )}
            <Icon className="size-8 mb-2" />
            <p className="text-sm">{action.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
