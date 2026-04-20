import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import AuthModal from './AuthModal'
import './App.css'

const categories = [
  'Music', 'Outdoors', 'Gaming', 'Food & Drink',
  'Art & Design', 'Sports', 'Books & Media', 'Animals',
]

const jobs = [
  {
    company: 'Patagonia',
    role: 'Senior Software Engineer',
    location: 'Ventura, CA',
    tag: 'Outdoors',
    desc: 'Build tools that power our sustainable supply chain and e-commerce platform.',
  },
  {
    company: 'Spotify',
    role: 'Data Analyst',
    location: 'Remote',
    tag: 'Music',
    desc: 'Turn listener data into insights that shape how people discover music.',
  },
  {
    company: 'AllTrails',
    role: 'Product Manager',
    location: 'San Francisco, CA',
    tag: 'Outdoors',
    desc: 'Define the roadmap for features used by 50M hikers and explorers worldwide.',
  },
  {
    company: 'Duolingo',
    role: 'UX Researcher',
    location: 'Pittsburgh, PA',
    tag: 'Books & Media',
    desc: 'Help millions of learners stay motivated with research-backed product decisions.',
  },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase.auth.signOut()

  return (
    <div className="page">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <nav className="nav">
        <span className="logo">LinkedInterests</span>
        <div className="nav-links">
          <a href="#">Browse Jobs</a>
          <a href="#">For Companies</a>
          {user ? (
            <>
              <span className="nav-user">
                {user.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="" className="nav-avatar" />
                )}
                {user.user_metadata?.full_name ?? user.email}
              </span>
              <button className="btn-outline" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => setShowAuth(true)}>Sign in</button>
              <button className="btn-primary" onClick={() => setShowAuth(true)}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Work somewhere you <em>actually care about</em></h1>
        <p className="hero-sub">
          Find roles at companies built around your passions — not just your résumé.
          Trade a bit of prestige for a lot of purpose.
        </p>
        <div className="search-bar">
          <input type="text" placeholder="Job title or skill" />
          <div className="search-divider" />
          <input type="text" placeholder="Interest (e.g. Climbing, Coffee, Gaming)" />
          <button className="btn-primary">Search</button>
        </div>
      </section>

      <section className="section">
        <h2>Browse by interest</h2>
        <div className="categories">
          {categories.map((label) => (
            <button key={label} className="category-pill">
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Featured jobs</h2>
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.company + job.role} className="job-card">
              <div className="job-header">
                <div>
                  <div className="job-company">{job.company}</div>
                  <div className="job-role">{job.role}</div>
                </div>
                <span className="job-tag">{job.tag}</span>
              </div>
              <div className="job-location">{job.location}</div>
              <p className="job-desc">{job.desc}</p>
              <button className="btn-outline btn-sm">View role →</button>
            </div>
          ))}
        </div>
      </section>

      <section className="section value-prop">
        <div className="value-item">
          <span className="value-num">01</span>
          <h3>Match on what matters</h3>
          <p>Filter by the interests and values that make work feel less like work.</p>
        </div>
        <div className="value-item">
          <span className="value-num">02</span>
          <h3>Mission-driven companies</h3>
          <p>Every company here is built around a community, hobby, or passion — not just profit.</p>
        </div>
        <div className="value-item">
          <span className="value-num">03</span>
          <h3>Your skills still matter</h3>
          <p>We match your existing experience to roles where it translates — no career pivot required.</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to enjoy Mondays?</h2>
        <p>Join thousands of professionals who put passion first.</p>
        <button className="btn-primary btn-lg" onClick={() => !user && setShowAuth(true)}>Browse Open Roles</button>
      </section>

      <footer className="footer">
        <span>© 2026 LinkedInterests</span>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}
