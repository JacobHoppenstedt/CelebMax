package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {
	// 1. Open DB
	db, err := gorm.Open(sqlite.Open("myapp.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	DB = db

	// 2. Auto-migrate model
	DB.AutoMigrate(&User{}, &Favorite{})

	// 3. Setup Gin router
	r := gin.Default()

	// 4. Enable CORS so that the react server can interact with the backend server
	r.Use(cors.Default())

	// Auth routes
	r.POST("/signup", signupHandler)
	r.POST("/signin", signinHandler)

	// Protected routes when we get the frontend to be able to login
	// protected := r.Group("/")
	// protected.Use(authMiddleware)
	// {
	// 	protected.POST("/match", matchHandler)
	// 	// When we get to favorites

	// 	// protected.POST("/favorites", addFavoriteHandler)
	// 	// protected.GET("/favorites", listFavoritesHandler)
	// }
	r.POST("/match", matchHandler)
	fmt.Println("Server is running on http://localhost:8080")
	r.Run(":8080")
}
