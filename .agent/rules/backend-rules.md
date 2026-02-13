---
trigger: always_on
---

---
description: This document outlines the coding standards, architectural patterns, and best practices for the Golang backend project using Fiber, GORM, and Clean Architecture principles.
---

# Golang Backend Rules & Standards

This document serves as the single source of truth for all backend development in this repository. Follow these rules to ensure code consistency, maintainability, and security.

## 1. Project Structure
We follow a modular, standard Go project layout:

```
backend/
├── cmd/             # Entry points (main.go)
├── config/          # Configuration loading (env vars)
├── database/        # Database connection & migrations
├── handlers/        # HTTP Handlers (Controllers) - Handle Requests/Responses
├── middleware/      # Fiber Middleware (Auth, Logger, CORS)
├── models/          # GORM Entities & Data Structures
├── routes/          # API Route Definitions
├── services/        # Business Logic (Optional but recommended for complex logic)
├── utils/           # Helper functions (JWT, Password Hashing, Responders)
└── .env             # Secrets (NEVER COMMIT THIS)
```

## 2. Coding Standards

### 2.1 General Setup
- **Go Version**: Use Go 1.21+
- **Module Name**: `laundry-backend` (as defined in `go.mod`)
- **Formatting**: Always run `go fmt ./...` before committing.
- **Linting**: Use `golangci-lint` to catch common errors.

### 2.2 Naming Conventions
- **Files**: `snake_case.go` (e.g., `user_handler.go`, `db_connection.go`)
- **Directories**: `lowercase` (e.g., `handlers`, `models`)
- **Structs/Interfaces**: `PascalCase` (e.g., `User`, `ServiceRepository`)
- **Functions**: `PascalCase` for exported, `camelCase` for internal.
- **Variables**: `camelCase` (e.g., `userID`, `dbConnection`). Short names (`i`, `ctx`, `err`) are okay in small scopes.
- **Constants**: `UpperCamelCase` or `ALL_CAPS` depending on usage (e.g., `StatusCompleted`, `DEFAULT_PORT`).

### 2.3 Error Handling
- **Never ignore errors**: Always check `if err != nil`.
- **Return errors**: Propagate errors up the stack rather than logging and exiting immediately in low-level functions.
- **Context**: Wrap errors when useful, e.g., `fmt.Errorf("failed to create user: %w", err)`.
- **HTTP Errors**: Use standard HTTP status codes (200, 201, 400, 401, 404, 500).

## 3. Library Stack
- **Web Framework**: [Go Fiber v2](https://gofiber.io/)
- **ORM**: [GORM](https://gorm.io/)
- **Database**: PostgreSQL (via `pgx` driver or standard `lib/pq`)
- **Config**: `joho/godotenv`
- **Auth**: `golang-jwt/jwt/v5`
- **Security**: `golang.org/x/crypto/bcrypt`
- **UUID**: `google/uuid` (Use for IDs if migrating from integer IDs, otherwise `uint`).

## 4. API Design & Response Format
All API responses MUST follow a consistent JSON structure using a helper function (e.g., in `utils/response.go`).

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Invalid input data",
  "data": null // or specific error details
}
```

## 5. Database Interaction
- **GORM Models**: Define primary keys, foreign keys, and JSON tags explicitly.
- **Soft Deletes**: Use `gorm.DeletedAt` for critical data (Users, Transactions).
- **Transactions**: Use `tx := db.Begin()` for operations involving multiple tables (e.g., Creating an Order + OrderItems).

## 6. Authentication & Security
- **Passwords**: NEVER store plain text. Always hash with `bcrypt` (cost 10-14).
- **JWT**:
  - Sign with `HS256` or `RS256`.
  - Expiry should be reasonable (e.g., 24h - 72h).
  - Store sensitive claims sparingly (UserID, Role).
- **Middleware**: Protect private routes using the JWT middleware.

## 7. Migration & Seeding
- **AutoMigrate**: Use `db.AutoMigrate(&Model{})` in `main.go` or a separate migration script for development.
- **Seeding**: Create a seeder function to populate initial data (Admin user, Default Services) if the database is empty.

## 8. Git Workflow
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat: add user login`
  - `fix: resolve db connection timeout`
  - `chore: update dependencies`
  - `refactor: simplify auth middleware`
- **Branches**: `feature/feature-name`, `bugfix/issue-description`.
