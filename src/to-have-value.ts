import isEqualWith from 'lodash.isequalwith'
import {
  checkHtmlElement,
  compareArraysAsSet,
  getMessage,
  getSingleElementValue,
  isCheckableInput,
  isInputElement,
  isSelectElement,
  isTextareaElement,
} from './utils.js'

export function toHaveValue(
  htmlElement: Element,
  expectedValue?: null | string | number | (string | number)[],
) {
  checkHtmlElement(htmlElement, toHaveValue, this)

  if (
    !isInputElement(htmlElement) &&
    !isSelectElement(htmlElement) &&
    !isTextareaElement(htmlElement)
  ) {
    throw new Error(
      '.toHaveValue(). Can only be used on input, select, and textarea elements',
    )
  }

  if (isCheckableInput(htmlElement)) {
    throw new Error(
      'input with type=checkbox or type=radio cannot be used with .toHaveValue(). Use .toBeChecked() for type=checkbox or .toHaveFormValues() instead',
    )
  }

  const receivedValue = getSingleElementValue(htmlElement)
  const expectsValue = expectedValue !== undefined

  let expectedTypedValue = expectedValue
  let receivedTypedValue = receivedValue
  if (expectedValue == receivedValue && expectedValue !== receivedValue) {
    expectedTypedValue = `${expectedValue} (${typeof expectedValue})`
    receivedTypedValue = `${receivedValue} (${typeof receivedValue})`
  }

  return {
    pass: expectsValue
      ? isEqualWith(receivedValue, expectedValue, compareArraysAsSet)
      : Boolean(receivedValue),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const matcher = this.utils.matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveValue`,
        'element',
        expectedValue,
      )
      return getMessage(
        this,
        matcher,
        `Expected the element ${to} have value`,
        expectsValue ? expectedTypedValue : '(any)',
        'Received',
        receivedTypedValue,
      )
    },
  }
}
