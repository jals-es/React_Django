/// <reference types="cypress" />

describe('example to-do app', () => {

    it('login', () => {
        cy.request('POST', '/api/user/login/', {
            "user": {
                "username": "jals",
                "password": "holaquetal"
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('name', 'Juan Antonio')
            expect(response.body).to.have.property('descr', '')
            expect(response.body).to.have.property('photo', 'https://avatars.githubusercontent.com/u/31510870?v=4')
            expect(response.body).to.have.property('username', 'jals')
        })
    })
})