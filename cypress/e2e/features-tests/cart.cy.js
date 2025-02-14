describe('Feature Test for Cart', () => {

    before(() => {
        cy.apiLogin();
        cy.selectProductWithStock();
    });

    beforeEach(() => {
        cy.fixture('user').then((user) => {
            cy.login(user);
        });
        cy.fixture('selectedProduct').as('selectedProduct');
    });

    it('should add a product to the cart', function () {
        cy.addProductToCart(this.selectedProduct.id);
        cy.verifyProductInCart(this.selectedProduct.name);
    });

    it('should update the stock after adding a product to the cart', function () {
        cy.verifyStockUpdate(this.selectedProduct.id, this.selectedProduct.availableStock);
    });

    it('should not add a product to the cart with a negative quantity', function () {
        cy.testQuantityLimit(this.selectedProduct.id, this.selectedProduct.name, -1, 0);
    });

    it('should add a product to the cart with a large quantity', function () {
        cy.testQuantityLimit(this.selectedProduct.id, this.selectedProduct.name, 21, 0);// Le test a échoué car le produit a été ajouté au panier malgré la quantité supérieure à 20 
    });
});
