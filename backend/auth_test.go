package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setup an in-memory db for testing
func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open in-memory DB: %v", err)
	}
	// Migrate models so that the DB schema is created.
	if err := db.AutoMigrate(&User{}, &Favorite{}); err != nil {
		t.Fatalf("failed to migrate: %v", err)
	}
	return db
}

// create a Gin router with our auth routes and a protected route for testing the middleware
func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/signup", signupHandler)
	r.POST("/signin", signinHandler)

	// protected route for testing AuthMiddleware
	protected := r.Group("/protected")
	protected.Use(authMiddleware)
	{
		protected.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Protected content"})
		})
	}
	return r
}

// struct to JSON
func toJSON(t *testing.T, v interface{}) []byte {
	b, err := json.Marshal(v)
	if err != nil {
		t.Fatalf("failed to marshal JSON: %v", err)
	}
	return b
}

func TestSignupHandler_Success(t *testing.T) {
	db := setupTestDB(t)
	DB = db
	router := setupRouter()

	// Prepare request body for signup
	reqBody := SignUpInput{
		Email:    "test@example.com",
		Password: "password123",
	}
	body := bytes.NewBuffer(toJSON(t, reqBody))
	req, _ := http.NewRequest("POST", "/signup", body)
	req.Header.Set("Content-Type", "application/json")

	// Record the response
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Verify that the response is as expected
	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.Equal(t, "Signup success", resp["message"])
	assert.NotNil(t, resp["user_id"])
}

func TestSignupHandler_UserAlreadyExists(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	// Create an existing user directly
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	existingUser := User{
		Email:        "test@example.com",
		PasswordHash: string(hash),
	}
	DB.Create(&existingUser)

	router := setupRouter()

	reqBody := SignUpInput{
		Email:    "test@example.com",
		Password: "anotherpassword",
	}
	body := bytes.NewBuffer(toJSON(t, reqBody))
	req, _ := http.NewRequest("POST", "/signup", body)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "User already exists", resp["error"])
}

func TestSigninHandler_Success(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	// Create a user to sign in
	password := "password123"
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	user := User{
		Email:        "signin@example.com",
		PasswordHash: string(hash),
	}
	DB.Create(&user)

	router := setupRouter()

	reqBody := SignInInput{
		Email:    "signin@example.com",
		Password: password,
	}
	body := bytes.NewBuffer(toJSON(t, reqBody))
	req, _ := http.NewRequest("POST", "/signin", body)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Signin success", resp["message"])
	assert.NotNil(t, resp["user_id"])

	// Verify that a session cookie was set
	cookie := w.Header().Get("Set-Cookie")
	assert.Contains(t, cookie, "session_token=")
}

func TestSigninHandler_IncorrectPassword(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	// Create a user with a known password
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	user := User{
		Email:        "wrongpass@example.com",
		PasswordHash: string(hash),
	}
	DB.Create(&user)

	router := setupRouter()

	reqBody := SignInInput{
		Email:    "wrongpass@example.com",
		Password: "incorrectpassword",
	}
	body := bytes.NewBuffer(toJSON(t, reqBody))
	req, _ := http.NewRequest("POST", "/signin", body)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Incorrect password", resp["error"])
}

func TestSigninHandler_UserNotFound(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	router := setupRouter()

	reqBody := SignInInput{
		Email:    "nonexistent@example.com",
		Password: "anyPassword",
	}
	body := bytes.NewBuffer(toJSON(t, reqBody))
	req, _ := http.NewRequest("POST", "/signin", body)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "User not found", resp["error"])
}

func TestAuthMiddleware_Success(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	// Create a user and sign in to obtain a session cookie
	password := "password123"
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	user := User{
		Email:        "auth@example.com",
		PasswordHash: string(hash),
	}
	DB.Create(&user)

	router := setupRouter()

	reqBody := SignInInput{
		Email:    "auth@example.com",
		Password: password,
	}
	body := bytes.NewBuffer(toJSON(t, reqBody))
	req, _ := http.NewRequest("POST", "/signin", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	cookie := w.Header().Get("Set-Cookie")
	assert.Contains(t, cookie, "session_token=")

	// attempt to access the protected endpoint
	reqProtected, _ := http.NewRequest("GET", "/protected", nil)
	reqProtected.Header.Set("Cookie", cookie)
	w2 := httptest.NewRecorder()
	router.ServeHTTP(w2, reqProtected)
	assert.Equal(t, http.StatusOK, w2.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w2.Body.Bytes(), &resp)
	assert.Equal(t, "Protected content", resp["message"])
}

func TestAuthMiddleware_NoSessionToken(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	router := setupRouter()

	req, _ := http.NewRequest("GET", "/protected", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "No session token", resp["error"])
}

func TestAuthMiddleware_InvalidSessionToken(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	router := setupRouter()

	req, _ := http.NewRequest("GET", "/protected", nil)
	req.Header.Set("Cookie", "session_token=invalidtoken")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var resp map[string]interface{}
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Invalid session token", resp["error"])
}
