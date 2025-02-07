import { checkHtmlElement, getTag } from './utils.js'

const FORM_TAGS = ['form', 'input', 'select', 'textarea']

function isElementHavingAriaInvalid(element) {
  return (
    element.hasAttribute('aria-invalid') &&
    element.getAttribute('aria-invalid') !== 'false'
  )
}

function isSupportsValidityMethod(element) {
  return FORM_TAGS.includes(getTag(element))
}

function isElementInvalid(element) {
  const isHaveAriaInvalid = isElementHavingAriaInvalid(element)
  if (isSupportsValidityMethod(element)) {
    return isHaveAriaInvalid || !element.checkValidity()
  } else {
    return isHaveAriaInvalid
  }
}

export function toBeInvalid(element) {
  checkHtmlElement(element, toBeInvalid, this)

  const isInvalid = isElementInvalid(element)

  return {
    pass: isInvalid,
    message: () => {
      const is = isInvalid ? 'is' : 'is not'
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeInvalid`,
          'element',
          '',
        ),
        '',
        `Received element ${is} currently invalid:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

export function toBeValid(element) {
  checkHtmlElement(element, toBeValid, this)

  const isValid = !isElementInvalid(element)

  return {
    pass: isValid,
    message: () => {
      const is = isValid ? 'is' : 'is not'
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeValid`,
          'element',
          '',
        ),
        '',
        `Received element ${is} currently valid:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
