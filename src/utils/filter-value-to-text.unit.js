import formatTextForValue from './filter-value-to-text'

describe('@utils/filter-value-to-text', () => {
  it('says hello', () => {
    const result = formatTextForValue()
    expect(result).toEqual('hello')
  })
})
