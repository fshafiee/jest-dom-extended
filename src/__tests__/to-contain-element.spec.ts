import { render } from './helpers/test-utils.js'

const { queryByTestId } = render(`
<span data-testid="grandparent">
  <span data-testid="parent">
    <span data-testid="child"></span>
  </span>
  <svg data-testid="svg-element"></svg>
</span>
`)

const grandparent = queryByTestId('grandparent') as Element
const parent = queryByTestId('parent') as Element
const child = queryByTestId('child') as Element
const svgElement = queryByTestId('svg-element') as Element
const nonExistantElement = queryByTestId('not-exists') as Element
const fakeElement = { thisIsNot: 'an html element' } as unknown as Element

test('.toContainElement positive test cases', () => {
  expect(grandparent).toContainElement(parent)
  expect(grandparent).toContainElement(child)
  expect(grandparent).toContainElement(svgElement)
  expect(parent).toContainElement(child)
  expect(parent).not.toContainElement(grandparent)
  expect(parent).not.toContainElement(svgElement)
  expect(child).not.toContainElement(parent)
  expect(child).not.toContainElement(grandparent)
  expect(child).not.toContainElement(svgElement)
  expect(grandparent).not.toContainElement(nonExistantElement)
})

test('.toContainElement negative test cases', () => {
  expect(() =>
    expect(nonExistantElement).not.toContainElement(child),
  ).toThrowError()
  expect(() => expect(parent).toContainElement(grandparent)).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainElement(grandparent),
  ).toThrowError()
  expect(() =>
    expect(grandparent).toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainElement(fakeElement),
  ).toThrowError()
  expect(() =>
    expect(fakeElement).toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(fakeElement).not.toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() => expect(fakeElement).toContainElement(grandparent)).toThrowError()
  expect(() => expect(grandparent).toContainElement(fakeElement)).toThrowError()
  expect(() => expect(fakeElement).toContainElement(fakeElement)).toThrowError()
  expect(() => expect(grandparent).not.toContainElement(child)).toThrowError()
  expect(() =>
    expect(grandparent).not.toContainElement(svgElement),
  ).toThrowError()
  expect(() =>
    expect(grandparent).not.toContainElement(undefined as unknown as Element),
  ).toThrowError()
})
