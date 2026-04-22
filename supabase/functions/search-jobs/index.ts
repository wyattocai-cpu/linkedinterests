import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ─── INTEREST KEYWORD MAP ──────────────────────────────────────
// Each entry maps an INTEREST_POOL name → keywords to scan for in job descriptions.
// Match is substring (lowercased), so "cycling" matches "cyclist", "cycleways", etc.
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

// ─── FIT SCORING ──────────────────────────────────────────────
// Positive signals: company/role has a passion/mission/lifestyle angle
const FIT_POSITIVE: string[] = [
  // Outdoor / active
  "outdoor", "adventure", "trail", "wilderness", "mountain",
  "cycling", "running", "hiking", "climbing", "fitness", "sport", "athletic",
  // Mission / purpose
  "mission-driven", "b corp", "benefit corp", "nonprofit", "non-profit",
  "climate", "sustainability", "conservation", "social impact", "purpose-driven",
  // Culture
  "dog-friendly", "dog friendly", "pets welcome", "community-driven",
  "passionate", "enthusiast", "maker culture", "small team", "creative",
  // Known passion-company names (partial)
  "strava", "alltrails", "komoot", "garmin", "rei ", "patagonia",
  "arc'teryx", "nikon", "gopro", "spotify", "bandcamp", "soundcloud",
  "zwift", "peloton", "duolingo", "headspace", "calm", "airbnb", "seatgeek",
];

// Hard negatives drag the score down
const FIT_NEGATIVE: string[] = [
  "government contractor", "federal contract", "dod clearance", "top secret clearance",
  "investment banking", "hedge fund", "private equity",
  "management consulting", "big four",
];

function scoreJobFit(title: string, company: string, description: string): number {
  const text = `${title} ${company} ${description}`.toLowerCase();
  let score = 0;
  for (const kw of FIT_POSITIVE) if (text.includes(kw)) score++;
  for (const kw of FIT_NEGATIVE) if (text.includes(kw)) score -= 3;
  return score;
}

function tagJob(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];
  for (const [interest, keywords] of Object.entries(INTEREST_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) tags.push(interest);
  }
  return tags.slice(0, 5);
}

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

  const { query = "", interests = [] } = (await req.json()) as {
    query: string;
    interests: string[];
  };

  // Build query: role/skill as primary + first 2 interests as context
  const interestContext = interests.slice(0, 2).join(" ");
  const fullQuery =
    [query.trim(), interestContext].filter(Boolean).join(" ") || "software engineer";

  const params = new URLSearchParams({
    query: fullQuery,
    page: "1",
    num_pages: "2",      // ~20 raw results before our filtering
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

  const jobs = raw
    .map((j) => {
      const tags = tagJob(j.job_title, j.job_description ?? "");
      const fitScore = scoreJobFit(j.job_title, j.employer_name, j.job_description ?? "");
      const location = j.job_is_remote
        ? "Remote"
        : [j.job_city, j.job_state].filter(Boolean).join(", ") ||
          j.job_country ||
          "Unknown";
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
        fitScore,
        source: "live" as const,
      };
    })
    .filter((j) => j.fitScore >= 0)          // drop hard-negative results
    .sort((a, b) => b.fitScore - a.fitScore)  // best fits first
    .slice(0, 12);

  return new Response(JSON.stringify({ jobs, query: fullQuery }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
