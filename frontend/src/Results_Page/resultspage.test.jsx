import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
  
    // Find the button by its text content
    const button = screen.getByText('Go Back');
  
    // Simulate a click event on the button
    fireEvent.click(button);
  
    // Assert that the URL changed to '/'
    expect(window.location.pathname).toBe('/');
  });

  test('logo appears on results page', () => {
    // Render the component
    render(
    <BrowserRouter>
        <ResultsPage />
    </BrowserRouter>
    );
  
    // Check if the logo is in the document
    const image = screen.getByAltText('Logo');
    expect(image).toBeInTheDocument();
});