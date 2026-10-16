import { useState } from 'react';
import { SwipeCard } from './SwipeCard';
import { Profile, FilterState } from '../App';
import { FPT_LOCATIONS } from '../data/locations';
import { SlidersHorizontal, X, ChevronDown, ChevronRight, Search, RotateCcw, Zap, AlertCircle, Heart, Ban, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Real FPT employee avatars — uploaded by user
import avatarDuc from '../../imports/image.png';
import avatarBao from '../../imports/image-1.png';
import avatarKhoa from '../../imports/image-2.png';
import avatarMinh from '../../imports/image-3.png';
import avatarLinh from '../../imports/image-4.png';
import avatarHieu from '../../imports/image-5.png';
import avatarAnh from '../../imports/image-6.png';

// Supplementary Unsplash portrait for Tokyo office profile
const PHOTO_TOKYO = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&auto=format';

const mockProfiles: Profile[] = [
  {
    id: '1', name: 'Linh Nguyen', age: 25,
    bio: 'Frontend dev who believes great UX makes lives better ✨ Coffee snob, weekend hiker, aspiring home chef.',
    photos: [avatarLinh],
    interests: ['Hiking', 'Coffee', 'Design', 'Cooking'],
    city: 'Ho Chi Minh City', cityId: 'hcm', office: 'Ftown 3 & Ftown 2', officeId: 'ftown',
    locationVisibility: 'city+office', verified: true, trustScore: 'High', compatibilityScore: 87,
    highlights: ['Adventurous spirit', 'Loves hiking', 'Creative soul'],
    role: 'Frontend Engineer · Senior', distance: 2, location: { lat: 10.85, lng: 106.63 },
  },
  {
    id: '2', name: 'Minh Tran', age: 28,
    bio: 'Backend engineer obsessed with clean code and strong coffee ☕ Ask me about distributed systems or my weekend plans — both are complicated.',
    photos: [avatarMinh],
    interests: ['Tech', 'Music', 'Cycling', 'Coffee'],
    city: 'Hanoi', cityId: 'hanoi', office: 'Hoa Lac Campus', officeId: 'hoalac',
    locationVisibility: 'city+office', verified: true, trustScore: 'High', compatibilityScore: 73,
    highlights: ['Tech-savvy', 'Music lover', 'Early riser'],
    role: 'Backend Engineer · Lead', distance: 0, location: { lat: 21.03, lng: 105.78 },
  },
  {
    id: '3', name: 'Anh Le', age: 26,
    bio: 'UX designer by day, amateur watercolor artist by night 🎨 Da Nang beaches fuel my creativity. Looking for someone to explore hidden cafes with.',
    photos: [avatarAnh],
    interests: ['Art', 'Design', 'Photography', 'Yoga'],
    city: 'Da Nang', cityId: 'danang',
    locationVisibility: 'city', verified: true, trustScore: 'Medium', compatibilityScore: 91,
    highlights: ['Creative soul', 'Art & design', 'Bookworm'],
    role: 'UX Designer · Mid', distance: 3, location: { lat: 16.07, lng: 108.22 },
  },
  {
    id: '4', name: 'Duc Hoang', age: 30,
    bio: 'DevOps at heart, home barista by passion. I automate things so I have more time to perfect my pour-over technique. Dog dad to a very spoiled corgi.',
    photos: [avatarDuc],
    interests: ['Fitness', 'Coffee', 'Dogs', 'Cooking'],
    city: 'Ho Chi Minh City', cityId: 'hcm', office: 'Tan Thuan Office', officeId: 'tanthan',
    locationVisibility: 'city+office', verified: true, trustScore: 'High', compatibilityScore: 68,
    highlights: ['Fitness minded', 'Coffee expert', 'Dog dad'],
    role: 'DevOps Engineer · Senior', distance: 5, location: { lat: 10.73, lng: 106.72 },
  },
  {
    id: '5', name: 'Kenji Yamamoto', age: 27,
    bio: 'Software architect at FPT Japan 🗾 Bridging Vietnamese and Japanese engineering culture. Weekend soba chef, amateur bonsai grower.',
    photos: [PHOTO_TOKYO],
    interests: ['Architecture', 'Cooking', 'Bonsai', 'Travel'],
    city: 'Tokyo', cityId: 'tokyo',
    locationVisibility: 'city', verified: true, trustScore: 'High', compatibilityScore: 82,
    highlights: ['Cross-cultural bridge', 'Detail-oriented', 'Foodie'],
    role: 'Software Architect · Senior', distance: 0, location: { lat: 35.68, lng: 139.69 },
  },
  {
    id: '6', name: 'Bao Nguyen', age: 29,
    bio: 'Security researcher by day, jazz drummer by night 🥁 I find patterns in both malware and music. Looking for genuine conversations and someone who appreciates a good vinyl record.',
    photos: [avatarBao],
    interests: ['Music', 'Security', 'Jazz', 'Reading'],
    city: 'Hanoi', cityId: 'hanoi', office: 'Hoa Lac Campus', officeId: 'hoalac',
    locationVisibility: 'city+office', verified: true, trustScore: 'High', compatibilityScore: 79,
    highlights: ['Music & arts', 'Thoughtful', 'Night owl'],
    role: 'Security Engineer · Mid', distance: 0, location: { lat: 21.05, lng: 105.74 },
  },
  {
    id: '7', name: 'Wei Liang', age: 26,
    bio: 'Full-stack developer at FPT Singapore 🇸🇬 Data pipelines by day, trail runs by weekend. Firm believer that good coffee makes better code.',
    photos: [avatarHieu],
    interests: ['Running', 'Data', 'Coffee', 'Travel'],
    city: 'Singapore', cityId: 'singapore',
    locationVisibility: 'city', verified: true, trustScore: 'High', compatibilityScore: 76,
    highlights: ['Global mindset', 'Data nerd', 'Adventurous'],
    role: 'Full-Stack Engineer · Mid', distance: 0, location: { lat: 1.35, lng: 103.82 },
  },
  {
    id: '8', name: 'Khoa Do', age: 31,
    bio: 'Engineering manager learning to code again for fun 😄 Father of two, occasional marathoner, always up for team trivia. Firm believer in psychological safety at work.',
    photos: [avatarKhoa],
    interests: ['Running', 'Tech', 'Games', 'Coffee'],
    city: 'Ho Chi Minh City', cityId: 'hcm', office: 'Ftown 3 & Ftown 2', officeId: 'ftown',
    locationVisibility: 'city', verified: true, trustScore: 'High', compatibilityScore: 65,
    highlights: ['Team player', 'Runner', 'Trivia king'],
    role: 'Engineering Manager', distance: 4, location: { lat: 10.86, lng: 106.64 },
  },
];

const AD_CARD = {
  id: 'ad-1',
  brand: 'Long Chau Pharmacy',
  headline: 'HPV Vaccination — protect your health',
  cta: 'Book a free consultation',
  logo: '💊',
  partner: 'FPT Ecosystem Partner',
};

interface SwipeViewProps {
  onMatch: (profile: Profile) => void;
  onSwipe: () => void;
  activeFilters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  isPremium: boolean;
  onShowPremium: () => void;
}

function AdCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="absolute inset-0 bg-card rounded-[20px] overflow-hidden shadow-xl flex flex-col z-10 border border-border">
      <div className="absolute top-3 left-3 bg-muted text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">Sponsored</div>
      <button onClick={onDismiss} className="absolute top-3 right-3 p-1.5 bg-muted rounded-full text-muted-foreground">
        <X className="size-3" />
      </button>
      <div className="flex-1 bg-gradient-to-br from-[#EBF2FA] to-[#D6E9F8] dark:from-[#1A2E42] dark:to-[#142234] flex flex-col items-center justify-center p-8 text-center">
        <span className="text-6xl mb-4">{AD_CARD.logo}</span>
        <p className="text-[10px] font-semibold text-[#0F4C81] dark:text-[#93BAE0] uppercase tracking-wider mb-2">{AD_CARD.partner}</p>
        <h3 className="text-xl font-bold text-foreground mb-2">{AD_CARD.brand}</h3>
        <p className="text-muted-foreground text-sm mb-6">{AD_CARD.headline}</p>
        <button className="bg-[#0F4C81] text-white px-6 py-3 rounded-2xl text-sm font-semibold">{AD_CARD.cta}</button>
      </div>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <button className="text-xs text-muted-foreground underline">Why am I seeing this?</button>
        <button onClick={onDismiss} className="text-xs text-muted-foreground underline">Hide this ad</button>
      </div>
    </div>
  );
}

function FilterSheet({
  filters,
  onFiltersChange,
  onClose,
}: {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filters);
  const [expandedCities, setExpandedCities] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const countries = Array.from(new Set(FPT_LOCATIONS.map(c => c.country)));
  const filteredCities = FPT_LOCATIONS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCity = (cityId: string) => {
    const next = local.selectedCityIds.includes(cityId)
      ? local.selectedCityIds.filter(id => id !== cityId)
      : [...local.selectedCityIds, cityId];
    setLocal({ ...local, selectedCityIds: next });
  };

  const toggleOffice = (cityId: string, officeId: string) => {
    const existing = local.selectedOfficeIds[cityId] || [];
    const next = existing.includes(officeId)
      ? existing.filter(id => id !== officeId)
      : [...existing, officeId];
    setLocal({ ...local, selectedOfficeIds: { ...local.selectedOfficeIds, [cityId]: next } });
  };

  const toggleCityExpand = (cityId: string) => {
    setExpandedCities(prev => prev.includes(cityId) ? prev.filter(id => id !== cityId) : [...prev, cityId]);
  };

  const resultCount = Math.floor(Math.random() * 80) + 40;
  const allCities = local.selectedCityIds.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-card w-full max-w-[390px] rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-lg">Filter Profiles</h3>
            <button onClick={onClose}><X className="size-5 text-muted-foreground" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Location section */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              Location
              <span className="text-xs text-muted-foreground font-normal">{allCities ? 'All cities' : `${local.selectedCityIds.length} selected`}</span>
            </h4>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F36F21]"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Some people only share their city — they appear in city filters but not office-level ones.
            </p>
            <div className="space-y-4">
              {countries.map(country => {
                const cities = filteredCities.filter(c => c.country === country);
                if (!cities.length) return null;
                return (
                  <div key={country}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{country}</p>
                    <div className="space-y-1.5">
                      {cities.map(city => {
                        const selected = local.selectedCityIds.includes(city.id);
                        const expanded = expandedCities.includes(city.id);
                        return (
                          <div key={city.id}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleCity(city.id)}
                                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-left ${selected ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F]' : 'border-border'}`}
                              >
                                <span className={`text-sm font-medium ${selected ? 'text-[#F36F21]' : 'text-foreground'}`}>{city.name}</span>
                                {!city.offices && <span className="text-xs text-muted-foreground">1 office</span>}
                              </button>
                              {city.offices && city.offices.length > 1 && selected && (
                                <button onClick={() => toggleCityExpand(city.id)} className="p-2 rounded-xl bg-muted">
                                  {expanded ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                                </button>
                              )}
                            </div>
                            {/* Office list */}
                            {city.offices && selected && expanded && (
                              <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#F36F21]/30 pl-3">
                                <label className="flex items-center gap-2 py-1.5 text-sm text-foreground cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="accent-[#F36F21]"
                                    checked={!local.selectedOfficeIds[city.id]?.length}
                                    onChange={() => setLocal({ ...local, selectedOfficeIds: { ...local.selectedOfficeIds, [city.id]: [] } })}
                                  />
                                  All offices in {city.name}
                                </label>
                                {city.offices.map(office => (
                                  <label key={office.id} className="flex items-center gap-2 py-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="accent-[#F36F21]"
                                      checked={(local.selectedOfficeIds[city.id] || []).includes(office.id)}
                                      onChange={() => toggleOffice(city.id, office.id)}
                                    />
                                    <div>
                                      <p className="text-sm text-foreground">{office.name}</p>
                                      <p className="text-xs text-muted-foreground">{office.area}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age range */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Age Range</h4>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-8">{local.ageRange[0]}</span>
              <input type="range" min={18} max={50} value={local.ageRange[0]} className="flex-1 accent-[#F36F21]"
                onChange={e => setLocal({ ...local, ageRange: [+e.target.value, local.ageRange[1]] })} />
              <input type="range" min={18} max={60} value={local.ageRange[1]} className="flex-1 accent-[#F36F21]"
                onChange={e => setLocal({ ...local, ageRange: [local.ageRange[0], +e.target.value] })} />
              <span className="text-sm text-muted-foreground w-8 text-right">{local.ageRange[1]}</span>
            </div>
          </div>

          {/* Distance — optional, separate from location filter */}
          <div>
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              Distance
              <span className="text-xs text-muted-foreground font-normal">(optional — adds to city filter)</span>
            </h4>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={200} value={local.maxDistance} className="flex-1 accent-[#F36F21]"
                onChange={e => setLocal({ ...local, maxDistance: +e.target.value })} />
              <span className="text-sm text-[#F36F21] font-semibold w-14 text-right">{local.maxDistance} km</span>
            </div>
          </div>

          {/* AI sort */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">AI best matches first</p>
              <p className="text-xs text-muted-foreground">Sort by compatibility score</p>
            </div>
            <button
              onClick={() => setLocal({ ...local, aiSortFirst: !local.aiSortFirst })}
              className={`w-12 h-6 rounded-full transition-all relative ${local.aiSortFirst ? 'bg-[#F36F21]' : 'bg-muted'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${local.aiSortFirst ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Empty state message when selection returns 0 */}
          {local.selectedCityIds.length > 0 && resultCount < 5 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
              <AlertCircle className="size-4 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">No one in these offices yet. Try adding another city or office.</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border space-y-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setLocal({ selectedCityIds: [], selectedOfficeIds: {}, ageRange: [21, 40], maxDistance: 50, aiSortFirst: true })}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="savedefault" className="accent-[#F36F21]" />
              <label htmlFor="savedefault" className="text-xs text-muted-foreground">Save as default</label>
            </div>
          </div>
          <button
            onClick={() => { onFiltersChange(local); onClose(); }}
            className="w-full bg-[#F36F21] text-white py-3.5 rounded-2xl font-semibold"
          >
            Show {resultCount} people
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function SwipeView({ onMatch, onSwipe, activeFilters, onFiltersChange, isPremium, onShowPremium }: SwipeViewProps) {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [likesUsed, setLikesUsed] = useState(0);
  const [showBlockSheet, setShowBlockSheet] = useState(false);
  const FREE_LIKE_LIMIT = 20;

  const activeChips: { label: string; cityId: string; officeId?: string }[] = [];
  for (const cityId of activeFilters.selectedCityIds) {
    const city = FPT_LOCATIONS.find(c => c.id === cityId);
    if (!city) continue;
    const officeIds = activeFilters.selectedOfficeIds[cityId] || [];
    if (officeIds.length === 0) {
      activeChips.push({ label: city.name, cityId });
    } else {
      for (const officeId of officeIds) {
        const office = city.offices?.find(o => o.id === officeId);
        activeChips.push({ label: `${city.name}: ${office?.name ?? officeId}`, cityId, officeId });
      }
    }
  }

  const removeChip = (cityId: string, officeId?: string) => {
    const newFilters = { ...activeFilters };
    if (officeId) {
      newFilters.selectedOfficeIds = {
        ...newFilters.selectedOfficeIds,
        [cityId]: (newFilters.selectedOfficeIds[cityId] || []).filter(id => id !== officeId),
      };
    } else {
      newFilters.selectedCityIds = newFilters.selectedCityIds.filter(id => id !== cityId);
      const { [cityId]: _, ...rest } = newFilters.selectedOfficeIds;
      newFilters.selectedOfficeIds = rest;
    }
    onFiltersChange(newFilters);
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!isPremium && likesUsed >= FREE_LIKE_LIMIT && direction !== 'left') {
      onShowPremium();
      return;
    }
    onSwipe();
    if (direction === 'right' || direction === 'up') {
      setLikesUsed(l => l + 1);
      if (Math.random() > 0.4) onMatch(profiles[currentIndex]);
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex % 4 === 0 && !isPremium) setShowAd(true);
    setCurrentIndex(nextIndex);
  };

  const handleBlock = () => {
    setProfiles(prev => prev.filter((_, i) => i !== currentIndex));
    setShowBlockSheet(false);
  };

  const currentProfile = profiles[currentIndex];
  const remaining = profiles.length - currentIndex;

  return (
    <div className="h-full flex flex-col relative">
      {/* Filter chips bar */}
      {(activeChips.length > 0 || activeFilters.aiSortFirst) && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none flex-shrink-0">
          {activeFilters.aiSortFirst && (
            <span className="flex items-center gap-1 bg-[#EBF2FA] dark:bg-[#1A2E42] text-[#0F4C81] dark:text-[#93BAE0] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap border border-[#0F4C81]/20">
              <Zap className="size-3" /> AI sorted
            </span>
          )}
          {activeChips.map(chip => (
            <button
              key={chip.label}
              onClick={() => removeChip(chip.cityId, chip.officeId)}
              className="flex items-center gap-1.5 bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap border border-[#F36F21]/30"
            >
              {chip.label} <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      {/* Filter button row */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
        <p className="text-xs text-muted-foreground">{remaining > 0 ? `${remaining} profiles nearby` : ''}</p>
        <button
          onClick={() => setShowFilter(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeChips.length > 0 ? 'bg-[#F36F21] text-white border-[#F36F21]' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
          {activeChips.length > 0 && <span className="bg-white text-[#F36F21] rounded-full size-4 text-[10px] flex items-center justify-center">{activeChips.length}</span>}
        </button>
      </div>

      {/* Card area */}
      <div className="flex-1 relative px-4 pb-4 min-h-0">
        {!isPremium && likesUsed >= FREE_LIKE_LIMIT ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <span className="text-4xl mb-4">💛</span>
            <h3 className="font-bold text-foreground text-xl mb-2">Daily limit reached</h3>
            <p className="text-muted-foreground text-sm mb-6">Upgrade to Premium for unlimited likes and more connections.</p>
            <button onClick={onShowPremium} className="bg-gradient-to-r from-[#C9972B] to-[#F36F21] text-white px-8 py-3.5 rounded-2xl font-semibold">
              Get Premium
            </button>
          </div>
        ) : showAd ? (
          <AdCard onDismiss={() => setShowAd(false)} />
        ) : remaining === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <span className="text-5xl mb-4">🎉</span>
            <h3 className="font-bold text-foreground text-xl mb-2">{"You've seen everyone!"}</h3>
            <p className="text-muted-foreground text-sm">Check back later — new colleagues join every day.</p>
          </div>
        ) : (
          profiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              isTop={idx === 0}
              stackIndex={idx}
            />
          ))
        )}
      </div>

      {/* Action buttons row — shown when there's an active card */}
      {remaining > 0 && !showAd && (!isPremium ? likesUsed < FREE_LIKE_LIMIT : true) && (
        null
      )}

      {/* Filter sheet */}
      <AnimatePresence>
        {showFilter && (
          <FilterSheet
            filters={activeFilters}
            onFiltersChange={onFiltersChange}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>

      {/* Block confirmation sheet */}
      <AnimatePresence>
        {showBlockSheet && currentProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBlockSheet(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-card w-full max-w-sm rounded-t-3xl overflow-hidden pb-safe"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mt-4 mb-1" />

              {/* Profile preview */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={currentProfile.photos[0]} alt={currentProfile.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{currentProfile.name}</p>
                  <p className="text-xs text-muted-foreground">{currentProfile.role} · {currentProfile.city}</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-2">
                <p className="text-xs text-muted-foreground mb-4">
                  Blocking {currentProfile.name.split(' ')[0]} will hide their profile from your Discover and remove any matches you may have.
                </p>

                <button
                  onClick={() => { handleSwipe('left'); setShowBlockSheet(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-muted transition-colors text-left"
                >
                  <Flag className="size-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Report {currentProfile.name.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">Let us know about a problem</p>
                  </div>
                </button>

                <button
                  onClick={handleBlock}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                >
                  <Ban className="size-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-destructive text-sm">Block {currentProfile.name.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">They won't see your profile or be able to contact you</p>
                  </div>
                </button>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => setShowBlockSheet(false)}
                  className="w-full py-3.5 rounded-2xl border border-border text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
