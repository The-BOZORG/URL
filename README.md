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
- [API Reference](#api-reference)
  - [Conventions](#conventions)
  - [Health Check](#health-check)
  - [Auth](#auth)
  - [Users](#users)
  - [Links](#links)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Models](#data-models)
- [Error Responses](#error-responses)
- [Known Issues](#known-issues)
- [License](#license)

## Features

- User registration, login, token refresh, and logout
- Access tokens (short-lived, sent in the `Authorization` header) and refresh tokens (signed, httpOnly cookie, stored in Redis)
- Role-based access control (`user` and `admin`)
- Create, list, and delete short links
- Public short-link redirects (HTTP 302) with per-link view counting
- Input validation with Zod
- Security headers (Helmet), CORS, and request logging (Morgan)
- Docker Compose setup with MongoDB and Redis

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Runtime          | Node.js (Docker image uses Node 24)     |
| Language         | TypeScript                              |
| Web framework    | Express 5                               |
| Database         | MongoDB with Mongoose 9                 |
| Cache / sessions | Redis (node-redis 6)                    |
| Auth             | JSON Web Tokens (`jsonwebtoken`), bcrypt |
| Validation       | Zod 4                                   |
| Security         | Helmet, CORS, cookie-parser (signed cookies) |
| Dev tooling      | tsx, nodemon, Yarn 4                    |

## Project Structure

```
.
├── src/
│   ├── index.ts              # Express app setup and middleware
│   ├── server.ts             # Entry point: connects DBs, starts the HTTP server
│   ├── config/
│   │   ├── index.ts          # Environment variable loading and validation (Zod)
│   │   ├── db.ts             # MongoDB connection
│   │   └── redis.ts          # Redis client
│   ├── routes/
│   │   ├── index.ts          # Root router mounted at /api/v1
│   │   ├── auth.ts           # /auth routes
│   │   ├── user.ts           # /user routes
│   │   └── link.ts           # /link routes
│   ├── controllers/
│   │   ├── auth/             # register, login, refresh, logout
│   │   ├── user/             # getMe, getAll, update, updatePassword, delete
│   │   ├── link/             # createLink, getLink, getAllLink, deleteLink
│   │   └── redirect/         # redirectLink
│   ├── middlewares/
│   │   ├── authenticate.ts   # Verifies the access token
│   │   ├── authorization.ts  # Role check (authorize(["admin"]))
│   │   ├── zodValidator.ts   # Validates req.body against a Zod schema
│   │   ├── asyncHandler.ts   # Forwards async errors to Express
│   │   └── errorHandler.ts   # Global error handler
│   ├── models/
│   │   ├── user.ts           # User schema (bcrypt hashing on save)
│   │   └── link.ts           # Link schema
│   ├── libs/
│   │   ├── jwt.ts            # Token generation, verification, refresh cookie
│   │   ├── redisRefresh.ts   # Refresh-token storage in Redis
│   │   └── validateSchema.ts # Zod schemas for request bodies
│   └── utils/
│       ├── apiResponse.ts    # ApiError class
│       ├── interface.ts      # Shared types
│       └── express.d.ts      # Adds userId and role to Express Request
├── Dockerfile
├── docker-compose.yml
├── nodemon.json
├── tsconfig.json
├── package.json
└── test.http                 # Sample requests for the REST client extension
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
WHITELIST=admin@example.com
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

| Service | Host port | Container port |
| ------- | --------- | -------------- |
| API     | 3000      | 3000           |
| MongoDB | 27018     | 27017          |
| Redis   | 6380      | 6379           |

The API runs at `http://localhost:3000/api/v1`. The `MONGO_URI` and `REDIS_URL` values above use the Compose service hostnames (`mongo`, `redis`), which are only reachable from inside the Compose network.

### Option 2: Run Locally

1. Install dependencies:

   ```bash
   corepack enable
   yarn install
   ```

2. Start MongoDB and Redis, either yourself or with only the infrastructure services from Compose:

   ```bash
   docker compose up -d mongo redis
   ```

3. Point the connection strings at `localhost` in `.env`, using the mapped host ports:

   ```env
   MONGO_URI=mongodb://localhost:27018/URL
   REDIS_URL=redis://localhost:6380
   ```

   If you run your own MongoDB and Redis, use their addresses instead.

4. Start the development server (nodemon restarts it on changes in `src/`):

   ```bash
   yarn start
   ```

   You should see `MongoDB connected successfully`, `Redis connected`, and `Server Running On http://localhost:3000`.

## Environment Variables

The application validates these variables at startup with Zod. It exits with an error if a required value is missing or malformed.

| Variable               | Required | Default | Description |
| ---------------------- | -------- | ------- | ----------- |
| `NODE_ENV`             | Yes      | –       | `development` or `production`. In production, the refresh cookie is sent only over HTTPS (`secure`). |
| `PORT`                 | No       | `3000`  | Port the HTTP server listens on. |
| `WHITELIST`            | Yes      | –       | A valid email address. Users who register with this email receive the `admin` role. |
| `MONGO_URI`            | Yes      | –       | MongoDB connection string (must be a valid URL). |
| `REDIS_URL`            | Yes      | –       | Redis connection string (must be a valid URL). |
| `JWT_SECRET`           | Yes      | –       | Secret used to sign the refresh-token cookie. |
| `JWT_ACCESS_SECRET`    | Yes      | –       | Secret used to sign access tokens. |
| `ACCESS_TOKEN_EXPIRY`  | Yes      | –       | Access token lifetime in **seconds** (positive integer). |
| `JWT_REFRESH_SECRET`   | Yes      | –       | Secret used to sign refresh tokens. |
| `REFRESH_TOKEN_EXPIRY` | Yes      | –       | Refresh token lifetime in **seconds** (positive integer). |

Use separate secrets for access and refresh tokens. Set `JWT_SECRET` to a value that differs from both.

## Scripts

| Command       | Description |
| ------------- | ----------- |
| `yarn start`  | Runs the server in watch mode with nodemon and tsx. |
| `yarn build`  | Compiles TypeScript to `dist/` with `tsc`. |

Note: the compiled output does not resolve the `@/` path alias, so run the app with `yarn start` (tsx) rather than `node dist/server.js`.

## API Reference

Base URL: `http://localhost:3000/api/v1`

### Conventions

- Request and response bodies are JSON (`Content-Type: application/json`).
- Protected endpoints require an `Authorization: Bearer <accessToken>` header.
- Errors return `{ "message": "..." }` with an appropriate HTTP status code.
- Endpoints that return no content respond with `204 No Content`.

### Health Check

#### `GET /api/v1/`

Returns the API status.

```json
{
  "message": "API is live",
  "status": "ok",
  "timestamp": "2026-10-11T12:00:00.000Z"
}
```

### Auth

#### `POST /api/v1/auth/register`

Creates a new user. Public.

Request body:

| Field      | Type   | Rules |
| ---------- | ------ | ----- |
| `username` | string | 3–20 characters |
| `email`    | string | Valid email; stored lowercase and trimmed |
| `password` | string | At least 3 characters |

```json
{
  "username": "soroush",
  "email": "soroush@example.com",
  "password": "secret"
}
```

Response `201 Created`:

```json
{
  "message": "User created success",
  "data": {
    "username": "soroush",
    "email": "soroush@example.com",
    "role": "user"
  }
}
```

Errors: `400` if the email is already registered, or if validation fails.

#### `POST /api/v1/auth/login`

Authenticates a user and issues tokens. Public.

Request body: `email` and `password` (same rules as registration).

Response `200 OK`:

```json
{
  "accessToken": "eyJhbGciOi...",
  "data": {
    "username": "soroush",
    "email": "soroush@example.com",
    "role": "user"
  }
}
```

The response also sets a signed, httpOnly cookie named `refreshToken` (valid for 7 days). The refresh token is stored in Redis, so a new login replaces the previous session.

Errors: `400` for unknown email or wrong password, `400` for validation failures.

#### `POST /api/v1/auth/refresh`

Issues a new access token using the `refreshToken` cookie. Public (cookie required).

Response `200 OK`:

```json
{
  "accessToken": "eyJhbGciOi..."
}
```

Errors: `401` if the cookie is missing, invalid, or doesn't match the token stored in Redis.

#### `POST /api/v1/auth/logout`

Deletes the stored refresh token and clears the cookie. Public.

Response: `204 No Content`.

### Users

All user endpoints require a valid access token.

#### `GET /api/v1/user/me`

Returns the authenticated user's profile (password excluded).

Response `200 OK`:

```json
{
  "user": {
    "_id": "6703f1c2e4b0a1b2c3d4e5f6",
    "username": "soroush",
    "email": "soroush@example.com",
    "role": "user",
    "createdAt": "2026-10-11T12:00:00.000Z",
    "updatedAt": "2026-10-11T12:00:00.000Z"
  }
}
```

#### `GET /api/v1/user/all`

Lists all users. **Admin only.**

Query parameters:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `limit`   | `10`    | Number of users to return |
| `offset`  | `0`     | Number of users to skip |

Response `200 OK`: `{ "limit", "offset", "total", "users": [...] }`

#### `PATCH /api/v1/user/update`

Updates the authenticated user's username and/or email. Both fields are optional.

```json
{
  "username": "sorix",
  "email": "new@example.com"
}
```

Response `200 OK`: `{ "user": { ... } }`

#### `PATCH /api/v1/user/updatePassword`

Changes the authenticated user's password.

```json
{
  "currentPassword": "secret",
  "newPassword": "new-secret"
}
```

Response `200 OK`: `{ "message": "Password updated successfully" }`

Errors: `401` if `currentPassword` is wrong.

#### `DELETE /api/v1/user/delete`

Deletes the authenticated user and their stored refresh token.

Response: `204 No Content`.

### Links

#### `POST /api/v1/link/create`

Creates a short link for the authenticated user.

```json
{
  "Url": "https://example.com/some/very/long/path"
}
```

The URL must be valid and is trimmed before validation.

Response `201 Created`:

```json
{
  "message": "Link created successfully",
  "data": {
    "_id": "6703f1c2e4b0a1b2c3d4e5f7",
    "creator": "6703f1c2e4b0a1b2c3d4e5f6",
    "Url": "https://example.com/some/very/long/path",
    "shortLink": "aB3dE_fG",
    "views": 0,
    "createdAt": "2026-10-11T12:00:00.000Z",
    "updatedAt": "2026-10-11T12:00:00.000Z"
  }
}
```

The short code is 8 URL-safe characters (`base64url` of 6 random bytes).

#### `GET /api/v1/link/myLink`

Lists the authenticated user's links, newest first.

Response `200 OK`: `{ "links": [...] }`

#### `GET /api/v1/link/all`

Lists all links from all users, newest first. **Admin only.**

Query parameters:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `page`    | `1`     | Page number |
| `limit`   | `10`    | Items per page |

Response `200 OK`:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

#### `DELETE /api/v1/link/delete/:LinkId`

Deletes a link by its ID.

Response: `204 No Content`. Returns `404` if the link does not exist.

#### `GET /api/v1/link/:shortLink`

Public redirect. Increments the link's `views` counter and responds with `302 Found` and a `Location` header pointing to the original URL.

Errors: `404` if the short code does not exist.

Example:

```bash
curl -i http://localhost:3000/api/v1/link/aB3dE_fG
```

## Authentication and Authorization

1. **Register** creates a user with the `user` role, or `admin` if the email exactly matches `WHITELIST`.
2. **Login** returns an access token in the response body and sets a refresh token cookie. The refresh token is also stored in Redis under the key `refreshToken:<userId>`.
3. **Access tokens** are signed with `JWT_ACCESS_SECRET` and expire after `ACCESS_TOKEN_EXPIRY` seconds. Send them as `Authorization: Bearer <token>`.
4. **Refresh tokens** are signed with `JWT_REFRESH_SECRET`, stored in a signed httpOnly cookie, and checked against Redis when used. Logging out or deleting the account removes the Redis entry, which revokes the session.
5. **Roles**: `authorize(["admin"])` guards the admin-only routes. The role is read from the database on each request.

Because `authenticate` requires `isVerified` to be true, and login sets it, users must log in at least once before their access tokens are accepted.

## Data Models

**User**

| Field        | Type     | Notes |
| ------------ | -------- | ----- |
| `username`   | String   | Required |
| `email`      | String   | Required, unique |
| `password`   | String   | Required, bcrypt-hashed (10 rounds), not returned by default |
| `role`       | String   | `user` (default) or `admin` |
| `isVerified` | Boolean  | Set to `true` on login |
| `verifiedAt` | Date     | Declared but not currently set |
| `createdAt`, `updatedAt` | Date | Automatic timestamps |

**Link**

| Field       | Type     | Notes |
| ----------- | -------- | ----- |
| `creator`   | ObjectId | Reference to `User`, required |
| `Url`       | String   | Original URL, required |
| `shortLink` | String   | Unique short code, required |
| `views`     | Number   | Visit count, defaults to `0` |
| `createdAt`, `updatedAt` | Date | Automatic timestamps |

## Error Responses

Errors use a consistent JSON shape:

```json
{
  "message": "Access token is required"
}
```

| Status | Meaning |
| ------ | ------- |
| `400`  | Validation failure or a bad request (for example, duplicate email on registration) |
| `401`  | Missing or invalid access or refresh token, or wrong current password |
| `403`  | Account not verified, or insufficient role |
| `404`  | Resource not found |
| `500`  | Unexpected server error |

## Known Issues

The following bugs exist in the current code. They are listed here so you know about them before relying on these endpoints.

- **Link model name**: `src/models/link.ts` registers the model as `"User"`, which conflicts with the `User` model and points queries at the wrong collection. It should be `"Link"`.
- **Link deletion**: `DELETE /link/delete/:LinkId` filters on `userId`, but the field is `creator`, so it always returns `404`. It also does not check ownership correctly.
- **My links**: `GET /link/myLink` calls `Link.find(userId)` instead of `Link.find({ creator: userId })`, so it does not return the user's links as intended.
- **Admin matching**: `WHITELIST` is checked with `String.includes`, so any email that is a substring of the whitelisted address is granted admin. An exact comparison is needed.
- **Logout**: `POST /auth/logout` reads `req.userId`, which is only set by `authenticate`, but the route does not use that middleware.
- **Verification flag**: login always sets `isVerified = true`, so the verification check in `authenticate` has no real effect.
- **Database errors**: a failed MongoDB connection is logged but the server still starts.
- **Build output**: `yarn build` does not rewrite the `@/` path alias, so the compiled JavaScript does not run with plain Node.

## License

No license has been specified for this project. Add a `LICENSE` file and update this section to choose one.
