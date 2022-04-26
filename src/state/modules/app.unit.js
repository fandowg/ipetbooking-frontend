import * as appModule from './app'

describe('@state/modules/app', () => {
  it('exports a valid Vuex module', () => {
    expect(appModule).toBeAVuexModule()
  })
})
