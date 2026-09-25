describe('Smoke - Home page', () => {
    it('Open home page and see the title Kitchen Sink', () => {
        cy.visit('/');
        cy.contains('h1', 'Kitchen Sink')
            .should('be.visible');
    });

    it('Navigate to page Commands > Actions', () => {
        cy.visit('/');
        cy.contains('Commands').click();
        cy.contains('Actions').click();
        cy.url().should('include', '/commands/actions');
    });
});