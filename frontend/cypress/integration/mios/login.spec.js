/// <reference types="cypress" />

describe('example to-do app', () => {

    it('login', () => {
        cy.visit('http://localhost:8080')

        cy.get('[type="text"]').type("jals")

        cy.get('[type="password"]').type("holaquetal")

        cy.get('#login-button').click()

        cy.get('.col-12 > .userTarget > .userInfo > .name').contains("Juan Antonio")

        cy.get('.col-12 > .userTarget > .userInfo > .username').contains("@jals")
    })
})