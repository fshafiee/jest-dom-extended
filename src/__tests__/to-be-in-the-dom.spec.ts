import { render } from './helpers/test-utils.js'

test('.toBeInTheDOM', () => {
  // @deprecated intentionally hiding warnings for test clarity
  const spy = import.meta.jest
    .spyOn(console, 'warn')
    .mockImplementation(() => {})

  const { queryByTestId } = render(`
    <span data-testid="count-container">
      <span data-testid="count-value"></span>
      <svg data-testid="svg-element"></svg>
    </span>`)

  const containerElement = queryByTestId('count-container') as Element
  const valueElement = queryByTestId('count-value') as Element
  const nonExistantElement = queryByTestId('not-exists') as Element
  const svgElement = queryByTestId('svg-element') as Element
  const fakeElement = { thisIsNot: 'an html element' } as unknown as Element

  // Testing toBeInTheDOM without container
  expect(valueElement).toBeInTheDocument()
  expect(svgElement).toBeInTheDocument()
  expect(nonExistantElement).not.toBeInTheDocument()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(valueElement).not.toBeInTheDocument()).toThrowError()

  expect(() => expect(svgElement).not.toBeInTheDocument()).toThrowError()

  expect(() => expect(nonExistantElement).toBeInTheDocument()).toThrowError()

  expect(() => expect(fakeElement).toBeInTheDocument()).toThrowError()

  // Testing toBeInTheDOM with container
  expect(containerElement).toContainElement(valueElement)
  expect(containerElement).toContainElement(svgElement)
  expect(valueElement).not.toContainElement(containerElement)

  expect(() =>
    expect(containerElement).not.toContainElement(valueElement),
  ).toThrowError()

  expect(() =>
    expect(containerElement).not.toContainElement(svgElement),
  ).toThrowError()

  expect(() =>
    expect(containerElement).toContainElement(nonExistantElement),
  ).toThrowError()

  expect(() =>
    expect(containerElement).toContainElement(fakeElement),
  ).toThrowError()

  expect(() => {
    expect(fakeElement).toContainElement(valueElement)
  }).toThrowError()

  spy.mockRestore()
})
