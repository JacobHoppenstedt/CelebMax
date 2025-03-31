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

## Go Unit Tests

## Python Service Unit Tests
