import * as merchantModule from './merchant'

describe('@state/modules/merchant', () => {
  it('exports a valid Vuex module', () => {
    expect(merchantModule).toBeAVuexModule()
  })
})
