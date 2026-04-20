import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import AuthModal from './AuthModal'
import ProfileBuilder from './ProfileBuilder'
import './App.css'

const ALL_INTERESTS = [
  'Music', 'Outdoors', 'Gaming', 'Food & Drink',
  'Art & Design', 'Sports', 'Fitness', 'Wellness',
  'Education', 'Books & Media', 'Animals', 'Sustainability',
]

const INTEREST_COLORS = {
  'Music':        '#e35598',
  'Outdoors':     '#3a8a47',
  'Gaming':       '#2750b6',
  'Food & Drink': '#eabc2b',
  'Art & Design': '#e35598',
  'Sports':       '#e8632c',
  'Fitness':      '#e8632c',
  'Wellness':     '#3a8a47',
  'Education':    '#2750b6',
  'Books & Media':'#eabc2b',
  'Animals':      '#3a8a47',
  'Sustainability':'#3a8a47',
}

const CARD_TOP_COLORS = ['#eabc2b', '#f4ece0', '#e35598', '#eabc2b', '#f4ece0', '#eabc2b']

export default function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeInterest, setActiveInterest] = useState(null)
  const [roleQuery, setRoleQuery] = useState('')
  const [interestQuery, setInterestQuery] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [activeInterest])

  async function fetchJobs() {
    setLoading(true)
    let query = supabase
      .from('jobs')
      .select('id, title, location, url, department, remote, companies(name, slug, interests, featured)')
      .eq('active', true)
      .order('posted_at', { ascending: false })
      .limit(20)

    if (activeInterest) {
      query = query.contains('companies.interests', [activeInterest])
    }

    const { data, error } = await query
    if (!error) setJobs((data ?? []).filter(j => j.companies))
    setLoading(false)
  }

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    let query = supabase
      .from('jobs')
      .select('id, title, location, url, department, remote, companies(name, slug, interests, featured)')
      .eq('active', true)
      .order('posted_at', { ascending: false })
      .limit(30)

    if (roleQuery) query = query.ilike('title', `%${roleQuery}%`)

    const { data, error } = await query
    let results = (data ?? []).filter(j => j.companies)

    if (interestQuery && results.length) {
      const term = interestQuery.toLowerCase()
      results = results.filter(j =>
        j.companies.interests?.some(i => i.toLowerCase().includes(term))
      )
    }

    if (!error) setJobs(results)
    setLoading(false)
  }

  const signOut = () => supabase.auth.signOut()

  if (page === 'profile-builder') {
    return <ProfileBuilder onBack={() => setPage('home')} />
  }

  return (
    <div className="page">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <nav className="nav">
        <span className="logo">Linked<span className="logo-accent">Interests</span></span>
        <div className="nav-links">
          <a href="#">Browse Jobs</a>
          <a href="#" onClick={e => { e.preventDefault(); setPage('profile-builder') }}>Build Profile</a>
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
              <button className="btn-primary" onClick={() => setPage('profile-builder')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-blooms" aria-hidden="true">
          <div className="hero-bloom">
            <div className="c c1" />
            <div className="c c2" />
          </div>
        </div>

        <p className="hero-eyebrow">Anti-LinkedIn</p>
        <h1>Work somewhere you <em>actually care about</em></h1>
        <p className="hero-sub">
          Find roles at companies built around your passions — not just your résumé.
        </p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title or skill"
            value={roleQuery}
            onChange={e => setRoleQuery(e.target.value)}
          />
          <div className="search-divider" />
          <input
            type="text"
            placeholder="Interest (e.g. Climbing, Coffee, Gaming)"
            value={interestQuery}
            onChange={e => setInterestQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </section>

      <section className="section">
        <h2>Browse by <em>interest</em></h2>
        <div className="categories">
          {ALL_INTERESTS.map((label) => {
            const color = INTEREST_COLORS[label]
            const isActive = activeInterest === label
            return (
              <button
                key={label}
                className={`category-pill${isActive ? ' active' : ''}`}
                onClick={() => setActiveInterest(isActive ? null : label)}
              >
                <span
                  className="pill-dot"
                  style={{ background: isActive ? 'transparent' : color, borderColor: isActive ? 'var(--paper)' : color }}
                />
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="section">
        <h2>{activeInterest ? <>{activeInterest} <em>jobs</em></> : <>Latest <em>jobs</em></>}</h2>
        {loading ? (
          <div className="jobs-empty">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="jobs-empty">No jobs found — try a different filter.</div>
        ) : (
          <div className="job-grid">
            {jobs.map((job, i) => {
              const interest = job.companies.interests?.[0]
              const dotColor = interest ? INTEREST_COLORS[interest] : '#eabc2b'
              const topBg = CARD_TOP_COLORS[i % CARD_TOP_COLORS.length]
              return (
                <a
                  key={job.id}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-card"
                >
                  <div className="job-card-top" style={{ background: topBg }}>
                    <div className="job-card-disc" style={{ background: dotColor }} />
                    <div className="job-company">{job.companies.name}</div>
                    <div className="job-role">{job.title}</div>
                  </div>
                  <div className="job-body">
                    <div className="job-location">
                      {job.remote ? 'Remote' : job.location ?? '—'}
                    </div>
                    {job.department && (
                      <div className="job-dept">{job.department}</div>
                    )}
                    {interest && (
                      <div className="job-tags">
                        <span className="job-tag">
                          <span className="job-tag-dot" style={{ background: dotColor }} />
                          {interest}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </section>

      <section className="section" style={{ padding: 0 }}>
        <div className="value-prop">
          <div className="value-item">
            <div
              className="value-item-deco"
              style={{ background: 'var(--federal)' }}
              aria-hidden="true"
            />
            <span className="value-num">01</span>
            <h3>Match on what <em>matters</em></h3>
            <p>Filter by the interests and values that make work feel less like work.</p>
          </div>
          <div className="value-item">
            <div
              className="value-item-deco"
              style={{ background: 'var(--fluoro)' }}
              aria-hidden="true"
            />
            <span className="value-num">02</span>
            <h3><em>Mission-driven</em> companies</h3>
            <p>Every company here is built around a community, hobby, or passion — not just profit.</p>
          </div>
          <div className="value-item">
            <div
              className="value-item-deco"
              style={{ background: 'var(--sun)' }}
              aria-hidden="true"
            />
            <span className="value-num">03</span>
            <h3>Your skills <em>still matter</em></h3>
            <p>We match your existing experience to roles where it translates — no career pivot required.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-bloom-l" aria-hidden="true" />
        <div className="cta-bloom-r" aria-hidden="true" />
        <h2>Ready to enjoy <em>Mondays?</em></h2>
        <p>Join professionals who put passion first.</p>
        <button className="btn-primary btn-lg" onClick={() => !user && setShowAuth(true)}>
          Browse Open Roles
        </button>
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
