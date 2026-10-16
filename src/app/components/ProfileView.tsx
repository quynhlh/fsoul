import { useState } from 'react';
import { UserStats } from '../App';
import { FPT_LOCATIONS } from '../data/locations';
import {
  Settings, Edit, Camera, MapPin, Briefcase, ChevronRight, Crown,
  Shield, Eye, EyeOff, Globe, Sun, Moon, Bell, Trash2, HelpCircle,
  Lock, AlertTriangle, X, CheckCircle, Plane
} from 'lucide-react';

type SubView = 'main' | 'editProfile' | 'locationSettings' | 'privacySettings' | 'safetySettings' | 'safeDistance' | 'notifications' | 'blockedList';

interface ProfileViewProps {
  darkMode: boolean;
  language: 'en' | 'vi';
  isPremium: boolean;
  onToggleDark: () => void;
  onLanguageChange: (l: 'en' | 'vi') => void;
  onShowPremium: () => void;
  userStats: UserStats;
  onShowRewards: () => void;
}

const MY_CITY = FPT_LOCATIONS.find(c => c.id === 'hcm')!;
const MY_OFFICE = MY_CITY.offices?.[0]!;

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${on ? 'bg-[#F36F21]' : 'bg-muted'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

function SettingRow({
  icon,
  label,
  sub,
  right,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const inner = (
    <>
      <div className={`flex-shrink-0 ${danger ? 'text-destructive' : 'text-muted-foreground'}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-destructive' : 'text-foreground'}`}>{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{sub}</p>}
      </div>
      {right ?? (onClick && <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />)}
    </>
  );
  const cls = `w-full flex items-center gap-3 px-5 py-4 transition-colors text-left ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${danger ? 'text-destructive' : ''}`;
  // Use div when a right element (e.g. Toggle button) is present to avoid button-in-button
  if (right) {
    return <div className={cls} onClick={onClick}>{inner}</div>;
  }
  return (
    <button onClick={onClick} disabled={!onClick} className={cls}>
      {inner}
    </button>
  );
}

// ── Location Settings ─────────────────────────────────────────────────────────
function LocationSettingsView({ onBack }: { onBack: () => void }) {
  const [selectedCityId, setSelectedCityId] = useState(MY_CITY.id);
  const [selectedOfficeId, setSelectedOfficeId] = useState(MY_OFFICE.id);
  const [visibility, setVisibility] = useState<'city' | 'city+office'>('city');
  const [hideFromOffice, setHideFromOffice] = useState(false);
  const [hideFromTeam, setHideFromTeam] = useState(true);
  const [travelMode, setTravelMode] = useState(false);
  const [travelCityId, setTravelCityId] = useState('');

  const selectedCity = FPT_LOCATIONS.find(c => c.id === selectedCityId);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <button onClick={onBack} className="p-1.5 rounded-full bg-muted text-muted-foreground">
          <X className="size-4" />
        </button>
        <h2 className="font-bold text-foreground">Location & Privacy</h2>
      </div>

      <div className="p-5 space-y-6">
        {/* Current location */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Location</p>
          <div className="bg-muted rounded-2xl p-4 flex items-start gap-3">
            <MapPin className="size-5 text-[#F36F21] mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">{selectedCity?.name}</p>
              {selectedOfficeId && selectedCity?.offices && (
                <p className="text-xs text-muted-foreground">{selectedCity.offices.find(o => o.id === selectedOfficeId)?.name}</p>
              )}
            </div>
            <button className="ml-auto text-[#F36F21] text-sm font-semibold">Change</button>
          </div>
        </div>

        {/* Visibility */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Visible Location</p>
          <p className="text-xs text-muted-foreground mb-3">People filtering by an office will only see you there if you choose City + Office.</p>
          <div className="flex gap-2">
            {(['city', 'city+office'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all flex items-center justify-center gap-1.5 ${visibility === v ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21]' : 'border-border text-muted-foreground'}`}
              >
                {v === 'city' ? <><EyeOff className="size-3.5" /> City only</> : <><Eye className="size-3.5" /> City + Office</>}
              </button>
            ))}
          </div>
        </div>

        {/* Workplace privacy */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workplace Privacy</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-start gap-3 p-4 border-b border-border">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Hide me from my own office</p>
                <p className="text-xs text-muted-foreground mt-0.5">Prevents you from appearing to direct colleagues at {MY_OFFICE.name}. Reduces awkward situations.</p>
              </div>
              <Toggle on={hideFromOffice} onToggle={() => setHideFromOffice(!hideFromOffice)} />
            </div>
            <div className="flex items-start gap-3 p-4">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Hide me from my team / department</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your direct team members won't see you in Discover. Keeps professional boundaries clear.</p>
              </div>
              <Toggle on={hideFromTeam} onToggle={() => setHideFromTeam(!hideFromTeam)} />
            </div>
          </div>
        </div>

        {/* Travel mode */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Travel Mode</p>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <Plane className="size-5 text-[#0F4C81]" />
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Visiting another office?</p>
                <p className="text-xs text-muted-foreground">Temporarily appear in a different city or office.</p>
              </div>
              <Toggle on={travelMode} onToggle={() => setTravelMode(!travelMode)} />
            </div>
            {travelMode && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  {FPT_LOCATIONS.filter(c => c.id !== selectedCityId).slice(0, 4).map(city => (
                    <button
                      key={city.id}
                      onClick={() => setTravelCityId(city.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${travelCityId === city.id ? 'border-[#0F4C81] bg-[#EBF2FA] dark:bg-[#1A2E42] text-[#0F4C81]' : 'border-border text-muted-foreground'}`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="date" className="flex-1 px-3 py-2 rounded-xl bg-muted text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
                  <span className="text-xs text-muted-foreground">ends</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Safe Distance View ─────────────────────────────────────────────────────────
function SafeDistanceView({ isPremium, onShowPremium, onBack }: { isPremium: boolean; onShowPremium: () => void; onBack: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [radius, setRadius] = useState(200);

  if (!isPremium) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <button onClick={onBack} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X className="size-4" /></button>
          <h2 className="font-bold text-foreground">Safe Distance</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#C9972B] to-[#F36F21] rounded-3xl flex items-center justify-center mb-5">
            <Shield className="size-10 text-white" />
          </div>
          <h3 className="font-bold text-foreground text-xl mb-3">Safe Distance Alerts</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Get a discreet alert when a blocked person is nearby. The alert shows no name, photo, or location — only &quot;A person you blocked is within your Safe Distance.&quot;
          </p>
          <div className="bg-muted rounded-2xl p-4 text-left mb-6 w-full">
            <p className="font-semibold text-foreground text-sm mb-3">Privacy rules:</p>
            {[
              'No name, photo, or map pin shown',
              'Only a proximity band: "very close"',
              "Blocked person is never notified",
              'Works only if both users have location on',
            ].map(rule => (
              <div key={rule} className="flex items-center gap-2 py-1.5">
                <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{rule}</p>
              </div>
            ))}
          </div>
          <button onClick={onShowPremium} className="w-full bg-gradient-to-r from-[#C9972B] to-[#F36F21] text-white py-4 rounded-2xl font-semibold">
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <button onClick={onBack} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X className="size-4" /></button>
        <h2 className="font-bold text-foreground">Safe Distance</h2>
        <span className="ml-auto text-xs bg-gradient-to-r from-[#C9972B] to-[#F36F21] text-white px-2 py-0.5 rounded-full font-semibold">Premium</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl">
          <div>
            <p className="font-semibold text-foreground">Enable Safe Distance</p>
            <p className="text-xs text-muted-foreground mt-0.5">Get proximity alerts for blocked people</p>
          </div>
          <Toggle on={enabled} onToggle={() => setEnabled(!enabled)} />
        </div>
        {enabled && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="font-semibold text-foreground mb-1">Alert radius</p>
            <p className="text-xs text-muted-foreground mb-3">You'll be notified when within this distance.</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10">50m</span>
              <input type="range" min={50} max={1000} step={50} value={radius} onChange={e => setRadius(+e.target.value)} className="flex-1 accent-[#F36F21]" />
              <span className="text-xs text-muted-foreground w-10 text-right">1km</span>
            </div>
            <p className="text-[#F36F21] font-bold text-center mt-2">{radius >= 1000 ? '1 km' : `${radius} m`}</p>
          </div>
        )}
        <div className="bg-[#EBF2FA] dark:bg-[#1A2E42] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="size-4 text-[#0F4C81] dark:text-[#93BAE0]" />
            <p className="font-semibold text-[#0F4C81] dark:text-[#93BAE0] text-sm">How it works</p>
          </div>
          <p className="text-xs text-[#0F4C81] dark:text-[#93BAE0] leading-relaxed">
            When a blocked contact comes within your safe distance, you receive a discreet notification. The alert never shows their name, photo, exact location, or direction. You can share your location with a trusted contact or call the HR/Security hotline directly from the alert.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Blocked People ({['Nguyen Van A', 'Tran Thi B'].length})</p>
          {['Nguyen Van A', 'Tran Thi B'].map((name, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">{name[0]}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">Alert radius: {200 + i * 50}m</p>
              </div>
              <input type="range" min={50} max={1000} step={50} defaultValue={200 + i * 50} className="w-20 accent-[#F36F21]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Profile View ──────────────────────────────────────────────────────────
export function ProfileView({ darkMode, language, isPremium, onToggleDark, onLanguageChange, onShowPremium, userStats, onShowRewards }: ProfileViewProps) {
  const [subView, setSubView] = useState<SubView>('main');
  const [profilePaused, setProfilePaused] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  if (subView === 'locationSettings') return <LocationSettingsView onBack={() => setSubView('main')} />;
  if (subView === 'safeDistance') return <SafeDistanceView isPremium={isPremium} onShowPremium={onShowPremium} onBack={() => setSubView('main')} />;

  return (
    <div className="h-full overflow-y-auto">
      {/* Profile header */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-[#F36F21] via-[#e05510] to-[#0F4C81]" />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
            <Settings className="size-5 text-white" />
          </button>
        </div>
        <div className="px-5 pb-5 -mt-12">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-[#F36F21] to-[#C9972B] border-4 border-card shadow-lg flex items-center justify-center">
              <span className="text-white text-3xl font-bold">TL</span>
            </div>
            <button className="absolute -bottom-1 -right-1 bg-[#F36F21] text-white p-1.5 rounded-full shadow">
              <Camera className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-2">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-bold text-foreground text-xl">Thu Linh Pham</h2>
            <p className="text-muted-foreground text-sm">Frontend Engineer · Mid</p>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="size-4 text-[#F36F21]" fill="#F36F21" />
            <span className="text-xs text-[#F36F21] font-semibold">FPT Software</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
          <MapPin className="size-3.5 text-[#F36F21]" />
          <span>Ho Chi Minh City</span>
          <button onClick={() => setSubView('locationSettings')} className="text-[#F36F21] font-semibold ml-1">Edit</button>
        </div>

        {/* Profile completeness */}
        <div className="bg-[#FFF5EE] dark:bg-[#2A1F0F] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Profile Completeness</span>
            <span className="text-[#F36F21] text-sm font-bold">80%</span>
          </div>
          <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2 mb-2">
            <div className="bg-[#F36F21] h-2 rounded-full" style={{ width: '80%' }} />
          </div>
          <p className="text-xs text-muted-foreground">Add your bio to reach 100% — gets you 3× more matches</p>
        </div>

        {/* Rewards shortcut */}
        <button
          onClick={onShowRewards}
          className="w-full flex items-center gap-3 bg-gradient-to-r from-[#C9972B]/10 to-[#F36F21]/10 border border-[#F36F21]/20 rounded-2xl p-4 mb-4"
        >
          <div className="text-2xl">🏆</div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground text-sm">Level {userStats.level} · {userStats.points.toLocaleString()} pts</p>
            <p className="text-xs text-muted-foreground">{userStats.streak}-day streak · Claim daily reward</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>

        {!isPremium && (
          <button
            onClick={onShowPremium}
            className="w-full flex items-center gap-3 bg-gradient-to-r from-[#C9972B] to-[#F36F21] rounded-2xl p-4 mb-4 text-white"
          >
            <Crown className="size-5" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Upgrade to Premium</p>
              <p className="text-white/80 text-xs">Unlimited likes, AI features, ad-free</p>
            </div>
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>

      {/* Settings sections */}
      <div className="pb-6">
        <div className="px-5 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
        </div>
        <div className="bg-card border-t border-b border-border">
          <SettingRow icon={<Edit className="size-4" />} label="Edit Profile" onClick={() => {}} />
          <SettingRow icon={<MapPin className="size-4" />} label="Location & Office" sub="Ho Chi Minh City · Ftown 3 & Ftown 2" onClick={() => setSubView('locationSettings')} />
          <SettingRow icon={<Briefcase className="size-4" />} label="Work Details" sub="Frontend Engineer · FPT Software" onClick={() => {}} />
        </div>

        <div className="px-5 py-2 mt-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Privacy</p>
        </div>
        <div className="bg-card border-t border-b border-border">
          <SettingRow
            icon={<Eye className="size-4" />}
            label="Pause my profile"
            sub="Hidden from Discover while paused"
            right={<Toggle on={profilePaused} onToggle={() => setProfilePaused(!profilePaused)} />}
          />
          <SettingRow
            icon={<MapPin className="size-4" />}
            label="Location sharing"
            right={<Toggle on={locationSharing} onToggle={() => setLocationSharing(!locationSharing)} />}
          />
          <SettingRow icon={<Shield className="size-4" />} label="Safe Distance Alerts" sub={isPremium ? 'Premium feature · Set up now' : 'Premium feature'} onClick={() => setSubView('safeDistance')} />
          <SettingRow icon={<Lock className="size-4" />} label="Blocked List" onClick={() => setSubView('blockedList')} />
        </div>

        <div className="px-5 py-2 mt-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preferences</p>
        </div>
        <div className="bg-card border-t border-b border-border">
          <SettingRow
            icon={darkMode ? <Moon className="size-4" /> : <Sun className="size-4" />}
            label="Dark Mode"
            right={<Toggle on={darkMode} onToggle={onToggleDark} />}
          />
          <SettingRow
            icon={<Globe className="size-4" />}
            label="Language"
            sub={language === 'en' ? 'English' : 'Tiếng Việt'}
            right={
              <div className="flex rounded-xl bg-muted overflow-hidden">
                {(['en', 'vi'] as const).map(lang => (
                  <button key={lang} onClick={() => onLanguageChange(lang)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-all ${language === lang ? 'bg-[#F36F21] text-white' : 'text-muted-foreground'}`}>
                    {lang === 'en' ? 'EN' : 'VI'}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow icon={<Bell className="size-4" />} label="Notifications" onClick={() => {}} />
        </div>

        <div className="px-5 py-2 mt-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Help & Safety</p>
        </div>
        <div className="bg-card border-t border-b border-border">
          <SettingRow icon={<HelpCircle className="size-4" />} label="Help & Safety Center" onClick={() => {}} />
          <SettingRow icon={<AlertTriangle className="size-4" />} label="Community Guidelines" onClick={() => {}} />
          <SettingRow icon={<Trash2 className="size-4" />} label="Delete Account" danger onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
