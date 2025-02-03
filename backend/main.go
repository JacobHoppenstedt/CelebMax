package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

// Copies file from src to dst, creating any necessary folders
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	// Create destination dir if needed
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

func uploadImage(filePath string, url string) (map[string]interface{}, error) {
	// Open the image file
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Create a multipart form
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

	// Send the request to the Python service
	resp, err := http.Post(url, writer.FormDataContentType(), body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Parse the response
	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func main() {
	// Call the Python service with your user image
	result, err := uploadImage("../test/jacobimage.jpg", "http://localhost:5000/predict")
	if err != nil {
		panic(err)
	}
	fmt.Println(result)

	// Extract top_matches
	topMatches, ok := result["top_matches"].([]interface{})
	if !ok {
		fmt.Println("No top_matches found or invalid format")
		return
	}

	// Create a folder for the top matches
	outputDir := "./top_matches"
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Println("Failed to create top_matches folder:", err)
		return
	}

	// Loop over matches and copy images
	for _, item := range topMatches {
		matchMap, ok := item.(map[string]interface{})
		if !ok {
			continue
		}

		// Extract fields
		imgName, _ := matchMap["image"].(string)
		// imgURL, _ := matchMap["image_url"].(string)
		distance, _ := matchMap["distance"].(float64)

		fmt.Printf("Copying match: %s (distance=%.4f)\n", imgName, distance)

		srcPath := filepath.Join("../python-service", "Celebrity_Faces_Dataset", imgName)
		dstPath := filepath.Join(outputDir, imgName)

		// Copy file
		if copyErr := copyFile(srcPath, dstPath); copyErr != nil {
			fmt.Printf("Error copying %s: %v\n", imgName, copyErr)
		} else {
			fmt.Printf("Copied %s -> %s\n", srcPath, dstPath)
		}
	}
}
