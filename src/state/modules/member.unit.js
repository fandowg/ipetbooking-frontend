import * as memberModule from './member'

describe('@state/modules/member', () => {
  it('exports a valid Vuex module', () => {
    expect(memberModule).toBeAVuexModule()
  })
})
