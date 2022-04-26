import * as couponModule from './coupon'

describe('@state/modules/coupon', () => {
  it('exports a valid Vuex module', () => {
    expect(couponModule).toBeAVuexModule()
  })
})
