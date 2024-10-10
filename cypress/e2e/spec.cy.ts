describe('Top page', () => {
  it('has correct title', () => {
    cy.visit('http://localhost:8000/')
    cy.contains('🐌 Trying Cypress 🐌').should('be.visible')
  })
})
