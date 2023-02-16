import { checkHtmlElement, isInputElement } from './utils.js'

export function toBePartiallyChecked(element: Element) {
  checkHtmlElement(element, toBePartiallyChecked, this)

  const isValidInput = () => {
    return isInputElement(element) && element.type === 'checkbox'
  }

  const isValidAriaElement = () => {
    return element.getAttribute('role') === 'checkbox'
  }

  if (!isValidInput() && !isValidAriaElement()) {
    return {
      pass: false,
      message: () =>
        'only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with .toBePartiallyChecked(). Use .toHaveValue() instead',
    }
  }

  const isPartiallyChecked = () => {
    const isAriaMixed = element.getAttribute('aria-checked') === 'mixed'

    if (isValidInput()) {
      return element.hasAttribute('indeterminate') || isAriaMixed
    }

    return isAriaMixed
  }

  return {
    pass: isPartiallyChecked(),
    message: () => {
      const is = isPartiallyChecked() ? 'is' : 'is not'
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBePartiallyChecked`,
          'element',
          '',
        ),
        '',
        `Received element ${is} partially checked:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
