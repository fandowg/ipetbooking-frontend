import request from './request'

describe('@utils/request', () => {
  it('says hello', () => {
    const result = request()
    expect(result).toEqual('hello')
  })
})
