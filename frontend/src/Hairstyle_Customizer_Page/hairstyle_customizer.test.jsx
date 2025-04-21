import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HairstyleCustomizerPage from "./hairstyle_customizer";
import { BrowserRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom';
import { vi } from "vitest";
import HairstyleCustomizer from "./hairstyle_customizer";

test('logo appears on hairstyle page', () => {
    // Render the component
    render(
    <BrowserRouter>
        <HairstyleCustomizerPage />
    </BrowserRouter>
    );
  
    // Check if the logo is in document
    const image = screen.getByAltText("Logo");
    expect(image).toBeInTheDocument();
});

test('navigates to the Results page when the back button is clicked', () => {
    // Render the component inside BrowserRouter
    render(
      <BrowserRouter initialEntries={['/']}>
        <HairstyleCustomizerPage />
      </BrowserRouter>
    );
  
    // Find the button by its text
    const button = screen.getByText('Go Back');
  
    // Simulate a click event on the button
    fireEvent.click(button);
  
    // Claim that the URL changed to '/'
    expect(window.location.pathname).toBe('/results');
  });

  test('original text appears', () => {
    // Render the component
    render(
        <BrowserRouter>
            <HairstyleCustomizerPage />
        </BrowserRouter>
        );
  
    //Get the user image by alt text
    const text = screen.getByText('Your Original Picture');
    expect(text).toBeInTheDocument();
  });

  test('arrow between original and modified images is present', () => {
    // Render the component
    render(
        <BrowserRouter>
            <HairstyleCustomizerPage />
        </BrowserRouter>
        );
  
    // Find the image element with alt text
    const imageElement = screen.getByAltText("Arrow")
  
    // Check to see if rendered
    expect(imageElement).toBeInTheDocument;
  
  })

  test('modified hairstyle text appears', () => {
    // Render the component
    render(
        <BrowserRouter>
            <HairstyleCustomizerPage />
        </BrowserRouter>
        );
  
    //Get the user image by alt text
    const text = screen.getByText('Modified Hairstyle');
    expect(text).toBeInTheDocument();
  });

  test('choose celebrity text appears', () => {
    // Render the component
    render(
        <BrowserRouter>
            <HairstyleCustomizerPage />
        </BrowserRouter>
        );
  
    //Get the user image by alt text
    const text = screen.getByText('Choose a Celebrity');
    expect(text).toBeInTheDocument();
  });

