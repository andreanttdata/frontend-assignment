/// <reference path="../support/index.d.ts" />

import { POKEMON } from '../constants';

beforeEach(() => {
	cy.visit('/');
});

describe('search for a specific pokemon by name', () => {
	it('should highlight it', () => {
		cy.searchPokemonByName(POKEMON.grass.name).then((name) => {
			cy.get('mark').should('have.text', name);
		});
	});
	it('should narrow the list of pokemons', () => {
		cy.findAllByRole('row').then(($tr) => {
			const currentAmountOfRows = $tr.length;

			cy.searchPokemonByName(POKEMON.grass.name).then((name) => {
				cy.findAllByRole('row')
					.its('length')
					.should('be.lt', currentAmountOfRows);
				cy.findByRole('button', { name: /reset/i }).click();
				cy.findAllByRole('row').its('length').should('eq', currentAmountOfRows);
			});
		});
	});
});
