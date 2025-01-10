describe('Smoke Test for Login', () => {

    it('should display the login form', () => {
        cy.gotoLogin();
        cy.get('[data-cy="login-input-username"]').should('be.visible');
        cy.get('[data-cy="login-input-password"]').should('be.visible');
        cy.get('[data-cy="login-submit"]').should('be.visible');
        cy.contains('a', "S'inscrire").should('be.visible').and('have.attr', 'href', '#/register');
    })
})