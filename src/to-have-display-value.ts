import {
  checkHtmlElement,
  getMessage,
  isCheckableInput,
  isInputElement,
  isSelectElement,
  isTextareaElement,
} from './utils.js'

export function toHaveDisplayValue(
  htmlElement: Element,
  expectedValue: string | number | RegExp | (string | number | RegExp)[],
) {
  checkHtmlElement(htmlElement, toHaveDisplayValue, this)

  if (
    !(
      isInputElement(htmlElement) ||
      isTextareaElement(htmlElement) ||
      isSelectElement(htmlElement)
    )
  ) {
    throw new Error(
      '.toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead.',
    )
  }

  if (isCheckableInput(htmlElement)) {
    throw new Error(
      `.toHaveDisplayValue() currently does not support input[type="${htmlElement.type}"], try with another matcher instead.`,
    )
  }

  const values = getValues(htmlElement)
  const expectedValues = getExpectedValues(expectedValue)
  const numberOfMatchesWithValues = expectedValues.filter(expected =>
    values.some(value =>
      expected instanceof RegExp
        ? expected.test(value)
        : this.equals(value, String(expected)),
    ),
  ).length

  const matchedWithAllValues = numberOfMatchesWithValues === values.length
  const matchedWithAllExpectedValues =
    numberOfMatchesWithValues === expectedValues.length

  return {
    pass: matchedWithAllValues && matchedWithAllExpectedValues,
    message: () =>
      getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveDisplayValue`,
          'element',
          '',
        ),
        `Expected element ${this.isNot ? 'not ' : ''}to have display value`,
        expectedValue,
        'Received',
        values,
      ),
  }
}

function getValues(htmlElement: HTMLInputElement | HTMLSelectElement) {
  return isSelectElement(htmlElement)
    ? Array.from(htmlElement)
        .filter(option => option.hasAttribute('selected'))
        .map(option => option.textContent ?? '')
    : [htmlElement.value]
}

function getExpectedValues(
  expectedValue: string | number | RegExp | (string | number | RegExp)[],
) {
  return expectedValue instanceof Array ? expectedValue : [expectedValue]
}
