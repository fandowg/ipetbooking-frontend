import * as inventoryModule from './inventory'

describe('@state/modules/inventory', () => {
  it('exports a valid Vuex module', () => {
    expect(inventoryModule).toBeAVuexModule()
  })
})
