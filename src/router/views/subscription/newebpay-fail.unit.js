import NewebpayBackUrl from './newebpay-fail'

describe('@views/newebpay-fail', () => {
  it('is a valid view', () => {
    expect(NewebpayBackUrl).toBeAViewComponent()
  })

  it('renders an element', () => {
    const { element } = shallowMountView(NewebpayBackUrl)
    expect(element.textContent).toContain('NewebpayBackUrl Page')
  })
})
