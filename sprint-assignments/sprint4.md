# Sprint 4 Overview

## Front-End Work Completed

- **Added carousel to the Results Page and refined CSS styling**  
  Built a paginated carousel for matched celebrities using React state, Framer Motion’s `AnimatePresence`, and custom slide variants. Updated `resultspage.module.css` to fine‑tune card sizing, arrow button positioning, and responsive gaps so that all divs fit together seamlessly.

- **Integrated the AI hairstyle service into the Hairstyle Customizer**  
  Connected `hairstyle_customizer.jsx` to the `/generate-hairstyle` backend endpoint with a `fetch` call inside `useEffect`, sending the user’s and celeb’s image URLs and handling JSON responses. Enhanced the module’s CSS (`hairstyle_customizer.module.css`) to bring the layout fully in line with the Figma spec, including padding, borders, and typography tweaks.

- **Streamlined celebrity search by making names directly clickable**  
  Removed the separate Celebrity Search page and refactored the Results Page so each celebrity name is now an `<a>` that opens a Google Images search in a new tab. This simplifies routing, reduces component count, and gives users immediate visual inspiration without extra navigation.

- **Added a loading spinner and user‑feedback states in the Customizer**  
  Introduced a CSS spinner component and conditional render blocks in `hairstyle_customizer.jsx` that show “Generating…” while the AI model runs, display an error message on failure, and render the final hairstyle image once ready. This gives clear progress feedback and improves perceived performance.


## Back-End Work Completed

- **Developed the `/generate-hairstyle` endpoint for AI integration**  
  Built a new Flask route to receive POST requests from the front end containing user and celebrity image URLs. The endpoint processes inputs, calls the AI model to generate a customized hairstyle, and returns a URL or base64-encoded image in a structured JSON response.

- **Removed outdated clustering logic for improved performance**  
  Deprecated and cleaned up the previous celebrity clustering code that grouped similar faces. This simplification reduced backend processing time, cut unnecessary dependencies, and aligned the system more closely with the updated front-end flow.

- **Implemented error handling and response validation**  
  Added robust try/except blocks around the AI model invocation to catch timeouts, missing parameters, and generation failures. Sent descriptive error messages and status codes back to the client to support frontend feedback states like spinners or error messages.

- **Optimized image handling and caching**  
  Used Pillow and temporary file storage to preprocess and cache images on the server, reducing redundant computation and speeding up repeated requests. Added logic to delete stale files and manage disk usage.


## Front-End Unit Tests and Cypress Test

_(can be found in `landingpage.test.jsx`, `resultspage.test.jsx`, `hairstyle_customizer.test.jsx`, and `landingpage.cy.js`)_

**Landing Page:**
- Open File Dialog is called when “Upload Photo” button is clicked.
- File explorer opens after “Upload Photo” button is clicked.
- Application logo appears on the landing page.
- Landing page images are horizontally aligned.
- Framer motion fade animation works on celebrity image
- Framer motion fade animation works on line of text
- Rendering of Celeb 1 image on screen
- Rendering of Celeb 2 image on screen
- Rendering of Celeb 3 image on screen
- Rendering of Celeb 4 image on screen
- Subheading text is visible on screen
- Rule 1 text is visible on screen

**Results Page:**
- “Go Back” button on results page navigates back to the landing page of the application.
- Application logo appears on results page.
- Framer motion fade animation works on user uploaded picture
- Button labeled "Try A Celebrity's Hairstyle appropriately navigates to Hairstyle Customizer page upon click
- Correct user image appears on results screen
- Subheading 1 text for user picture appears on screen
- Subheading 2 text for matched celebrities appears on screen
- Right arrow button for carousel functionality is present on screen

**Hairstle Customizer Page:**
- Logo image appears on the page
- "Go Back" button appropriately navigates back to results page upon click
- Original picture section text appears on screen
- Arrow from original to modified is present on screen
- Modified picture section text appears on screen
- Celebrity choosing section text is visible on screen

**Cypress Test:**
- Simple test to ensure that the “Upload Photo” button component is visible on the landing page.



## Back-End Unit Tests and Integration Tests


**`/generate-hairstyle` Endpoint:**
- Successfully returns a 200 status code when valid user and celebrity image URLs are provided.
- Returns a valid JSON response containing the generated image or result URL.
- Returns a 400 status code with appropriate error message when required parameters are missing.
- Returns a 500 status code when the AI model fails to generate an image.
- Handles timeouts and server-side exceptions gracefully with descriptive error responses.
- Validates incoming data to prevent malformed payloads.

**Image Processing Utilities (`utils.py`):**
- Correctly preprocesses input images (resize, format conversion).
- Generates temporary files and deletes them after processing.
- Validates image URL accessibility before downloading.

