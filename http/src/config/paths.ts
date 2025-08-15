import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // /home/alex/code/UNCC/http/src/config/paths.ts
const __dirname = path.dirname(__filename); // /home/alex/code/UNCC/http/src/config
export const PROJECT_ROOT = path.resolve(__dirname, "..", ".."); // /home/alex/code/UNCC/http
export const SRC_DIR = path.resolve(__dirname, ".."); // /home/alex/code/UNCC/http/src
