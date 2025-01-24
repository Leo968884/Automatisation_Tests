describe('GET Requests API Tests', () => {

    it('should return 403 for Forbidden GET request to /orders', () => {
        cy.apiLogin().then((token) => {
            cy.intercept('GET', 'http://localhost:8081/orders', (req) => {
                req.headers['Authorization'] = `Bearer invalid_token`;
            }).as('getOrders');

            cy.request({
                method: 'GET',
                url: 'http://localhost:8081/orders',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403);// bug signalé 403 => 401
            });
        });
    });

    it('should return the list of products in the cart for authenticated GET request to /orders', () => {
        cy.apiLogin().then((token) => {
            cy.request({
                method: 'GET',
                url: 'http://localhost:8081/orders',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('orderLines');
            });
        });
    });

    it('should return the details of a specific product', () => {
        cy.fetchProducts().then(() => {
            cy.fixture('products').then((products) => {
                const firstProductId = products[0].id;
                cy.request({
                    method: 'GET',
                    url: `http://localhost:8081/products/${firstProductId}`,
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('id', firstProductId);
                });
            });
        });
    });
});