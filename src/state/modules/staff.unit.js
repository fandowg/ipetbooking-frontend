import * as staffModule from './staff'

describe('@state/modules/staff', () => {
  it('exports a valid Vuex module', () => {
    expect(staffModule).toBeAVuexModule()
  })
})
