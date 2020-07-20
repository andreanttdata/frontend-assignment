import { capitalize } from '../../src/utils/capitalize';

Cypress.Commands.add('selectSomeFilters', () => {
	cy.findByRole('button', { name: 'filter' }).click();
	cy.get('[type="checkbox"]').eq(0).check().should('be.checked');
	cy.get('[type="checkbox"]').eq(1).check().should('be.checked');
	cy.findByRole('button', { name: /ok/i }).click();
	cy.get('.ant-table-row').each(($tr) => {
		cy.get($tr)
			.children()
			.eq(1)
			.contains(/grass|poison/i)
			.should('exist');
	});
	// after this set of instructions we need to get back to the main context
	cy.get('main');
});

Cypress.Commands.add('searchPokemonByName', (pokemon) => {
	cy.findByRole('button', { name: 'search' }).click();
	cy.findByPlaceholderText('Search name')
		.type(pokemon)
		.then(() => capitalize(pokemon));
});
