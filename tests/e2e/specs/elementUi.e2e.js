describe('Home Page', () => {
  // beforeEach(() => {
  //   cy.visit('/')

  // })

  it('dropdown select', () => {
    cy.visit('https://element.eleme.io/#/zh-CN/component/select')
    cy.get(
      'div[aria-label="提示"] .el-message-box__btns button:not(.el-button--primary)'
    ).click({
      force: true,
    })
    cy.get('#ji-chu-yong-fa')
      .next()
      .next()
      .find('input')
      .click()
      .type('{downarrow}{enter}')
  })
})
