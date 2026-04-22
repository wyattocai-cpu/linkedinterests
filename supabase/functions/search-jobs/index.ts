import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ─── SKILL KEYWORDS ───────────────────────────────────────────
const SKILL_KEYWORDS: Record<string, string[]> = {
  "Product Design":     ["product design", "product designer", "ux design", "user experience design"],
  "UX Research":        ["ux research", "user research", "usability testing", "user interviews", "user testing"],
  "Figma":              ["figma"],
  "Design Systems":     ["design system", "component library", "design tokens", "design ops"],
  "Prototyping":        ["prototyping", "prototype", "wireframing", "wireframe", "mockup"],
  "Motion Design":      ["motion design", "animation", "after effects", "motion graphics", "lottie"],
  "Brand Identity":     ["brand identity", "branding", "brand design", "visual identity", "brand strategy"],
  "Illustration":       ["illustration", "illustrator", "visual art", "vector art"],
  "Type Design":        ["type design", "typography", "typeface", "lettering"],
  "Python":             ["python"],
  "JavaScript":         ["javascript", "typescript", " js ", "es6", "node.js", "nodejs"],
  "React":              ["react", "react.js", "reactjs", "next.js", "nextjs"],
  "Swift":              ["swift", "swiftui", "ios development", "xcode"],
  "Node.js":            ["node.js", "nodejs", "express", "fastify"],
  "SQL":                ["sql", "postgresql", "mysql", "database query", "postgres"],
  "Data Viz":           ["data visualization", "data viz", "d3.js", "tableau", "looker", "charts"],
  "Machine Learning":   ["machine learning", "deep learning", "neural network", "llm", "ai/ml", "ml engineer"],
  "GIS Mapping":        ["gis", "geospatial", "geographic information", "mapbox", "arcgis"],
  "Ecology":            ["ecology", "ecological", "environmental science", "field ecology"],
  "Copywriting":        ["copywriting", "ux writing", "content writing", "copy"],
  "Editorial":          ["editorial", "content editing", "managing editor"],
  "Content Strategy":   ["content strategy", "content planning", "information architecture"],
  "Product Management": ["product management", "product manager", " pm ", "roadmap", "product owner"],
  "Community Building": ["community management", "community building", "community manager"],
  "Facilitation":       ["facilitation", "design sprint", "workshop"],
  "Photography":        ["photography", "photo", "camera", "photoshoot"],
  "Video Editing":      ["video editing", "video production", "premiere", "final cut", "davinci"],
  "3D Modeling":        ["3d modeling", "blender", "maya", "3d design", "cad"],
  "Unity":              ["unity", "unity3d", "game engine"],
  "Marketing":          ["marketing", "growth marketing", "digital marketing", "campaign"],
  "SEO":                ["seo", "search engine optimization", "organic search"],
  "Operations":         ["operations", "ops", "process improvement", "program management"],
  "Finance":            ["finance", "financial planning", "accounting", "fp&a"],
  "Legal":              ["legal", "compliance", "regulatory", "counsel"],
};

// ─── INTEREST KEYWORDS ────────────────────────────────────────
const INTEREST_KEYWORDS: Record<string, string[]> = {
  "Rock Climbing":        ["climbing", "rock climbing", "bouldering", "mountaineer"],
  "Trail Running":        ["trail running", "trail run", "ultramarathon"],
  "Hiking":               ["hiking", "hike", "trailhead", "backcountry"],
  "Backpacking":          ["backpacking", "thru-hike"],
  "Surfing":              ["surfing", "surf", "surfboard"],
  "Cycling":              ["cycling", "bicycle", "biking", "mtb", "mountain bike", "gravel bike"],
  "Running":              ["running", "marathon", "half marathon", "5k"],
  "Fishing":              ["fishing", "fly fishing", "angling"],
  "Hunting":              ["hunting", "game management"],
  "Birding":              ["birding", "birdwatching", "ornitholog"],
  "Mushroom Foraging":    ["foraging", "mushroom", "mycolog"],
  "Rowing":               ["rowing", "kayaking", "paddling", "sculling"],
  "Animals":              ["animal welfare", "pet", "veterinar", "wildlife", "fauna"],
  "Sustainability":       ["sustainab", "climate", "carbon neutral", "clean energy", "renewable", "conservation"],
  "Live Music":           ["live music", "concert", "music festival", "venue", "touring"],
  "Playing Music":        ["musician", "band", "recording studio", "audio production"],
  "Vinyl Collecting":     ["vinyl", "record collecting", "turntable", "hi-fi"],
  "DJing":                ["djing", "mixing software", "nightlife", "dance music"],
  "Fitness":              ["fitness", "workout", "gym", "strength training", "active lifestyle"],
  "Yoga":                 ["yoga", "mindfulness", "meditation", "pilates"],
  "Fashion":              ["fashion", "apparel", "clothing brand", "streetwear", "sneaker"],
  "Poetry":               ["poetry", "literary", "spoken word"],
  "Indie Games":          ["indie game", "game developer", "gaming", "video game"],
  "Tabletop RPGs":        ["tabletop", "role-playing game", "board game"],
  "D&D":                  ["dungeons", "dragons", "d&d"],
  "Puzzles":              ["puzzle", "logic game"],
  "Mechanical Keyboards": ["mechanical keyboard", "keyboard enthusiast"],
  "Sports":               ["sports league", "athletic", "team sport", "stadium"],
  "Fantasy Sports":       ["fantasy sport", "fantasy football", "sports analytics"],
  "Travel":               ["travel", "adventure travel", "expedition", "nomad"],
  "Language Learning":    ["language learning", "multilingual", "translation", "linguistic"],
  "Book Club":            ["book club", "reading community", "publishing"],
  "Cooking":              ["cooking", "culinary", "food tech", "recipe", "gastronomy"],
  "Coffee":               ["coffee", "espresso", "barista", "specialty coffee", "roastery"],
  "Sourdough":            ["sourdough", "bread baking", "fermentation", "artisan food"],
  "Natural Wine":         ["natural wine", "winery", "vineyard"],
  "Craft Beer":           ["craft beer", "brewery", "brewing"],
  "Film Photography":     ["photography", "film camera", "darkroom", "analog photo"],
  "Pottery":              ["pottery", "ceramics", "clay studio"],
  "Zine Making":          ["zine", "self-publishing", "print design"],
};

// ─── TYPES ────────────────────────────────────────────────────
interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo?: string | null;
  job_title: string;
  job_apply_link: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_description: string;
  job_is_remote: boolean;
}

// ─── TAG JOB against only the provided skills + interests ─────
// Skills: search title + description (role titles name the skill explicitly)
// Interests: search description only (company culture lives in the body, not the title)
function tagJob(
  title: string,
  description: string,
  skills: string[],
  interests: string[]
): { tags: string[]; interestCount: number } {
  const fullText = `${title} ${description}`.toLowerCase();
  const descText = description.toLowerCase();
  const tags: string[] = [];
  let interestCount = 0;

  for (const skill of skills) {
    const keywords = SKILL_KEYWORDS[skill];
    if (keywords && keywords.some((kw) => fullText.includes(kw))) {
      tags.push(skill);
    }
  }

  for (const interest of interests) {
    const keywords = INTEREST_KEYWORDS[interest];
    if (keywords && keywords.some((kw) => descText.includes(kw))) {
      tags.push(interest);
      interestCount++;
    }
  }

  return { tags, interestCount };
}

// ─── HANDLER ──────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const apiKey = Deno.env.get("RAPIDAPI_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "RAPIDAPI_KEY secret not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  const { query = "", skills = [], interests = [] } = (await req.json()) as {
    query: string;
    skills: string[];
    interests: string[];
  };

  if (!query.trim()) {
    return new Response(
      JSON.stringify({ error: "query is required" }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  const params = new URLSearchParams({
    query: query.trim(),
    page: "1",
    num_pages: "2",
    date_posted: "month",
  });

  let jsearchData: { data?: JSearchJob[] };
  try {
    const resp = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });
    if (!resp.ok) {
      const detail = await resp.text();
      return new Response(
        JSON.stringify({ error: "JSearch request failed", detail }),
        { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }
    jsearchData = await resp.json();
  } catch (_e) {
    return new Response(
      JSON.stringify({ error: "Network error calling JSearch" }),
      { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  const raw: JSearchJob[] = jsearchData.data ?? [];
  const hasFilters = skills.length > 0 || interests.length > 0;

  const jobs = raw
    .map((j) => {
      const { tags, interestCount } = tagJob(j.job_title, j.job_description ?? "", skills, interests);
      const location = j.job_is_remote
        ? "Remote"
        : [j.job_city, j.job_state].filter(Boolean).join(", ") || j.job_country || "Unknown";
      return {
        id: j.job_id,
        title: j.job_title,
        company: j.employer_name,
        logo: j.employer_logo ?? null,
        location,
        remote: j.job_is_remote,
        url: j.job_apply_link,
        description: (j.job_description ?? "").slice(0, 500).trim(),
        tags,
        matchCount: tags.length,
        interestCount,
        source: "live" as const,
      };
    })
    // Must have ≥1 interest match — pure skill matches don't qualify
    .filter((j) => !hasFilters || j.interestCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 12);

  return new Response(JSON.stringify({ jobs, query: query.trim() }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
