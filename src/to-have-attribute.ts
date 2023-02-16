import { checkHtmlElement, getMessage } from './utils.js'

function printAttribute(stringify, name, value) {
  return value === undefined ? name : `${name}=${stringify(value)}`
}

function getAttributeComment(stringify, name, value) {
  return value === undefined
    ? `element.hasAttribute(${stringify(name)})`
    : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`
}

export function toHaveAttribute(
  htmlElement: Element,
  name?: string,
  expectedValue?: string,
) {
  checkHtmlElement(htmlElement, toHaveAttribute, this)
  const isExpectedValuePresent = expectedValue !== undefined
  const hasAttribute = !!name && htmlElement.hasAttribute(name)
  const receivedValue = !!name ? htmlElement.getAttribute(name) : null
  return {
    pass: isExpectedValuePresent
      ? hasAttribute && this.equals(receivedValue, expectedValue)
      : hasAttribute,
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const receivedAttribute = hasAttribute
        ? printAttribute(this.utils.stringify, name, receivedValue)
        : null
      const matcher = this.utils.matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveAttribute`,
        'element',
        this.utils.printExpected(name),
        {
          secondArgument: isExpectedValuePresent
            ? this.utils.printExpected(expectedValue)
            : undefined,
          comment: getAttributeComment(
            this.utils.stringify,
            name,
            expectedValue,
          ),
        },
      )
      return getMessage(
        this,
        matcher,
        `Expected the element ${to} have attribute`,
        printAttribute(this.utils.stringify, name, expectedValue),
        'Received',
        receivedAttribute,
      )
    },
  }
}
