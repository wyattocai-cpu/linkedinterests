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

const INTEREST_POOL = [
  { name: "Rock Climbing",      color: "leaf" },
  { name: "Trail Running",      color: "leaf" },
  { name: "Birding",            color: "leaf" },
  { name: "Mushroom Foraging",  color: "leaf" },
  { name: "Backpacking",        color: "leaf" },
  { name: "Surfing",            color: "leaf" },
  { name: "Vinyl Collecting",   color: "fluoro" },
  { name: "DJing",              color: "fluoro" },
  { name: "Live Music",         color: "fluoro" },
  { name: "Yoga",               color: "fluoro" },
  { name: "Indie Games",        color: "federal" },
  { name: "Tabletop RPGs",      color: "federal" },
  { name: "Mechanical Keyboards", color: "federal" },
  { name: "D&D",                color: "federal" },
  { name: "Sourdough",          color: "sun" },
  { name: "Coffee",             color: "sun" },
  { name: "Natural Wine",       color: "sun" },
  { name: "Cooking",            color: "sun" },
  { name: "Pottery",            color: "persimmon" },
  { name: "Film Photography",   color: "persimmon" },
  { name: "Zine Making",        color: "persimmon" },
  { name: "Book Club",          color: "federal" },
  { name: "Poetry",             color: "fluoro" },
]

const COLORS = {
  leaf: "#3a8a47",
  fluoro: "#e35598",
  federal: "#2750b6",
  sun: "#eabc2b",
  persimmon: "#e8632c",
  ink: "#181818",
}

const OVERLAPS = [
  {
    name: "Outdoor Brand Design",
    c1: 'federal', c2: 'leaf',
    skills: ["Product Design", "Brand Identity", "Figma"],
    interests: ["Rock Climbing", "Trail Running", "Backpacking"],
  },
  {
    name: "Field Research UX",
    c1: 'federal', c2: 'leaf',
    skills: ["UX Research", "Design Systems"],
    interests: ["Rock Climbing", "Birding"],
  },
  {
    name: "Music × Product",
    c1: 'federal', c2: 'fluoro',
    skills: ["Product Design", "Prototyping"],
    interests: ["Vinyl Collecting", "DJing", "Live Music"],
  },
  {
    name: "Games × Design Systems",
    c1: 'federal', c2: 'fluoro',
    skills: ["Design Systems", "Prototyping"],
    interests: ["Indie Games", "Tabletop RPGs"],
  },
  {
    name: "Food-Maker Tools",
    c1: 'fluoro', c2: 'sun',
    skills: ["Product Design", "UX Research"],
    interests: ["Sourdough", "Coffee", "Cooking"],
  },
  {
    name: "Craft × Brand",
    c1: 'fluoro', c2: 'persimmon',
    skills: ["Brand Identity", "Illustration"],
    interests: ["Pottery", "Zine Making"],
  },
]

const SOFT_PAIRS = [
  ["Rock Climbing", "Trail Running"],
  ["Vinyl Collecting", "DJing"],
  ["Sourdough", "Coffee"],
  ["Indie Games", "Tabletop RPGs"],
  ["Film Photography", "Pottery"],
]

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
function buildGraphData(skills, interests) {
  const nodes = []
  const links = []

  skills.forEach(s => {
    nodes.push({ id: 's:' + s, kind: 'skill', name: s, r: 9, x: 0, y: 0, vx: 0, vy: 0 })
  })
  interests.forEach((color, name) => {
    nodes.push({ id: 'i:' + name, kind: 'interest', name, color, r: 22, x: 0, y: 0, vx: 0, vy: 0 })
  })

  OVERLAPS.forEach(o => {
    const presentSk = o.skills.filter(s => skills.has(s))
    const presentIn = o.interests.filter(n => interests.has(n))
    if (presentSk.length && presentIn.length) {
      const id = 'o:' + o.name
      nodes.push({ id, kind: 'overlap', name: o.name, c1: o.c1, c2: o.c2, r: 28, x: 0, y: 0, vx: 0, vy: 0 })
      presentSk.forEach(s => links.push({ source: id, target: 's:' + s, kind: 'ov' }))
      presentIn.forEach(i => links.push({ source: id, target: 'i:' + i, kind: 'ov' }))
    }
  })

  SOFT_PAIRS.forEach(([a, b]) => {
    if (interests.has(a) && interests.has(b)) {
      links.push({ source: 'i:' + a, target: 'i:' + b, kind: 'soft' })
    }
  })

  return { nodes, links }
}

function Graph({ skills, interests }) {
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

    const data = buildGraphData(skills, interests)
    const nodeMap = new Map(data.nodes.map(n => [n.id, n]))
    data.links.forEach(l => {
      l.source = nodeMap.get(l.source)
      l.target = nodeMap.get(l.target)
    })
    // drop any links where source/target didn't resolve
    const validLinks = data.links.filter(l => l.source && l.target)

    // initial placement
    data.nodes.forEach(n => {
      const cx = W / 2, cy = H / 2
      if (n.kind === 'skill') {
        n.x = cx - 180 + (Math.random() - 0.5) * 160
        n.y = cy + (Math.random() - 0.5) * 340
      } else if (n.kind === 'interest') {
        n.x = cx + 180 + (Math.random() - 0.5) * 160
        n.y = cy + (Math.random() - 0.5) * 340
      } else {
        n.x = cx + (Math.random() - 0.5) * 100
        n.y = cy + (Math.random() - 0.5) * 180
      }
    })

    svg.innerHTML = `<g id="pb-edges"></g><g id="pb-nodes"></g>`
    const edgesG = svg.querySelector('#pb-edges')
    const nodesG = svg.querySelector('#pb-nodes')

    // edges
    const edgeEls = validLinks.map(l => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      p.setAttribute('fill', 'none')
      p.setAttribute('stroke', l.kind === 'soft' ? '#9a968b' : '#181818')
      p.setAttribute('stroke-width', l.kind === 'soft' ? '1' : '1.25')
      if (l.kind === 'soft') p.setAttribute('stroke-dasharray', '2 4')
      edgesG.appendChild(p)
      return { path: p, link: l }
    })

    // nodes
    const nodeEls = data.nodes.map(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('data-id', n.id)
      g.style.cursor = 'grab'

      if (n.kind === 'skill') {
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
      } else if (n.kind === 'interest') {
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
      } else {
        const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c1.setAttribute('cx', -12); c1.setAttribute('cy', 0); c1.setAttribute('r', n.r)
        c1.setAttribute('fill', COLORS[n.c1])
        c1.setAttribute('stroke', '#181818'); c1.setAttribute('stroke-width', '1.5')
        c1.style.mixBlendMode = 'multiply'
        const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c2.setAttribute('cx', 12); c2.setAttribute('cy', 0); c2.setAttribute('r', n.r)
        c2.setAttribute('fill', COLORS[n.c2])
        c2.setAttribute('stroke', '#181818'); c2.setAttribute('stroke-width', '1.5')
        c2.style.mixBlendMode = 'multiply'
        g.appendChild(c1); g.appendChild(c2)
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('y', n.r + 22)
        t.setAttribute('font-family', 'Instrument Serif, serif')
        t.setAttribute('font-style', 'italic')
        t.setAttribute('font-size', '16'); t.setAttribute('fill', '#181818')
        t.textContent = n.name
        g.appendChild(t)
      }

      nodesG.appendChild(g)

      // hover → tooltip
      g.addEventListener('mouseenter', () => {
        if (!detail) return
        const rect = svg.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const sx = (n.x / W) * rect.width + rect.left - containerRect.left
        const sy = (n.y / H) * rect.height + rect.top - containerRect.top
        detail.style.left = sx + 'px'
        detail.style.top = sy + 'px'

        detail.querySelector('.nd-type-label').textContent =
          n.kind === 'skill' ? 'Skill' :
          n.kind === 'interest' ? 'Interest' : 'Overlap · the sweet spot'
        const sw = detail.querySelector('.nd-sw')
        if (n.kind === 'skill') {
          sw.style.background = '#181818'; sw.style.borderRadius = '0'
        } else if (n.kind === 'interest') {
          sw.style.background = COLORS[n.color]; sw.style.borderRadius = '50%'
        } else {
          sw.style.background = COLORS[n.c1]; sw.style.borderRadius = '50%'
        }
        detail.querySelector('.nd-name').textContent = n.name
        detail.querySelector('.nd-desc').textContent =
          n.kind === 'skill' ? "Something you do well — shows up in job match scoring." :
          n.kind === 'interest' ? "A passion outside work — we'll prioritize companies built around this." :
          "Where your skills meet your passions — roles you'd actually love."

        const related = validLinks
          .filter(l => l.source.id === n.id || l.target.id === n.id)
          .map(l => l.source.id === n.id ? l.target : l.source)
          .slice(0, 4)
        const linksEl = detail.querySelector('.nd-links')
        linksEl.innerHTML = '<div style="margin-bottom:4px">— Connects to</div>' + related.map(r => {
          const col = r.kind === 'skill' ? '#181818' : r.kind === 'interest' ? COLORS[r.color] : COLORS[r.c1]
          const rad = r.kind === 'skill' ? '0' : '50%'
          return `<div class="nd-link-item"><span class="nd-link-dot" style="background:${col};border-radius:${rad}"></span>${r.name}</div>`
        }).join('')

        detail.classList.add('show')
      })
      g.addEventListener('mouseleave', () => detail && detail.classList.remove('show'))

      // drag
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
    })

    let alpha = 1

    function runStep() {
      data.nodes.forEach(n => {
        if (n.fx != null) { n.x = n.fx; n.y = n.fy; n.vx = 0; n.vy = 0; return }
        n.vx += (W / 2 - n.x) * 0.002 * alpha
        n.vy += (H / 2 - n.y) * 0.002 * alpha
      })
      validLinks.forEach(l => {
        const dx = l.target.x - l.source.x
        const dy = l.target.y - l.source.y
        const d = Math.sqrt(dx * dx + dy * dy) || 0.001
        const desired = l.kind === 'soft' ? 110 : 140
        const k = l.kind === 'soft' ? 0.015 : 0.03
        const f = (d - desired) * k * alpha
        const fx = (dx / d) * f, fy = (dy / d) * f
        if (l.source.fx == null) { l.source.vx += fx; l.source.vy += fy }
        if (l.target.fx == null) { l.target.vx -= fx; l.target.vy -= fy }
      })
      for (let i = 0; i < data.nodes.length; i++) {
        for (let j = i + 1; j < data.nodes.length; j++) {
          const a = data.nodes[i], b = data.nodes[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const d2 = dx * dx + dy * dy + 0.01
          const d = Math.sqrt(d2)
          const minD = a.r + b.r + 20
          if (d < minD * 3) {
            const f = (1800 / d2) * alpha
            const fx = (dx / d) * f, fy = (dy / d) * f
            if (a.fx == null) { a.vx -= fx; a.vy -= fy }
            if (b.fx == null) { b.vx += fx; b.vy += fy }
          }
        }
      }
      const pad = 80
      data.nodes.forEach(n => {
        if (n.fx != null) return
        n.vx *= 0.82; n.vy *= 0.82
        n.x += n.vx; n.y += n.vy
        n.x = Math.max(pad, Math.min(W - pad, n.x))
        n.y = Math.max(pad + 40, Math.min(H - pad, n.y))
      })
    }

    function draw() {
      edgeEls.forEach(({ path, link }) => {
        const sx = link.source.x, sy = link.source.y
        const tx = link.target.x, ty = link.target.y
        const mx = (sx + tx) / 2, my = (sy + ty) / 2
        const dx = tx - sx, dy = ty - sy
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const off = Math.min(40, len * 0.15)
        const nx = (-dy / len) * off, ny = (dx / len) * off
        path.setAttribute('d', `M ${sx} ${sy} Q ${mx + nx} ${my + ny} ${tx} ${ty}`)
      })
      nodeEls.forEach(({ g, node }) => {
        g.setAttribute('transform', `translate(${node.x}, ${node.y})`)
      })
    }

    function tick() {
      runStep()
      alpha *= 0.98
      draw()
      if (alpha > 0.001) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    // zoom controls
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
      alpha = 0.5
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      nodeEls.forEach(el => el.cleanup())
    }
  }, [skills, interests])

  return (
    <div className="pb-main" ref={containerRef}>
      <div className="pb-graph-eyebrow">§ Your passion-skill graph</div>
      <div className="pb-graph-heading">The shape of your <em>work-life</em> Venn.</div>

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

      <div className="pb-graph-hint">Hover a node to see connections · drag to rearrange.</div>
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
export default function ProfileBuilder({ onBack, noTopNav, screen: screenProp, setScreen: setScreenProp }) {
  const [screenLocal, setScreenLocal] = useState('form')
  const screen = screenProp !== undefined ? screenProp : screenLocal
  const setScreen = setScreenProp !== undefined ? setScreenProp : setScreenLocal
  const [skills, setSkills] = useState(() => new Set([
    "Product Design", "Figma", "Design Systems", "UX Research", "Prototyping"
  ]))
  const [interests, setInterests] = useState(() => new Map([
    ["Rock Climbing", "leaf"],
    ["Vinyl Collecting", "fluoro"],
    ["Sourdough", "sun"],
    ["Indie Games", "federal"],
  ]))
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
    interestsAC.setQuery('')
    interestsAC.setOpen(false)
  }
  const removeInterest = name => setInterests(prev => { const n = new Map(prev); n.delete(name); return n })

  const handleFile = f => {
    setFile(f)
    setSkills(prev => new Set([...prev, "Data Viz", "Copywriting"]))
  }

  const overlapCount = OVERLAPS.filter(o =>
    o.skills.some(s => skills.has(s)) && o.interests.some(i => interests.has(i))
  ).length

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
              <button className="pb-btn ghost">Save &amp; finish later</button>
              <button className="pb-btn" onClick={() => setScreen('profile')}>See my profile →</button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE SCREEN */}
      {screen === 'profile' && (
        <div className="pb-profile">
          <aside className="pb-side">
            <div className="pb-avatar"><span>AC</span></div>
            <div className="pb-name">Avery Chen</div>
            <div className="pb-handle">@averyc · Brooklyn, NY</div>
            <div className="pb-bio">
              <span className="hi">Product designer</span> who climbs on weekends, DJs on weeknights, and has strong opinions about sourdough hydration ratios.
            </div>
            <div className="pb-meta">
              <div className="meta-row"><span>— Looking for</span><span className="meta-val">Full-time</span></div>
              <div className="meta-row"><span>— Open to</span><span className="meta-val">Remote-first</span></div>
              <div className="meta-row"><span>— Notice period</span><span className="meta-val">4 weeks</span></div>
            </div>
            <div className="pb-stats">
              <div className="pb-stat">
                <div className="stat-n blue">{skills.size}</div>
                <div className="stat-l">Skills</div>
              </div>
              <div className="pb-stat">
                <div className="stat-n pink">{interests.size}</div>
                <div className="stat-l">Interests</div>
              </div>
              <div className="pb-stat">
                <div className="stat-n">{overlapCount}</div>
                <div className="stat-l">Overlaps</div>
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
              <div className="legend-row">
                <span className="lmark ov" />
                Overlap
                <span className="legend-meta">the sweet spot</span>
              </div>
            </div>

            <div className="pb-actions">
              <button className="pb-btn pb-btn-full">See matching jobs →</button>
              <button className="pb-btn pb-btn-full pb-btn-sec" onClick={() => setScreen('form')}>Edit profile</button>
            </div>
          </aside>

          <Graph key={`${[...skills].join(',')}-${[...interests.keys()].join(',')}`} skills={skills} interests={interests} />
        </div>
      )}
    </div>
  )
}
