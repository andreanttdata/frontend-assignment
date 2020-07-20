beforeEach(() => {
	cy.visit('/');
});

describe('start at main page', () => {
	it('has pagination', () => {
		cy.findByTitle('4').contains('4').should('exist');
	});
	it('has a usable pagination', () => {
		cy.findAllByRole('cell')
			.first()
			.then(($td) => {
				const firstTableDataCell = $td.text();
				cy.findByTitle('4')
					.contains('4')
					.click()
					.then(() => {
						cy.get(firstTableDataCell).should('not.exist');
					});
			});
	});
});

describe('after load more button is clicked', () => {
	it('should show a success message', () => {
		cy.findByRole('button', { name: /load more/i }).click();
		cy.get('.ant-message').should('exist');
	});

	it('should show more pagination links', () => {
		cy.findAllByRole('listitem').then(($listItems) => {
			const currentAmountOfPaginationLinks = $listItems.length;

			cy.findByRole('button', { name: /load more/i })
				.click()
				.then(() => {
					cy.findAllByRole('listitem').then(($updatedListItems) => {
						cy.get($updatedListItems)
							.its('length')
							.should('be.gt', currentAmountOfPaginationLinks);
					});
				});
		});
	});
});

describe('after load more button is clicked multiple times', () => {
	it('should be disabled', () => {
		cy.findByRole('button', { name: /load more/i })
			.click()
			.click()
			.click()
			.should('be.disabled');
	});
});
