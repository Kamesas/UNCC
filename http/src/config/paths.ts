import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //file (`paths.ts`)
const __dirname = path.dirname(__filename); // (`/path/to/project/src/config`)
export const PROJECT_ROOT = path.resolve(__dirname, "..", ".."); // to root from the config
export const SRC_DIR = path.resolve(__dirname, ".."); // to root from the config
