import swaggerUi from "swagger-ui-express";
import swaggerSpecJson from "./swaggerSpec.json";

/**
 * Swagger UI configuration
 * Serves interactive API documentation at /api-docs
 */
export const swaggerUiConfig = {
  routePrefix: "/api-docs",
  customCss: ".swagger-ui topbar { display: none }",
  customSiteTitle: "URL Shortener API",
};

export default swaggerUiConfig;