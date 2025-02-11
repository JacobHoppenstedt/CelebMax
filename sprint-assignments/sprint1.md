# CelebMax Sprint 1

## User Stories
- As a user who is interested in seeing which celebrities match up with their face for fun, I want to be able to add a picture of myself and then get given celebrities that match my face.
- As a user, I would like a user-friendly landing page that gives a clear description on what the website does and the type of picture to upload (i.e full body shot or headshot/filetype) to find celebrity look-alikes.
- As a user who is looking for a new style, I want the system to identify which celebrity I resemble, so that I can discover hairstyle and fashion ideas.
- As a user, I want to be able to sign in and be able to save my favorite hairstyles and outfits to review them later.
- As a user, I want to be able to find out the brand/buy link of the outfit that my look alike celebrities are wearing and the specific hairstyle.

## Issues Planned

### Select a face recognition model (Back-End)
**Issue:** Deciding on an accurate and feasible face recognition library  
**User Story Match:** “As a developer, I need a reliable model to identify celebrity lookalikes, so that users receive accurate matches.”  
**Solution:**
- Research popular libraries like DeepFace
- Integrate model on Kaggle
- Choose model with highest accuracy and recognition

### Designing a User-Friendly Landing Page and Results Page using Figma (Front-End)
**Issue:** Creating clear, appealing interface designs and user flows before coding.  
**User Story Match:** “As a user, I want an intuitive landing page that explains the process and a results page that’s easy to interpret.”  
**Solution:**
- Use Figma to wireframe layouts for both the landing and results pages and implement it
- Gather feedback from the team and iterate as needed.

### Implementing the Landing Page in React (Front-End)
**Issue:** Implementing the landing page to ensure clarity in the UI and alignment with the Figma design.  
**User Story Match:** "As a user, I would like a user-friendly landing page that gives a clear description on what the website does and the type of picture to upload (i.e., full body shot or headshot/filetype) to find celebrity look-alikes."  
**Solution:**
- Match Figma Design in React
- Create Clear Instructions
- Responsive Design
- Interactive Elements

### Implementing the Results Page in React (Front-End)
**Issue:** The results page is a critical component that displays the output of the face recognition AI. It should dynamically show matched celebrity profiles along with relatedness data (e.g., similarity percentage).  
**User Story Match:** "As a user, I want to be able to find out the brand/buy link of the outfit that my look-alike celebrities are wearing and the specific hairstyle."  
**Solution:**
- Use React to match the Figma design for the results page layout.
- Implement dynamic functionality for core features (e.g., displaying matched celebrity images and relatedness).
- Incorporate responsive design to make the results page accessible on different devices.

### Integrating a Python-based model into a GoLang backend for seamless celebrity look-alike matching (Back-End)
**Issue:** Integrating a Python-based model into a GoLang backend for seamless celebrity look-alike matching.  
**User Story:** "As a developer, I want to integrate the Python model into the GoLang backend to provide users with accurate and efficient results."  
**Solution:**
- Host the Python model as a microservice using Flask or FastAPI.
- Ensure asynchronous communication for better performance.

### Favorites System (Front-End)
**Issue:** The user should be able to favorite outfits and hairstyles they find interest in and save them for later viewing.  
**User Story Match:** “As a user, I want to be able to sign in and be able to save my favorite hairstyles and outfits to review them later.”  
**Solution:**
- When users are logged into their account, the application should give them the option to favorite an outfit/hairstyle image.
- There should also be a favorites page with all the images the user has favored.

### Building the Upload Photo Component With Proper Validation and Toast Messages (Front-End)
**Issue:** We need a robust upload component that validates image file type and size, providing immediate feedback to the user via toast messages.  
**User Story Match:** “As a user who is interested in seeing which celebrities match up with their face for fun, I want to be able to add a picture of myself and then get given celebrities that match my face.”  
**Solution:**
- Implement a drag-and-drop or file upload field in React.
- Validate JPG/PNG file types and size.
- Use toast messages to inform users of successful uploads or validation errors.
- Pass validated images to the backend for further processing.

### Displaying Matched Celebrity Data on Results Page (Front-End)
**Issue:** Integrating a Python-based face recognition model into a GoLang backend so the React front end can seamlessly display celebrity look-alike information, including similarity scores and style details.  
**User Story Match:**
- “As a user who is looking for a new style, I want the system to identify which celebrity I resemble, so that I can discover hairstyle and fashion ideas.”
- “As a user, I want to be able to find out the brand/buy link of the outfit my look-alike celebrities are wearing and the specific hairstyle.”  
**Solution:**
- Create a GoLang API endpoint to handle image uploads and validation.
- Call the Python model for face recognition, returning a standardized JSON with celebrity matches.
- Display celebrity images, similarity scores, and style info on the React results page in a responsive layout, matching the Figma design.

### User Account Functionality (Back-End)
**Issue:** Enabling sign-up, sign-in, and session management for each user.  
**User Story Match:** “As a user, I want to securely create an account so I can save my favorites and return later.”  
**Solution:**
- Implement sign-up/sign-in endpoints in Go with password hashing.
- Use sessions for authentication; store user’s login state in cookies or local storage.

### Database schema (Back-End)
**Issue:** Designing tables for users, favorites, possible celebrity embeddings and style/outfit data.  
**User Story Match:** “As a user, I need my data (account info, favorites) stored reliably so it’s always accessible.”  
**Solution:**
- Form database relationships
- Use SQLite database to formulate approach

### Designing the Hairstyles/Outfits Recommendation Page (Front-End)
**Issue:** We need a dedicated page layout that showcases recommended hairstyles and outfits based on matched celebrities, with links to brands and buying options.  
**User Story Match:** “As a user who wants new style ideas, I want to explore recommended hairstyles and outfits from my matched celebrities so that I can replicate their looks.”  
**Solution**
- Use Figma to wireframe a dedicated recommendation page.
- Include sections for hairstyle inspirations, outfits, and links to purchase or learn more.
- Ensure responsive design and clear labeling of brand/buy links.

### Implementing the Hairstyles/Outfits Recommendation Page in React (Front-End)
**Issue:** We must translate the Figma design for hairstyles/outfits recommendations into a functional React page, pulling dynamic data from the backend.  
**User Story Match:**
- “As a user, I want a user-friendly interface to view and interact with hairstyle/outfit recommendations, so I can easily find new looks to try.”
- "As a user, I want to be able to find out the brand/buy link of the outfit that my look alike celebrities are wearing and the specific hairstyle."  
**Solution:**
- Create React components for displaying hairstyle/outfit cards, with brand/buy links.
- Fetch and render recommendation data from the backend via an API endpoint.
- Add responsive styling and error handling for a smooth user experience.

### Implementation of model and logic (Back-End)
**Issue:** Finding the top 10 celebrity matches for a user’s uploaded photo.  
**User Story:** "As a user, I want to upload my photo and see a ranked list of the top 10 celebrity look-alikes."  
**Solution:**
- **Model:** Use a pre-trained model (e.g., FaceNet) to extract facial embeddings and compare them with a database of celebrity embeddings using cosine similarity.
- **Logic:** Rank celebrities by similarity score and return the top 10 matches.

## Issues Successfully Completed
- Select a face recognition model (Back-End)
- Designing a User-Friendly Landing Page and Results Page using Figma (Front-End)
- Implementing the Landing Page in React (Front-End)
- Implementing the Results Page in React (Front-End)
- Integrating a Python-based model into a GoLang backend for seamless celebrity look-alike matching (Back-End)
- Implementation of model and logic (Back-End)

## Issues Not Completed
Due to our limited capacity in Sprint 1, all of the below incomplete issues will be carried over and completed in future sprints:
- Database schema (Back-End)
- User Account Functionality (Back-End)
- Displaying Matched Celebrity Data on Results Page (Front-End)
- Building the Upload Photo Component With Proper Validation and Toast Messages (Front-End)
- Favorites System (Front-End)
- Implementing the Hairstyles/Outfits Recommendation Page in React (Front-End)
- Designing the Hairstyles/Outfits Recommendation Page (Front-End)
