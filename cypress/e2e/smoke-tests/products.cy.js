// cypress/integration/products.spec.js

describe('Smoke Test for products', () => {

    it('should display the products form without login', () => {
        cy.gotoFirstProductDetails();
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
        cy.get('[data-cy="detail-product-add"]').should('be.visible');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/login');
    })

    it('should display the products form with login', () => {
        cy.fixture('user').then((user) => {
            cy.login(user);
        })
        cy.gotoFirstProductDetails();
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
        cy.get('[data-cy="detail-product-add"]').should('be.visible');
        cy.get('[data-cy="detail-product-name"]').should('not.be.empty')
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/cart');
    })
})