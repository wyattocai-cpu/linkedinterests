import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import AuthModal from './AuthModal'
import './App.css'

const ALL_INTERESTS = [
  'Music', 'Outdoors', 'Gaming', 'Food & Drink',
  'Art & Design', 'Sports', 'Fitness', 'Wellness',
  'Education', 'Books & Media', 'Animals', 'Sustainability',
]

export default function App() {
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
        <h2>Browse by interest</h2>
        <div className="categories">
          {ALL_INTERESTS.map((label) => (
            <button
              key={label}
              className={`category-pill${activeInterest === label ? ' active' : ''}`}
              onClick={() => setActiveInterest(activeInterest === label ? null : label)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>{activeInterest ? `${activeInterest} jobs` : 'Latest jobs'}</h2>
        {loading ? (
          <div className="jobs-empty">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="jobs-empty">No jobs found — try a different filter.</div>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <a
                key={job.id}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="job-card"
              >
                <div className="job-header">
                  <div>
                    <div className="job-company">{job.companies.name}</div>
                    <div className="job-role">{job.title}</div>
                  </div>
                  {job.companies.interests?.[0] && (
                    <span className="job-tag">{job.companies.interests[0]}</span>
                  )}
                </div>
                <div className="job-location">
                  {job.remote ? 'Remote' : job.location ?? '—'}
                </div>
                {job.department && (
                  <div className="job-dept">{job.department}</div>
                )}
              </a>
            ))}
          </div>
        )}
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
