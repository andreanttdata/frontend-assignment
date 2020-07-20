/// <reference path="../support/index.d.ts" />

const user = cy;

const clickOnReset = () => {
	cy.get('.ant-btn-link').contains(/reset/i).click();
};

describe('start at main page', () => {
	beforeEach(() => {
		user.visit('/');
	});

	it('should filter by selected pokemon types', () => {
		user.selectSomeFilters();
	});

	it('should reset the checkbox list', () => {
		user.selectSomeFilters();
		cy.findByRole('button', { name: 'filter' }).click();
		clickOnReset();
		cy.get('.ant-checkbox-checked').should('not.exist');
	});
});
