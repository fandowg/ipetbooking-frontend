import Plans from './plans'

describe('@views/plans', () => {
  it('is a valid view', () => {
    expect(Plans).toBeAViewComponent()
  })

  it('renders an element', () => {
    const { element } = shallowMountView(Plans)
    expect(element.textContent).toContain('Plans Page')
  })
})
