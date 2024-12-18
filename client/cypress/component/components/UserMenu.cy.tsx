import UserMenu from '../../../src/components/UserMenu'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

describe('UserMenu Component', () => {
  const mountUserMenu = (initialPath = '/') => {
    return cy.mount(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="*" element={<UserMenu />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders all navigation links', () => {
    mountUserMenu()
    
    cy.contains('.nav-link', 'Create New Character').should('exist')
    cy.contains('.nav-link', 'My Characters').should('exist')
    cy.contains('.nav-link', 'My Campaigns').should('exist')
  })

  it('applies active class based on current route', () => {
    // Test Create Character route
    mountUserMenu('/create-character')
    cy.contains('.nav-link', 'Create New Character')
      .should('have.class', 'active')
    cy.contains('.nav-link', 'My Characters')
      .should('not.have.class', 'active')
    
    // Test My Characters route
    mountUserMenu('/my-characters')
    cy.contains('.nav-link', 'My Characters')
      .should('have.class', 'active')
    cy.contains('.nav-link', 'Create New Character')
      .should('not.have.class', 'active')
    
    // Test My Campaigns route
    mountUserMenu('/my-campaigns')
    cy.contains('.nav-link', 'My Campaigns')
      .should('have.class', 'active')
    cy.contains('.nav-link', 'Create New Character')
      .should('not.have.class', 'active')
  })

  it('has working navigation links', () => {
    mountUserMenu()

    // Click Create Character link and verify URL change
    cy.contains('.nav-link', 'Create New Character').click()
    cy.contains('.nav-link', 'Create New Character').should('have.class', 'active')

    // Click My Characters link and verify URL change
    cy.contains('.nav-link', 'My Characters').click()
    cy.contains('.nav-link', 'My Characters').should('have.class', 'active')

    // Click My Campaigns link and verify URL change
    cy.contains('.nav-link', 'My Campaigns').click()
    cy.contains('.nav-link', 'My Campaigns').should('have.class', 'active')
  })
})