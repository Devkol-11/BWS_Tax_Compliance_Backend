import Express from "express";
import { initilalizeRoutes } from "./module/routes/routes";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function intializeApplication() {
  const app = Express();
  const routes = initilalizeRoutes();
  app.use(helmet);
  app.use(cors({ allowedHeaders: [] }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );
  app.use("/api/v1/tax", routes);

  return app;
}
