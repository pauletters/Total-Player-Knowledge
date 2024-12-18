describe('Authentication Flow', () => {
    const testUser = {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'Password123!'
    }
  
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
  
    it('shows about page when user is not logged in', () => {
      cy.get('.hero-title').should('contain', 'About')
      cy.get('.hero-subtitle').should('contain', 'Total Player Knowledge')
    })
  
    it('opens auth modal and switches between login and signup', () => {
      // Click login/signup button
      cy.get('.nav-auth-link').click({ force: true })
  
      // Modal should be visible
      cy.get('.modal').should('be.visible')
  
      // Check initial login view - ensure we're looking within the active tab
      cy.get('.tab-content .active input[name="email"]').should('exist')
      cy.get('.tab-content .active input[name="password"]').should('exist')
  
      // Switch to signup
      cy.get('.modal-title .nav-link').contains('Sign Up').click({ force: true })
      cy.get('.tab-content .active input[name="username"]').should('exist')
      cy.get('.tab-content .active input[name="email"]').should('exist')
      cy.get('.tab-content .active input[name="password"]').should('exist')
  
      // Switch back to login
      cy.get('.modal-title .nav-link').contains('Login').click({ force: true })
      cy.get('.tab-content .active input[name="username"]').should('not.exist')
    })
  
    it('allows user to sign up and redirects to create character', () => {
      // Click login/signup button
      cy.get('.nav-auth-link').click({ force: true })
  
      // Switch to signup and wait for tab content to be active
      cy.get('.modal-title .nav-link').contains('Sign Up').click({ force: true })
      cy.get('.tab-content .active').should('be.visible')
  
      // Fill in signup form within the active tab
      cy.get('.tab-content .active input[name="username"]').type(testUser.username)
      cy.get('.tab-content .active input[name="email"]').type(testUser.email)
      cy.get('.tab-content .active input[name="password"]').type(testUser.password)
  
      // Submit form
      cy.get('.tab-content .active button[type="submit"]').click()
  
      // Should be redirected to create character page
      cy.url().should('include', '/create-character')
      cy.get('h1').should('contain', 'Create New Character')
  
      // Logout to prepare for login test
      cy.get('.nav-logout').click()
    })
  
    it('allows user to login with created account and redirects to create character', () => {
      // Click login/signup button
      cy.get('.nav-auth-link').click({ force: true })
  
      // Wait for login tab content to be active
      cy.get('.tab-content .active').should('be.visible')
  
      // Fill in login form within the active tab
      cy.get('.tab-content .active input[name="email"]').type(testUser.email)
      cy.get('.tab-content .active input[name="password"]').type(testUser.password)
  
      // Submit form
      cy.get('.tab-content .active button[type="submit"]').click()
  
      // Should be redirected to create character page
      cy.url().should('include', '/create-character')
      cy.get('h1').should('contain', 'Create New Character')
    })
  })