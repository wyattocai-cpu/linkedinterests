import { useState } from "react";
import './App.css';

// ─── STATIC DATA ────────────────────────────────────────────
const FEATURED_JOBS = [
  {
    id: 1,
    company: "Strava",
    role: "Senior Software Engineer, Feed",
    location: "San Francisco, CA",
    remote: true,
    tag: "Fitness",
    tagColor: "#e8632c",
    cardBg: "#eabc2b",
    url: "#",
  },
  {
    id: 2,
    company: "Duolingo",
    role: "Staff Product Manager, Learning",
    location: "Pittsburgh, PA",
    remote: false,
    tag: "Language",
    tagColor: "#2750b6",
    cardBg: "#f4ece0",
    url: "#",
  },
  {
    id: 3,
    company: "Fender",
    role: "Senior UX Designer, Digital Products",
    location: "Los Angeles, CA",
    remote: true,
    tag: "Music",
    tagColor: "#e35598",
    cardBg: "#e35598",
    url: "#",
  },
  {
    id: 4,
    company: "AllTrails",
    role: "Engineering Manager, Mobile",
    location: "San Francisco, CA",
    remote: true,
    tag: "Outdoors",
    tagColor: "#3a8a47",
    cardBg: "#eabc2b",
    url: "#",
  },
  {
    id: 5,
    company: "SeatGeek",
    role: "Product Designer, Consumer",
    location: "New York, NY",
    remote: false,
    tag: "Sports",
    tagColor: "#e8632c",
    cardBg: "#f4ece0",
    url: "#",
  },
  {
    id: 6,
    company: "Calm",
    role: "Backend Engineer, Infrastructure",
    location: "Remote",
    remote: true,
    tag: "Wellness",
    tagColor: "#3a8a47",
    cardBg: "#2750b6",
    url: "#",
  },
];

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
function Nav({ onNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      }} onClick={() => onNav("home")}>
        Field<span style={{ color: "var(--federal)" }}>work</span>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {[
          { label: "Browse Jobs", section: "jobs" },
          { label: "Move of the Week", section: "move" },
          { label: "Build Profile", section: "profile" },
        ].map(({ label, section }) => (
          <button key={label} onClick={() => onNav(section)} style={{
            background: "none", border: "none", padding: 0,
            fontSize: 13, fontWeight: 500, color: "var(--ink-2)",
            letterSpacing: "-0.01em", cursor: "pointer",
            transition: "color 0.1s",
          }}
          onMouseEnter={e => e.target.style.color = "var(--ink)"}
          onMouseLeave={e => e.target.style.color = "var(--ink-2)"}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => onNav("submit")}
          style={btnOutline}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
        >
          Submit a company
        </button>
        <button
          onClick={() => onNav("signup")}
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
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "var(--federal)", opacity: 0.7, mixBlendMode: "multiply", left: 0, top: 24 }} />
          <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "var(--fluoro)", opacity: 0.7, mixBlendMode: "multiply", right: 0, top: 24 }} />
        </div>
      </div>

      <p className="fade-up" style={{
        fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "var(--ink-3)",
        marginBottom: 24, display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ display: "inline-block", width: 20, height: 1.5, background: "var(--ink-3)" }} />
        For people who work in tech
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
          Start acting<br />like it.
        </em>
      </h1>

      <p className="fade-up fade-up-2" style={{
        fontFamily: "var(--ff-serif)", fontStyle: "italic",
        fontSize: 22, lineHeight: 1.4, color: "var(--ink-2)",
        maxWidth: 540, marginBottom: 48,
      }}>
        Fieldwork is a job board for tech workers who are done building things they don't care about.
      </p>

      <div className="fade-up fade-up-3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => onNav("jobs")}
          style={{ ...btnPrimary, padding: "14px 28px", fontSize: 15, boxShadow: "5px 5px 0 var(--federal)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "6px 6px 0 var(--federal)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "5px 5px 0 var(--federal)"; }}
        >
          See open roles <ArrowRight />
        </button>
        <button
          onClick={() => onNav("signup")}
          style={{ ...btnOutline, padding: "14px 28px", fontSize: 15 }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
        >
          Get the weekly list
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

// ─── FEATURED JOBS ───────────────────────────────────────────
function FeaturedJobs() {
  return (
    <section id="jobs" style={{
      borderTop: "var(--stroke) solid var(--ink)",
      padding: "64px 48px",
      maxWidth: 1180, margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <h2 style={{
            fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 32,
            letterSpacing: "-0.03em", lineHeight: 1, color: "var(--ink)",
          }}>
            Roles worth{" "}
            <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400 }}>
              getting out of bed for
            </em>
          </h2>
          <p style={{ marginTop: 8, fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-3)" }}>
            Hand-picked positions at companies doing something you'll actually talk about at a party.
          </p>
        </div>
        <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-4)", whiteSpace: "nowrap" }}>
          All curated by hand
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        border: "var(--stroke) solid var(--ink)",
        background: "var(--ink)",
        gap: "1.5px",
      }}>
        {FEATURED_JOBS.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} />
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
          Browse all roles <ArrowRight />
        </button>
      </div>
    </section>
  );
}

function JobCard({ job, index }) {
  const [hovered, setHovered] = useState(false);
  const isLight = job.cardBg === "#f4ece0";
  const textColor = (job.cardBg === "#2750b6" || job.cardBg === "#e35598") ? "#f4ece0" : "var(--ink)";

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: "var(--paper)", display: "block", textDecoration: "none",
        color: "var(--ink)", position: "relative", overflow: "hidden",
        transform: hovered ? "translate(-2px, -2px)" : "none",
        boxShadow: hovered ? "3px 3px 0 var(--ink)" : "none",
        zIndex: hovered ? 2 : 1,
        transition: "transform 0.1s, box-shadow 0.1s",
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
          fontFamily: "var(--ff-mono)", fontSize: 10, fontWeight: 500,
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
            <span style={{ marginLeft: "auto", color: "var(--federal)", opacity: 0.7 }}>
              <ExternalLink />
            </span>
          )}
        </div>
      </div>
    </a>
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

// ─── VALUE PROPS ─────────────────────────────────────────────
function ValueProps() {
  const items = [
    {
      num: "01", accent: "var(--federal)",
      h: <>Work on something you'd <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400 }}>open on your own time</em></>,
      p: "Every company here is built around something people actually love — not enterprise software, not B2B logistics.",
    },
    {
      num: "02", accent: "var(--fluoro)",
      h: <>Your skills transfer <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400 }}>more than you think</em></>,
      p: "A senior PM, engineer, or designer can work almost anywhere. Most never realize it until it's too late.",
    },
    {
      num: "03", accent: "var(--sun)",
      h: <>Curated by a person, <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400 }}>not an algorithm</em></>,
      p: "Every company on Fieldwork is hand-picked. If it's here, a human vouched for it.",
    },
  ];

  return (
    <section style={{ borderTop: "var(--stroke) solid var(--ink)", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        border: "var(--stroke) solid var(--ink)", margin: "0 48px",
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: 32,
            borderRight: i < 2 ? "var(--stroke) solid var(--ink)" : "none",
            display: "flex", flexDirection: "column", gap: 12,
            minHeight: 200, background: "var(--paper)",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", right: -30, bottom: -30,
              width: 120, height: 120, borderRadius: "50%",
              background: item.accent, mixBlendMode: "multiply", opacity: 0.5,
              pointerEvents: "none",
            }} />
            <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              {item.num}
            </span>
            <h3 style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.025em", lineHeight: 1.15, color: "var(--ink)", marginTop: 8 }}>
              {item.h}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>{item.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PROFILE BUILDER ─────────────────────────────────────────
function ProfileBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", title: "", company: "", bio: "",
    interests: [], openTo: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const INTERESTS = ["Music", "Gaming", "Food & Drink", "Fitness", "Art & Design", "Sports", "Outdoors", "Sustainability", "Books & Media", "Film", "Fashion", "Travel"];
  const INTEREST_COLORS = { Music: "#e35598", Gaming: "#2750b6", "Food & Drink": "#eabc2b", Fitness: "#e8632c", "Art & Design": "#e35598", Sports: "#e8632c", Outdoors: "#3a8a47", Sustainability: "#3a8a47", "Books & Media": "#eabc2b", Film: "#2750b6", Fashion: "#e35598", Travel: "#3a8a47" };

  const steps = ["About you", "Your interests", "Where you're headed"];

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

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));
  };

  if (submitted) {
    return (
      <section id="profile" style={{ borderTop: "var(--stroke) solid var(--ink)", padding: "64px 48px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>✦</div>
          <h2 style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Profile saved.
          </h2>
          <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 18, color: "var(--ink-2)", lineHeight: 1.4 }}>
            We'll reach out when companies matching your interests start browsing.
          </p>
          <button style={{ ...btnPrimary, marginTop: 32 }} onClick={() => { setSubmitted(false); setStep(0); setForm({ name: "", title: "", company: "", bio: "", interests: [], openTo: "" }); }}>
            Edit profile
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="profile" style={{ borderTop: "var(--stroke) solid var(--ink)", padding: "64px 48px", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

        {/* left — copy */}
        <div>
          <p style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 16 }}>
            Profile Builder
          </p>
          <h2 style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 36, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>
            The profile your{" "}
            <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--federal)" }}>
              résumé can't show
            </em>
          </h2>
          <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)", marginBottom: 40 }}>
            What do you build? What are you into? Where do you actually want to go?
            Tell us — and let the right companies find you.
          </p>

          {/* feature list */}
          {[
            { label: "What you build", desc: "Your stack, your craft, your experience level" },
            { label: "What you're into", desc: "The interests that should shape where you work" },
            { label: "Where you want to go", desc: "Your next move, in your own words" },
          ].map(({ label, desc }) => (
            <div key={label} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--federal)", marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>{label}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* right — form */}
        <div>
          {/* stepper */}
          <div style={{ display: "flex", gap: 0, marginBottom: 32, border: "var(--stroke) solid var(--ink)" }}>
            {steps.map((s, i) => (
              <button key={s} onClick={() => i <= step && setStep(i)} style={{
                flex: 1, padding: "10px 4px", border: "none",
                borderRight: i < 2 ? "var(--stroke) solid var(--ink)" : "none",
                background: i === step ? "var(--ink)" : i < step ? "var(--paper-2)" : "var(--paper)",
                color: i === step ? "var(--paper)" : "var(--ink-3)",
                fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.1em",
                textTransform: "uppercase", cursor: i <= step ? "pointer" : "default",
                transition: "background 0.15s, color 0.15s",
              }}>
                {i < step ? "✓ " : `${i + 1}. `}{s}
              </button>
            ))}
          </div>

          {/* step 0 */}
          {step === 0 && (
            <div>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} placeholder="Alex Rivera" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>Current title</label>
              <input style={inputStyle} placeholder="Senior Software Engineer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>Current company</label>
              <input style={inputStyle} placeholder="Boring Corp Inc." value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>One-line bio</label>
              <textarea style={{ ...inputStyle, height: 88, resize: "vertical" }} placeholder="I build iOS apps and spend my weekends on a road bike." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
          )}

          {/* step 1 */}
          {step === 1 && (
            <div>
              <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 15, color: "var(--ink-2)", marginBottom: 20 }}>
                Pick the interests that should shape where you work. Select as many as you want.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {INTERESTS.map(interest => {
                  const isActive = form.interests.includes(interest);
                  const color = INTEREST_COLORS[interest];
                  return (
                    <button key={interest} onClick={() => toggleInterest(interest)} style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "7px 16px 7px 8px",
                      background: isActive ? "var(--ink)" : "var(--paper)",
                      border: "var(--stroke) solid var(--ink)",
                      borderRadius: 999,
                      fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 13,
                      letterSpacing: "-0.01em",
                      color: isActive ? "var(--paper)" : "var(--ink)",
                      cursor: "pointer",
                      transition: "background 0.1s, color 0.1s, transform 0.08s",
                    }}
                    onMouseEnter={e => !isActive && (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "")}
                    >
                      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${isActive ? "var(--paper)" : color}`, background: isActive ? "transparent" : color, flexShrink: 0, opacity: 0.9 }} />
                      {interest}
                    </button>
                  );
                })}
              </div>
              {form.interests.length > 0 && (
                <p style={{ marginTop: 16, fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  {form.interests.length} selected: {form.interests.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* step 2 */}
          {step === 2 && (
            <div>
              <label style={labelStyle}>What kind of move are you looking for?</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20 }}>
                {[
                  { val: "active", label: "Actively looking", desc: "Ready to interview now" },
                  { val: "passive", label: "Open to the right thing", desc: "Not rushing, but interested" },
                  { val: "exploring", label: "Just exploring", desc: "Curious what's out there" },
                ].map(({ val, label, desc }) => (
                  <button key={val} onClick={() => setForm(f => ({ ...f, openTo: val }))} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 16px",
                    border: "var(--stroke) solid var(--ink)",
                    borderBottom: "none",
                    background: form.openTo === val ? "var(--ink)" : "var(--paper)",
                    color: form.openTo === val ? "var(--paper)" : "var(--ink)",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.1s, color 0.1s",
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${form.openTo === val ? "var(--paper)" : "var(--ink)"}`, background: form.openTo === val ? "var(--paper)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {form.openTo === val && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)" }} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--ff-display)", fontWeight: 600, fontSize: 14 }}>{label}</div>
                      <div style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 13, opacity: 0.6, marginTop: 1 }}>{desc}</div>
                    </div>
                  </button>
                ))}
                <div style={{ border: "var(--stroke) solid var(--ink)", height: 0 }} />
              </div>
              <label style={labelStyle}>Describe your ideal next role (optional)</label>
              <textarea style={{ ...inputStyle, height: 120, resize: "vertical" }}
                placeholder="I want to work at a smaller company where I can see the impact of what I ship. Ideally something in music, sports, or fitness."
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
          )}

          {/* nav buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button style={btnOutline} onClick={() => setStep(s => s - 1)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--ink)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--ink)"; }}
              >
                Back
              </button>
            ) : <div />}
            {step < 2 ? (
              <button style={btnPrimary} onClick={() => setStep(s => s + 1)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--federal)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--federal)"; }}
              >
                Next <ArrowRight />
              </button>
            ) : (
              <button style={btnPrimary} onClick={() => setSubmitted(true)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--federal)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 var(--federal)"; }}
              >
                Save profile ✦
              </button>
            )}
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
          A short list of the most interesting tech roles we've found — curated by humans, not an algorithm.
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
      borderTop: "var(--stroke) solid var(--ink)",
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
            Know a company that{" "}
            <em style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--federal)" }}>
              belongs here?
            </em>
          </h2>
          <p style={{ fontFamily: "var(--ff-serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.5, color: "var(--ink-2)", marginBottom: 40 }}>
            We're always looking for companies doing genuinely interesting things that still pay real salaries. If it passes the vibe check, we'll add it.
          </p>

          {/* what makes it in */}
          <div style={{ border: "var(--stroke) solid var(--ink)", padding: 24, background: "var(--paper-2)" }}>
            <div style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 16 }}>
              What makes it in
            </div>
            {[
              "Built around a genuine interest or hobby",
              "Pays market-rate or close to it",
              "Actually hires software engineers, designers, or PMs",
              "You'd be excited to tell a friend you work there",
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
              <label style={labelStyle}>Company name *</label>
              <input style={inputStyle} placeholder="onX Maps" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                onFocus={e => e.target.style.boxShadow = "3px 3px 0 var(--federal)"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
              <label style={labelStyle}>Website *</label>
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
        For tech workers who want to do something worth talking about.
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
  const handleNav = (section) => {
    if (section === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
        <Nav onNav={handleNav} />
        <Hero onNav={handleNav} />
        <FeaturedJobs />
        <MoveOfWeek />
        <ValueProps />
        <ProfileBuilder />
        <EmailSignup />
        <SubmitCompany />
        <Footer />
      </div>
    </>
  );
}
