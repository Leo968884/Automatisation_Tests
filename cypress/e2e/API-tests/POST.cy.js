describe('POST Requests API Tests', () => {

    it('should return 401 for login with unknown user', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                username: 'unknown@example.com',
                password: 'unknownpassword'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('should return 200 for login with known user', () => {
        cy.fixture('user.json').then((user) => {
            cy.request({
                method: 'POST',
                url: 'http://localhost:8081/login',
                body: {
                    username: user.email,
                    password: user.password
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('token');
            });
        });
    });

    it('should add an available product to the cart', () => {
        cy.apiLogin().then((token) => {
            cy.selectProductWithStock();

            cy.fixture('selectedProduct.json').then((selectedProduct) => {
                const productId = selectedProduct.id;

                cy.request({
                    method: 'POST',//bug signalé POST => PUT
                    url: 'http://localhost:8081/orders/add',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: {
                        product: productId,
                        quantity: 1
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('orderLines').that.is.not.empty;
                });
            });
        });
    });

    it('should return an error for adding an out-of-stock product to the cart', () => {
        cy.apiLogin().then((token) => {
            cy.selectProductWithoutStock();

            cy.fixture('selectedProduct.json').then((selectedProduct) => {
                const productId = selectedProduct.id;

                cy.request({
                    method: 'POST',//bug signalé POST => PUT
                    url: 'http://localhost:8081/orders/add',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: {
                        product: productId,
                        quantity: 1
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(400); // renvoie une 200 parce qu'il est possible d'ajouté un produit sans stock
                });
            });
        });
    });

    it('should add a review', () => {
        cy.apiLogin().then((token) => {
            const comment = 'Sane coleus es, Caïus. Abi pedicatum, terrae tuber, et in cruce figaris, lumbrice!'
            cy.request({
                method: 'POST',
                url: 'http://localhost:8081/reviews',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {
                    rating: 5,
                    title: 'Great product!',
                    comment: comment
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('comment', comment);
            });
        });
    });
});
