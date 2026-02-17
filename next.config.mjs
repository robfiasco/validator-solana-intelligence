import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Force Next to use this repo as root (prevents wrong root inference from parent lockfiles).
    root: __dirname,
  },
};

export default nextConfig;
