package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMatchHandler_Success(t *testing.T) {
	// Create a mock Python microservice that returns a JSON response
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"top_matches":[{"image":"celeb1.jpg","distance":0.12}]}`))
	}))
	defer mockServer.Close()

	pythonServiceURL = mockServer.URL

	db := setupTestDB(t)
	DB = db

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/match", matchHandler)

	// Create a form-data request with a dummy "image" file
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", "test.jpg")
	assert.NoError(t, err)
	_, err = part.Write([]byte("fake image bytes"))
	assert.NoError(t, err)
	writer.Close()

	req, _ := http.NewRequest("POST", "/match", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	respBody, _ := io.ReadAll(w.Body)
	assert.Contains(t, string(respBody), "top_matches")

	// Verify that the temp file used in matchHandler is removed
	_, err = os.Stat("./temp_upload.jpg")
	assert.True(t, os.IsNotExist(err), "temp_upload.jpg should be removed after processing")
}

func TestMatchHandler_NoFile(t *testing.T) {
	db := setupTestDB(t)
	DB = db

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/match", matchHandler)

	req, _ := http.NewRequest("POST", "/match", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "No image file provided")
}

func TestUploadImage_Success(t *testing.T) {
	// Create a mock server for the Python service call
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"mock_key": "mock_value"}`))
	}))
	defer mockServer.Close()

	// Create a temporary file to simulate an image
	tempFileName := "test_upload_image.jpg"
	os.WriteFile(tempFileName, []byte("fake image bytes"), 0644)
	defer os.Remove(tempFileName)

	result, err := uploadImage(tempFileName, mockServer.URL)
	assert.NoError(t, err)
	assert.Equal(t, "mock_value", result["mock_key"])
}

func TestUploadImage_FileNotFound(t *testing.T) {
	_, err := uploadImage("nonexistent_file.jpg", "http://example.com")
	assert.Error(t, err)
}
