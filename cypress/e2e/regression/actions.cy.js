describe('Regression - Form actions', () => {
    beforeEach(() => cy.visit('/commands/actions'));

    it('Enter an email into field named Email address', () => {
        cy.get('.action-email')
            .type('lab@example.com')
            .should('have.value', 'lab@example.com');
    });

    it('Verify enabled checkboxes can be checked', () => {
        cy.get('.action-checkboxes [type="checkbox"]')
            .not('[disabled]')
            .check()
            .should('be.checked');
    });
});