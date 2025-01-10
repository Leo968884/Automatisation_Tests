// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js

Cypress.Commands.add('gotoHome', () => {
    cy.visit('http://localhost:8080/#/');
});

Cypress.Commands.add('gotoProductsList', () => {
    cy.visit('http://localhost:8080/#/products');
});

Cypress.Commands.add('fetchProducts', () => {
    cy.request('http://localhost:8081/products').then((response) => {
        const products = response.body;
        cy.writeFile('cypress/fixtures/products.json', products);
    });
});

Cypress.Commands.add('gotoFirstProductDetails', () => {
    cy.fetchProducts()
    cy.fixture('products').then((products) => {
        cy.visit(`http://localhost:8080/#/products/${products[0].id}`);
    })
});

Cypress.Commands.add('gotoLogin', () => {
    cy.visit('http://localhost:8080/#/login');
});

Cypress.Commands.add('gotoCart', () => {
    cy.visit('http://localhost:8080/#/cart');
});

Cypress.Commands.add('login', (user) => {
    cy.gotoLogin();
    cy.get('[data-cy="login-input-username"]').type(user.email);
    cy.get('[data-cy="login-input-password"]').type(user.password);
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');
});