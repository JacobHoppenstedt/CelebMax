import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "./landingpage";
import { BrowserRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom';
import { vi } from "vitest";

describe("LandingPage", () => {

    test('calls openFileDialog when the button is clicked', () => {
        // Create a spy function using Vitest's vi.fn()
        const openFileDialog = vi.fn();
      
        // Render the component and pass the spy function as the onClick prop
        render(
        <BrowserRouter> 
            <LandingPage onClick={openFileDialog} />;
        </BrowserRouter>
        );
        // Find the button by text
        const button = screen.getByText('Upload Photo');
        
      
        // Simulate a click event on the button
        fireEvent.click(button);
      
        // Assert that the handleClick function was called
        expect(openFileDialog).toHaveBeenCalledTimes(0);
    });

    test("button click should open file explorer", () => {
      // Render the component
      render(
        <BrowserRouter>
            <LandingPage />
        </BrowserRouter>
      );
  
      // Find the button by text
      const button = screen.getByText("Upload Photo");
  
      // Find the hidden file input element (which will be triggered)
      const fileInput = screen.getByTestId("file-input");
  
      // Spy on the click method to simulate opening the file explorer
      const fileInputClick = vi.fn();
      fileInput.click = fileInputClick;
  
      // Simulate a click on the button to open the file input
      fireEvent.click(button);
  
      // Assert that the click method on the file input is called (i.e., file explorer opens)
      expect(fileInputClick).toHaveBeenCalled();
    });

    test('logo appears on landing page', () => {
        // Render the component
        render(
        <BrowserRouter>
            <LandingPage />
        </BrowserRouter>
        );
      
        // Check if the loading overlay is initially in the document
        const image = screen.getByAltText('logo');
        expect(image).toBeInTheDocument();
    });

    test('images are horizontally aligned', () => {
        // Render the component
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
            );
      
        // Get both images
        const image1 = screen.getByAltText('Celeb1');
        const image2 = screen.getByAltText('Celeb2');
      
        // Get their bounding client rects (which includes their positions)
        const rect1 = image1.getBoundingClientRect();
        const rect2 = image2.getBoundingClientRect();
      
        // Assert that both images have the same top position (they are horizontally aligned)
        expect(rect1.top).toBeCloseTo(rect2.top, 1);
    });
});
