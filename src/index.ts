import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import route from "@/routes";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "@/config";
import swaggerUiConfig from "@/config/swagger";
import swaggerSpec from "@/config/swaggerSpec.json";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

// Swagger UI is mounted before the global helmet() so its inline scripts
// are not blocked by the default Content-Security-Policy.
app.use(
  swaggerUiConfig.routePrefix,
  helmet({ contentSecurityPolicy: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiConfig),
);
app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use(cookieParser(env.JWT_SECRET));
app.use(helmet());
app.use(cors());

app.use("/api/v1", route);

app.use(errorHandler);

export default app;