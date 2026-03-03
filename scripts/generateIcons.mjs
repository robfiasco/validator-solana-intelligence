/**
 * generateIcons.mjs
 * Downloads Orbitron font, embeds it in the SVG, then uses sharp to
 * generate all icon sizes needed for the PWA manifest and public/icon.png.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const cwd = process.cwd();
const SVG_PATH = path.join(cwd, "public", "gossip-icon.svg");
const ICONS_DIR = path.join(cwd, "public", "icons");
const FONT_CACHE = path.join(cwd, ".orbitron-font.b64");

// ── Sizes ────────────────────────────────────────────────────────────────────
const WEBP_SIZES = [48, 72, 96, 128, 192, 256, 512];
const PNG_SIZES = [{ size: 1024, out: path.join(cwd, "public", "icon.png") }];

// ── Download & cache Orbitron 900 ─────────────────────────────────────────────
async function getOrbitronBase64() {
  if (fs.existsSync(FONT_CACHE)) {
    console.log("  Using cached Orbitron font.");
    try { return JSON.parse(fs.readFileSync(FONT_CACHE, "utf-8")); } catch { fs.unlinkSync(FONT_CACHE); }
  }

  console.log("  Downloading Orbitron 900 from Google Fonts CSS...");
  // Fetch the CSS to get the actual woff2 URL
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap";
  const cssRes = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible)" },
  });
  const css = await cssRes.text();
  // Accept woff2 or truetype URLs
  const match = css.match(/src:\s*url\(([^)]+(?:woff2|\.ttf)[^)]*)\)\s*format\(['"]?(?:woff2|truetype)['"]?\)/);
  if (!match) throw new Error("Could not find font URL in Google Fonts CSS. Response: " + css.slice(0, 200));

  const fontUrl = match[1].replace(/'/g, "");
  const isTtf = fontUrl.includes(".ttf");
  console.log(`  Fetching ${isTtf ? "TTF" : "woff2"} font from gstatic...`);
  const fontRes = await fetch(fontUrl);
  const buf = Buffer.from(await fontRes.arrayBuffer());
  const b64 = buf.toString("base64");
  // Store format alongside b64 so embed knows the mime type
  const entry = JSON.stringify({ b64, fmt: isTtf ? "truetype" : "woff2", mime: isTtf ? "font/ttf" : "font/woff2" });
  fs.writeFileSync(FONT_CACHE, entry, "utf-8");
  console.log(`  Orbitron font downloaded (${Math.round(buf.length / 1024)}KB)`);
  return JSON.parse(entry);
}

// ── Build SVG with embedded font ──────────────────────────────────────────────
function buildSvgWithFont(svgSource, fontInfo) {
  const { b64, fmt, mime } = fontInfo;
  const fontFace = `@font-face { font-family: 'Orbitron'; font-weight: 900; src: url('data:${mime};base64,${b64}') format('${fmt}'); }`;
  return svgSource.replace(/@import url\([^)]+\);/, fontFace);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🎨 Gossip Icon Generator\n");

  if (!fs.existsSync(SVG_PATH)) {
    console.error(`❌ SVG not found at ${SVG_PATH}`);
    process.exit(1);
  }

  const svgRaw = fs.readFileSync(SVG_PATH, "utf-8");

  // Embed font
  console.log("📦 Embedding Orbitron font...");
  const fontB64 = await getOrbitronBase64();
  const svgEmbedded = buildSvgWithFont(svgRaw, fontB64);
  const svgBuf = Buffer.from(svgEmbedded, "utf-8");

  // Ensure icons dir exists
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  // Generate WebP sizes
  console.log("\n🖼  Generating WebP icons...");
  for (const size of WEBP_SIZES) {
    const outPath = path.join(ICONS_DIR, `icon-${size}.webp`);
    await sharp(svgBuf)
      .resize(size, size)
      .webp({ quality: 90 })
      .toFile(outPath);
    console.log(`  ✅ icon-${size}.webp`);
  }

  // Generate PNG sizes
  console.log("\n🖼  Generating PNG icons...");
  for (const { size, out } of PNG_SIZES) {
    await sharp(svgBuf)
      .resize(size, size)
      .png()
      .toFile(out);
    console.log(`  ✅ ${path.relative(cwd, out)} (${size}x${size})`);
  }

  console.log("\n✨ All icons generated.\n");
}

main().catch(e => { console.error("❌", e.message); process.exit(1); });
