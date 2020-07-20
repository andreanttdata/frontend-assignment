/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		selectSomeFilters(): Chainable<Element>;
		searchPokemonByName(pokemon: string): Chainable<Element>;
	}
}
