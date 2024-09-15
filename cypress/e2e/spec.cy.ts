describe('CRUD Application Tests', () => {
  const baseUrl = 'http://localhost:8080/'; // Replace with your actual URL if different

  beforeEach(() => {
      cy.visit(baseUrl); // Visit the application before each test
  });

  it('should display the form and table', () => {
      // Check if the form and table are present
      cy.get('form#itemForm').should('be.visible');
      cy.get('table#itemTable').should('be.visible');
  });

  it('should add an item', () => {
      // Add a new item
      cy.get('#itemName').type('Test Item');
      cy.get('#itemDescription').type('This is a test item');
      cy.get('button[type="submit"]').click();

      // Verify the item appears in the table
      cy.get('table#itemTable tbody').contains('tr', 'Test Item').should('be.visible');
      cy.get('table#itemTable tbody').contains('tr', 'This is a test item').should('be.visible');
  });

  it('should delete an item', () => {
      // First, add an item to delete
      cy.get('#itemName').type('Item to Delete');
      cy.get('#itemDescription').type('This item will be deleted');
      cy.get('button[type="submit"]').click();

      // Ensure the item was added
      cy.get('table#itemTable tbody').contains('tr', 'Item to Delete').should('be.visible');

      // Click the delete button for the item
      cy.get('table#itemTable tbody').contains('tr', 'Item to Delete')
          .find('button')
          .contains('Delete')
          .click();

      // Verify the item has been removed from the table
      cy.get('table#itemTable tbody').contains('tr', 'Item to Delete').should('not.exist');
  });
});
  