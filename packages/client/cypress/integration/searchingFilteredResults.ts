/// <reference path="../support/index.d.ts" />

import { POKEMON } from '../constants';

const user = cy;

const clickOnSearchReset = () => {
	cy.get('.ant-btn-primary').contains(/reset/i).click();
};

beforeEach(() => {
	cy.visit('/');
});

describe('search for a pokemon in a filtered list', () => {
	it('should find atleast a match', () => {
		user.selectSomeFilters();
		user.searchPokemonByName(POKEMON.grass.name);
		cy.get('.ant-table-row').its('length').should('be.gt', 0);
	});

	it('should find no matches', () => {
		user.searchPokemonByName(POKEMON.water.name);
		cy.get('.ant-table-row').its('length').should('be', 1);
		clickOnSearchReset();
		user.selectSomeFilters();
		user.searchPokemonByName(POKEMON.water.name);
		cy.get('.ant-table-row').should('not.exist');
	});
});
