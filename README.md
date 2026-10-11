# URL Shortener API

A REST API for shortening URLs, built with **Express 5**, **TypeScript**, **MongoDB** (via Mongoose), and **Redis**. Users register and log in with JWT-based authentication, create short links, and get redirected to the original URL when someone visits the short link. Each link tracks how many times it has been visited.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
      - [Option 1: Docker Compose (recommended)](#option-1-docker-compose-recommended)
      - [Option 2: Run Locally](#option-2-run-locally)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Rate Limiting](#rate-limiting)
- [API Documentation](#api-documentation)
- [API Reference](#api-reference)
      - [Conventions](#conventions)
      - [Health Check](#health-check)
      - [Auth](#auth)
      - [Users](#users)
      - [Links](#links)
- [Authentication and Authorization](#authentication-and-authorization)

## Features

- User registration, login, token refresh, and logout
- Access tokens (short-lived, sent in the `Authorization` header) and refresh tokens (signed, httpOnly cookie, stored in Redis)
- Role-based access control (`user` and `admin`)
- Create, list, and delete short links
- Public short-link redirects (HTTP 302) with per-link view counting
- Input validation with Zod
- Rate limiting with express-rate-limit (stricter Auth limiter and a general limiter for User and Link routes)
- API documentation with Swagger UI and a JSON specification endpoint
- Security headers (Helmet), CORS, and request logging (Morgan)
- Docker Compose setup with MongoDB and Redis

## Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| Runtime            | Node.js (Docker image uses Node 24)           |
| Language           | TypeScript                                    |
| Web framework      | Express 5                                     |
| Database           | MongoDB with Mongoose 9                       |
| Cache / sessions   | Redis (node-redis 6)                          |
| Auth               | JSON Web Tokens (`jsonwebtoken`), bcrypt      |
| Validation         | Zod 4                                         |
| Rate limiting      | express-rate-limit                            |
| API documentation  | Swagger UI / OpenAPI specification            |
| Security           | Helmet, CORS, cookie-parser (signed cookies)  |
| Dev tooling        | tsx, nodemon, Yarn 4                          |

## Project Structure

```
.
├── src/
│   ├── index.ts              # Express app setup and middleware
│   ├── server.ts             # Entry point: connects DBs, starts the HTTP server
│   ├── config/
│   │   ├── index.ts          # Environment variable loading and validation (Zod)
│   │   ├── db.ts             # MongoDB connection
│   │   ├── redis.ts          # Redis client
│   │   └── swagger.ts     # Swagger / OpenAPI configuration
│   ├── routes/
│   │   ├── index.ts          # Root router mounted at /api/v1
│   │   ├── auth.ts           # /auth routes
│   │   ├── user.ts           # /user routes
│   │   └── link.ts           # /link routes
│   ├── controllers/
│   │   ├── auth/             # register, login, refresh, logout
│   │   ├── user/             # getMe, getAll, update, updatePassword, delete
│   │   ├── link/             # createLink, getLink, getAllLink, deleteLink
│   │   └── redirect/         # redirectLink
│   ├── middlewares/
│   │   ├── authenticate.ts   # Verifies the access token
│   │   ├── authorization.ts  # Role check (authorize(["admin"]))
│   │   ├── rateLimiter.ts    # Auth and general request rate limits
│   │   ├── zodValidator.ts   # Validates req.body against a Zod schema
│   │   ├── asyncHandler.ts   # Forwards async errors to Express
│   │   └── errorHandler.ts   # Global error handler
│   ├── models/
│   │   ├── user.ts           # User schema (bcrypt hashing on save)
│   │   └── link.ts           # Link schema
│   ├── libs/
│   │   ├── jwt.ts            # Token generation, verification, refresh cookie
│   │   ├── redisRefresh.ts   # Refresh-token storage in Redis
│   │   └── validateSchema.ts # Zod schemas for request bodies
│   └── utils/
│       ├── apiResponse.ts    # ApiError class
│       ├── interface.ts      # Shared types
│       └── express.d.ts      # Adds userId and role to Express Request
├── Dockerfile
├── docker-compose.yml
├── nodemon.json
├── tsconfig.json
├── package.json
└── test.http                 # Sample requests for the REST client extension
```

## Prerequisites

- **Node.js** 24 or later (for local development)
- **Yarn** 4 (the project pins `yarn@4.12.0` through Corepack)
- **MongoDB** and **Redis** instances (provided by Docker Compose, or installed locally)
- **Docker** and **Docker Compose** (optional, for the containerized setup)

## Getting Started

Clone the repository:

```bash
git clone https://github.com/The-BOZORG/URL.git
cd URL
```

Create a `.env` file in the project root. The file is gitignored. See [Environment Variables](#environment-variables) for the full list.

```env
NODE_ENV=development
PORT=3000
WHITELIST=admin@example.com,admin@yahoo.com //must 2 or more email
MONGO_URI=mongodb://mongo:27017/URL
REDIS_URL=redis://redis:6379
JWT_SECRET=change-me
JWT_ACCESS_SECRET=change-me-access
ACCESS_TOKEN_EXPIRY=900
JWT_REFRESH_SECRET=change-me-refresh
REFRESH_TOKEN_EXPIRY=604800
```

Use strong, unique secrets in any non-local environment.

### Option 1: Docker Compose (recommended)

The Compose file starts three services: the API (`app`), MongoDB (`mongo`), and Redis (`redis`).

```bash
docker compose up --build
```

| Service | Host port   | Container port   |
| ------- | ----------- | ---------------- |
| API     | 3000        | 3000             |
| MongoDB | 27018       | 27017            |
| Redis   | 6380        | 6379             |

The API runs at `http://localhost:3000/api/v1`. The `MONGO_URI` and `REDIS_URL` values above use the Compose service hostnames (`mongo`, `redis`), which are only reachable from inside the Compose network.

### Option 2: Run Locally

1. Install dependencies:
         `bash
   corepack enable
   yarn install
   `
2. Start MongoDB and Redis, either yourself or with only the infrastructure services from Compose:
         `bash
   docker compose up -d mongo redis
   `
3. Point the connection strings at `localhost` in `.env`, using the mapped host ports:
         `env
   MONGO_URI=mongodb://localhost:27018/URL
   REDIS_URL=redis://localhost:6380
   `
         If you run your own MongoDB and Redis, use their addresses instead.
4. Start the development server (nodemon restarts it on changes in `src/`):
         `bash
   yarn start
   `
         You should see `MongoDB connected successfully`, `Redis connected`, and `Server Running On http://localhost:3000`.

## Environment Variables

The application validates these variables at startup with Zod. It exits with an error if a required value is missing or malformed.
| Variable               | Required | Default | Description |
| ---------------------- | -------- | ------- | ----------- |
| `NODE_ENV`             | Yes      | –       | `development` or `production`. In production, the refresh cookie is sent only over HTTPS (`secure`). |
| `PORT`                 | No       | `3000`  | Port the HTTP server listens on. |
| `WHITELIST`            | Yes      | –       | A valid email address. Users who register with this email receive the `admin` role. |
| `MONGO_URI`            | Yes      | –       | MongoDB connection string (must be a valid URL). |
| `REDIS_URL`            | Yes      | –       | Redis connection string (must be a valid URL). |
| `JWT_SECRET`           | Yes      | –       | Secret used to sign the refresh-token cookie. |
| `JWT_ACCESS_SECRET`    | Yes      | –       | Secret used to sign access tokens. |
| `ACCESS_TOKEN_EXPIRY`  | Yes      | –       | Access token lifetime in **seconds** (positive integer). |
| `JWT_REFRESH_SECRET`   | Yes      | –       | Secret used to sign refresh tokens. |
| `REFRESH_TOKEN_EXPIRY` | Yes      | –       | Refresh token lifetime in **seconds** (positive integer). |
Use separate secrets for access and refresh tokens. Set `JWT_SECRET` to a value that differs from both.

## Scripts

| Command         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `yarn start`    | Runs the server in watch mode with nodemon and tsx.  |
| `yarn build`    | Compiles TypeScript to `dist/` with `tsc`.           |

Note: the compiled output does not resolve the `@/` path alias, so run the app with `yarn start` (tsx) rather than `node dist/server.js`.

## Rate Limiting

- authLimiter: allows up to 5 requests per IP in a 15-minute window and is mounted on /api/v1/auth.
- globalLimiter: allows up to 100 requests per IP in a 15-minute window and is mounted on /api/v1/user and /api/v1/link.
    Both limiters return 429 Too Many Requests after the limit is exceeded. The current in-memory store resets when the app restarts and is not shared between multiple app containers.

## API Documentation

- Swagger UI: http://localhost:3000/api-docs
- Swagger specification JSON: http://localhost:3000/api-docs.json
    These routes are served by the API app and are available when the app is running, including in the Docker Compose setup with the API port published on 3000.

## API Reference

Base URL: http://localhost:3000/api/v1

### Conventions

Protected endpoints require Authorization: Bearer <accessToken>. Request and response bodies use JSON; errors return { "message": "..." }.

### Health Check

GET / — Check API status.

### Auth

Method Endpoint Description
POST /auth/register Create an account
POST /auth/login Log in and receive access token and refresh cookie
POST /auth/refresh Get a new access token using the refresh cookie
POST /auth/logout Clear the refresh cookie and remove the stored refresh token

### Users

Method Endpoint Description
GET /user/me Get the current user's profile
GET /user/all List users (admin; supports limit and offset)
PATCH /user/update Update username and/or email
PATCH /user/updatePassword Change password
DELETE /user/delete Delete the current user's account

### Links

Method Endpoint Description
POST /link/create Create a short link
GET /link/myLink List the current user's links
GET /link/all List all links with pagination (admin; page, limit)
DELETE /link/delete/:LinkId Delete a link by ID
GET /link/:shortLink Public redirect; increments the view count

## Authentication and Authorization

1. **Register** creates a user with the `user` role, or `admin` if the email exactly matches `WHITELIST`.
2. **Login** returns an access token in the response body and sets a refresh token cookie. The refresh token is also stored in Redis under the key `refreshToken:<userId>`.
3. **Access tokens** are signed with `JWT_ACCESS_SECRET` and expire after `ACCESS_TOKEN_EXPIRY` seconds. Send them as `Authorization: Bearer <token>`.
4. **Refresh tokens** are signed with `JWT_REFRESH_SECRET`, stored in a signed httpOnly cookie, and checked against Redis when used. Logging out or deleting the account removes the Redis entry, which revokes the session.
5. **Roles**: `authorize(["admin"])` guards the admin-only routes. The role is read from the database on each request.
      Because `authenticate` requires `isVerified` to be true, and login sets it, users must log in at least once before their access tokens are accepted.
