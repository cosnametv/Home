import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Admin inbox is for local/preview use only — never ship it on cosnametech.com production.
 * Vercel sets VERCEL_ENV=production on the live deployment.
 */
const isProduction =
  process.env.VERCEL_ENV === "production" || process.env.STRIP_ADMIN === "1";

const adminDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "Admin");

if (!isProduction) {
  console.log("Admin inbox kept in build (not a production deploy).");
  process.exit(0);
}

if (existsSync(adminDir)) {
  rmSync(adminDir, { recursive: true, force: true });
  console.log("Removed Admin inbox from production build.");
}
