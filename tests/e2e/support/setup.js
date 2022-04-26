// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'
const baseUrl = 'http://admin.dingsomething.test'

// login
before(() => {
  // 不先把 whitelist 設成空陣列，clearCookies 會沒作用
  Cypress.Cookies.defaults({
    whitelist: [],
  })

  // * 忽略等待儀表板的 api 回應，不然會拉長測試的時間 * //
  cy.server()
  cy.route({
    method: 'POST',
    url: '**/admin/dashboard/*',
    onRequest: () => {
      throw new Error('Whoops')
    },
  })

  cy.route({
    method: 'GET',
    url: '**/admin/dashboard/*',
    onRequest: () => {
      throw new Error('Whoops')
    },
  })
  // * * * * * * * * * * * * * * * * * * * * * * //

  cy.visit(baseUrl + '/')
  cy.clearCookies()
  cy.visit(baseUrl + '/login')
  cy.url().should('match', /login/)
  cy.contains('span', '登入')
  cy.get('[placeholder="Email"]').type('admin@senji.com.tw')
  cy.get('[placeholder="密碼"]').type('senji@2019')
  cy.get('button[type="submit"]').click()
  cy.contains('h2', '儀表板', { timeout: 20000 })
})

beforeEach(() => {
  Cypress.Cookies.defaults({
    whitelist: [
      'auth.currentUserPermission',
      'auth.currentUserAccount',
      'auth.currentUserRoutes',
      'auth.currentUser',
      'auth.currentSubscription',
    ],
  })
})
