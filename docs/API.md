# API Documentation - Maulana Laundry

All API endpoints are prefixed with `/api`.

## Authentication

### Login
Authenticates a user and returns a JWT token.

- **Method**: `POST`
- **Path**: `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "status": "success",
    "message": "Success login",
    "data": "JWT_TOKEN_HERE"
  }
  ```

### Change Password (Protected)
Updates the current user's password.

- **Method**: `POST`
- **Path**: `/auth/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "old_password": "current_password",
    "new_password": "new_password123"
  }
  ```

## Services (Protected)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/services` | List all available laundry services |
| `GET` | `/services/:id` | Get details of a single service |
| `POST` | `/services` | Create a new service (Admin only) |

## Transactions (Protected)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/transactions` | List all transactions |
| `POST` | `/transactions` | Create a new transaction |
| `PATCH` | `/transactions/:id` | Update transaction status |
