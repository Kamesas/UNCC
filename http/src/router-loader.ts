import dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import { PROJECT_ROOT } from "./config/paths.js";

const isDev = process.env.NODE_ENV === "development";

export const FEATURES_DIR = isDev
  ? path.join(PROJECT_ROOT, "src", "features")
  : path.join(PROJECT_ROOT, "dist", "features");

export async function loadRoutes(): Promise<Route[]> {
  let allRoutes: Route[] = [];
  const features = fs.readdirSync(FEATURES_DIR);

  for (const feature of features) {
    const routeFile = path.join(FEATURES_DIR, feature, `${feature}.routes.js`);

    try {
      const routeModule = await import(`file://${routeFile}`);

      if (Array.isArray(routeModule.routes)) {
        allRoutes = allRoutes.concat(routeModule.routes);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ERR_MODULE_NOT_FOUND") {
        console.error(`Error loading routes for feature "${feature}":`, error);
      }
    }
  }

  return allRoutes;
}
