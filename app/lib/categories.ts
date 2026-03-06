// Shared category classification — used by story cards, locked paywall, and story detail

export function getSignalLabel(categoryRaw: string): string {
  const cls = getKickerClass(categoryRaw);
  const labels: Record<string, string> = {
    critical: "SECURITY SIGNAL",
    ai:       "AI SIGNAL",
    gaming:   "GAMING SIGNAL",
    alpha:    "ALPHA SIGNAL",
    mobile:   "MOBILE SIGNAL",
    privacy:  "PRIVACY SIGNAL",
  };
  return labels[cls] ?? "INTELLIGENCE SIGNAL";
}

export const CATEGORY_COLORS: Record<string, string> = {
  critical: "#ff4545",
  ai:       "#ae88ff",
  gaming:   "#14f195",
  alpha:    "#14f195",
  mobile:   "#00c2ff",
  privacy:  "#b06eff",
  default:  "#00c2ff",
};

export function getKickerClass(categoryRaw: string): string {
  const cat = String(categoryRaw || "").toLowerCase();
  if (/security|risk|breach|exploit|hack/.test(cat)) return "critical";
  if (/ai|agent/.test(cat)) return "ai";
  if (/gaming|game/.test(cat)) return "gaming";
  if (/alpha/.test(cat)) return "alpha";
  if (/mobile|seeker/.test(cat)) return "mobile";
  if (/privacy|zk/.test(cat)) return "privacy";
  return "";
}

export function getKickerColor(categoryRaw: string): string {
  const cls = getKickerClass(categoryRaw);
  return CATEGORY_COLORS[cls] ?? CATEGORY_COLORS.default;
}
