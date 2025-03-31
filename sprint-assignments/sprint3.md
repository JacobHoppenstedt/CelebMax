# Sprint 3 Overview

### 🖥️ Front-End Work Completed

- **Designed the Hairstyle Switcher page on Figma**  
  Created a layout prototype for the hairstyle switcher feature, outlining user flow and visual design. Focus was placed on usability, intuitive navigation, and clearly distinguishing the original and modified image sections.

- **Implemented Hairstyle Switcher page in React**  
  Built the front-end for the switcher using JSX and modular CSS. The page includes two main rounded divs: one for showing the original and modified images, and another for selecting from a list of celebrity hairstyles. Currently using placeholder images, with a pending task to integrate AI-based hairstyle switching via backend API.

- **Improved styling and layout**  
  Fixed CSS issues to better match the Figma design, including padding, spacing, scrollable grids for celebrities, and visual consistency across components. Updated colors to match brand aesthetics and improved responsiveness for different screen sizes.

- **Enhanced Results Page with names from dataset**  
  Since our backend now returns filenames with embedded celebrity names, we parsed and cleaned these filenames to display properly formatted celebrity names under each match. This made the results feel more personalized since you're now able to see the names of the celebrities you've matched with.

- **Added animations with Framer Motion**  
  Introduced smooth fade-ins and transitions on the Landing Page and Results Page to elevate the user experience. Used timed animations to sequentially introduce instructions and images, making the site feel more modern and engaging.

- **Enabled hot-reloading in Docker for frontend development**  
  Created a `Dockerfile.dev` that runs `npm run dev` instead of building static files. Updated `docker-compose.yml` to mount local volumes, allowing live updates without restarting the container. This significantly sped up the front-end development workflow.

- **Created Celebrity Search Page**  
  Implemented a new page that takes a selected celebrity's name and generates a clickable link to a Google Image search. This offers users a quick way to explore more pictures of the celebrity they matched with for styling inspiration.

## Backend Work Completed
- **Go Backend Enhancements**
  Refactored Go services to improve modularity and maintainability Optimized database queries to reduce response times and improve   efficiency.Implemented structured logging for better debugging and monitoring.Improved error handling with detailed responses for various failure cases.

- **Python Service Improvements**
  Refactored Python services for better readability and performance.Optimized data processing functions to handle large imagesmore    efficiently.Enhanced exception handling to prevent crashes and improve reliability.Introduced multi-threading for parallel processing of multiple requests.

- **Integrated Amazon S3 for Image Storage**
  Implemented S3 buckets for storing and managing the large collection of celebrity hairstyle images. This solution ensures better scalability and availability for images used in the application.Set up S3 buckets with appropriate permissions to allow backend access for image uploads and retrieval.Integrated the backend services to directly upload and fetch images from S3 during the image processing workflow.

- **Go Unit Tests**
  Wrote unit tests for sign-in and sign-up functionality.
  Sign-Up Test: Validated that new user registration correctly handles various scenarios, including valid and invalid input (e.g., missing fields, existing usernames).
  Sign-In Test: Ensured that the sign-in process correctly authenticates users, handles incorrect credentials, and checks for empty or invalid inputs.
  Ensured proper handling of edge cases and error conditions in user authentication.
  Increased code coverage to improve the reliability of user-related operations.


- **Python Service Unit Tests**
  Wrote unit tests for data transformation functions and image processing logic.Validated correct handling of input variations and boundary conditions.Improved test execution speed with mock data and caching mechanisms.
  S3 Integration Test: Wrote a unit test that calls the S3 bucket, retrieves the images, and ensures the correct output is returned. This test simulates real-world scenarios where the application fetches images from the cloud and processes them, validating that the connection to S3 works correctly and that data is handled without errors.

## Frontend React Vite Unit Tests and Cypress Tests

_(can be found in `landingpage.test.jsx`, `resultspage.test.jsx`, and `hairstyle_customizer.test.jsx`)_

### **Landing Page:**
- Framer motion fade animation works on celebrity image
- Framer motion fade animation works on line of text

### **Results Page:**
- Framer motion fade animation works on user uploaded picture
- Button labeled "Try A Celebrity's Hairstyle appropriately navigates to Hairstyle Customizer page upon click

### **Hairstle Customizer Page:**
- Logo image appears on the page
- "Go Back" button appropriately navigates back to results page upon click


