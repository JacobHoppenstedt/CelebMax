import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResultsPage from "./resultspage";
import { BrowserRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom';
import { it, vi } from "vitest";

test('navigates to the Landing page when the back button is clicked', () => {
    // Render the component inside BrowserRouter
    render(
      <BrowserRouter initialEntries={['/']}>
        <ResultsPage />
      </BrowserRouter>
    );
  
    // Find the button by its text
    const button = screen.getByText('Go Back');
  
    // Simulate a click event on the button
    fireEvent.click(button);
  
    // Claim that the URL changed to '/'
    expect(window.location.pathname).toBe('/');
  });

  test('logo appears on results page', () => {
    // Render the component
    render(
    <BrowserRouter>
        <ResultsPage />
    </BrowserRouter>
    );
  
    // Check if the logo is in document
    const image = screen.getByAltText('Logo');
    expect(image).toBeInTheDocument();
});

test('it applies Framer Motion animation to the image', async () => {
  // Render the component
  render(
      <BrowserRouter>
          <ResultsPage />
      </BrowserRouter>
      );

  // Find the image element
  const imageElement = screen.getByAltText(/Your Picture/i)

  // Initially check that the opacity is 0
  expect(imageElement).toHaveStyle('opacity: 0')

  // Wait for the animation to finish (checking opacity change to 1)
  await waitFor(() => expect(imageElement).toHaveStyle('opacity: 1'), { timeout: 3000 })

})

test('navigates to the Hairstyle Customizer page when the back button is clicked', () => {
  // Render the component inside BrowserRouter
  render(
    <BrowserRouter initialEntries={['/']}>
      <ResultsPage />
    </BrowserRouter>
  );

  // Find the button by its text
  const button = screen.getByText("Try A Celebrity's Hairstyle");

  // Simulate a click event on the button
  fireEvent.click(button);

  // Claim that the URL changed to '/'
  expect(window.location.pathname).toBe('/hairstyle_customizer');
});

test('renders the user image with correct alt text', () => {
  // Render the component
  render(
      <BrowserRouter>
          <ResultsPage />
      </BrowserRouter>
      );

  //Get the user image by alt text
  const image = screen.getByAltText('Your Picture');

  //See if image is in results page
  expect(image).toBeInTheDocument();
});

test('displays the subheading1 text', () => {
  // Render the component
  render(
      <BrowserRouter>
          <ResultsPage />
      </BrowserRouter>
      );

  //Gets the subheading component by text
  const subheading1 = screen.getByText('Your Picture');

  //See if subheading text is in results page
  expect(subheading1).toBeInTheDocument();
});

test('displays the subheading2 text', () => {
  // Render the component
  render(
      <BrowserRouter>
          <ResultsPage />
      </BrowserRouter>
      );

  //Gets the subheading component by text
  const subheading2 = screen.getByText('Matched Celebrities');

  //See if subheading text is in results page
  expect(subheading2).toBeInTheDocument();
});

test('checks if the right arrow button for carousel is present', () => {
  //Render the component
  render(
    <BrowserRouter>
        <ResultsPage />
    </BrowserRouter>
    );

  // Query by the alt text of the image inside the button
  const button = screen.getByAltText('Right arrow');

  // Verify that the button with the alt text is in the document
  expect(button).toBeInTheDocument();
});