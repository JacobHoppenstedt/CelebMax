package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// BASIC user auth for testing, rudimentarily works

// Global map to hold session_token mapping
var sessions = map[string]uint{}

func generateSessionToken(userID uint) string {
	// Unique session token for each user
	return fmt.Sprintf("session_%d_%d", userID, time.Now().UnixNano())
}

// Signup

type SignUpInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Handle new user registration
func signupHandler(c *gin.Context) {
	var input SignUpInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check if user already exists
	var existingUser User
	err := DB.Where("email = ?", input.Email).First(&existingUser).Error
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
		// other error w/ DB
	} else if err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Hash password w/ bcrypt
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := User{
		Email:        input.Email,
		PasswordHash: string(hash),
	}
	if err := DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Signup success", "user_id": user.ID})
}

// Signin

type SignInInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Verifies correct email and password of user
func signinHandler(c *gin.Context) {
	var input SignInInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	// Look up the user by email
	var user User
	if err := DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	// Compare the provided password with the stored bcrypt hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}
	// Generate session token for user
	sessionToken := generateSessionToken(user.ID)

	// Set a cookie that expires in 1 hour (localhost testing)
	c.SetCookie("session_token", sessionToken, 3600, "/", "localhost", false, true)
	sessions[sessionToken] = user.ID

	c.JSON(http.StatusOK, gin.H{"message": "Signin success", "user_id": user.ID})
}

// Checks whether incoming request has valid session cookie

func authMiddleware(c *gin.Context) {
	// Retrieve session token
	sessionToken, err := c.Cookie("session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No session token"})
		c.Abort()
		return
	}
	// Check if this token has match in sessions map
	userID, ok := sessions[sessionToken]
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session token"})
		c.Abort()
		return
	}
	// sets userID for future handling and moves to next
	c.Set("userID", userID)
	c.Next()
}
