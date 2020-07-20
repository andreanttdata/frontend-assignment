describe('start at main page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should show the button', () => {
		cy.findByRole('button', { name: /load more/i }).should('exist');
	});
	it('should show the table', () => {
		cy.findByRole('table').should('exist');
	});
});
