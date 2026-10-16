# Fsoul: product requirements document

**Status:** Draft v0.1 for review **Date:** 16 October 2026 **Owner:** To be assigned **Related:** Interactive Discover prototype ([https://claude.ai/artifact/9xgHvrdFA1itze4ixVf7BY](https://claude.ai/artifact/9xgHvrdFA1itze4ixVf7BY))

---

## 1. Summary

Fsoul is a mobile-first web app where verified FPT Software employees meet colleagues across offices through a swipe-and-match experience. It adds AI to the parts of dating apps that people find hardest: writing a profile, judging whether a profile is trustworthy, and sending the first message. It earns revenue through Premium subscriptions and clearly labelled ads from the FPT ecosystem (for example Long Chau).

**Biggest risks, in one line each:**

- Everyone shares an employer, so privacy and harassment risks are higher than in a public dating app.
- The blocked-person proximity alert (Safe Distance) involves location data and can be misused if designed carelessly.
- AI scores and suggestions can feel invasive or unfair unless they are transparent.

This document treats those three as design constraints, not afterthoughts.

---

## 2. Problem statement

FPT Software employees work across many cities and offices, but most social contact stays inside their own team or office. Public dating apps are a poor fit: they cannot verify that someone is a real colleague, they expose people to coworkers and managers with no workplace safeguards, and they do little to help people who freeze at the first message.

**Who is affected:** employees looking for friendships or relationships outside their immediate team, especially people who relocated or joined recently.

**Cost of not solving it:** weaker cross-office connection, and employees turning to public apps where privacy and safety controls do not suit a workplace.

**Evidence status:** none collected yet. See open question Q1. The goals below are hypotheses until validated by a survey or interviews.

---

## 3. Goals and non-goals

### Goals

| # | Goal | Type |
| --- | --- | --- |
| G1 | Help employees meet people they would not otherwise meet, across offices and cities | User |
| G2 | Make the first message easy: most new matches start a conversation within 48 hours | User |
| G3 | Make every user feel safe: verified identity, strong privacy controls, fast reporting | User |
| G4 | Reach 30% of eligible employees activated within the first 6 months | Business |
| G5 | Fund the product through Premium and partner ads without compromising privacy | Business |

### Non-goals (version 1)

| Non-goal | Why it is out of scope |
| --- | --- |
| Employees outside FPT Software (other FPT companies, public users) | Verification and moderation scale much better with one employer first |
| Professional networking, mentoring, or HR features | Different product and different risk profile |
| Video calls, voice notes, and live events | High build and moderation cost; add after chat is proven |
| Native iOS and Android apps | Version 1 is a mobile-first web app; revisit after adoption data |
| Letting FPT or managers view individual user activity | Would destroy trust; see principle P4 |
| Automated matchmaking decisions that hide profiles from users | Users stay in control of who they see and like |

---

## 4. Users

| Persona | Needs | Main risk to design for |
| --- | --- | --- |
| **Connector**, wants to meet people outside their team | Good discovery, filters by city and office | Being seen by the wrong colleagues |
| **Hesitant starter**, does not know what to say | Openers that fit the other person's profile | Generic or cringeworthy AI text |
| **Privacy-first user** | Control over who can see them | Exposure to their own team or manager |
| **Newcomer or relocated employee** | Meeting people in a new city or office | Feeling pushed toward dating when they want friends |
| **Trust and safety agent** (internal) | Reports queue, evidence, enforcement tools | Report volume and slow response |
| **Partner advertiser** (internal or FPT group) | Reach employees with relevant offers | Ads feeling invasive |

---

## 5. Product principles

These resolve disagreements during design and build.

- **P1. Privacy by default.** New profiles show city only, are hidden from the user's own team, and share no location until the user opts in.
- **P2. Transparent AI.** Every score or suggestion shows why it was made, how it was calculated, and how to challenge it.
- **P3. Safety over engagement.** When a safety control and a growth metric conflict, safety wins.
- **P4. The employer cannot see individuals.** FPT receives only aggregated, anonymised analytics. No one at FPT can view a user's profile activity, matches, or messages.
- **P5. Ads never use sensitive data.** Health, orientation, relationship preferences, chat content, and precise location are never used to select ads.

---

## 6. Scope and phasing

| Phase | Contents |
| --- | --- |
| **Phase 0: validate** | Employee survey, legal and HR review (see section 12), data-flow review with security |
| **Phase 1: MVP** | Verification, profile and AI profile builder, Discover with city and office filters, matches and chat, AI compatibility, trust score, AI conversation starters, safety and privacy controls, English and Vietnamese |
| **Phase 2: monetise** | Premium (unlimited likes, see who likes you, advanced openers, boost, ad-free), sponsored ad placements |
| **Phase 3: advanced safety** | Safe Distance alerts for blocked profiles (Premium), after dedicated legal and security sign-off |

Safe Distance is deliberately in Phase 3. It is the highest-risk feature, and the base blocking and reporting flow works without it.

---

## 7. Functional requirements

Priority: **P0** must have for the phase, **P1** fast follow, **P2** future.

### 7.1 Onboarding and verification

| ID | Requirement | Priority |
| --- | --- | --- |
| ONB-01 | Users sign in with their FPT work email and verify with a one-time code. | P0 |
| ONB-02 | Accounts are tied to a verified employee record and show a "Verified FPT employee" badge. | P0 |
| ONB-03 | Users must confirm they are 18 or older. | P0 |
| ONB-04 | Users set: name, age, gender, who they want to meet, city, office (optional), interests, and 1 to 6 photos. | P0 |
| ONB-05 | A plain-language consent screen explains location use, AI features, and data handling before they are used. Each consent is separate and can be changed later. | P0 |
| ONB-06 | Optional selfie verification adds a photo-verified badge. | P1 |
| ONB-07 | Users read and accept community guidelines at first launch. | P0 |
| ONB-08 | The welcome screen supports a returning-user state ("Welcome back"). | P1 |

**Acceptance criteria (ONB-01, ONB-02):**

- Given a user enters an email outside the FPT Software domain, when they request a code, then no code is sent and a clear message explains who can join.
- Given an employee leaves the company, when the HR sync marks them inactive, then their profile is hidden within 24 hours and they cannot sign in.
- Given a user enters a wrong code 5 times, then further attempts are blocked for 15 minutes.

### 7.2 Profile and AI profile builder

| ID | Requirement | Priority |
| --- | --- | --- |
| PRF-01 | Users can create and edit a profile with photos, bio, prompt answers, and interests. | P0 |
| PRF-02 | "Help me write my profile": the user answers 3 to 5 quick questions or picks interest chips, and the AI proposes 3 bio options in different tones (warm, witty, adventurous). Each can be used, edited, or regenerated. | P0 |
| PRF-03 | The AI also suggests answers to profile prompts such as "A perfect weekend is...". | P1 |
| PRF-04 | A completeness meter shows progress and one concrete improvement tip. | P1 |
| PRF-05 | Photo-quality tips (lighting, face visible, no group-only photos) before upload. | P1 |

**Acceptance criteria (PRF-02):**

- Given the user has answered the questions, when they request bios, then 3 distinct options appear within 5 seconds (95th percentile).
- Given the user does not tap "Use", then their existing bio is unchanged.
- The AI never invents facts the user did not provide (for example employer details, hobbies, or achievements).

### 7.3 Discover (swipe) and matching

| ID | Requirement | Priority |
| --- | --- | --- |
| DSC-01 | Users see a stack of profile cards with photo carousel, name, age, role level, location tag, and verified badge. | P0 |
| DSC-02 | Swipe right or tap like, swipe left or tap pass, swipe up or tap for super like. Keyboard arrows work on desktop. | P0 |
| DSC-03 | A mutual like creates a match and shows a match screen with conversation starters. | P0 |
| DSC-04 | Tapping a card opens the full profile. | P0 |
| DSC-05 | Undo last pass (Premium). | P2 |
| DSC-06 | Free users have a daily like limit; when reached, a clear Premium prompt appears and passing still works. | P1 |
| DSC-07 | Empty states: "You've seen everyone nearby" and "No one in these offices yet. Try adding another city or office." | P0 |
| DSC-08 | "Best matches first" ordering by compatibility score, switchable off. | P0 |
| DSC-09 | Desktop layout: the card stack sits in a phone-width centre column; filters and AI settings appear on the left, AI insights on the right. Below 1080px wide the side panels become drawers. | P0 |

### 7.4 Location, city, and office filters

FPT Software offices are modelled as two levels: **city**, then **office** (office appears only for cities with more than one).

| ID | Requirement | Priority |
| --- | --- | --- |
| LOC-01 | Users choose a city and, where relevant, a primary office during onboarding. | P0 |
| LOC-02 | Users choose what others see: **city only** (default) or **city plus office**. | P0 |
| LOC-03 | Discover filter lets users select one or more cities, grouped by country, with a search field. | P0 |
| LOC-04 | When a city with several offices is selected, an office list appears with "All offices" as default. Users can select one, several, or all. | P0 |
| LOC-05 | Active filters show as removable chips above the cards, and the filter shows a live result count. | P0 |
| LOC-06 | People who share only their city are matched by city filters but not by office filters. The filter shows the note "Some people only share their city". | P0 |
| LOC-07 | An optional distance filter exists, separate from city and office. It needs location sharing to be on. | P1 |
| LOC-08 | Travel mode: "I'm visiting another office this week" lets a user appear in another city or office until an end date. | P1 |
| LOC-09 | The office and city list comes from a managed table that operations can update without a release. | P0 |
| LOC-10 | Offices are shown by name only, never by address or floor. | P0 |

**Acceptance criteria (LOC-04, LOC-06):**

- Given a user selects Hanoi and only "Hoa Lac campus", when results load, then only people in Hanoi who chose "city plus office" and listed Hoa Lac campus appear.
- Given a user selects Hanoi with "All offices", then people who chose "city only" in Hanoi also appear.
- Given a city has one office, then no office list appears and the label shows "1 office".

### 7.5 AI profile insights (compatibility, trust, highlights)

| ID | Requirement | Priority |
| --- | --- | --- |
| AIS-01 | **Compatibility score** (0 to 100%) with a short "Why you match" explanation based on shared interests, lifestyle answers, and stated preferences. | P0 |
| AIS-02 | **Trust score** shown as High, Medium, or Building, derived only from listed signals: verified work email, selfie verification, profile completeness, and community reports. | P0 |
| AIS-03 | Tapping the trust score lists every signal and its status. A "How is this calculated?" explanation and a "Report a problem with this score" link are always present. | P0 |
| AIS-04 | **Highlights**: 3 short chips summarising the profile (for example "Loves hiking"). | P0 |
| AIS-05 | Users can switch compatibility and trust badges on or off on cards in their settings. | P1 |
| AIS-06 | A user can see their own trust score and what would improve it. | P1 |

**Rules for AI scoring:**

- Scores must not use race, religion, health, disability, sexual orientation, or any other protected attribute as an input.
- The trust score is about verification and conduct, never about personality. It is not called a "credibility" or "character" score in the UI.
- Reports lower a trust score only after review, not automatically on first report.
- A user can appeal a trust score and receive a response within 3 working days.

### 7.6 AI conversation starters

This is the core differentiator. When a user does not know how to begin, the AI proposes openers that fit the other person's profile.

| ID | Requirement | Priority |
| --- | --- | --- |
| AIC-01 | On the match screen and in an empty chat, a "Not sure what to say?" panel shows 3 suggested openers. | P0 |
| AIC-02 | Suggestions are tailored to the other person's profile: photos, interests, bio tone. Example: an outdoorsy, bold profile gets energetic, playful openers; a calm, bookish profile gets thoughtful, low-pressure ones. | P0 |
| AIC-03 | A label above the suggestions says what they are tailored to (for example "Tailored to Linh's profile: Adventurous, outdoorsy"). | P0 |
| AIC-04 | Tone selector: Match their vibe (default), Playful, Sincere, Curious, Bold. | P0 |
| AIC-05 | Each suggestion can be inserted into the message box, edited, or regenerated. A "Why this suggestion?" tooltip explains the reasoning. | P0 |
| AIC-06 | Reply suggestions appear in ongoing chats and are never sent without the user's action. | P1 |
| AIC-07 | Users can set a default tone and turn AI suggestions off entirely. | P1 |
| AIC-08 | Openers are also available before matching as a preview (copy only). | P1 |

**Acceptance criteria (AIC-02, AIC-05):**

- Given a profile with hiking photos and an adventurous bio, when "Match their vibe" is selected, then at least 2 of 3 openers refer to outdoor or adventure themes.
- Given a profile with little information, then the AI uses safe, general openers and does not guess at personal details.
- Suggestions never mention a person's body, appearance beyond neutral comments on a photo's subject, relationship history, or protected attributes.
- No suggestion is sent automatically. The user must press send.

### 7.7 Matches and chat

| ID | Requirement | Priority |
| --- | --- | --- |
| CHT-01 | Matches screen with a "New matches" row and a chat list showing unread state. | P0 |
| CHT-02 | One-to-one text chat with typing indicator and read state. | P0 |
| CHT-03 | Image sending with automatic safety scanning before delivery. | P1 |
| CHT-04 | In chat: Report, Block, and Unmatch always one tap away. | P0 |
| CHT-05 | "Likes you" grid, blurred beyond the first few profiles for free users. | P1 (Premium) |
| CHT-06 | Messages from users who were blocked or reported are hidden from the reporter. | P0 |

### 7.8 Safety, reporting, and blocking

| ID | Requirement | Priority |
| --- | --- | --- |
| SAF-01 | Report flow with categories (harassment, fake profile, inappropriate content, other), optional screenshots, and confirmation. | P0 |
| SAF-02 | Blocking is immediate and mutual: neither person sees the other anywhere in the app. | P0 |
| SAF-03 | Reports go to a trust and safety queue with a response target (see section 9). | P0 |
| SAF-04 | Repeat or serious offences lead to suspension, with an internal audit trail. | P0 |
| SAF-05 | Safety centre with guidance and links to the right internal contacts (HR, security). | P1 |
| SAF-06 | Photos are scanned for explicit content on upload. | P0 |

### 7.9 Privacy and visibility controls

| ID | Requirement | Priority |
| --- | --- | --- |
| PRV-01 | "Hide me from my own team or department" is **on by default**. | P0 |
| PRV-02 | "Hide me from my own office" toggle. | P1 |
| PRV-03 | Pause profile: hidden from Discover but existing chats stay. | P0 |
| PRV-04 | Location sharing is off by default and can be turned off at any time. | P0 |
| PRV-05 | Users can delete their account and all data. Deletion completes within 30 days and chats are removed for the other party too. | P0 |
| PRV-06 | Hide from managers and direct reports (sourced from the HR reporting line). | P0 (pending Q4) |

### 7.10 Ads (clearly labelled "Sponsored")

| ID | Requirement | Priority |
| --- | --- | --- |
| ADS-01 | Native ad card inserted in the Discover stack at a configurable interval (default: after every 10 profiles). | P1 (Phase 2) |
| ADS-02 | Ad slots on the Matches screen (banner) and in the chat list (sponsored row). | P1 (Phase 2) |
| ADS-03 | Every ad shows a "Sponsored" label, "Why am I seeing this?", and "Hide this ad". | P1 |
| ADS-04 | Partners come from the FPT ecosystem (for example Long Chau, FPT Shop, FPT Play, FPT Telecom). A health ad such as HPV vaccination is allowed as a general campaign. | P1 |
| ADS-05 | **Targeting limits:** ads use only coarse, non-sensitive context (city, time of day, general life stage if user-provided). They never use health data, orientation, relationship goals, chat content, or precise location. | P0 for ads |
| ADS-06 | Premium users see no ads. | P1 |
| ADS-07 | Ad content goes through an approval process (Q6). | P0 for ads |

**Acceptance criteria (ADS-05):**

- Given a user has never shared health information, when a health-related ad is shown, then it is shown to the same audience rule as any other campaign (for example all users in a city) and not because of anything the app inferred about the user.
- Ad targeting rules are reviewed by privacy and legal before each campaign launches.

### 7.11 Premium

| ID | Requirement | Priority |
| --- | --- | --- |
| PRM-01 | Plan comparison screen: Free versus Premium, with monthly and yearly pricing and a trial option. | P1 |
| PRM-02 | Premium includes: unlimited likes, see who likes you, ad-free, advanced AI openers, profile boost, and Safe Distance alerts (once released). | P1 |
| PRM-03 | Cancel any time in the app. | P1 |
| PRM-04 | Payment through a provider approved by FPT finance (Q7). | P1 |

### 7.12 Safe Distance alerts for blocked profiles (Premium, Phase 3)

When someone blocks a person, they can ask to be warned if that person comes close.

| ID | Requirement | Priority |
| --- | --- | --- |
| SDA-01 | Premium users can turn on "Safe Distance" for a blocked profile and set a radius from 50 m to 1 km (default 200 m). | P1 |
| SDA-02 | The alert says only "A person you blocked is within your Safe Distance". It shows no name, photo, map, direction, or exact distance. A general band such as "very close" is allowed. | P0 for this feature |
| SDA-03 | The blocked person's location is never visible to the person who blocked them, in the app or in the data returned by any API. | P0 for this feature |
| SDA-04 | The alert works only when both people have location sharing turned on. If the blocked person has it off, no alert is possible. | P0 for this feature |
| SDA-05 | The blocked person is never told that Safe Distance exists for them. | P0 for this feature |
| SDA-06 | Distance is calculated on the server from coarse location (rounded) and the result discarded after the check; location history is not stored for this purpose. | P0 for this feature |
| SDA-07 | The alert banner offers: share my location with a trusted contact, call security or HR hotline, dismiss. | P1 |
| SDA-08 | A plain-language explainer and one-tap "Turn off" are always available. | P0 for this feature |
| SDA-09 | Rate limits and abuse detection prevent someone from repeatedly blocking and unblocking to probe another user's whereabouts. | P0 for this feature |

**Why the design is restricted this way:** a feature that tells you when a specific person is near can be turned into a tool for tracking that person. The restrictions above keep the safety benefit (you get warned) and remove the stalking benefit (you cannot find them).

### 7.13 Settings

Language switcher (English and Vietnamese), light and dark mode, notification preferences, blocked list, data export and account deletion, help and safety centre.

| ID | Requirement | Priority |
| --- | --- | --- |
| SET-01 | English and Vietnamese for every screen, string, and AI output. | P0 |
| SET-02 | Light and dark mode. | P1 |
| SET-03 | Data export (download my data). | P1 |

---

## 8. Non-functional requirements

| Area | Requirement |
| --- | --- |
| **Performance** | First card visible within 2 seconds on a mid-range phone over 4G. AI suggestions within 5 seconds (95th percentile). |
| **Availability** | 99.5% monthly for core flows (sign in, Discover, chat). |
| **Accessibility** | WCAG 2.1 AA: 4.5:1 text contrast, 48 px tap targets, keyboard operation, screen-reader labels, reduced-motion support. Swipe actions always have button alternatives. |
| **Browsers** | Latest two versions of Chrome, Safari, Edge, and Firefox; iOS Safari and Android Chrome. |
| **Security** | Single sign-on and one-time-code protection, encryption in transit and at rest, role-based access for staff tools, audit logs for every staff access to user data. |
| **Scalability** | Plan for the full FPT Software headcount (capacity to be confirmed in Q2). |
| **AI quality** | Moderation on every AI output; a blocked-word and tone filter; red-team testing before launch; monitoring for biased scoring. |
| **Localisation** | Vietnamese and English with natural phrasing, not literal translation; AI prompts tested in both languages. |
| **Analytics** | Aggregated and anonymised only, with no individual-level reports available to FPT staff. |

---

## 9. Trust and safety operations

| Item | Target |
| --- | --- |
| Report acknowledgement | Within 1 hour |
| Review of serious reports (harassment, threats) | Within 4 hours, around the clock |
| Review of other reports | Within 24 hours |
| Appeal of a trust score or suspension | Response within 3 working days |
| Staffing | A named trust and safety team and an escalation path to HR and security (Q5) |

---

## 10. Data, privacy, and compliance

- **Sensitive data:** gender, who a user wants to meet, photos, and location are sensitive. Collect only what each feature needs, with separate consent for location and AI processing.
- **Separation from the employer:** user profile data and activity are stored apart from HR systems. HR provides only a "currently employed" signal and reporting-line data used for hiding. No individual-level data flows back.
- **AI processing:** photos and bios sent to AI models are used only to produce the result for that user, not to train models, and not stored by the model provider beyond what is required to run the request (to be confirmed with the chosen provider).
- **Retention:** chats and profile data are deleted on account deletion; reports are retained for a defined period (Q3).
- **Legal review:** requirements must be checked against Vietnam's current personal data protection rules and the privacy laws of each country where FPT Software employees use the app. Counsel confirms the details; this document does not state them.
- **Workplace policy:** HR defines how Fsoul relates to existing codes of conduct, relationships between managers and reports, and what happens to reported misconduct (Q4, Q5).

---

## 11. Success metrics

Targets below are starting hypotheses. Set final numbers after the Phase 0 survey (Q1) and re-check at 30, 90, and 180 days.

### Leading indicators (first 30 to 90 days)

| Metric | Target | How measured |
| --- | --- | --- |
| Registration to verified profile | 60% within 7 days of sign-up | Funnel analytics |
| Profile completeness 80% or higher | 50% of activated users | Profile data |
| Match rate (matches per 100 likes) | At least 8 | Aggregated |
| Matches that start a conversation within 48 hours | 55% (stretch 65%) | Chat events |
| Share of first messages that used an AI opener | 40% | Opener-use events |
| AI opener satisfaction ("this fit them") | 70% positive | In-product rating |
| Profile reports per 100 active users per month | Under 2, with serious reports reviewed within target 95% of the time | Trust and safety queue |

### Lagging indicators (3 to 6 months)

| Metric | Target |
| --- | --- |
| Activated share of eligible employees | 30% at 6 months |
| 30-day retention of activated users | 25% |
| Cross-office matches (different city or office) | 35% of all matches |
| Premium conversion among active users | 3% at launch of Premium |
| Ad click-through on labelled placements | Set with partners; no target until Phase 2 |
| Net promoter score | 30 or higher |

### Guardrail metrics (must not worsen)

- Harassment reports per 1,000 conversations
- Number of users who delete their account within 14 days citing privacy
- Trust score appeals upheld (a high rate signals an unfair score)

---

## 12. Open questions

**Blocking: answer before build starts**

| # | Question | Owner |
| --- | --- | --- |
| Q1 | What evidence shows employees want this (survey, interviews)? What share would use it? | Product, HR |
| Q2 | How many employees are eligible (by country and city), and what are the capacity and cost implications? | Product, Engineering |
| Q3 | What are the retention rules for chats, reports, and deleted accounts? | Legal, Security |
| Q4 | Is a dating-style app allowed by FPT policy, and how are manager and report relationships handled (including the "hide from managers" rule)? | HR, Legal |
| Q5 | Who runs trust and safety, and what is the 24/7 escalation path for serious reports? | HR, Security |

**Non-blocking: resolve during build**

| # | Question | Owner |
| --- | --- | --- |
| Q6 | Who approves partner ad content, and what categories are never allowed (for example health claims)? | Marketing, Legal |
| Q7 | Which payment provider and currencies are used for Premium? | Finance |
| Q8 | Can the HR system provide a reliable employment-status and reporting-line feed? | IT, HR |
| Q9 | Which AI model provider is used, where is data processed, and what are the terms on data use? | Engineering, Security, Legal |
| Q10 | What is the official list of FPT Software offices by city, and who maintains it? | Operations |
| Q11 | Is Safe Distance legally acceptable in each country, and does it need a data-protection impact assessment? | Legal, Security |
| Q12 | Will the product name "Fsoul" and use of the FPT name and logo be approved by brand? | Brand |

---

## 13. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Users worry that HR or managers can see their activity | Low adoption, reputational damage | Principle P4, communicated clearly in onboarding; independent privacy review |
| Harassment between colleagues | Harm to users, legal exposure | Mutual blocking, fast reports, hide from own team and managers, suspension policy |
| Safe Distance used to track a blocked person | Serious harm | Design limits in 7.12; Phase 3 only after legal and security sign-off; abuse monitoring |
| AI scores seen as unfair or judgemental | Complaints, loss of trust | Transparent signals, appeals, no protected attributes, review for bias |
| AI openers feel generic or unsuitable | Low use of the core feature | Test with real users in both languages; tone selector; edit before send |
| Ads feel invasive, especially health ads | Brand damage | Contextual-only targeting, labelled placements, hide option, partner content review |
| Small offices make people identifiable through office filters | Privacy loss | Default "city only"; office visibility is opt-in; minimum-size rule before an office filter appears (to be decided) |
| Low initial user numbers feel empty | Poor first impressions, churn | Launch city by city or office by office; show "new people nearby" messaging |

---

## 14. Release plan and dependencies

| Milestone | Dependencies |
| --- | --- |
| Phase 0 complete | Survey run; blocking questions Q1 to Q5 answered |
| Phase 1 internal pilot (one or two offices) | HR identity feed (Q8), AI provider contract (Q9), trust and safety staffing (Q5) |
| Phase 1 company-wide | Pilot results meet guardrail metrics |
| Phase 2 | Payment provider (Q7), ad approval process (Q6) |
| Phase 3 | Legal and security sign-off on Safe Distance (Q11) |

No hard external deadlines are known. Dates should be added once the team and capacity are confirmed.

---

## 15. Glossary

- **Match:** two users who have liked each other.
- **Super like:** a stronger like that notifies the other person.
- **Trust score:** a High, Medium, or Building label based on verification and conduct signals.
- **Compatibility score:** a 0 to 100% estimate of fit from shared interests and stated preferences.
- **Safe Distance:** Premium alert that warns a user when someone they blocked is within a chosen range, without revealing who or where.
- **City only / city plus office:** the visibility levels for a user's work location.