import { UserStats } from '../App';
import { Trophy, Flame, Target, Award, Gift, TrendingUp, Zap, Crown, Star } from 'lucide-react';

interface GamificationViewProps {
  userStats: UserStats;
  onShowReward: () => void;
}

const ACHIEVEMENTS = [
  { id: 'first_match', name: 'First Match', icon: '💘', description: 'Got your first match!', points: 100 },
  { id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: '7 day login streak', points: 200 },
  { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', description: '10 matches in a day', points: 300 },
  { id: 'conversation_starter', name: 'Conversation Starter', icon: '💬', description: 'Sent 50 messages', points: 150 },
  { id: 'popular', name: 'Popular', icon: '⭐', description: 'Received 100 likes', points: 250 },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Active after midnight', points: 100 },
];

const DAILY_CHALLENGES = [
  { id: 1, title: 'Swipe 30 profiles', progress: 15, total: 30, reward: 50, icon: Target },
  { id: 2, title: 'Get 3 matches', progress: 3, total: 3, reward: 100, icon: Award, completed: true },
  { id: 3, title: 'Send 5 messages', progress: 2, total: 5, reward: 75, icon: Zap },
];

export function GamificationView({ userStats, onShowReward }: GamificationViewProps) {
  const levelProgress = (userStats.points % 1000) / 1000 * 100;
  const nextLevelPoints = 1000 - (userStats.points % 1000);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-orange-50 to-pink-50">
      {/* Level & Points Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="size-6 text-yellow-300" />
              <span className="text-2xl">Level {userStats.level}</span>
            </div>
            <p className="text-white/80 text-sm">{nextLevelPoints} points to next level</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Trophy className="size-6 text-yellow-300" />
              <span className="text-2xl">{userStats.points}</span>
            </div>
            <p className="text-white/80 text-sm">Total Points</p>
          </div>
        </div>
        
        {/* Level Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-yellow-300 h-full transition-all duration-500 rounded-full"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Daily Streak */}
      <div className="p-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Flame className="size-6 text-orange-500" />
              Daily Streak
            </h3>
            <span className="text-3xl text-orange-500">{userStats.streak}</span>
          </div>
          <div className="flex gap-2 mb-3">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-12 rounded-lg flex flex-col items-center justify-center ${
                  i < userStats.streak
                    ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Flame className="size-5" />
                <span className="text-xs mt-0.5">{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm text-center">
            Keep it going! Come back tomorrow to maintain your streak 🔥
          </p>
        </div>

        {/* Daily Reward */}
        <button
          onClick={onShowReward}
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform mb-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="relative flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-xl mb-1">Daily Bonus!</h3>
              <p className="text-white/90 text-sm">Claim your free reward</p>
            </div>
            <Gift className="size-12" />
          </div>
        </button>

        {/* Daily Challenges */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
            <Target className="size-5 text-orange-500" />
            Daily Challenges
          </h3>
          <div className="space-y-3">
            {DAILY_CHALLENGES.map((challenge) => {
              const Icon = challenge.icon;
              const progress = (challenge.progress / challenge.total) * 100;
              
              return (
                <div key={challenge.id} className="bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${challenge.completed ? 'bg-green-100' : 'bg-orange-100'}`}>
                        <Icon className={`size-5 ${challenge.completed ? 'text-green-600' : 'text-orange-500'}`} />
                      </div>
                      <div>
                        <p className="text-gray-900 text-sm">{challenge.title}</p>
                        <p className="text-gray-500 text-xs">
                          {challenge.progress}/{challenge.total}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {challenge.completed ? (
                        <span className="text-green-600 text-sm">✓ Done</span>
                      ) : (
                        <span className="text-orange-500 text-sm">+{challenge.reward}</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${challenge.completed ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="size-5 text-orange-500" />
            Today's Activity
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow text-center">
              <div className="text-3xl text-orange-500 mb-1">{userStats.swipesToday}</div>
              <p className="text-gray-600 text-sm">Swipes</p>
              <p className="text-orange-500 text-xs mt-1">+{userStats.swipesToday * 5} pts</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow text-center">
              <div className="text-3xl text-pink-500 mb-1">{userStats.matchesToday}</div>
              <p className="text-gray-600 text-sm">Matches</p>
              <p className="text-pink-500 text-xs mt-1">+{userStats.matchesToday * 50} pts</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
            <Award className="size-5 text-orange-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = userStats.achievements.includes(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`bg-white rounded-xl p-3 shadow text-center ${
                    !isUnlocked && 'opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-1">{achievement.icon}</div>
                  <p className="text-gray-900 text-xs mb-0.5">{achievement.name}</p>
                  {isUnlocked && (
                    <div className="flex items-center justify-center gap-1 text-orange-500">
                      <Star className="size-3" />
                      <span className="text-xs">+{achievement.points}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
