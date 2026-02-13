---
description: This workflow initializes a Go backend project using Fiber v2, GORM (PostgreSQL), JWT, and Bcrypt. It sets up the folder structure, authentication, and database models for a Laundry Web App.
---

# 01 Backend Setup (Fiber + GORM + JWT)

This workflow sets up the backend for the Laundry Web App using Go Fiber, GORM, and PostgreSQL. It includes authentication (JWT), password hashing (bcrypt), and a modular project structure.

## 1. Initialize Go Module
// turbo
Initialize the Go module in the `backend` directory.
```bash
cd backend
if [ ! -f go.mod ]; then
    go mod init laundry-backend
fi
```

## 2. Install Dependencies
// turbo
Install Fiber, GORM, Postgres driver, JWT, Bcrypt, UUID, and Godotenv.
```bash
cd backend
go get -u github.com/gofiber/fiber/v2
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
go get -u github.com/joho/godotenv
go get -u github.com/golang-jwt/jwt/v5
go get -u golang.org/x/crypto/bcrypt
go get -u github.com/google/uuid
```

## 3. Create Project Structure
// turbo
Create the modular folder structure.
```bash
cd backend
mkdir -p cmd
mkdir -p config
mkdir -p database
mkdir -p handlers
mkdir -p middleware
mkdir -p models
mkdir -p routes
mkdir -p utils
```

## 4. Configuration & Database
Set up the database connection and configuration.

### 4.1 Config
Create `config/config.go`.
```go
package config

import (
	"os"

	"github.com/joho/godotenv"
)

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		// handle error or ignore if using system envs
	}
}

func Get(key string) string {
	return os.Getenv(key)
}
```

### 4.2 Database Connection
Create `database/connection.go`.
```go
package database

import (
	"fmt"
	"log"

	"laundry-backend/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	config.LoadConfig()

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		config.Get("DB_HOST"),
		config.Get("DB_USER"),
		config.Get("DB_PASSWORD"),
		config.Get("DB_NAME"),
		config.Get("DB_PORT"),
		config.Get("DB_SSLMODE"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	log.Println("Database connection established")
}
```

## 5. Utilities (Password & JWT)

### 5.1 Password Hashing
Create `utils/password.go`.
```go
package utils

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
```

### 5.2 JWT Utilities
Create `utils/jwt.go`.
```go
package utils

import (
	"time"
	"laundry-backend/config"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID uint, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.Get("JWT_SECRET")))
}
```

## 6. Models (User, Service, Transaction)
Create models with GORM tags.

### 6.1 User Model
Create `models/user.go`.
```go
package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Email     string         `gorm:"unique" json:"email"`
	Password  string         `json:"-"`
	Role      string         `json:"role"` // admin, customer
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
```

### 6.2 Service Model
Create `models/service.go`.
```go
package models

import (
	"time"
	"gorm.io/gorm"
)

type Service struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Unit        string         `json:"unit"` // kg, pcs
	Price       float64        `json:"price"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
```

### 6.3 Transaction Model
Create `models/transaction.go`.
```go
package models

import (
	"time"
	"gorm.io/gorm"
)

type Transaction struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user"`
	ServiceID uint           `json:"service_id"`
	Service   Service        `gorm:"foreignKey:ServiceID" json:"service"`
	Quantity  float64        `json:"quantity"`
	Total     float64        `json:"total"`
	Status    string         `json:"status"` // pending, process, done
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
```

## 7. Middleware
Create `middleware/auth.go`.
```go
package middleware

import (
	"laundry-backend/config"
	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/contrib/jwt"
)

func Protected() fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(config.Get("JWT_SECRET"))},
		ErrorHandler: jwtError,
	})
}

func jwtError(c *fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Missing or malformed JWT", "data": nil})
	}
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid or expired JWT", "data": nil})
}
```

## 8. Handlers (Basic Setup)
Create `handlers/auth.go` just as an example.
```go
package handlers

import (
	"laundry-backend/database"
	"laundry-backend/models"
	"laundry-backend/utils"
	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error on login request", "data": err})
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "User not found", "data": nil})
	}

	if !utils.CheckPasswordHash(input.Password, user.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid password", "data": nil})
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Could not login", "data": nil})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Success login", "data": token})
}
```

## 9. Routes
Create `routes/routes.go`.
```go
package routes

import (
	"laundry-backend/handlers"
	"laundry-backend/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	
	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handlers.Login)

	// Services (Protected)
	// service := api.Group("/services", middleware.Protected())
	// service.Get("/", handlers.GetAllServices)
}
```

## 10. Main Entry & Migration
Create `cmd/main.go`.
```go
package main

import (
	"laundry-backend/config"
	"laundry-backend/database"
	"laundry-backend/models"
	"laundry-backend/routes"
	"laundry-backend/utils" // Imported for seeding if needed

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
)

func main() {
	// 1. Connect DB
	database.Connect()

	// 2. Auto Migrate
	log.Println("Running Migrations...")
	database.DB.AutoMigrate(&models.User{}, &models.Service{}, &models.Transaction{})
	
	// 3. Seed Data (Optional - Simple check)
	var userCount int64
	database.DB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		hash, _ := utils.HashPassword("admin123")
		database.DB.Create(&models.User{
			Name: "Admin",
			Email: "admin@laundry.com",
			Password: hash,
			Role: "admin",
		})
		log.Println("Seeded Admin User")
	}

	// 4. Init Fiber
	app := fiber.New()
	
	// 5. Middleware
	app.Use(cors.New())

	// 6. Routes
	routes.SetupRoutes(app)

	// 7. Listen
	port := config.Get("SERVER_PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}
```

## 11. Run Application
// turbo
Run the application (which runs migrations on start).
```bash
cd backend
go run cmd/main.go
```