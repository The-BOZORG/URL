import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description:
        "REST API for shortening URLs with JWT authentication, role-based access, and per-link view tracking.",
    },
    servers: [
      {
        url: "/api/v1",
        description: "Current server",
      },
    ],
    tags: [
      { name: "Health", description: "Service status" },
      { name: "Auth", description: "Registration, login, token refresh, logout" },
      { name: "Users", description: "User profile management" },
      { name: "Links", description: "Short link management and redirects" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Access token returned by POST /auth/login",
        },
        refreshCookie: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "Signed httpOnly refresh token set by POST /auth/login",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Access token is required" },
          },
        },
        UserPublic: {
          type: "object",
          properties: {
            username: { type: "string", example: "soroush" },
            email: { type: "string", format: "email", example: "soroush@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6703f1c2e4b0a1b2c3d4e5f6" },
            username: { type: "string", example: "soroush" },
            email: { type: "string", format: "email", example: "soroush@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Link: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6703f1c2e4b0a1b2c3d4e5f7" },
            creator: { type: "string", example: "6703f1c2e4b0a1b2c3d4e5f6" },
            Url: { type: "string", format: "uri", example: "https://example.com/some/long/path" },
            shortLink: { type: "string", example: "aB3dE_fG" },
            views: { type: "integer", minimum: 0, example: 0 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", minLength: 3, maxLength: 20, example: "soroush" },
            email: { type: "string", format: "email", example: "soroush@example.com" },
            password: { type: "string", minLength: 3, example: "secret" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "soroush@example.com" },
            password: { type: "string", minLength: 3, example: "secret" },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            username: { type: "string", minLength: 3, maxLength: 20, example: "sorix" },
            email: { type: "string", format: "email", example: "new@example.com" },
          },
        },
        UpdatePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string", minLength: 3, example: "secret" },
            newPassword: { type: "string", minLength: 3, example: "new-secret" },
          },
        },
        CreateLinkRequest: {
          type: "object",
          required: ["Url"],
          properties: {
            Url: { type: "string", format: "uri", example: "https://example.com/some/long/path" },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Validation failed or bad request",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
        Unauthorized: {
          description: "Missing or invalid token, or wrong credentials",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
        Forbidden: {
          description: "Account not verified or insufficient role",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
        NotFound: {
          description: "Resource not found",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
