/**
 * Pulse Profile utilities.
 *
 * Purpose:
 * - Provide one place to normalize and merge profile data coming from
 *   multiple routes (Act 1, My Lab, counselor input, AI patch proposals).
 * - Keep backward compatibility with existing `pulse_data` fields while
 *   introducing a consistent baseline profile shape for future tickets.
 *
 * NOTE:
 * - This file intentionally contains pure helpers only.
 * - No app behavior is changed until these helpers are wired into call sites.
 */

const DEFAULT_VISION_LEVEL = {
  emoji: "",
  title: "",
  goalAmount: 0,
  progressAsset: 0,
  immersionScript: "",
  events: [],
};

/**
 * Creates a safe baseline profile object for unified profile merging.
 *
 * Backward compatibility fields preserved:
 * - user_name
 * - annual_income
 * - target_date
 * - ledger
 * - visions
 * - bps_traits
 * - vak_profile
 * - tci_profile
 * - signature
 * - signed_date
 * - apex_conversation_id
 */
export function createDefaultPulseProfile() {
  return {
    // Backward-compatible top-level fields
    user_name: "",
    annual_income: "",
    target_date: "",
    ledger: [],
    visions: {
      1: { ...DEFAULT_VISION_LEVEL },
      2: { ...DEFAULT_VISION_LEVEL },
      3: { ...DEFAULT_VISION_LEVEL },
      4: { ...DEFAULT_VISION_LEVEL },
      5: { ...DEFAULT_VISION_LEVEL },
      6: { ...DEFAULT_VISION_LEVEL },
    },
    bps_traits: [],
    vak_profile: normalizeVakProfile(),
    tci_profile: normalizeTciProfile(),
    signature: "",
    signed_date: "",
    apex_conversation_id: "",

    // Target architecture-friendly shape extensions (non-breaking)
    life_profile: {
      sleep_time: "",
      wake_time: "",
      sleep_notes: "",
      major_goals: [],
    },
    apex_bps: null,
    contract: null,
  };
}

/**
 * Normalizes TCI profile input into a consistent object.
 *
 * Supported incoming formats:
 * - Act 1 quick shape: { ns, ha, rd, p }
 * - Existing app nested shape: { ns: { score }, ha: { score }, ... }
 * - Partial/mixed object from manual input or AI patches
 */
export function normalizeTciProfile(input, source = "unknown", type = "unknown") {
  const raw = input && typeof input === "object" ? input : {};

  const getNumeric = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const pickScore = (key, fallback = 50) => {
    const value = raw[key];

    if (value && typeof value === "object" && "score" in value) {
      return getNumeric(value.score, fallback);
    }

    return getNumeric(value, fallback);
  };

  return {
    ns: { score: pickScore("ns", 50) },
    ha: { score: pickScore("ha", 50) },
    rd: { score: pickScore("rd", 50) },
    p: { score: pickScore("p", 50) },
    // Provenance for future debugging/auditing
    _meta: { source, type },
  };
}

/**
 * Normalizes VAK profile input into a consistent object.
 *
 * Expected normalized shape:
 * - vPercent, aPercent, kPercent: numeric percentages
 * - dominant: "V" | "A" | "K"
 * - order: sorted rank string (e.g., "VAK")
 */
export function normalizeVakProfile(input, source = "unknown", type = "unknown") {
  const raw = input && typeof input === "object" ? input : {};

  const getNumeric = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const vPercent = getNumeric(raw.vPercent ?? raw.v ?? 34, 34);
  const aPercent = getNumeric(raw.aPercent ?? raw.a ?? 33, 33);
  const kPercent = getNumeric(raw.kPercent ?? raw.k ?? 33, 33);

  const ranked = [
    { label: "V", value: vPercent },
    { label: "A", value: aPercent },
    { label: "K", value: kPercent },
  ].sort((x, y) => y.value - x.value);

  const order = ranked.map((x) => x.label).join("");
  const dominant = ["V", "A", "K"].includes(raw.dominant) ? raw.dominant : ranked[0].label;

  return {
    vPercent,
    aPercent,
    kPercent,
    dominant,
    order,
    _meta: { source, type },
  };
}

/**
 * Merges Act 1 journey data into an existing profile object.
 *
 * This is a non-destructive merge helper:
 * - starts from default profile
 * - overlays existing profile
 * - overlays recognized Act 1 fields
 */
export function mergeAct1JourneyIntoProfile(existingProfile, journeyData) {
  const base = {
    ...createDefaultPulseProfile(),
    ...(existingProfile && typeof existingProfile === "object" ? existingProfile : {}),
  };

  const journey = journeyData && typeof journeyData === "object" ? journeyData : {};

  const next = {
    ...base,
    user_name: journey.userName ?? base.user_name,
    vak_profile: normalizeVakProfile(journey.vakProfile ?? base.vak_profile, "act1", "journey"),
    tci_profile: normalizeTciProfile(journey.tciQuickProfile ?? base.tci_profile, "act1", "journey"),
  };

  if (journey.signature != null) {
    next.signature = journey.signature;
  }

  if (journey.signedDate != null) {
    next.signed_date = journey.signedDate;
  }

  if (journey.generatedBPS && journey.selectedNeedLevel) {
    const level = Number(journey.selectedNeedLevel);

    if (Number.isInteger(level) && next.visions[level]) {
      const bps = journey.generatedBPS;
      next.visions = {
        ...next.visions,
        [level]: {
          ...next.visions[level],
          title: bps.goalTitle ?? next.visions[level].title,
          immersionScript: bps.immersionScript ?? next.visions[level].immersionScript,
        },
      };

      if (Array.isArray(bps.traits) && bps.traits.length > 0) {
        next.bps_traits = bps.traits;
      }
    }
  }

  return next;
}

/**
 * Extracts all fixed-value events from visions payload.
 *
 * Input supports the app's level-indexed `visions` object.
 * Output is a flat array with level context included.
 */
export function extractFixedValueEvents(visions) {
  if (!visions || typeof visions !== "object") return [];

  const levels = Object.keys(visions);
  const fixed = [];

  levels.forEach((levelKey) => {
    const level = visions[levelKey];
    const events = Array.isArray(level?.events) ? level.events : [];

    events.forEach((event) => {
      if (event?.isFixedValue === true || event?.fixedValue === true || event?.type === "fixed_value") {
        fixed.push({
          ...event,
          level: Number(levelKey),
        });
      }
    });
  });

  return fixed;
}
