import { useState, useEffect } from "react";
import './App.css';
import ProfileBuilder, { useAC, SKILL_POOL } from './ProfileBuilder';

// ─── STATIC DATA ────────────────────────────────────────────
// FEATURED_JOBS is derived from ALL_JOBS below — defined after ALL_JOBS

const MOVE_OF_WEEK = {
  name: "Jordan Mercer",
  prev_role: "Senior SWE",
  prev_company: "Palantir",
  new_role: "Staff Engineer",
  new_company: "AllTrails",
  years: 5,
  quote:
    "I was shipping dashboards for government contracts. Now I'm building the thing I open every weekend before a hike. Same skills, completely different reason to get out of bed.",
  tags: ["Outdoors", "Hiking", "React Native"],
  avatar_initials: "JM",
  avatar_color: "#2750b6",
};

// ─── ICONS ──────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalLink = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 4l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── BUTTON COMPONENTS ──────────────────────────────────────
const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: 8,
  fontFamily: "var(--ff-display)", fontSize: 13, fontWeight: 600,
  letterSpacing: "-0.01em", padding: "10px 20px",
  border: "var(--stroke) solid var(--ink)",
  background: "var(--ink)", color: "var(--paper)",
  cursor: "pointer", borderRadius: 0,
  boxShadow: "3px 3px 0 var(--federal)",
  transition: "transform 0.08s, box-shadow 0.08s",
  whiteSpace: "nowrap",
};

const btnOutline = {
  ...btnPrimary,
  background: "var(--paper)", color: "var(--ink)",
  boxShadow: "3px 3px 0 var(--ink)",
};

// ─── NAV ────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const navLink = (label, target) => (
    <button key={label} onClick={() => setPage(target)} style={{
      background: "none", border: "none", padding: 0,
      fontSize: 13, fontWeight: 500,
      color: page === target ? "var(--ink)" : "var(--ink-2)",
      letterSpacing: "-0.01em", cursor: "pointer",
      transition: "color 0.1s",
    }}
    onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
    onMouseLeave={e => e.currentTarget.style.color = page === target ? "var(--ink)" : "var(--ink-2)"}
    >
      {label}
    </button>
  );

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: 60,
      borderBottom: "var(--stroke) solid var(--ink)",
      position: "sticky", top: 0,
      background: "var(--paper)", zIndex: 100,
    }}>
      <span style={{
        fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 20,
        letterSpacing: "-0.04em", lineHeight: 1, cursor: "pointer",
      }} onClick={() => setPage("home")}>
        Field<span style={{ color: "var(--federal)" }}>work</span>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {navLink("Browse Jobs", "jobs")}
        {navLink("Build Profile", "profile")}
        <button
          onClick={() => setPage("home")}
          style={btnOutline}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
        >
          Submit a company
        </button>
        <button
          onClick={() => setPage("home")}
          style={btnPrimary}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--federal)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--federal)"; }}
        >
          Get early access <ArrowRight />
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────
function Hero({ onNav }) {
  return (
    <section style={{
      padding: "96px 48px 80px",
      maxWidth: 1180, margin: "0 auto",
      position: "relative", overflow: "hidden",
    }}>
      {/* blooms */}
      <div aria-hidden style={{ position: "absolute", right: 60, top: 60, pointerEvents: "none" }}>
        <div style={{ position: "relative", width: 600, height: 200 }}>
          <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "var(--federal)", opacity: 0.5, mixBlendMode: "multiply", left: 0, top: 24 }} />
          <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "var(--fluoro)", opacity: 0.5, mixBlendMode: "multiply", right: 0, top: 24 }} />
        </div>
      </div>

      <p className="fade-up" style={{
        fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "var(--ink-3)",
        marginBottom: 24, display: "flex", alignItems: "center", gap: 12,
      }}>
      </p>

      <h1 className="fade-up fade-up-1" style={{
        fontFamily: "var(--ff-display)", fontWeight: 700,
        fontSize: "clamp(52px, 7vw, 88px)", lineHeight: 0.92,
        letterSpacing: "-0.05em", color: "var(--ink)",
        maxWidth: 760, marginBottom: 32,
      }}>
        Your skills work<br />
        anywhere.{" "}
        <em style={{
          fontFamily: "var(--ff-serif)", fontStyle: "italic",
          fontWeight: 400, letterSpacing: "-0.02em", color: "var(--federal)",
        }}>
          <br></br>Start acting like it.
        </em>
      </h1>

      <p className="fade-up fade-up-2" style={{
        fontFamily: "var(--ff-serif)", fontStyle: "italic",
        fontSize: 22, lineHeight: 1.4, color: "var(--ink-2)",
        maxWidth: 540, marginBottom: 48,
      }}>
        Fieldwork shows you tech roles that are less jobby and more hobbie.
      </p>

      <div className="fade-up fade-up-3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => onNav("profile")}
          style={{ ...btnPrimary, padding: "16px 36px", fontSize: 17, boxShadow: "5px 5px 0 var(--federal)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "6px 6px 0 var(--federal)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 var(--federal)"; }}
        >
          Build your profile <ArrowRight />
        </button>
        <button
          onClick={() => onNav("jobs")}
          style={{ ...btnOutline, padding: "16px 36px", fontSize: 17 }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
        >
          Browse open roles
        </button>
      </div>

      {/* live indicator */}
      <div className="fade-up fade-up-4" style={{
        marginTop: 56, display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%", background: "var(--leaf)",
          animation: "pulse-dot 2s ease infinite",
        }} />
        <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          {FEATURED_JOBS.length} roles live · updated weekly
        </span>
      </div>
    </section>
  );
}

// ─── BROWSE JOBS DATA ────────────────────────────────────────
const INTEREST_COLORS = {
  "Outdoors": "#3a8a47", "Hiking": "#3a8a47", "Running": "#3a8a47",
  "Biking": "#3a8a47", "Fishing": "#3a8a47", "Hunting": "#3a8a47",
  "Rowing": "#3a8a47", "World-Saving": "#3a8a47", "Animals": "#3a8a47",
  "Music": "#e35598", "Fashion": "#e35598", "Photography": "#e35598",
  "Sports": "#2750b6", "Language": "#2750b6", "Travel": "#2750b6",
  "Games": "#2750b6", "Puzzles": "#2750b6",
  "Food": "#eabc2b", "Beer": "#eabc2b", "YC": "#eabc2b",
  "Fitness": "#e8632c", "Chillin": "#e8632c",
  "Gambling": "#181818",
};

const SKILL_TO_DEPT = {
  // Engineering
  JavaScript: "Engineering", TypeScript: "Engineering", React: "Engineering",
  "Vue.js": "Engineering", "Next.js": "Engineering", Svelte: "Engineering",
  "Node.js": "Engineering", Python: "Engineering", Go: "Engineering",
  Rust: "Engineering", Java: "Engineering", Kotlin: "Engineering",
  Ruby: "Engineering", Rails: "Engineering", Django: "Engineering",
  Swift: "Engineering", iOS: "Engineering", Android: "Engineering",
  "React Native": "Engineering", Flutter: "Engineering",
  SQL: "Engineering", PostgreSQL: "Engineering", MongoDB: "Engineering",
  Redis: "Engineering", AWS: "Engineering", GCP: "Engineering",
  Azure: "Engineering", Docker: "Engineering", Kubernetes: "Engineering",
  "Machine Learning": "Engineering", "Computer Vision": "Engineering",
  "GIS Mapping": "Engineering", "Embedded Systems": "Engineering",
  Unity: "Engineering", "Unreal Engine": "Engineering", WebGL: "Engineering",
  "3D Modeling": "Engineering", "Game Design": "Engineering",
  "Audio Engineering": "Engineering", "Video Editing": "Engineering",
  Photography: "Engineering",
  // Design
  "Product Design": "Design", "UX Research": "Design", Figma: "Design",
  "Design Systems": "Design", Prototyping: "Design", "Motion Design": "Design",
  "Brand Identity": "Design", Illustration: "Design", "Type Design": "Design",
  "After Effects": "Design",
  // Product
  "Product Management": "Product", Roadmapping: "Product", "A/B Testing": "Product",
  Agile: "Product", "User Research": "Product", Analytics: "Product",
  Facilitation: "Product",
  // Data
  "Data Viz": "Data", "Data Science": "Data", Pandas: "Data",
  dbt: "Data", Airflow: "Data", Spark: "Data", NumPy: "Data",
  Elasticsearch: "Data",
  // Marketing
  Marketing: "Marketing", SEO: "Marketing", Copywriting: "Marketing",
  "Content Strategy": "Marketing", "Community Building": "Marketing",
  Editorial: "Marketing",
};

const PREFS = [
  { id: "remote",  label: "Remote" },
  { id: "mission", label: "Mission-driven" },
  { id: "small",   label: "Small team" },
];

const ALL_JOBS = [
  // Outdoors & Nature
  { id: "onx-swe",        company: "OnX",         role: "Senior Software Engineer, Maps",           location: "Missoula, MT",       remote: true,  tag: "Outdoors",     tags: ["Outdoors","Fishing","Hunting","Hiking"],   tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: true,  url: "https://job-boards.greenhouse.io/onxmaps/jobs",      description: "Build maps that help hunters find public land and hikers plan epic trips. OnX's audience uses what you ship on actual adventures — not just on their phones at their desks." },
  { id: "strava-ios",     company: "Strava",       role: "Staff iOS Engineer, Activity Feed",        location: "San Francisco, CA",  remote: true,  tag: "Outdoors",     tags: ["Outdoors","Hiking","Running","Biking"],    tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: false, url: "https://jobs.ashbyhq.com/strava",                    description: "Your code shows up in the feed of 100M+ athletes. The team runs, rides, and hikes — they're building for themselves." },
  { id: "garmin-emb",     company: "Garmin",       role: "Embedded Software Engineer",               location: "Olathe, KS",         remote: false, tag: "Outdoors",     tags: ["Outdoors","Hiking","Biking","Running"],    tagColor: "#3a8a47", cardBg: "#f4ece0", dept: "Engineering", mission: false, small: false, url: "https://www.garmin.com/en-US/",                      description: "Write firmware that goes everywhere: summits, open water, the trail at 5am. Garmin devices are trusted when nothing else is around." },
  { id: "alltrails-em",   company: "AllTrails",    role: "Engineering Manager, Mobile",              location: "San Francisco, CA",  remote: true,  tag: "Outdoors",     tags: ["Outdoors","Hiking","Running"],             tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Product",     mission: true,  small: false, url: "https://jobs.lever.co/alltrails",                    description: "Lead mobile engineers building the app millions of people open before every hike. AllTrails has a rare combination: massive scale and genuine mission." },
  { id: "patagonia-dir",  company: "Patagonia",    role: "Director of Digital Products",             location: "Ventura, CA",        remote: false, tag: "Outdoors",     tags: ["Outdoors","Fashion","World-Saving"],       tagColor: "#3a8a47", cardBg: "#3a8a47", dept: "Product",     mission: true,  small: false, url: "https://www.patagonia.com/home/",                    description: "Run digital products for the most respected outdoor brand on the planet. Patagonia donates its profits to environmental causes — every feature you ship supports that." },
  { id: "rei-pd",         company: "REI",          role: "Product Designer, Digital Commerce",       location: "Kent, WA",           remote: true,  tag: "Outdoors",     tags: ["Outdoors","Fashion"],                      tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Design",      mission: true,  small: false, url: "https://www.rei.com/",                               description: "Design the shopping and trip-planning experience for the co-op that puts gear in the hands of millions of outdoor enthusiasts." },
  { id: "gopro-cv",       company: "GoPro",        role: "Computer Vision Engineer",                 location: "San Mateo, CA",      remote: true,  tag: "Photography",  tags: ["Photography","Outdoors"],                  tagColor: "#e35598", cardBg: "#f4ece0", dept: "Engineering", mission: false, small: false, url: "https://gopro.com/en/us/",                           description: "Build the computer vision behind the world's most extreme cameras. Your algorithms get deployed to wingsuits, surfboards, and ski runs." },
  { id: "fishbrain-ios",  company: "Fishbrain",    role: "iOS Engineer, Social Features",            location: "Stockholm, Sweden",  remote: true,  tag: "Fishing",      tags: ["Fishing","Outdoors"],                      tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: true,  url: "https://fishbrain.com/",                             description: "Build iOS features for the world's largest fishing app. Fishbrain is small, remote-first, and their users genuinely care about what you build." },
  { id: "john-deere-swe", company: "John Deere",   role: "Software Engineer, Precision Ag",          location: "Moline, IL",         remote: false, tag: "Outdoors",     tags: ["Outdoors"],                               tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: false, url: "https://about.deere.com/",                           description: "Write precision agriculture software that helps farmers get more from their land. Your code runs on tractors in fields across the world." },
  { id: "outside-pm",     company: "Outside",      role: "Product Manager, Digital Media",           location: "Santa Fe, NM",       remote: true,  tag: "Outdoors",     tags: ["Outdoors"],                               tagColor: "#3a8a47", cardBg: "#f4ece0", dept: "Product",     mission: true,  small: true,  url: "https://www.outsideonline.com/featured",             description: "Manage digital products for the media brand covering trail running, skiing, climbing, and everything in between. Mission-driven, small team energy." },
  { id: "halter-iot",     company: "Halter",       role: "Software Engineer, IoT",                   location: "Auckland, NZ",       remote: false, tag: "Animals",      tags: ["Animals","Outdoors","YC"],                 tagColor: "#3a8a47", cardBg: "#3a8a47", dept: "Engineering", mission: true,  small: true,  url: "https://jobs.ashbyhq.com/halter/",                   description: "Build IoT software that monitors cattle on New Zealand farms — GPS collars, solar-powered, no cell service. YC-backed and genuinely novel engineering." },
  // Music
  { id: "spotify-be",     company: "Spotify",      role: "Senior Backend Engineer, Recommendations", location: "New York, NY",       remote: true,  tag: "Music",        tags: ["Music"],                                  tagColor: "#e35598", cardBg: "#e35598", dept: "Engineering", mission: false, small: false, url: "https://open.spotify.com/",                          description: "Build the recommendation engine behind billions of streams. Spotify's engineering culture is top-tier and the domain is genuinely fun." },
  { id: "fender-ux",      company: "Fender",       role: "Senior UX Designer, Digital Products",     location: "Los Angeles, CA",    remote: true,  tag: "Music",        tags: ["Music"],                                  tagColor: "#e35598", cardBg: "#e35598", dept: "Design",      mission: false, small: false, url: "https://job-boards.greenhouse.io/fender",            description: "Design digital products for the most iconic guitar brand in history. Fender Digital is a small product org inside a massive cultural institution." },
  { id: "soundcloud-eng", company: "SoundCloud",   role: "Staff Engineer, Audio Streaming",           location: "Berlin, Germany",    remote: true,  tag: "Music",        tags: ["Music"],                                  tagColor: "#e35598", cardBg: "#181818", dept: "Engineering", mission: false, small: false, url: "https://job-boards.greenhouse.io/soundcloud71",      description: "Work on the audio streaming infrastructure that powers SoundCloud. Berlin-based engineering culture, deep music community, and genuinely hard scale problems." },
  { id: "songtradr-be",   company: "Songtradr",    role: "Backend Engineer, Music Licensing",         location: "Los Angeles, CA",    remote: true,  tag: "Music",        tags: ["Music"],                                  tagColor: "#e35598", cardBg: "#f4ece0", dept: "Engineering", mission: false, small: true,  url: "https://songtradr.bamboohr.com/careers",             description: "Build the backend for a music licensing marketplace. Small team, interesting domain, and you'll actually understand what your product does." },
  // Games
  { id: "nyt-fe",         company: "NYT Games",    role: "Senior Frontend Engineer, Puzzles",         location: "New York, NY",       remote: false, tag: "Games",        tags: ["Games","Puzzles"],                         tagColor: "#2750b6", cardBg: "#181818", dept: "Engineering", mission: false, small: false, url: "https://job-boards.greenhouse.io/thenewyorktimes",   description: "Ship the frontend for Wordle, Connections, Spelling Bee, and the Crossword. NYT Games has some of the most engaged users in tech." },
  { id: "roblox-swe",     company: "Roblox",       role: "Senior Software Engineer, Platform",        location: "San Mateo, CA",      remote: false, tag: "Games",        tags: ["Games"],                                  tagColor: "#2750b6", cardBg: "#e8632c", dept: "Engineering", mission: false, small: false, url: "https://www.roblox.com/",                            description: "Scale the platform where millions of kids create and play games every day. Roblox's technical challenges are genuinely hard and interesting." },
  { id: "discord-staff",  company: "Discord",      role: "Staff Engineer, Voice & Video",             location: "San Francisco, CA",  remote: true,  tag: "Games",        tags: ["Games"],                                  tagColor: "#2750b6", cardBg: "#2750b6", dept: "Engineering", mission: false, small: false, url: "https://discord.com/",                               description: "Own the voice and video infrastructure for 600M+ registered users. Discord's engineering is respected in the industry and the culture is real." },
  { id: "colonist-fe",    company: "Colonist.io",  role: "Senior Frontend Engineer, Game UI",         location: "Remote",             remote: true,  tag: "Games",        tags: ["Games"],                                  tagColor: "#2750b6", cardBg: "#f4ece0", dept: "Engineering", mission: false, small: true,  url: "https://jobs.ashbyhq.com/colonist/",                 description: "Build game UI for a Settlers of Catan-inspired web game with a passionate community. Small team, fully remote, and you'll know your players." },
  // Sports
  { id: "seatgeek-pd",    company: "SeatGeek",     role: "Product Designer, Consumer",                location: "New York, NY",       remote: false, tag: "Sports",       tags: ["Sports","Music"],                          tagColor: "#2750b6", cardBg: "#f4ece0", dept: "Design",      mission: false, small: false, url: "https://seatgeek.com/",                              description: "Design the ticket-buying experience for sports, concerts, and live events. SeatGeek is the designer-friendly alternative in a category that usually isn't." },
  { id: "underdog-be",    company: "Underdog",     role: "Senior Backend Engineer, Fantasy Sports",   location: "New York, NY",       remote: true,  tag: "Sports",       tags: ["Sports","Gambling"],                       tagColor: "#2750b6", cardBg: "#2750b6", dept: "Engineering", mission: false, small: false, url: "https://job-boards.greenhouse.io/underdogfantasy",   description: "Build the backend for a fast-growing fantasy sports platform. Underdog is one of the more technically interesting companies in the sports space." },
  { id: "fanatics-pd",    company: "Fanatics",     role: "Product Designer, Commerce",                location: "Jacksonville, FL",   remote: true,  tag: "Sports",       tags: ["Sports","Fashion"],                        tagColor: "#2750b6", cardBg: "#181818", dept: "Design",      mission: false, small: false, url: "https://job-boards.greenhouse.io/fanaticsinc",       description: "Design commerce experiences for the world's largest sports merchandise company. Big scale, interesting personalization problems." },
  { id: "nike-swe",       company: "Nike",         role: "Senior Software Engineer, Running",         location: "Beaverton, OR",      remote: false, tag: "Sports",       tags: ["Sports","Fitness","Running"],              tagColor: "#2750b6", cardBg: "#181818", dept: "Engineering", mission: false, small: false, url: "https://nike.wd1.myworkdayjobs.com/nke",             description: "Build the running app and training platform for the world's biggest sports brand. Nike Digital is a real engineering org with interesting challenges at scale." },
  { id: "redbull-pm",     company: "Red Bull",     role: "Product Manager, Digital Media",            location: "Santa Monica, CA",   remote: false, tag: "Sports",       tags: ["Sports","Outdoors"],                       tagColor: "#2750b6", cardBg: "#e8632c", dept: "Product",     mission: false, small: false, url: "https://www.redbull.com/us-en",                      description: "Run digital media products for Red Bull, the brand that invented its own category of sports coverage and has a media empire most companies would kill for." },
  // Fitness & Wellness
  { id: "peloton-android",company: "Peloton",      role: "Android Engineer, Fitness Content",         location: "New York, NY",       remote: true,  tag: "Fitness",      tags: ["Fitness","Biking","Running"],              tagColor: "#e8632c", cardBg: "#e8632c", dept: "Engineering", mission: false, small: false, url: "https://www.onepeloton.com/",                        description: "Build the Android app that streams workouts to millions of connected bikes and treadmills. Peloton's media + hardware combination creates unique engineering challenges." },
  { id: "whoop-fs",       company: "Whoop",        role: "Full Stack Engineer, Health Analytics",     location: "Boston, MA",         remote: false, tag: "Fitness",      tags: ["Fitness"],                                 tagColor: "#e8632c", cardBg: "#e8632c", dept: "Engineering", mission: false, small: false, url: "https://jobs.lever.co/whoop/",                       description: "Build the health analytics platform behind the wearable that serious athletes obsess over. Small team in Boston doing genuinely interesting health data work." },
  { id: "wahoo-swe",      company: "Wahoo",        role: "Senior SWE, Training Analytics",            location: "Atlanta, GA",        remote: true,  tag: "Fitness",      tags: ["Fitness","Biking"],                        tagColor: "#e8632c", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: false, url: "https://www.wahoofitness.com/",                      description: "Build training analytics software for cyclists and runners who take their performance seriously. Wahoo is the underdog hardware company doing interesting connected fitness work." },
  { id: "oura-ios",       company: "Oura",         role: "iOS Engineer, Health Platform",             location: "Oulu, Finland",      remote: true,  tag: "Fitness",      tags: ["Fitness"],                                 tagColor: "#e8632c", cardBg: "#181818", dept: "Engineering", mission: false, small: false, url: "https://job-boards.greenhouse.io/oura",              description: "Build the iOS app for the ring-sized health tracker loved by biohackers and sleep optimizers. Oura is scaling fast and the hardware-software integration is genuinely hard." },
  { id: "hydrow-swe",     company: "Hydrow",       role: "Senior SWE, Connected Fitness",             location: "Boston, MA",         remote: true,  tag: "Fitness",      tags: ["Fitness","Rowing"],                        tagColor: "#e8632c", cardBg: "#f4ece0", dept: "Engineering", mission: false, small: true,  url: "https://jobs.lever.co/Hydrow/",                      description: "Build the connected fitness experience for the rowing machine trying to become the Peloton of rowing. Small team, real growth story, and a passionate user base." },
  { id: "calm-be",        company: "Calm",         role: "Backend Engineer, Infrastructure",          location: "Remote",             remote: true,  tag: "Chillin",      tags: ["Chillin"],                                 tagColor: "#e8632c", cardBg: "#2750b6", dept: "Engineering", mission: true,  small: false, url: "https://job-boards.greenhouse.io/calm/",             description: "Build the infrastructure for the mental wellness app used by millions to sleep, meditate, and manage anxiety. Fully remote, mission-driven, and a product you can actually talk about at dinner." },
  { id: "headspace-ios",  company: "Headspace",    role: "Senior iOS Engineer",                       location: "Los Angeles, CA",    remote: true,  tag: "Chillin",      tags: ["Chillin"],                                 tagColor: "#e8632c", cardBg: "#181818", dept: "Engineering", mission: true,  small: false, url: "https://job-boards.greenhouse.io/hs",                description: "Build iOS features for the meditation and mental health app that has been in the space longer than anyone. Mission-driven LA team with a product that genuinely helps people." },
  // Food & Drink
  { id: "beli-fs",        company: "Beli",         role: "Full Stack Engineer",                       location: "San Francisco, CA",  remote: true,  tag: "Food",         tags: ["Food"],                                    tagColor: "#eabc2b", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: true,  url: "https://beli.breezy.hr/",                            description: "Build the restaurant and dish tracking app that serious food people use to remember what they ate and discover what's next. Small SF team with real user love." },
  { id: "opentable-eng",  company: "OpenTable",    role: "Senior Engineer, Booking Systems",          location: "San Francisco, CA",  remote: true,  tag: "Food",         tags: ["Food"],                                    tagColor: "#eabc2b", cardBg: "#e8632c", dept: "Engineering", mission: false, small: false, url: "https://job-boards.greenhouse.io/opentable",         description: "Build the booking systems that power reservations at thousands of restaurants. OpenTable is a mature product with interesting engineering scale challenges." },
  { id: "nextglass-fs",   company: "Next Glass",   role: "Full Stack Engineer, Recommendations",      location: "Wilmington, NC",     remote: true,  tag: "Beer",         tags: ["Beer","Food"],                             tagColor: "#eabc2b", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: true,  url: "https://www.nextglass.co/",                          description: "Build the recommendation engine for a beer and wine discovery app. Small team doing interesting taste-preference work that's actually fun to demo at parties." },
  // Language & Travel
  { id: "duolingo-pm",    company: "Duolingo",     role: "Staff Product Manager, Learning",           location: "Pittsburgh, PA",     remote: false, tag: "Language",     tags: ["Language","Travel"],                       tagColor: "#2750b6", cardBg: "#f4ece0", dept: "Product",     mission: true,  small: false, url: "https://www.duolingo.com/",                          description: "Lead product at the company that's made language learning actually work for 500M+ users. Duolingo's growth story is one of the best in consumer tech and the mission is real." },
  // Animals
  { id: "chewy-swe",      company: "Chewy",        role: "Senior SWE, Personalization",               location: "Dania Beach, FL",    remote: true,  tag: "Animals",      tags: ["Animals"],                                 tagColor: "#3a8a47", cardBg: "#eabc2b", dept: "Engineering", mission: false, small: false, url: "https://www.chewy.com/",                             description: "Build the personalization systems for the pet supply company that has won over pet owners with its customer obsession. Interesting ML and recommendation work at real scale." },
];

const FEATURED_JOBS = ALL_JOBS.filter(j =>
  ["strava-ios", "duolingo-pm", "fender-ux", "alltrails-em", "seatgeek-pd", "calm-be"].includes(j.id)
);

// ─── BROWSE JOBS ───────────────────────────────────────────
function BrowseJobs({ onJobClick }) {
  const [activeInterests, setActiveInterests] = useState([]);
  const [selectedSkills,  setSelectedSkills]  = useState(new Set());
  const [activePrefs,     setActivePrefs]     = useState([]);
  const [searching,       setSearching]       = useState(false);

  const allInterests = [...new Set(ALL_JOBS.flatMap(j => j.tags))].sort();

  const skillsAC = useAC({
    pool: SKILL_POOL,
    filterFn: (s, q) => !selectedSkills.has(s) && s.toLowerCase().includes(q),
  });
  const addSkill = s => {
    setSelectedSkills(prev => new Set([...prev, s]));
    skillsAC.setQuery(''); skillsAC.setOpen(false);
  };
  const removeSkill = s => setSelectedSkills(prev => { const n = new Set(prev); n.delete(s); return n; });

  const skillDepts = new Set([...selectedSkills].map(s => SKILL_TO_DEPT[s]).filter(Boolean));

  const filtered = ALL_JOBS.filter(job => {
    if (activeInterests.length && !activeInterests.some(i => job.tags.includes(i))) return false;
    if (skillDepts.size        && !skillDepts.has(job.dept))                         return false;
    if (activePrefs.includes("remote")  && !job.remote)  return false;
    if (activePrefs.includes("mission") && !job.mission) return false;
    if (activePrefs.includes("small")   && !job.small)   return false;
    return true;
  });

  const toggleArr = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const hasFilters = activeInterests.length || selectedSkills.size || activePrefs.length;

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 700);
    // TODO: call JSearch API with activeInterests + selectedSkills + activePrefs
  };

  const sectionLabel = {
    fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, display: "block",
  };

  const interestPill = (interest) => {
    const isActive = activeInterests.includes(interest);
    const color = INTEREST_COLORS[interest] || "var(--ink-4)";
    return (
      <button key={interest}
        onClick={() => toggleArr(activeInterests, setActiveInterests, interest)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 16px 7px 8px", borderRadius: 999,
          border: "var(--stroke) solid var(--ink)",
          background: isActive ? "var(--ink)" : "var(--paper)",
          color: isActive ? "var(--paper)" : "var(--ink)",
          fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 13,
          letterSpacing: "-0.01em", cursor: "pointer",
          transition: "background 0.1s, color 0.1s, transform 0.08s",
        }}
        onMouseEnter={e => !isActive && (e.currentTarget.style.transform = "translateY(-1px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "")}
      >
        <span style={{
          width: 18, height: 18, borderRadius: "50%", flexShrink: 0, opacity: 0.9,
          background: isActive ? "transparent" : color,
          border: `1.5px solid ${isActive ? "var(--paper)" : color}`,
        }} />
        {interest}
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 48px 96px" }}>

      {/* Page header */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        marginBottom: 40, paddingBottom: 32, borderBottom: "var(--stroke) solid var(--ink)",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
            Browse jobs
          </p>
          <h1 style={{
            fontFamily: "var(--ff-display)", fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            Roles worth{" "}
            <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400 }}>
              getting out of bed for
            </em>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--ink-4)" }}>
            {filtered.length} of {ALL_JOBS.length} curated roles
          </span>
          {hasFilters && (
            <button
              onClick={() => { setActiveInterests([]); setSelectedSkills(new Set()); setActivePrefs([]); }}
              style={{ ...btnOutline, fontSize: 11, padding: "6px 14px", boxShadow: "2px 2px 0 var(--ink)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "2px 2px 0 var(--ink)"; }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Interests */}
      <div style={{ marginBottom: 28 }}>
        <span style={sectionLabel}>Browse by interest</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allInterests.map(interestPill)}
        </div>
      </div>

      {/* Skills — same search UI as ProfileBuilder */}
      <div style={{ marginBottom: 28 }}>
        <span style={sectionLabel}>Browse by skill</span>
        <div style={{ position: "relative" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            border: "var(--stroke) solid var(--ink)",
            padding: "12px 16px", background: "var(--paper)",
            transition: "box-shadow 0.1s",
          }}
          onFocus={() => {}} /* box-shadow handled inline below */
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" stroke="var(--ink-3)" style={{ flexShrink: 0 }}>
              <circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" />
            </svg>
            <input
              ref={skillsAC.inputRef}
              placeholder="Try: React, Figma, Product Design, Python…"
              value={skillsAC.query}
              onChange={e => { skillsAC.setQuery(e.target.value); skillsAC.setOpen(true); skillsAC.setFocused(-1); }}
              onFocus={e => { skillsAC.setOpen(true); e.currentTarget.closest('div').style.boxShadow = "4px 4px 0 var(--federal)"; }}
              onBlur={e => { setTimeout(() => skillsAC.setOpen(false), 150); e.currentTarget.closest('div').style.boxShadow = "none"; }}
              onKeyDown={e => {
                if (e.key === 'Backspace' && !skillsAC.query && selectedSkills.size) {
                  const arr = [...selectedSkills]; removeSkill(arr[arr.length - 1]);
                }
                skillsAC.handleKeyDown(e, addSkill);
              }}
              style={{
                flex: 1, border: "none", background: "transparent",
                fontFamily: "var(--ff-display)", fontSize: 14, color: "var(--ink)",
                outline: "none",
              }}
              autoComplete="off"
            />
            <span style={{
              fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--ink-4)",
              paddingLeft: 12, borderLeft: "1px solid var(--rule-soft)", whiteSpace: "nowrap",
            }}>
              {selectedSkills.size} added
            </span>
          </div>

          {/* Autocomplete dropdown */}
          {skillsAC.open && skillsAC.matches.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 20,
              background: "var(--paper)", border: "var(--stroke) solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)", maxHeight: 260, overflowY: "auto",
            }}>
              {skillsAC.matches.map((s, i) => (
                <div key={s} onMouseDown={() => addSkill(s)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", cursor: "pointer",
                  background: i === skillsAC.focused ? "var(--paper-2)" : "transparent",
                  borderBottom: "1px solid var(--rule-soft)",
                  fontFamily: "var(--ff-display)", fontSize: 13, color: "var(--ink)",
                }}>
                  <span style={{ width: 10, height: 10, background: "var(--ink)", flexShrink: 0 }} />
                  {s}
                  <span style={{ marginLeft: "auto", fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>
                    {SKILL_TO_DEPT[s] || "skill"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected skill pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, minHeight: 34 }}>
          {selectedSkills.size === 0 ? (
            <span style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 13, color: "var(--ink-4)", lineHeight: "34px" }}>
              — nothing yet. Start typing above.
            </span>
          ) : [...selectedSkills].map(s => (
            <span key={s} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "5px 6px 5px 10px",
              border: "var(--stroke) solid var(--ink)",
              background: "var(--ink)", color: "var(--paper)",
              fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 12,
              letterSpacing: "-0.01em",
            }}>
              <span style={{ width: 8, height: 8, background: "var(--paper)", flexShrink: 0 }} />
              {s}
              <button onClick={() => removeSkill(s)} style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(244,236,224,0.15)", color: "var(--paper)",
                border: "none", cursor: "pointer", display: "grid", placeItems: "center",
                fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 13, lineHeight: 1,
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--fluoro)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(244,236,224,0.15)"}
              >×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div style={{ marginBottom: 32 }}>
        <span style={sectionLabel}>Preferences</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PREFS.map(({ id, label }) => {
            const isActive = activePrefs.includes(id);
            return (
              <button key={id} onClick={() => toggleArr(activePrefs, setActivePrefs, id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 20px", borderRadius: 999,
                  border: "var(--stroke) solid var(--ink)",
                  background: isActive ? "var(--ink)" : "var(--paper)",
                  color: isActive ? "var(--paper)" : "var(--ink)",
                  fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 13,
                  letterSpacing: "-0.01em", cursor: "pointer",
                  transition: "background 0.1s, color 0.1s, transform 0.08s",
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "")}
              >
                {isActive && <span style={{ fontSize: 10, lineHeight: 1 }}>✓</span>}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search button */}
      <div style={{ marginBottom: 48, paddingBottom: 40, borderBottom: "var(--stroke) solid var(--ink)", display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={handleSearch}
          style={{ ...btnPrimary, padding: "13px 32px", fontSize: 14, boxShadow: "4px 4px 0 var(--federal)", opacity: searching ? 0.7 : 1 }}
          onMouseEnter={e => { if (!searching) { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "5px 5px 0 var(--federal)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 var(--federal)"; }}
          disabled={searching}
        >
          {searching ? "Searching…" : <>Search roles <ArrowRight /></>}
        </button>
        <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>
          {filtered.length} match · JSearch coming soon
        </span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0",
          fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 18, color: "var(--ink-3)",
        }}>
          No roles match those filters — try broadening your search.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          border: "var(--stroke) solid var(--ink)",
          background: "var(--ink)",
          gap: "1.5px",
        }}>
          {filtered.map((job, i) => <JobCard key={job.id} job={job} index={i} onJobClick={onJobClick} />)}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, index, onJobClick }) {
  const [hovered, setHovered] = useState(false);
  const textColor = (job.cardBg === "#2750b6" || job.cardBg === "#e35598") ? "#f4ece0" : "var(--ink)";

  return (
    <div
      onClick={() => onJobClick && onJobClick(job)}
      style={{
        background: "var(--paper)", display: "block",
        color: "var(--ink)", position: "relative", overflow: "hidden",
        transform: hovered ? "translate(-2px, -2px)" : "none",
        boxShadow: hovered ? "3px 3px 0 var(--ink)" : "none",
        zIndex: hovered ? 2 : 1,
        transition: "transform 0.1s, box-shadow 0.1s",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* card top */}
      <div style={{
        padding: "18px 20px 16px",
        borderBottom: "var(--stroke) solid var(--ink)",
        background: job.cardBg,
        position: "relative", overflow: "hidden", minHeight: 100,
      }}>
        {/* decorative disc */}
        <div style={{
          position: "absolute", width: 110, height: 110, borderRadius: "50%",
          right: -24, top: -28, background: job.tagColor,
          mixBlendMode: "multiply", opacity: 0.6,
        }} />
        <div style={{
          fontFamily: "var(--ff-mono)", fontSize: 18, fontWeight: 500,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: textColor, marginBottom: 4, position: "relative", zIndex: 1,
          opacity: 0.85,
        }}>
          {job.company}
        </div>
        <div style={{
          fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 18,
          lineHeight: 1.15, letterSpacing: "-0.02em",
          color: textColor, position: "relative", zIndex: 1,
        }}>
          {job.role}
        </div>
      </div>

      {/* card body */}
      <div style={{ padding: "14px 20px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 14, color: "var(--ink-2)" }}>
          {job.remote ? "Remote" : job.location}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px 3px 6px", border: "1px solid var(--ink)",
            borderRadius: 999, fontFamily: "var(--ff-display)", fontSize: 11,
            fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
            color: "var(--ink)", background: "var(--paper)",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: job.tagColor, flexShrink: 0 }} />
            {job.tag}
          </span>
          {hovered && (
            <span style={{ marginLeft: "auto", fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              View →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MOVE OF THE WEEK ────────────────────────────────────────
function MoveOfWeek() {
  return (
    <section id="move" style={{
      borderTop: "var(--stroke) solid var(--ink)",
      background: "var(--ink)", color: "var(--paper)",
      position: "relative", overflow: "hidden",
    }}>
      {/* blooms */}
      <div aria-hidden style={{ position: "absolute", left: -60, top: -60, width: 260, height: 260, borderRadius: "50%", background: "var(--federal)", opacity: 0.35, mixBlendMode: "multiply", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 200, borderRadius: "50%", background: "var(--sun)", opacity: 0.35, mixBlendMode: "multiply", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 48px" }}>

        {/* header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,236,224,0.5)", marginBottom: 8 }}>
              Weekly feature
            </p>
            <h2 style={{
              fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 32,
              letterSpacing: "-0.03em", lineHeight: 1, color: "var(--paper)",
            }}>
              Move of the{" "}
              <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--sun)" }}>
                Week
              </em>
            </h2>
          </div>
          <div style={{
            fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(244,236,224,0.4)",
          }}>
            New profile every Monday
          </div>
        </div>

        {/* card */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          border: "var(--stroke) solid rgba(244,236,224,0.2)",
          background: "rgba(244,236,224,0.04)",
        }}>
          {/* left — identity */}
          <div style={{
            padding: "40px 48px",
            borderRight: "var(--stroke) solid rgba(244,236,224,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
              {/* avatar */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: MOVE_OF_WEEK.avatar_color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 20,
                color: "var(--paper)", flexShrink: 0,
                border: "2px solid rgba(244,236,224,0.3)",
              }}>
                {MOVE_OF_WEEK.avatar_initials}
              </div>
              <div>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", color: "var(--paper)" }}>
                  {MOVE_OF_WEEK.name}
                </div>
                <div style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 14, color: "rgba(244,236,224,0.6)", marginTop: 2 }}>
                  {MOVE_OF_WEEK.new_role} · {MOVE_OF_WEEK.new_company}
                </div>
              </div>
            </div>

            {/* the move */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,236,224,0.4)", marginBottom: 16 }}>
                The move
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* from */}
                <div style={{
                  padding: "14px 16px",
                  background: "rgba(244,236,224,0.06)",
                  border: "1px solid rgba(244,236,224,0.1)",
                }}>
                  <div style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,236,224,0.35)", marginBottom: 4 }}>From</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 15, color: "rgba(244,236,224,0.75)", letterSpacing: "-0.01em" }}>
                    {MOVE_OF_WEEK.prev_role} at {MOVE_OF_WEEK.prev_company}
                  </div>
                </div>
                {/* arrow connector */}
                <div style={{ display: "flex", justifyContent: "center", padding: "6px 0", borderLeft: "1px solid rgba(244,236,224,0.1)", borderRight: "1px solid rgba(244,236,224,0.1)" }}>
                  <span style={{ color: "var(--sun)", fontSize: 18 }}>↓</span>
                </div>
                {/* to */}
                <div style={{
                  padding: "14px 16px",
                  background: "rgba(234,188,43,0.12)",
                  border: "1px solid rgba(234,188,43,0.3)",
                }}>
                  <div style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,188,43,0.6)", marginBottom: 4 }}>To</div>
                  <div style={{ fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 15, color: "var(--paper)", letterSpacing: "-0.01em" }}>
                    {MOVE_OF_WEEK.new_role} at {MOVE_OF_WEEK.new_company}
                  </div>
                </div>
              </div>
            </div>

            {/* tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {MOVE_OF_WEEK.tags.map(tag => (
                <span key={tag} style={{
                  padding: "4px 12px", border: "1px solid rgba(244,236,224,0.2)",
                  fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "rgba(244,236,224,0.5)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* right — quote */}
          <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontFamily: "var(--ff-serif)", fontStyle: "italic",
                fontSize: 28, lineHeight: 1.35, color: "var(--paper)",
                letterSpacing: "-0.01em", marginBottom: 24,
              }}>
                <span style={{ color: "var(--sun)", fontSize: 48, lineHeight: 0.5, display: "block", marginBottom: 8, fontStyle: "normal" }}>"</span>
                {MOVE_OF_WEEK.quote}
              </div>
              <div style={{
                height: 1, background: "rgba(244,236,224,0.12)", marginBottom: 24,
              }} />
              <div style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(244,236,224,0.4)" }}>
                {MOVE_OF_WEEK.years} years at {MOVE_OF_WEEK.prev_company} → now at {MOVE_OF_WEEK.new_company}
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <button style={{
                ...btnPrimary,
                background: "var(--paper)", color: "var(--ink)",
                border: "var(--stroke) solid var(--paper)",
                boxShadow: "3px 3px 0 var(--sun)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--sun)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--sun)"; }}
              >
                Read the full story <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── EMAIL SIGNUP ────────────────────────────────────────────
function EmailSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="signup" style={{
      borderTop: "var(--stroke) solid var(--ink)",
      background: "var(--ink)", color: "var(--paper)",
      padding: "80px 48px", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "var(--federal)", opacity: 0.12, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,236,224,0.4)", marginBottom: 16 }}>
          Weekly digest
        </p>
        <h2 style={{
          fontFamily: "var(--ff-display)", fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.04em",
          lineHeight: 1, marginBottom: 16, color: "var(--paper)",
        }}>
          Good jobs,{" "}
          <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--sun)" }}>
            once a week.
          </em>
          {" "}That's it.
        </h2>
        <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 18, color: "rgba(244,236,224,0.65)", marginBottom: 40, lineHeight: 1.4 }}>
          A short list of the most interesting tech roles we've found.
        </p>

        {done ? (
          <div style={{ padding: "20px 32px", border: "var(--stroke) solid rgba(58,138,71,0.6)", background: "rgba(58,138,71,0.1)" }}>
            <p style={{ fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 16, color: "var(--paper)" }}>
              You're in. ✓
            </p>
            <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 14, color: "rgba(244,236,224,0.6)", marginTop: 4 }}>
              First digest hits your inbox Monday.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", border: "var(--stroke) solid rgba(244,236,224,0.3)", boxShadow: "5px 5px 0 var(--federal)" }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && email && setDone(true)}
              style={{
                flex: 1, padding: "14px 16px",
                border: "none", background: "transparent",
                fontFamily: "var(--ff-body)", fontSize: 14,
                color: "var(--paper)", outline: "none",
              }}
            />
            <button
              onClick={() => email && setDone(true)}
              style={{
                padding: "14px 24px",
                border: "none", borderLeft: "var(--stroke) solid rgba(244,236,224,0.3)",
                background: "var(--paper)", color: "var(--ink)",
                fontFamily: "var(--ff-display)", fontSize: 13, fontWeight: 600,
                letterSpacing: "-0.01em", cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--paper-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--paper)"}
            >
              I'm in
            </button>
          </div>
        )}

        <p style={{ marginTop: 16, fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,236,224,0.3)" }}>
          No spam. No recruiters cold-emailing you. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}

// ─── FEATURED JOBS ───────────────────────────────────────────
function FeaturedJobs({ onJobClick }) {
  return (
    <section id="jobs" style={{
      padding: "64px 48px",
      maxWidth: 1180, margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <h2 style={{
            fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 32,
            letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)",
          }}>
            Featured Jobs
          </h2>
          <p style={{ marginTop: 8, fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-3)" }}>
            Roles we've been jealous of lately.
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        border: "var(--stroke) solid var(--ink)",
        background: "var(--ink)",
        gap: "1.5px",
      }}>
        {FEATURED_JOBS.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} onJobClick={onJobClick} />
        ))}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <button style={{
          ...btnOutline, gap: 8,
          fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
        >
          Want to refine your options? Build your profile<ArrowRight />
        </button>
      </div>

    </section>
  );
}

// ─── SUBMIT A COMPANY ────────────────────────────────────────
function SubmitCompany() {
  const [form, setForm] = useState({ company: "", website: "", why: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "var(--stroke) solid var(--ink)",
    background: "var(--paper)", fontFamily: "var(--ff-body)",
    fontSize: 14, color: "var(--ink)", outline: "none",
    borderRadius: 0, transition: "box-shadow 0.1s",
  };

  const labelStyle = {
    fontFamily: "var(--ff-mono)", fontSize: 10, fontWeight: 500,
    color: "var(--ink-3)", letterSpacing: "0.14em", textTransform: "uppercase",
    display: "block", marginBottom: 6, marginTop: 20,
  };

  return (
    <section id="submit" style={{
      padding: "64px 48px",
      maxWidth: 1180, margin: "0 auto",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

        {/* left — copy */}
        <div>
          <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 16 }}>
            Submit a company
          </p>
          <h2 style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 36, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>
            Know a company that belongs here?
          </h2>
          <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)", marginBottom: 40 }}>
            We love hearing about new folks building something worth sharing. 
          </p>

          {/* what makes it in */}
          <div style={{ border: "var(--stroke) solid var(--ink)", padding: 24, background: "var(--paper-2)" }}>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 16 }}>
              What makes it in
            </div>
            {[
              "Doing compelling work",
              "Actually hires software engineers, designers, or PMs",
              "Your eight-year-old self would think it was cool",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: "var(--leaf)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, lineHeight: 1.4, color: "var(--ink-2)" }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 16, fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)" }}>
            We read every submission.
          </p>
        </div>

        {/* right — form */}
        <div>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>✦</div>
              <h3 style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 24, letterSpacing: "-0.02em", marginBottom: 12 }}>
                Got it. Thanks.
              </h3>
              <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-2)" }}>
                We'll take a look and reach out if it's a fit.
              </p>
              <button style={{ ...btnOutline, marginTop: 24 }} onClick={() => { setSubmitted(false); setForm({ company: "", website: "", why: "", contact: "" }); }}>
                Submit another
              </button>
            </div>
          ) : (
            <>
              <label style={labelStyle}>Company name</label>
              <input style={inputStyle} placeholder="onX Maps" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>Website</label>
              <input style={inputStyle} placeholder="https://onxmaps.com" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>Why does it belong here?</label>
              <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }}
                placeholder="They make mapping software specifically for hunters and hikers. The whole team is obsessed with public land access."
                value={form.why}
                onChange={e => setForm(f => ({ ...f, why: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>Your email (optional)</label>
              <input style={inputStyle} placeholder="you@example.com" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <button
                style={{ ...btnPrimary, marginTop: 28, width: "100%", justifyContent: "center" }}
                onClick={() => form.company && form.website && setSubmitted(true)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--federal)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--federal)"; }}
              >
                Submit for review <ArrowRight />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── JOB VIEW ────────────────────────────────────────────────
function JobView({ job, onBack }) {
  const [copied, setCopied] = useState(false);
  const darkBg = ["#181818","#2750b6","#e35598","#e8632c"].includes(job.cardBg);
  const headerTextColor = darkBg ? "#f4ece0" : "var(--ink)";

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#job-${job.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 48px 96px" }}>

      {/* Back */}
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--ink-3)",
          display: "flex", alignItems: "center", gap: 6, marginBottom: 32,
          transition: "color 0.1s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--ink-3)"}
      >
        ← Back to jobs
      </button>

      {/* Header card */}
      <div style={{
        background: job.cardBg,
        border: "var(--stroke) solid var(--ink)",
        padding: "40px 48px", marginBottom: 0,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 280, height: 280, borderRadius: "50%",
          right: -60, top: -60, background: job.tagColor,
          mixBlendMode: "multiply", opacity: 0.5,
        }} />
        <div style={{
          position: "absolute", width: 160, height: 160, borderRadius: "50%",
          left: -40, bottom: -40, background: job.tagColor,
          mixBlendMode: "multiply", opacity: 0.3,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px 3px 6px", border: `1px solid ${headerTextColor === "#f4ece0" ? "rgba(244,236,224,0.4)" : "var(--ink)"}`,
            borderRadius: 999, fontFamily: "var(--ff-display)", fontSize: 11,
            fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
            color: headerTextColor, marginBottom: 20, opacity: 0.9,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: job.tagColor, flexShrink: 0 }} />
            {job.tag}
          </span>

          <div style={{
            fontFamily: "var(--ff-mono)", fontSize: 20, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: headerTextColor, marginBottom: 8, opacity: 0.8,
          }}>
            {job.company}
          </div>
          <h1 style={{
            fontFamily: "var(--ff-display)", fontWeight: 700,
            fontSize: "clamp(24px, 4vw, 40px)", lineHeight: 1.1,
            letterSpacing: "-0.03em", color: headerTextColor,
          }}>
            {job.role}
          </h1>
        </div>
      </div>

      {/* Details row */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 0,
        border: "var(--stroke) solid var(--ink)",
        borderTop: "none", marginBottom: 40,
      }}>
        {[
          { label: "Location", value: job.remote ? `${job.location} · Remote` : job.location },
          { label: "Department", value: job.dept },
          { label: "Team size", value: job.small ? "Small team" : "Large team" },
          { label: "Mission-driven", value: job.mission ? "Yes" : "Not listed" },
        ].map(({ label, value }, i, arr) => (
          <div key={label} style={{
            flex: "1 1 160px", padding: "16px 20px",
            borderRight: i < arr.length - 1 ? "var(--stroke) solid var(--ink)" : "none",
          }}>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 16 }}>
          About this role
        </p>
        <p style={{
          fontFamily: "var(--ff-serif)", fontStyle: "italic",
          fontSize: 22, lineHeight: 1.55, color: "var(--ink-2)",
          maxWidth: 640,
        }}>
          {job.description}
        </p>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12 }}>
          Interests
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {job.tags.map(t => (
            <span key={t} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px 5px 8px", borderRadius: 999,
              border: "var(--stroke) solid var(--ink)",
              fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 12,
              letterSpacing: "-0.01em", color: "var(--ink)",
            }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: INTEREST_COLORS[t] || "var(--ink-4)", flexShrink: 0 }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 32, borderTop: "var(--stroke) solid var(--ink)" }}>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnPrimary, padding: "14px 32px", fontSize: 15, boxShadow: "4px 4px 0 var(--federal)", textDecoration: "none" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "5px 5px 0 var(--federal)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 var(--federal)"; }}
        >
          Apply now <ExternalLink />
        </a>
        <button
          onClick={handleShare}
          style={{ ...btnOutline, padding: "14px 28px", fontSize: 15 }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
        >
          {copied ? "Link copied ✓" : "Share this role"}
        </button>
      </div>
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: "var(--stroke) solid var(--ink)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "24px 48px", flexWrap: "wrap", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.04em" }}>
          Field<span style={{ color: "var(--federal)" }}>work</span>
        </span>
        <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          © 2026
        </span>
      </div>
      <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 13, color: "var(--ink-3)" }}>
        Make boring boring again.
      </p>
      <div style={{ display: "flex", gap: 32 }}>
        {["About", "Privacy", "Contact"].map(link => (
          <a key={link} href="#" style={{
            fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--ink-3)", textDecoration: "none",
            transition: "color 0.1s",
          }}
          onMouseEnter={e => e.target.style.color = "var(--ink)"}
          onMouseLeave={e => e.target.style.color = "var(--ink-3)"}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [profileScreen, setProfileScreen] = useState("form");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#job-")) {
      const id = hash.slice(5);
      const job = ALL_JOBS.find(j => j.id === id);
      if (job) setSelectedJob(job);
    }
  }, []);

  const openJob = (job) => {
    setSelectedJob(job);
    window.location.hash = `job-${job.id}`;
  };

  const closeJob = () => {
    setSelectedJob(null);
    history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav page={page} setPage={setPage} />

      {/* Profile sub-nav — sits sticky below main nav */}
      {!selectedJob && page === "profile" && (
        <div style={{
          position: "sticky", top: 60, zIndex: 99,
          borderBottom: "var(--stroke) solid var(--ink)",
          background: "var(--paper)",
          display: "flex", alignItems: "stretch", height: 48,
        }}>
          <div style={{ display: "flex" }}>
            {[
              { id: "form",    label: "Tell us who you are", step: 1 },
              { id: "profile", label: "Your profile",        step: 2 },
            ].map(({ id, label, step }) => {
              const active = profileScreen === id;
              return (
                <button key={id} onClick={() => setProfileScreen(id)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "0 20px",
                  border: "none", borderRight: "var(--stroke) solid var(--ink)",
                  background: active ? "var(--ink)" : "var(--paper)",
                  color: active ? "var(--paper)" : "var(--ink)",
                  fontFamily: "var(--ff-mono)", fontSize: 11,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  cursor: "pointer", transition: "background 0.1s, color 0.1s",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: active ? "var(--paper)" : "var(--fluoro)",
                    color: active ? "var(--ink)" : "var(--paper)",
                    display: "grid", placeItems: "center",
                    fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 10, letterSpacing: 0,
                  }}>{step}</span>
                  {label}
                </button>
              );
            })}
          </div>
          <span style={{
            marginLeft: "auto", padding: "0 24px",
            display: "flex", alignItems: "center",
            fontFamily: "var(--ff-mono)", fontSize: 10,
            letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)",
          }}>
            Profile builder
          </span>
        </div>
      )}

      {selectedJob ? (
        <>
          <JobView job={selectedJob} onBack={closeJob} />
          <Footer />
        </>
      ) : (
        <>
          {page === "home" && (
            <>
              <Hero onNav={setPage} />
              <EmailSignup />
              <FeaturedJobs onJobClick={openJob} />
              <SubmitCompany />
            </>
          )}
          {page === "jobs" && <BrowseJobs onJobClick={openJob} />}
          {page === "profile" && (
            <div style={{ "--pb-top-offset": "108px" }}>
              <ProfileBuilder
                noTopNav
                screen={profileScreen}
                setScreen={setProfileScreen}
                onBack={() => setPage("home")}
              />
            </div>
          )}
          {page !== "profile" && <Footer />}
        </>
      )}
    </div>
  );
}
