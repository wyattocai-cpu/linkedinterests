import { useState, useRef, useEffect, useCallback } from 'react'
import './ProfileBuilder.css'

/* ─── DATA ─────────────────────────────────────────────────── */
export const SKILL_POOL = [
  "Product Design", "UX Research", "Figma", "Design Systems", "Prototyping",
  "Motion Design", "Brand Identity", "Illustration", "Type Design",
  "Python", "JavaScript", "React", "Swift", "Node.js", "SQL",
  "Data Viz", "Machine Learning", "GIS Mapping", "Ecology",
  "Copywriting", "Editorial", "Content Strategy",
  "Product Management", "Community Building", "Facilitation",
  "Photography", "Video Editing", "3D Modeling", "Unity",
  "Marketing", "SEO", "Operations", "Finance", "Legal",
]

export const INTEREST_POOL = [
  // Outdoors
  { name: "Rock Climbing",       color: "leaf" },
  { name: "Trail Running",       color: "leaf" },
  { name: "Hiking",              color: "leaf" },
  { name: "Backpacking",         color: "leaf" },
  { name: "Surfing",             color: "leaf" },
  { name: "Cycling",             color: "leaf" },
  { name: "Running",             color: "leaf" },
  { name: "Fishing",             color: "leaf" },
  { name: "Hunting",             color: "leaf" },
  { name: "Birding",             color: "leaf" },
  { name: "Mushroom Foraging",   color: "leaf" },
  { name: "Rowing",              color: "leaf" },
  { name: "Animals",             color: "leaf" },
  { name: "Sustainability",      color: "leaf" },
  // Music
  { name: "Live Music",          color: "fluoro" },
  { name: "Playing Music",       color: "fluoro" },
  { name: "Vinyl Collecting",    color: "fluoro" },
  { name: "DJing",               color: "fluoro" },
  // Fitness & Wellness
  { name: "Fitness",             color: "fluoro" },
  { name: "Yoga",                color: "fluoro" },
  { name: "Fashion",             color: "fluoro" },
  { name: "Poetry",              color: "fluoro" },
  // Games & Puzzles
  { name: "Indie Games",         color: "federal" },
  { name: "Tabletop RPGs",       color: "federal" },
  { name: "D&D",                 color: "federal" },
  { name: "Puzzles",             color: "federal" },
  { name: "Mechanical Keyboards",color: "federal" },
  { name: "Sports",              color: "federal" },
  { name: "Fantasy Sports",      color: "federal" },
  { name: "Travel",              color: "federal" },
  { name: "Language Learning",   color: "federal" },
  { name: "Book Club",           color: "federal" },
  // Food & Drink
  { name: "Cooking",             color: "sun" },
  { name: "Coffee",              color: "sun" },
  { name: "Sourdough",           color: "sun" },
  { name: "Natural Wine",        color: "sun" },
  { name: "Craft Beer",          color: "sun" },
  // Creative
  { name: "Film Photography",    color: "persimmon" },
  { name: "Pottery",             color: "persimmon" },
  { name: "Zine Making",         color: "persimmon" },
]

export const COLORS = {
  leaf:      "#3a8a47",
  fluoro:    "#e35598",
  federal:   "#2750b6",
  sun:       "#eabc2b",
  persimmon: "#e8632c",
  ink:       "#181818",
}


const YN_QUESTIONS = [
  {
    id: 'outdoors',
    q: <>I want a job that gets me <em>outside</em>.</>,
    sub: 'Fieldwork, travel, trail days — not just a window view.',
  },
  {
    id: 'mission',
    q: <>I care about working at a <em>mission-driven</em> company.</>,
    sub: 'Non-profits, B-Corps, climate, education, public good.',
  },
  {
    id: 'remote',
    q: <>Remote-first is <em>a must</em>.</>,
    sub: "We'll hide hybrid/in-office roles if yes.",
  },
  {
    id: 'small',
    q: <>I'd rather work at a <em>small team</em> than a giant company.</>,
    sub: 'Under 100 people. More ownership, less process.',
  },
  {
    id: 'animals',
    q: <>Bonus points if there are <em>dogs in the office</em>.</>,
    sub: '(We had to ask.)',
  },
]

/* ─── GRAPH ─────────────────────────────────────────────────── */
function buildGraphData(skills, interests, userName) {
  const nodes = []
  const links = []
  nodes.push({ id: 'you', kind: 'you', name: userName || 'You', r: 26, x: 0, y: 0, vx: 0, vy: 0 })
  skills.forEach(s => {
    nodes.push({ id: 's:' + s, kind: 'skill', name: s, r: 9, x: 0, y: 0, vx: 0, vy: 0 })
    links.push({ source: 'you', target: 's:' + s })
  })
  interests.forEach((color, name) => {
    nodes.push({ id: 'i:' + name, kind: 'interest', name, color, r: 22, x: 0, y: 0, vx: 0, vy: 0 })
    links.push({ source: 'you', target: 'i:' + name })
  })
  return { nodes, links }
}

function Graph({ skills, interests, userName }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const detailRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ zoom: 1 })

  useEffect(() => {
    const svg = svgRef.current
    const container = containerRef.current
    const detail = detailRef.current
    if (!svg || !container) return

    let W = container.clientWidth
    let H = container.clientHeight
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)

    const data = buildGraphData(skills, interests, userName)
    const nodeMap = new Map(data.nodes.map(n => [n.id, n]))
    data.links.forEach(l => {
      l.source = nodeMap.get(l.source)
      l.target = nodeMap.get(l.target)
    })
    const validLinks = data.links.filter(l => l.source && l.target)

    // fix "you" at center
    const youNode = nodeMap.get('you')
    youNode.x = W / 2; youNode.y = H / 2
    youNode.fx = W / 2; youNode.fy = H / 2

    // scatter leaves around center
    data.nodes.forEach(n => {
      if (n.id === 'you') return
      const angle = Math.random() * Math.PI * 2
      const d = 120 + Math.random() * 80
      n.x = W / 2 + Math.cos(angle) * d
      n.y = H / 2 + Math.sin(angle) * d
    })

    svg.innerHTML = `<g id="pb-edges"></g><g id="pb-nodes"></g>`
    const edgesG = svg.querySelector('#pb-edges')
    const nodesG = svg.querySelector('#pb-nodes')

    // straight line edges
    const edgeEls = validLinks.map(l => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('stroke', '#cfc4ab')
      line.setAttribute('stroke-width', '1.25')
      edgesG.appendChild(line)
      return { line, link: l }
    })

    // nodes
    const nodeEls = data.nodes.map(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('data-id', n.id)
      g.style.cursor = n.id === 'you' ? 'default' : 'grab'

      if (n.kind === 'you') {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c.setAttribute('r', n.r)
        c.setAttribute('fill', '#181818')
        c.setAttribute('stroke', '#181818')
        c.setAttribute('stroke-width', '1.5')
        g.appendChild(c)
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        t.setAttribute('text-anchor', 'middle')
        t.setAttribute('y', 5)
        t.setAttribute('font-family', 'Space Grotesk, sans-serif')
        t.setAttribute('font-size', '12')
        t.setAttribute('font-weight', '700')
        t.setAttribute('fill', '#f4ece0')
        t.setAttribute('letter-spacing', '-0.01em')
        t.textContent = n.name
        g.appendChild(t)
      } else if (n.kind === 'skill') {
        const sq = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        sq.setAttribute('x', -n.r); sq.setAttribute('y', -n.r)
        sq.setAttribute('width', n.r * 2); sq.setAttribute('height', n.r * 2)
        sq.setAttribute('fill', '#181818')
        g.appendChild(sq)
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        t.setAttribute('x', n.r + 7); t.setAttribute('y', 4)
        t.setAttribute('font-family', 'Space Grotesk, sans-serif')
        t.setAttribute('font-size', '12'); t.setAttribute('font-weight', '600')
        t.setAttribute('fill', '#181818'); t.setAttribute('letter-spacing', '-0.01em')
        t.textContent = n.name
        g.appendChild(t)
      } else {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c.setAttribute('r', n.r)
        c.setAttribute('fill', COLORS[n.color])
        c.setAttribute('stroke', '#181818'); c.setAttribute('stroke-width', '1.5')
        g.appendChild(c)
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('y', n.r + 16)
        t.setAttribute('font-family', 'Space Grotesk, sans-serif')
        t.setAttribute('font-size', '13'); t.setAttribute('font-weight', '700')
        t.setAttribute('fill', '#181818'); t.setAttribute('letter-spacing', '-0.015em')
        t.textContent = n.name
        g.appendChild(t)
      }

      nodesG.appendChild(g)

      if (n.kind !== 'you') {
        g.addEventListener('mouseenter', () => {
          if (!detail) return
          const rect = svg.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          detail.style.left = (n.x / W) * rect.width + rect.left - containerRect.left + 'px'
          detail.style.top = (n.y / H) * rect.height + rect.top - containerRect.top + 'px'
          detail.querySelector('.nd-type-label').textContent = n.kind === 'skill' ? 'Skill' : 'Interest'
          const sw = detail.querySelector('.nd-sw')
          sw.style.background = n.kind === 'skill' ? '#181818' : COLORS[n.color]
          sw.style.borderRadius = n.kind === 'skill' ? '0' : '50%'
          detail.querySelector('.nd-name').textContent = n.name
          detail.querySelector('.nd-desc').textContent =
            n.kind === 'skill'
              ? "Something you do well — shows up in job match scoring."
              : "A passion outside work — we'll prioritize companies built around this."
          detail.querySelector('.nd-links').innerHTML = ''
          detail.classList.add('show')
        })
        g.addEventListener('mouseleave', () => detail && detail.classList.remove('show'))

        let dragging = false, offX = 0, offY = 0
        g.addEventListener('mousedown', e => {
          dragging = true; n.fx = n.x; n.fy = n.y
          g.style.cursor = 'grabbing'
          const rect = svg.getBoundingClientRect()
          offX = (e.clientX - rect.left) * (W / rect.width) - n.x
          offY = (e.clientY - rect.top) * (H / rect.height) - n.y
          e.preventDefault()
        })
        const onMove = e => {
          if (!dragging) return
          const rect = svg.getBoundingClientRect()
          n.fx = (e.clientX - rect.left) * (W / rect.width) - offX
          n.fy = (e.clientY - rect.top) * (H / rect.height) - offY
          n.x = n.fx; n.y = n.fy
        }
        const onUp = () => {
          if (dragging) { dragging = false; g.style.cursor = 'grab'; delete n.fx; delete n.fy }
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
        return { g, node: n, cleanup: () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) } }
      }

      return { g, node: n, cleanup: () => {} }
    })

    let alpha = 1

    function runStep() {
      const leaves = data.nodes.filter(n => n.id !== 'you')

      leaves.forEach(n => {
        if (n.fx != null) return
        const dx = n.x - W / 2
        const dy = n.y - H / 2
        const d = Math.sqrt(dx * dx + dy * dy) || 0.001
        const desired = n.kind === 'skill' ? 150 : 175
        const f = (d - desired) * 0.04 * alpha
        n.vx -= (dx / d) * f
        n.vy -= (dy / d) * f
      })

      for (let i = 0; i < leaves.length; i++) {
        for (let j = i + 1; j < leaves.length; j++) {
          const a = leaves[i], b = leaves[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const d2 = dx * dx + dy * dy + 0.01
          const d = Math.sqrt(d2)
          if (d < (a.r + b.r + 40) * 2.5) {
            const f = (2200 / d2) * alpha
            const fx = (dx / d) * f, fy = (dy / d) * f
            if (a.fx == null) { a.vx -= fx; a.vy -= fy }
            if (b.fx == null) { b.vx += fx; b.vy += fy }
          }
        }
      }

      const pad = 80
      leaves.forEach(n => {
        if (n.fx != null) return
        n.vx *= 0.82; n.vy *= 0.82
        n.x += n.vx; n.y += n.vy
        n.x = Math.max(pad, Math.min(W - pad, n.x))
        n.y = Math.max(pad + 40, Math.min(H - pad, n.y))
      })
    }

    function draw() {
      edgeEls.forEach(({ line, link }) => {
        line.setAttribute('x1', link.source.x)
        line.setAttribute('y1', link.source.y)
        line.setAttribute('x2', link.target.x)
        line.setAttribute('y2', link.target.y)
      })
      nodeEls.forEach(({ g, node }) => {
        g.setAttribute('transform', `translate(${node.x}, ${node.y})`)
      })
    }

    function tick() {
      runStep()
      alpha *= 0.98
      draw()
      if (alpha > 0.001) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    function zoomTo(z) {
      stateRef.current.zoom = Math.max(0.4, Math.min(2.5, z))
      const s = stateRef.current.zoom
      nodesG.setAttribute('transform', `translate(${W / 2}, ${H / 2}) scale(${s}) translate(${-W / 2}, ${-H / 2})`)
      edgesG.setAttribute('transform', `translate(${W / 2}, ${H / 2}) scale(${s}) translate(${-W / 2}, ${-H / 2})`)
    }

    const zoomIn  = container.querySelector('[data-zoom="in"]')
    const zoomOut = container.querySelector('[data-zoom="out"]')
    const zoomRst = container.querySelector('[data-zoom="reset"]')
    if (zoomIn)  zoomIn.addEventListener('click',  () => zoomTo(stateRef.current.zoom * 1.2))
    if (zoomOut) zoomOut.addEventListener('click', () => zoomTo(stateRef.current.zoom / 1.2))
    if (zoomRst) zoomRst.addEventListener('click', () => zoomTo(1))

    const onResize = () => {
      W = container.clientWidth; H = container.clientHeight
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      youNode.fx = W / 2; youNode.fy = H / 2
      youNode.x = W / 2; youNode.y = H / 2
      alpha = 0.5
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      nodeEls.forEach(el => el.cleanup())
    }
  }, [skills, interests, userName])

  return (
    <div className="pb-main" ref={containerRef}>
      <div className="pb-graph-eyebrow">§ Your passion-skill map</div>
      <div className="pb-graph-heading">Your <em>skills</em> and <em>interests.</em></div>

      <svg id="pb-graph" ref={svgRef} xmlns="http://www.w3.org/2000/svg" />

      <div className="pb-node-detail" ref={detailRef}>
        <div className="nd-type">
          <span className="nd-sw" />
          <span className="nd-type-label" />
        </div>
        <div className="nd-name" />
        <div className="nd-desc" />
        <div className="nd-links" />
      </div>

      <div className="pb-graph-hint">Hover a node to learn more · drag to rearrange.</div>
      <div className="pb-zoom">
        <button data-zoom="out">−</button>
        <button data-zoom="reset">◎</button>
        <button data-zoom="in">+</button>
      </div>
    </div>
  )
}

/* ─── AUTOCOMPLETE HOOK ─────────────────────────────────────── */
export function useAC({ pool, filterFn }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(-1)
  const inputRef = useRef(null)

  const matches = query.trim()
    ? pool.filter(item => filterFn(item, query.trim().toLowerCase())).slice(0, 8)
    : []

  const handleKeyDown = (e, onPick) => {
    if (!open || matches.length === 0) {
      if (e.key === 'Enter' && matches[0]) { onPick(matches[0]); setQuery(''); setOpen(false) }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocused(f => (f + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused(f => (f - 1 + matches.length) % matches.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = focused >= 0 ? matches[focused] : matches[0]
      if (item) { onPick(item); setQuery(''); setOpen(false); setFocused(-1) }
    }
  }

  return { query, setQuery, open, setOpen, matches, focused, setFocused, inputRef, handleKeyDown }
}

/* ─── PROFILE BUILDER ───────────────────────────────────────── */
export default function ProfileBuilder({ onBack, noTopNav, screen: screenProp, setScreen: setScreenProp, user, onSave, initialSkills, initialInterests, onSearchJobs }) {
  const [screenLocal, setScreenLocal] = useState('form')
  const screen = screenProp !== undefined ? screenProp : screenLocal
  const setScreen = setScreenProp !== undefined ? setScreenProp : setScreenLocal
  const [skills, setSkills] = useState(() => initialSkills ? new Set(initialSkills) : new Set())
  const [interests, setInterests] = useState(() => {
    if (initialInterests) {
      return new Map(initialInterests.map(name => {
        const entry = INTEREST_POOL.find(i => i.name === name)
        return [name, entry ? entry.color : 'ink']
      }))
    }
    return new Map()
  })
  const [ynState, setYnState] = useState({
    outdoors: 'yes', mission: 'yes', remote: 'maybe', small: 'yes', animals: null,
  })
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  const skillsAC = useAC({
    pool: SKILL_POOL,
    filterFn: (s, q) => !skills.has(s) && s.toLowerCase().includes(q),
  })

  const addSkill = s => {
    setSkills(prev => new Set([...prev, s]))
    skillsAC.setQuery('')
    skillsAC.setOpen(false)
  }
  const removeSkill = s => setSkills(prev => { const n = new Set(prev); n.delete(s); return n })

  const addInterest = i => {
    setInterests(prev => new Map([...prev, [i.name, i.color]]))
  }
  const removeInterest = name => setInterests(prev => { const n = new Map(prev); n.delete(name); return n })

  const handleFile = f => {
    setFile(f)
    setSkills(prev => new Set([...prev, "Data Viz", "Copywriting"]))
  }

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!onSave || saving) return
    setSaving(true)
    setSaved(false)
    await onSave({
      skills: [...skills],
      interests: [...interests.keys()],
      prefs: ynState,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="pb-shell">
      {!noTopNav && (
        <div className="pb-top">
          <button className="pb-logo" onClick={onBack}>
            Field<span className="blue">work</span>
          </button>
          <div className="pb-tabs">
            <button
              className={`pb-tab${screen === 'form' ? ' active' : ''}`}
              onClick={() => setScreen('form')}
            >
              <span className="step">1</span>Tell us who you are
            </button>
            <button
              className={`pb-tab${screen === 'profile' ? ' active' : ''}`}
              onClick={() => setScreen('profile')}
            >
              <span className="step">2</span>Your profile
            </button>
          </div>
          <div className="pb-top-right">Profile builder</div>
        </div>
      )}

      {/* FORM SCREEN */}
      {screen === 'form' && (
        <div className="pb-form-wrap">
          <div className="pb-form-head">
            <div>
              <div className="eyebrow">§ Step 1 of 2 · About 2 minutes</div>
              <h1>Tell us <span className="italic">who</span><br />you <span className="blue">are.</span></h1>
            </div>
            <div className="sub">The résumé is optional — the rest is the part no other job site asks.</div>
          </div>

          {/* Q1: Resume */}
          <div className="q-block">
            <div className="q-num-wrap">
              <span className="q-num">— 01</span>
              <div className="q-label">Start with the <em>easy</em> part.</div>
              <div className="q-hint">Drop in a résumé and we'll pre-fill your skills. Or skip — it's optional.</div>
            </div>
            <div>
              {file ? (
                <div className="pb-drop filled">
                  <div className="drop-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l4 4 10-10" />
                    </svg>
                  </div>
                  <div className="drop-txt">
                    <div className="drop-bold">{file.name}</div>
                    <div className="drop-meta">{(file.size / 1024).toFixed(0)} KB · imported 2 skills</div>
                  </div>
                  <button className="drop-remove" onClick={() => setFile(null)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  className={`pb-drop${dragging ? ' dragging' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragEnter={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
                >
                  <div className="drop-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round">
                      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
                      <path d="M14 3v6h6" />
                      <path d="M12 18v-7M9 14l3-3 3 3" />
                    </svg>
                  </div>
                  <div className="drop-txt">
                    <div className="drop-bold">Drop your résumé here, or <span className="link">browse</span></div>
                    <div className="drop-meta">PDF, DOCX · up to 10 MB</div>
                    <div className="drop-or">— or —</div>
                    <button className="drop-paste" onClick={e => e.stopPropagation()}>Paste a LinkedIn URL instead</button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept=".pdf,.docx,.doc"
                onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }}
              />
            </div>
          </div>

          {/* Q2: Skills */}
          <div className="q-block">
            <div className="q-num-wrap">
              <span className="q-num">— 02</span>
              <div className="q-label">What can you <em>do?</em></div>
              <div className="q-hint">Your skills, tools, and disciplines. Aim for 5–12.</div>
            </div>
            <div>
              <div className="pb-search-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round">
                  <circle cx="10.5" cy="10.5" r="6" />
                  <path d="M15 15l5 5" />
                </svg>
                <input
                  ref={skillsAC.inputRef}
                  placeholder="Try: Product Design, Python, Ecology, Copywriting…"
                  value={skillsAC.query}
                  onChange={e => { skillsAC.setQuery(e.target.value); skillsAC.setOpen(true); skillsAC.setFocused(-1) }}
                  onFocus={() => skillsAC.setOpen(true)}
                  onBlur={() => setTimeout(() => skillsAC.setOpen(false), 150)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !skillsAC.query && skills.size) {
                      const arr = [...skills]; removeSkill(arr[arr.length - 1])
                    }
                    skillsAC.handleKeyDown(e, addSkill)
                  }}
                  autoComplete="off"
                />
                <span className="pb-search-count">{skills.size} added</span>
                {skillsAC.open && skillsAC.matches.length > 0 && (
                  <div className="pb-ac">
                    {skillsAC.matches.map((s, i) => (
                      <div
                        key={s}
                        className={`pb-ac-item${i === skillsAC.focused ? ' focused' : ''}`}
                        onMouseDown={() => addSkill(s)}
                      >
                        <span className="ac-sq" />
                        {s}
                        <span className="ac-meta">skill</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="pb-pills">
                {skills.size === 0 ? (
                  <span className="pb-pills-empty">— nothing yet. Start typing above.</span>
                ) : (
                  [...skills].map(s => (
                    <span key={s} className="pb-pill">
                      <span className="pill-sq" />
                      {s}
                      <button className="pill-x" onClick={() => removeSkill(s)}>×</button>
                    </span>
                  ))
                )}
              </div>
              <div className="pb-suggest">
                <span className="suggest-lbl">Often paired:</span>
                {["Figma", "Design Systems", "Prototyping", "GIS Mapping"].map(s => (
                  !skills.has(s) && (
                    <button key={s} className="pb-chip" onMouseDown={() => addSkill(s)}>
                      <span className="chip-plus">+</span>{s}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Q3: Interests */}
          <div className="q-block">
            <div className="q-num-wrap">
              <span className="q-num">— 03</span>
              <div className="q-label">What are you <em>into?</em></div>
              <div className="q-hint">The things you'd do on a free Saturday. Be honest — this is the whole point.</div>
            </div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {INTEREST_POOL.map(item => {
                  const isActive = interests.has(item.name)
                  const color = COLORS[item.color]
                  return (
                    <button
                      key={item.name}
                      onClick={() => isActive ? removeInterest(item.name) : addInterest(item)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '7px 16px 7px 8px', borderRadius: 999,
                        border: 'var(--stroke) solid var(--ink)',
                        background: isActive ? 'var(--ink)' : 'var(--paper)',
                        color: isActive ? 'var(--paper)' : 'var(--ink)',
                        fontFamily: 'var(--ff-display)', fontWeight: 600, fontSize: 13,
                        letterSpacing: '-0.01em', cursor: 'pointer',
                        transition: 'background 0.1s, color 0.1s, transform 0.08s',
                      }}
                      onMouseEnter={e => !isActive && (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = '')}
                    >
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, opacity: 0.9,
                        background: isActive ? 'transparent' : color,
                        border: `1.5px solid ${isActive ? 'var(--paper)' : color}`,
                      }} />
                      {item.name}
                    </button>
                  )
                })}
              </div>
              {interests.size > 0 && (
                <p style={{ marginTop: 14, fontFamily: 'var(--ff-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  {interests.size} selected
                </p>
              )}
            </div>
          </div>

          {/* Q4: Yes/No
          <div className="q-block">
            <div className="q-num-wrap">
              <span className="q-num">— 04</span>
              <div className="q-label">A few <em>quick ones.</em></div>
              <div className="q-hint">These help us filter out the wrong-fit roles before you see them.</div>
            </div>
            <div>
              {YN_QUESTIONS.map(({ id, q, sub }) => (
                <div key={id} className="pb-yn">
                  <div className="yn-txt">
                    {q}
                    <span className="yn-sub">{sub}</span>
                  </div>
                  <div className="pb-yn-choices">
                    {['yes', 'maybe', 'no'].map(val => (
                      <button
                        key={val}
                        className={`pb-yn-choice${ynState[id] === val ? ` active-${val}` : ''}`}
                        onClick={() => setYnState(s => ({ ...s, [id]: val }))}
                      >
                        {val === 'yes' ? 'Yes' : val === 'maybe' ? 'Sometimes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Submit */}
          <div className="pb-submit-bar">
            <div className="pb-progress">
              <strong>Looking good.</strong> You've filled in enough — you can always add more later from your profile.
            </div>
            <div className="pb-btn-row">
              {user ? (
                <button
                  className="pb-btn ghost"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save profile'}
                </button>
              ) : (
                <button className="pb-btn ghost" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Sign in to save">
                  Sign in to save
                </button>
              )}
              <button className="pb-btn" onClick={() => setScreen('profile')}>See my profile →</button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE SCREEN */}
      {screen === 'profile' && (
        <div className="pb-profile">
          <aside className="pb-side">
            {user?.user_metadata?.avatar_url ? (
              <div className="pb-avatar" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={user.user_metadata.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
            ) : (
              <div className="pb-avatar">
                <span>{(user?.user_metadata?.full_name || user?.email || 'You').slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div className="pb-name">{user?.user_metadata?.full_name || user?.email || 'Your Profile'}</div>

            <div className="pb-stats">
              <div className="pb-stat">
                <div className="stat-n blue">{skills.size}</div>
                <div className="stat-l">Skills</div>
              </div>
              <div className="pb-stat">
                <div className="stat-n pink">{interests.size}</div>
                <div className="stat-l">Interests</div>
              </div>
            </div>

            <div className="pb-legend-title">— The map, decoded</div>
            <div className="pb-legend">
              <div className="legend-row">
                <span className="lmark sk" />
                Skill
                <span className="legend-meta">what you do</span>
              </div>
              <div className="legend-row">
                <span className="lmark in" />
                Interest
                <span className="legend-meta">what you love</span>
              </div>
            </div>

            <div className="pb-actions">
              {onSearchJobs && (
                <button className="pb-btn pb-btn-full" onClick={() => onSearchJobs([...interests.keys()])}>
                  Search matching jobs →
                </button>
              )}
              <button className="pb-btn pb-btn-full pb-btn-sec" onClick={() => setScreen('form')}>Edit profile</button>
            </div>
          </aside>

          <Graph
            key={`${[...skills].join(',')}-${[...interests.keys()].join(',')}`}
            skills={skills}
            interests={interests}
            userName={user?.user_metadata?.full_name?.split(' ')[0] || 'You'}
          />
        </div>
      )}
    </div>
  )
}
