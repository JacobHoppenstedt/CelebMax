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

## Front-End Unit Tests

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