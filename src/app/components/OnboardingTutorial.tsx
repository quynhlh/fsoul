import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, Search, ChevronDown, ChevronRight, Eye, EyeOff, Sparkles, Shield, X } from 'lucide-react';
import { FPT_LOCATIONS, FPTCity } from '../data/locations';

type OnboardingStep = 'email' | 'otp' | 'consent' | 'basicInfo' | 'location' | 'photos' | 'aiBio' | 'done';

interface Props {
  onComplete: () => void;
  darkMode?: boolean;
}

const INTEREST_OPTIONS = ['Travel', 'Coffee', 'Hiking', 'Photography', 'Music', 'Cooking', 'Gaming', 'Reading', 'Yoga', 'Movies', 'Art', 'Sports', 'Tech', 'Fitness', 'Food', 'Nature'];

const AI_BIO_OPTIONS = [
  {
    tone: 'Warm',
    text: "Frontend dev with a soft spot for good coffee and mountain trails. I believe the best conversations happen over a shared meal — or a challenging hike. Looking for someone curious about the world and kind to everyone in it.",
  },
  {
    tone: 'Witty',
    text: "Professional bug-fixer by day, amateur chef by night (the kitchen is still intact, mostly). I speak fluent React, passable sarcasm, and a little bit of everything on Spotify. Swipe right if you also think semicolons are optional.",
  },
  {
    tone: 'Adventurous',
    text: "Always planning the next trip before finishing the last one. Da Nang beaches, Sapa clouds, Tokyo ramen — I'm a collector of experiences. My love language is 'let's just go' and a well-timed travel playlist.",
  },
];

const countriesOrder = ['Vietnam', 'Japan', 'South Korea', 'Singapore', 'Malaysia', 'USA', 'Australia', 'France'];

function groupByCountry(cities: FPTCity[]) {
  const groups: Record<string, FPTCity[]> = {};
  for (const c of cities) {
    if (!groups[c.country]) groups[c.country] = [];
    groups[c.country].push(c);
  }
  return countriesOrder.filter(k => groups[k]).map(k => ({ country: k, cities: groups[k] }));
}

export function OnboardingTutorial({ onComplete, darkMode }: Props) {
  const [step, setStep] = useState<OnboardingStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedOfficeId, setSelectedOfficeId] = useState('');
  const [locationVisibility, setLocationVisibility] = useState<'city' | 'city+office'>('city');
  const [photoCount, setPhotoCount] = useState(0);
  const [selectedBioIndex, setSelectedBioIndex] = useState<number | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const stepOrder: OnboardingStep[] = ['email', 'otp', 'consent', 'basicInfo', 'location', 'photos', 'aiBio', 'done'];
  const stepIndex = stepOrder.indexOf(step);
  const progress = ((stepIndex + 1) / stepOrder.length) * 100;

  const selectedCity = FPT_LOCATIONS.find(c => c.id === selectedCityId);
  const filteredCities = FPT_LOCATIONS.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const next = () => {
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) setStep(stepOrder[idx + 1]);
    else onComplete();
  };
  const back = () => {
    const idx = stepOrder.indexOf(step);
    if (idx > 0) setStep(stepOrder[idx - 1]);
  };

  const toggleInterest = (i: string) => {
    setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const content = () => {
    switch (step) {
      // ── Email ──────────────────────────────────────────────────────────────
      case 'email':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4">
              <div className="w-16 h-16 bg-[#FFF5EE] dark:bg-[#2A1F0F] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="size-8 text-[#F36F21]" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Sign in with your FPT email</h1>
              <p className="text-muted-foreground text-sm mb-8">Only verified FPT Software employees can join fsoul.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yourname@fpt.com.vn"
                    className="w-full px-4 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-[#F36F21] text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#EBF2FA] dark:bg-[#1A2E42] rounded-xl">
                  <CheckCircle className="size-4 text-[#0F4C81] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#0F4C81] dark:text-[#93BAE0]">We verify your email domain to confirm you're an FPT Software employee. Your data is handled per FPT's privacy policy.</p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} disabled={!email.includes('@fpt')} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold disabled:opacity-40 transition-opacity flex items-center justify-center gap-2">
                Send Verification Code <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        );

      // ── OTP ────────────────────────────────────────────────────────────────
      case 'otp':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">Enter verification code</h1>
              <p className="text-muted-foreground text-sm mb-8">We sent a 6-digit code to <span className="text-foreground font-medium">{email || 'yourname@fpt.com.vn'}</span></p>
              <div className="flex gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '');
                      const newOtp = [...otp];
                      newOtp[i] = v;
                      setOtp(newOtp);
                    }}
                    className="flex-1 h-14 text-center text-xl font-bold rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-[#F36F21] text-foreground"
                  />
                ))}
              </div>
              <button className="text-[#F36F21] text-sm font-semibold">Resend code</button>
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2">
                Verify <CheckCircle className="size-5" />
              </button>
            </div>
          </div>
        );

      // ── Consent ────────────────────────────────────────────────────────────
      case 'consent':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4 overflow-y-auto">
              <h1 className="text-2xl font-bold text-foreground mb-2">A few things before you start</h1>
              <p className="text-muted-foreground text-sm mb-6">Plain language, no legal jargon.</p>
              {[
                { icon: '📍', title: 'Location', body: "We use your location to find nearby colleagues. You control exactly what's shared — city only, or city + office. You can pause anytime." },
                { icon: '🤖', title: 'AI Features', body: "fsoul uses AI to suggest compatibility scores, conversation starters, and profile tips. Scores are transparent — you can always see why they were calculated." },
                { icon: '🔒', title: 'Data & Privacy', body: "Your data never leaves FPT's internal systems. Chat content is never used for ads or AI training. You can delete your account and all data at any time." },
                { icon: '🏢', title: 'Workplace Respect', body: "fsoul is a safe, respectful space. Harassment, unsolicited photos, or discrimination will result in immediate removal from the platform." },
              ].map(item => (
                <div key={item.title} className="flex gap-4 mb-5">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2">
                I understand, continue <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        );

      // ── Basic Info ─────────────────────────────────────────────────────────
      case 'basicInfo':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4 overflow-y-auto space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Tell us about yourself</h1>
                <p className="text-muted-foreground text-sm">This appears on your public profile.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nguyen Thi Linh" className="w-full px-4 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-[#F36F21] text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Age</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="w-full px-4 py-3.5 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-[#F36F21] text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">I am</label>
                <div className="flex gap-2">
                  {['Woman', 'Man', 'Non-binary'].map(g => (
                    <button key={g} onClick={() => setGender(g)} className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${gender === g ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21]' : 'border-border text-muted-foreground'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Looking to meet</label>
                <div className="flex gap-2 flex-wrap">
                  {['Women', 'Men', 'Everyone'].map(g => (
                    <button key={g} onClick={() => setLookingFor(g)} className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all ${lookingFor === g ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21]' : 'border-border text-muted-foreground'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Interests <span className="text-muted-foreground normal-case font-normal">— pick up to 5</span></label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)} className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selectedInterests.includes(i) ? 'bg-[#F36F21] text-white border-[#F36F21]' : 'border-border text-muted-foreground hover:border-[#F36F21]'}`}>{i}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} disabled={!name || !age || !gender} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                Continue <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        );

      // ── Location ───────────────────────────────────────────────────────────
      case 'location':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4 overflow-y-auto">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Where do you work?</h1>
                <p className="text-muted-foreground text-sm mb-5">This helps you connect with nearby colleagues.</p>
              </div>

              {/* City search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={citySearch}
                  onChange={e => setCitySearch(e.target.value)}
                  placeholder="Search city or country..."
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-[#F36F21] text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>

              <div className="space-y-4">
                {groupByCountry(filteredCities).map(group => (
                  <div key={group.country}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.country}</p>
                    <div className="space-y-1">
                      {group.cities.map(city => (
                        <button
                          key={city.id}
                          onClick={() => { setSelectedCityId(city.id); setSelectedOfficeId(''); }}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${selectedCityId === city.id ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F]' : 'border-border hover:border-muted-foreground'}`}
                        >
                          <div>
                            <p className="font-semibold text-foreground text-sm">{city.name}</p>
                            <p className="text-xs text-muted-foreground">{city.offices ? `${city.offices.length} offices` : '1 office'}</p>
                          </div>
                          <MapPin className={`size-4 ${selectedCityId === city.id ? 'text-[#F36F21]' : 'text-muted-foreground'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Office picker */}
              {selectedCity?.offices && selectedCity.offices.length > 1 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Primary Office in {selectedCity.name}</p>
                  <div className="space-y-1">
                    {selectedCity.offices.map(office => (
                      <button
                        key={office.id}
                        onClick={() => setSelectedOfficeId(office.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${selectedOfficeId === office.id ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F]' : 'border-border'}`}
                      >
                        <p className="font-semibold text-foreground text-sm">{office.name}</p>
                        <p className="text-xs text-muted-foreground">{office.area}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-3 p-3 bg-muted rounded-xl">
                    <input type="checkbox" id="multioffice" className="accent-[#F36F21]" />
                    <label htmlFor="multioffice" className="text-sm text-foreground">I work at several offices</label>
                  </div>
                </div>
              )}

              {/* Visibility */}
              {selectedCityId && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Show others my</p>
                  <div className="flex gap-2">
                    {(['city', 'city+office'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setLocationVisibility(v)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all flex items-center justify-center gap-1.5 ${locationVisibility === v ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F] text-[#F36F21]' : 'border-border text-muted-foreground'}`}
                      >
                        {v === 'city' ? <><Eye className="size-3.5" /> City only</> : <><MapPin className="size-3.5" /> City + Office</>}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {locationVisibility === 'city' ? 'Only your city is shown. Office is private.' : 'Your city and office name appear on your card.'}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} disabled={!selectedCityId} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                Continue <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        );

      // ── Photos ─────────────────────────────────────────────────────────────
      case 'photos':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4">
              <h1 className="text-2xl font-bold text-foreground mb-1">Add your photos</h1>
              <p className="text-muted-foreground text-sm mb-6">Up to 6 photos. Your main photo gets AI quality tips.</p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[...Array(6)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoCount(Math.max(photoCount, i + 1))}
                    className={`aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed transition-all ${i < photoCount ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F]' : 'border-border bg-muted hover:border-[#F36F21]'}`}
                  >
                    {i < photoCount ? (
                      <CheckCircle className="size-8 text-[#F36F21]" />
                    ) : (
                      <span className="text-2xl text-muted-foreground">+</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="bg-[#EBF2FA] dark:bg-[#1A2E42] rounded-2xl p-4">
                <p className="text-xs font-semibold text-[#0F4C81] dark:text-[#93BAE0] mb-2">AI Photo Tips</p>
                <ul className="space-y-1.5">
                  {['Clear face in good lighting', 'Genuine smile works best', 'Mix solo and activity shots', 'Avoid group photos as main'].map(tip => (
                    <li key={tip} className="flex items-center gap-2 text-xs text-[#0F4C81] dark:text-[#93BAE0]">
                      <CheckCircle className="size-3 flex-shrink-0" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} disabled={photoCount === 0} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                Continue <ArrowRight className="size-5" />
              </button>
              <button onClick={next} className="w-full text-center text-muted-foreground text-sm mt-3">Skip for now</button>
            </div>
          </div>
        );

      // ── AI Bio Builder ─────────────────────────────────────────────────────
      case 'aiBio':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 px-6 pt-8 pb-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-5 text-[#F36F21]" />
                <h1 className="text-2xl font-bold text-foreground">AI Profile Builder</h1>
              </div>
              <p className="text-muted-foreground text-sm mb-6">Based on your interests, we wrote 3 bio options. Pick one, edit it, or regenerate.</p>
              <div className="space-y-3 mb-4">
                {AI_BIO_OPTIONS.map((bio, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedBioIndex(i)}
                    className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${selectedBioIndex === i ? 'border-[#F36F21] bg-[#FFF5EE] dark:bg-[#2A1F0F]' : 'border-border bg-card'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedBioIndex === i ? 'bg-[#F36F21] text-white' : 'bg-muted text-muted-foreground'}`}>{bio.tone}</span>
                      {selectedBioIndex === i && <CheckCircle className="size-4 text-[#F36F21]" />}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{bio.text}</p>
                    {selectedBioIndex === i && (
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs text-[#F36F21] font-semibold border border-[#F36F21] px-3 py-1 rounded-full">Edit</button>
                        <button className="text-xs text-muted-foreground border border-border px-3 py-1 rounded-full flex items-center gap-1"><Sparkles className="size-3" /> Regenerate</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-muted rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Profile Completeness</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-[#F36F21] h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                  <span className="text-[#F36F21] text-sm font-bold">80%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Add a bio to reach 100% and get 3× more matches</p>
              </div>
            </div>
            <div className="px-6 pb-8">
              <button onClick={next} className="w-full bg-[#F36F21] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2">
                {selectedBioIndex !== null ? 'Use this bio' : 'Skip for now'} <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        );

      // ── Done ───────────────────────────────────────────────────────────────
      case 'done':
        return (
          <div className="flex flex-col h-full items-center justify-center px-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="w-24 h-24 bg-gradient-to-br from-[#F36F21] to-[#C9972B] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle className="size-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-3">You're all set!</h1>
            <p className="text-muted-foreground mb-2">Welcome to fsoul, {name || 'there'}.</p>
            <p className="text-muted-foreground text-sm mb-8">Start discovering colleagues near you.</p>
            <button onClick={onComplete} className="w-full max-w-xs bg-[#F36F21] text-white py-4 rounded-2xl font-semibold">
              Start Discovering
            </button>
          </div>
        );
    }
  };

  const stepLabels: Record<OnboardingStep, string> = {
    email: 'Sign In', otp: 'Verify', consent: 'Privacy', basicInfo: 'About You',
    location: 'Location', photos: 'Photos', aiBio: 'Bio', done: 'Ready'
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} fixed inset-0 bg-card text-foreground flex flex-col`} style={{ fontFamily: "'Be Vietnam Pro', 'Inter', sans-serif" }}>
      {/* Progress bar */}
      <div className="px-5 pt-12 pb-3 sm:pt-5">
        <div className="flex items-center gap-2 mb-3">
          {stepIndex > 0 && step !== 'done' && (
            <button onClick={back} className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors mr-1">
              <ArrowLeft className="size-4" />
            </button>
          )}
          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-[#F36F21] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{stepIndex + 1}/{stepOrder.length}</span>
        </div>
        <p className="text-xs font-semibold text-[#F36F21] uppercase tracking-wider">{stepLabels[step]}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {content()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
