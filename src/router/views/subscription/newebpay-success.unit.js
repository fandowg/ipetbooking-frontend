import NewebpayReturnUrl from './newebpay-success'

describe('@views/newebpay-success', () => {
  it('is a valid view', () => {
    expect(NewebpayReturnUrl).toBeAViewComponent()
  })

  it('renders an element', () => {
    const { element } = shallowMountView(NewebpayReturnUrl)
    expect(element.textContent).toContain('NewebpayReturnUrl Page')
  })
})
