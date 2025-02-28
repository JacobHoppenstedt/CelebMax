package main

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// Global function to copy files
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}

// // The user uploads an image, call the Python microservice, then copy top matches
// func matchHandler(c *gin.Context) {
// 	file, err := c.FormFile("image")
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "No image file provided"})
// 		return
// 	}

// 	// Save temporarily
// 	tempPath := "./temp_upload.jpg"
// 	if err := c.SaveUploadedFile(file, tempPath); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save temp file"})
// 		return
// 	}
// 	defer os.Remove(tempPath) // Clean up

// 	// Now call python microservice
// 	result, err := uploadImage(tempPath, "http://localhost:5000/predict")
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Call to python service failed", "details": err.Error()})
// 		return
// 	}

// 	topMatches, ok := result["top_matches"].([]interface{})
// 	if !ok {
// 		c.JSON(http.StatusOK, gin.H{"message": "No top_matches found or invalid format", "result": result})
// 		return
// 	}

// 	// Create a folder for the top matches
// 	outputDir := "./top_matches"
// 	if err := os.MkdirAll(outputDir, 0755); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create top_matches folder"})
// 		return
// 	}

// 	// Copy images
// 	copiedFiles := []string{}
// 	for _, item := range topMatches {
// 		matchMap, ok := item.(map[string]interface{})
// 		if !ok {
// 			continue
// 		}
// 		imgName, _ := matchMap["image"].(string)
// 		distance, _ := matchMap["distance"].(float64)

// 		fmt.Printf("Copying match: %s (distance=%.4f)\n", imgName, distance)

// 		srcPath := filepath.Join("../python-service", "Celebrity_Faces_Dataset", imgName)
// 		dstPath := filepath.Join(outputDir, imgName)

// 		if copyErr := copyFile(srcPath, dstPath); copyErr != nil {
// 			fmt.Printf("Error copying %s: %v\n", imgName, copyErr)
// 		} else {
// 			copiedFiles = append(copiedFiles, imgName)
// 		}
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"message":      "Match success",
// 		"copied_files": copiedFiles,
// 	})
// }

func matchHandler(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image file provided"})
		return
	}

	// Save file temporarily
	tempPath := "./temp_upload.jpg"
	if err := c.SaveUploadedFile(file, tempPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save temp file"})
		return
	}
	defer os.Remove(tempPath)

	// Call Python microservice
	result, err := uploadImage(tempPath, pythonServiceURL+"/predict")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Call to python service failed",
			"details": err.Error(),
		})
		return
	}

	// Rreturns the full "result"
	c.JSON(http.StatusOK, result)
}

// uploadImage calls the Python service
func uploadImage(filePath string, url string) (map[string]interface{}, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", filePath)
	if err != nil {
		return nil, err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return nil, err
	}
	writer.Close()

	resp, err := http.Post(url, writer.FormDataContentType(), body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result, nil
}
