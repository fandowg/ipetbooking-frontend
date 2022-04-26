describe('Product create and remove', () => {
  const pid = Math.floor(Math.random() * 100000)
  // 換成自己的本機環境路徑，若要測開發站就改成 https://admin.dingsomething.daydream-lab.com
  const baseUrl = 'http://admin.dingsomething.test'

  it('remove product', () => {
    cy.visit(baseUrl + '/products')
    cy.url().should('match', /products/)
    cy.get('div[class*=ListItem_title]', { timeout: 20000 }).each(
      ($listItem) => {
        if ($listItem[0].textContent === '自動測試用活動') {
          cy.wrap($listItem).click({ force: true })
          cy.get('svg[data-icon="trash-alt"]')
            .parent()
            .click({ force: true })
          cy.get('div.el-message-box__btns > button.el-button--primary').click({
            force: true,
          })
        }
      }
    )
  })

  it('create product', () => {
    cy.visit(baseUrl + '/products')
    cy.url().should('match', /products/)
    cy.get('button[tooltip="新增項目"]').click()
    cy.get('div[class*=list_types] button')
      .first()
      .click()
    cy.url().should('include', '/products/add?type=activity')

    // Step 1
    cy.get('label[for="name"]')
      .next()
      .find('input')
      .type('自動測試用活動', { force: true })

    cy.get('label[for="alias"]')
      .next()
      .find('input')
      .type('activity-' + pid, { force: true })

    cy.get('label[for="description"]')
      .next()
      .find('textarea')
      .type('活動敘述活動敘述活動敘述', { force: true })

    cy.get('label[for="orderExtrafields.0.value"]')
      .next()
      .find('textarea')
      .type('補充敘述 A', { force: true })

    cy.get('label[for="orderExtrafields.1.value"]')
      .next()
      .find('textarea')
      .type('補充敘述 B', { force: true })

    cy.get('label[for="orderExtrafields.2.value"]')
      .next()
      .find('textarea')
      .type('補充敘述 C', { force: true })

    cy.get('label[for="location.name"]')
      .next()
      .find('input')
      .type('地點名稱地點名稱', { force: true })

    cy.get('label[for="location.city"]')
      .next()
      .find('input')
      .click({ force: true })
      .type('{downarrow}{enter}', { force: true })

    cy.get('label[for="location.address"]')
      .next()
      .find('input')
      .type('地址地址地址地址', { force: true })

    cy.get(
      'button[data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步"]'
    ).as('nextStepBtn')
    cy.get('@nextStepBtn').click({ force: true })

    // Step 2
    cy.url().should('match', /products\/.+\/add$/)

    cy.contains(
      '.el-card__header',
      '想要在什麼時間讓客戶參與活動呢？可以設定多重時段及重複週期喔！暫不編輯時段，請按離開，完成時段編輯，請按下一步。'
    )

    cy.get('input[placeholder="選擇開始時間"]').type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}13:50',
      { force: true }
    )

    cy.get(
      'div[data-tour-text="設定活動結束時間。若是有不同時段，請再新增一個時段唷！"]'
    )
      .find('.el-form-item:first-child input')
      .type('{rightarrow}{rightarrow}{enter}', {
        force: true,
      })

    cy.get('input[placeholder="選擇結束時間"]').type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}17:50',
      { force: true }
    )

    cy.get('label[for="repeat"]')
      .next()
      .find('input')
      .click()
      .type('{downarrow}{downarrow}{enter}')

    cy.get('input[min="0"]').type('100', { force: true })

    cy.get('label[for="repeatEndDate"]')
      .next()
      .find('input')
      .type('{rightarrow}{rightarrow}{enter}', { force: true })

    cy.get(
      'button[data-tour-text="最後別忘記按下「完成」，完成此時段新增了唷！"]'
    ).click({ force: true })

    cy.get('@nextStepBtn').click({ force: true })

    // Step 3
    cy.contains(
      '.el-card__header',
      '可以設定各式各樣的購買方案讓客戶選擇，請將購買方案所包含的項目或使用方式寫在內容中。暫不編輯購買方案，請按離開，完成購買方案編輯，請按下一步。'
    )

    cy.get('label[for="title"]')
      .next()
      .find('input')
      .type('單人票', { force: true })

    cy.get('label[for="description"]')
      .next()
      .find('textarea')
      .type('這是單人票的內容', { force: true })

    cy.get('label[for="basePrice"]')
      .next()
      .find('input')
      .type('1000', { force: true })
    cy.get('label[for="price"]')
      .next()
      .find('input')
      .type('900', { force: true })
    cy.get('label[for="inventory"]')
      .next()
      .find('input')
      .type('666', { force: true })

    cy.get(
      'button[data-tour-text="最後別忘記按下「完成」，完成此方案新增了唷！"]'
    ).click({ force: true })

    cy.get('@nextStepBtn').click({ force: true })

    // Step 4
    cy.contains(
      '.el-card__header',
      '想知道客戶是如何得知你們的嗎？或是需要統計餐點數量提前做準備嗎？可以自訂問題與客戶互動喔～完成或想略過額外欄位新增請按下一步。'
    )

    cy.get('button.is-fullwidth.el-button--primary').click({ force: true })

    cy.get('label[for="title"]')
      .next()
      .find('input')
      .type('請選擇中餐', { force: true })

    cy.get('label[for="type"]')
      .next()
      .find('input')
      .click({ force: true })
      .type('{downarrow}{downarrow}{enter}', { force: true })

    cy.get('label[for="params.options.0.title"]')
      .next()
      .find('input')
      .type('漢堡', { force: true })

    // 新增選項
    cy.get(
      'div[class*=ExtraFieldListItem_content] form > div:nth-child(3) button.el-button--primary'
    ).click({ force: true })

    cy.get('label[for="params.options.1.title"]')
      .next()
      .find('input')
      .type('義大利麵', { force: true })

    cy.get(
      'div[class*=ExtraFieldListItem_footer] button.el-button--primary'
    ).click({ force: true })

    cy.get('@nextStepBtn').click({ force: true })

    // Step 5
    cy.contains('.el-card__header', '是否上架？')
    cy.get('div[class*=Step5State_container] button.el-button--primary').click({
      force: true,
    })

    // check product existing
    cy.get('div[class*=ListItem_title]', { timeout: 5000 })
      .first()
      .should('contain.text', '自動測試用活動')
    cy.get('div[class*=ListItem_title]')
      .first()
      .next()
      .should('contain.text', '上架中')
  })

  // 產品列表找出「自動測試用活動」，按下編輯產品藉此進入時段頁籤，進入時段訂單新增訂單，最後檢查是否新增成功
  it('find period and place an order', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '/api/admin/order/search',
    }).as('order_search')

    cy.visit(baseUrl + '/products')
    cy.url().should('match', /products/)

    cy.get('div[class*=ListItem_title]', { timeout: 20000 }).each(
      ($listItem) => {
        if ($listItem[0].textContent === '自動測試用活動') {
          cy.wrap($listItem[0]).as('testProduct')
        }
      }
    )

    cy.get('@testProduct').click({ force: true })
    cy.get('svg[data-icon="edit"]')
      .parent()
      .click({ force: true })

    cy.contains('h2', '編輯活動')
    cy.get('#tab-2.el-tabs__item').click({ force: true })

    cy.get('.el-table__row button').click({ force: true })
    cy.contains('h2', '#1 時段')
    cy.get('.el-table__row button').click({ force: true })

    cy.wait('@order_search').then((xhr) => {
      const orderCount = xhr.response.body.data.items.length
      cy.wrap(orderCount).as('orderCount')
    })

    cy.get(
      'div[element-loading-text="載入訂單中⋯⋯"] button.is-fullwidth.el-button--primary:not(.is-plain)'
    ).click({ force: true })

    cy.get('label[for="phoneNumber"]').should(
      'contain.text',
      '快速查詢客戶資料'
    )

    cy.get('input[placeholder="請輸入手機號碼"]').type('0912345678{enter}', {
      force: true,
    })
    cy.get('input[placeholder="手機號碼"]', { timeout: 10000 }).should(
      'have.value',
      '0912345678'
    )

    cy.get('span.el-input-number__increase').click({ force: true })

    cy.get('div[class*=OrderExtraField] input').type('義大利麵', {
      force: true,
    })

    cy.get('.el-drawer__wrapper .is-fullwidth.el-button--primary').click({
      type: true,
    })

    cy.get('div[aria-label="訂單新增成功！"] button.el-button').click({
      type: true,
    })

    cy.wait('@order_search').then((xhr) => {
      cy.get('@orderCount').then((orderCount) => {
        expect(xhr.response.body.data.items.length).to.eq(orderCount + 1)
      })
    })
  })
})
