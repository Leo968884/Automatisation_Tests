describe('Feature Test for Login', () => {

    it('should connect', () => {
        cy.gotoHome();
        cy.get('[data-cy="nav-link-login"]').click();
        cy.fixture('user').then((user) => {
            cy.login(user);
        })
        cy.get('[data-cy="nav-link-cart"]').should('be.visible');
    })
})