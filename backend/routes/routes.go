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
	auth.Post("/change-password", middleware.Protected(), handlers.ChangePassword)

	// Services (Protected)
	// service := api.Group("/services", middleware.Protected())
	// service.Get("/", handlers.GetAllServices)
}
