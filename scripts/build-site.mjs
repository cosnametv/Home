import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const siteSrc = join(root, "src", "site");
const distOut = join(root, "dist");

if (!existsSync(siteSrc)) {
  console.error("Missing src/site — static site source folder not found.");
  process.exit(1);
}

mkdirSync(distOut, { recursive: true });
cpSync(siteSrc, distOut, { recursive: true });
console.log("Copied src/site → dist");
