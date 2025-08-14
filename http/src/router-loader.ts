import * as fs from "fs";
import * as path from "path";
import { SRC_DIR } from "./config/paths.js";

const featuresDir = path.join(SRC_DIR, "features");

export async function loadRoutes(): Promise<Route[]> {
  let allRoutes: Route[] = [];
  const features = fs.readdirSync(featuresDir);

  for (const feature of features) {
    const routeFile = path.join(featuresDir, feature, `${feature}.routes.js`);
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
