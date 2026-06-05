import { cpSync, existsSync, mkdirSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const siteSrc = path.join(root, "src", "site");
const distOut = path.join(root, "dist");

function syncSite() {
  if (!existsSync(siteSrc)) {
    console.error("Missing src/site");
    return;
  }
  mkdirSync(distOut, { recursive: true });
  cpSync(siteSrc, distOut, { recursive: true });
  console.log(`[site] synced src/site → dist (${new Date().toLocaleTimeString()})`);
}

syncSite();

watch(siteSrc, { recursive: true }, (_event, filename) => {
  if (filename) syncSite();
});

console.log("[site] watching src/site for changes…");
