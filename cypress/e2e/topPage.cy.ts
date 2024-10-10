describe('Top page', () => {
  it('has correct title', () => {
    cy.visit('/')
    cy.contains('🐌 Trying Cypress 🐌').should('be.visible')
  })
})
