describe('Start at main page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should show the button', () => {
		cy.findByText(/load more/i).should('exist');
	});
	it('should show the table', () => {
		cy.findByTestId('table').should('exist');
	});
});
