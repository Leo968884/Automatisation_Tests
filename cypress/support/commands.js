let authToken;

// Commands for navigation
Cypress.Commands.add('gotoHome', () => {
    cy.visit('http://localhost:8080/#/');
});

Cypress.Commands.add('gotoProductsList', () => {
    cy.visit('http://localhost:8080/#/products');
});

Cypress.Commands.add('gotoProductDetailsById', (productId) => {
    cy.visit(`http://localhost:8080/#/products/${productId}`);
});

Cypress.Commands.add('gotoLogin', () => {
    cy.visit('http://localhost:8080/#/login');
});

Cypress.Commands.add('gotoCart', () => {
    cy.visit('http://localhost:8080/#/cart');
});

// Commands for API requests
Cypress.Commands.add('fetchProducts', () => {
    cy.request('http://localhost:8081/products').then((response) => {
        const products = response.body;
        cy.writeFile('cypress/fixtures/products.json', products);
    });
});

Cypress.Commands.add('apiLogin', () => {
    cy.fixture('user.json').then((user) => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                username: user.email,
                password: user.password,
            }
        }).then((response) => {
            const authToken = response.body.token;
            return authToken;
        });
    });
});

// Commands for user actions
Cypress.Commands.add('login', (user) => {
    cy.gotoLogin();
    cy.get('[data-cy="login-input-username"]').type(user.email);
    cy.get('[data-cy="login-input-password"]').type(user.password);
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('be.visible');
});

Cypress.Commands.add('addProductToCart', (productId) => {
    cy.intercept(`GET`, `http://localhost:8081/products/${productId}`).as('getProductDetails');
    cy.gotoProductDetailsById(productId);
    cy.wait('@getProductDetails');
    cy.get('[data-cy="detail-product-add"]').click();
});

Cypress.Commands.add('verifyProductInCart', (productName) => {
    cy.get('[data-cy="cart-line-name"]').should('contain', productName);
});

Cypress.Commands.add('verifyStockUpdate', (productId, initialStock) => {
    cy.intercept(`GET`, `http://localhost:8081/products/${productId}`).as('getProductDetailsAgain');
    cy.gotoProductDetailsById(productId);
    cy.wait('@getProductDetailsAgain');
    cy.get('[data-cy="detail-product-stock"]').invoke("text").then((stockText) => {
        const newStock = parseInt(stockText);
        expect(newStock).to.equal(initialStock - 1);
    });
});

Cypress.Commands.add('testQuantityLimit', (productId, productName, quantity, expectedRequestCount) => {
    cy.gotoProductDetailsById(productId);
    cy.get('[data-cy="detail-product-quantity"]').clear().type(quantity);
    cy.intercept('PUT', 'http://localhost:8081/orders/add').as('addOrder');
    cy.get('[data-cy="detail-product-add"]').click();
    cy.get('@addOrder.all').should('have.length', expectedRequestCount);

    if (quantity > 0) {
        cy.verifyCartContent(productId, productName, quantity);
    }
});

function selectProductByCondition(condition) {
    cy.fetchProducts();
    cy.fixture('products').then((products) => {
        const selectedProduct = products.find(condition);
        if (selectedProduct) {
            cy.writeFile('cypress/fixtures/selectedProduct.json', selectedProduct);
        } else {
            cy.fail('Aucun produit correspondant à la condition n\'a été trouvé.');
        }
    });
}

Cypress.Commands.add('selectProductWithStock', () => {
    selectProductByCondition(product => product.availableStock > 0);
});

Cypress.Commands.add('selectProductWithoutStock', () => {
    selectProductByCondition(product => product.availableStock <= 0);
});

Cypress.Commands.add('verifyCartContent', (productId, productName, quantity) => {
    cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then((response) => {
        const orders = response.body;
        const productInCart = orders.orderLines.find(orderLine => orderLine.product.id === productId);

        expect(productInCart).to.exist;
        expect(productInCart.product.name).to.equal(productName);
        expect(productInCart.quantity).to.equal(quantity + 1);
    });
});