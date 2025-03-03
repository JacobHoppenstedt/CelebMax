# Sprint 2 Overview

## Frontend Work Completed

### Implemented Image Cropping Modal
- We integrated a crop modal using `react-easy-crop`, allowing users to crop their image before submission. This ensures that the AI processes a clear, properly framed image, leading to more accurate celebrity matches. The cropping feature is particularly important for our upcoming hairstyle swapping feature, where a well-cropped image will improve the quality of the transformation.

### Added a Loading Screen for Better UX
- To enhance user feedback and engagement, we introduced a loading overlay after the user clicks "Save" on the crop modal. This prevents users from being left uncertain about the app's status while the image is sent to the backend. To avoid unnecessary flickering, we implemented a short delay before displaying the loader, ensuring it only appears when the processing time is noticeable.

### Improved Page Layout
- The Landing Page was adjusted to match the Figma design, improving the structure, alignment, and visual clarity of elements. We focused on better spacing, font sizes, and button positioning, creating a cleaner and more polished interface that aligns with the user experience goals.

### Implemented Toast Error Messages
- Using `react-toastify`, we improved error handling by displaying clear and immediate feedback when users upload an invalid image. Based on real-time validation from the backend, we now provide specific error messages:
    - **No face detected**: Prompt to retry with a clearer image.
    - **Multiple faces detected**: Request for a single-person image.
    - **Processing failure**: General error message.

### Integrated Frontend with Backend
- We successfully connected the frontend to the Flask backend, allowing the app to send cropped user images to the `/match` endpoint. The backend processes the image, runs facial recognition and similarity analysis, and returns matched celebrity data. If the response contains errors, the user is shown an immediate toast notification. Otherwise, they are redirected to the Results Page, where they can see their top celebrity matches with confidence scores.

---

## Backend Work Completed

### Docker
- Completed CGO-enabled Docker build for Go so SQLite works.
- Coordinated Docker Compose to start both the Go backend, Python service, and frontend.

### Auth & DB
- Implemented `signup` and `signin` in Go, storing user credentials in `myapp.db`.

### Face Matching
- Implemented `/predict` in Python with `insightface` and `clustered_embeddings.npy`.

### Model Research and Selection
- Conducted an extensive review of various AI-based hairstyle modification models.
- Identified **HairFastGAN** as a suitable model and explored its API for integration.

### API Integration
- Began code to call `fal.ai/hair-fast-gan`, tested locally, pending full route integration of HairFastGAN API.
- Tested API calls to ensure image processing works as expected.

### Evaluation of Alternative Models
- Researched the **Barbershop model** as another potential option for hairstyle modifications.
- Analyzed the model’s capabilities and its feasibility for integration in future sprints.

---

## Go Unit Tests

### **POST /signup**
#### Request Body (JSON):
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```
#### Response:
```json
{
  "message": "Signup success",
  "user_id": 1
}
```
Errors:
- `400` (User exists / invalid data)
- `500` (DB error)

### **POST /signin**
#### Request Body (JSON):
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```
#### Response:
```json
{
  "message": "Signin success",
  "user_id": 1
}
```
Errors:
- `401` (Invalid credentials)
- `500` (DB error)

_(Planned)_ `/favorites` or `/match` behind authentication, but not fully implemented in this sprint.

---

## Python-Service Unit Tests

### **TestPredictNoImage**
- **Scenario**: Send a `POST /predict` with no image field. Expect `400` error.

### **TestPredictFace**
- **Scenario**: Provide a valid face image. Confirm `top matches` array has `length > 0`.

---

## Frontend React Vite Unit Tests and Cypress Tests

_(can be found in `landingpage.test.jsx`, `resultspage.test.jsx`, and `landingpage.cy.js`)_

### **Landing Page:**
- Open File Dialog is called when “Upload Photo” button is clicked.
- File explorer opens after “Upload Photo” button is clicked.
- Application logo appears on the landing page.
- Landing page images are horizontally aligned.

### **Results Page:**
- “Go Back” button on results page navigates back to the landing page of the application.
- Application logo appears on results page.

### **Cypress Test:**
- Simple test to ensure that the “Upload Photo” button component is visible on the landing page.
