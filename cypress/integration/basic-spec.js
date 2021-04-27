describe('ngx-cron demo', () => {
  before(() => {
    cy.visit('/');
    // cy.get('.page-loader').should('not.exist', { timeout: 20000 });
  });

  it('loads', () => {
    cy.contains('User-friendly cron input');
  });
});
