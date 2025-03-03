describe('Upload Button Existence Test', () => {
  it('should have a button with the text "Upload Photo"', () => {
    // Visit the page where the component is rendered
    cy.visit('/');

    // Check if the button with the text "Upload Photo" exists
    cy.contains('button', 'Upload Photo').should('exist');

    // Alternative with data-testid
    cy.get('[data-testid="file-input"]').should('exist');
  });
});
