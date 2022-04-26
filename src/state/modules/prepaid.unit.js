import * as prepaidModule from './prepaid'

describe('@state/modules/prepaid', () => {
  it('exports a valid Vuex module', () => {
    expect(prepaidModule).toBeAVuexModule()
  })
})
