import { ARIARoleDefintionKey, roles } from 'aria-query'
import { checkHtmlElement, toSentence, isCheckableInput } from './utils.js'

export function toBeChecked(element: Element) {
  checkHtmlElement(element, toBeChecked, this)

  const isValidAriaElement = (el: Element) => {
    return (
      roleSupportsChecked(el.getAttribute('role') as ARIARoleDefintionKey) &&
      ['true', 'false'].includes(el.getAttribute('aria-checked') ?? '')
    )
  }

  if (!isCheckableInput(element) && !isValidAriaElement(element)) {
    return {
      pass: false,
      message: () =>
        `only inputs with type="checkbox" or type="radio" or elements with ${supportedRolesSentence()} and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead`,
    }
  }

  const isChecked = (el: Element) => {
    if (isCheckableInput(el)) return el.hasAttribute('checked')
    return element.getAttribute('aria-checked') === 'true'
  }

  return {
    pass: isChecked(element),
    message: () => {
      const is = isChecked(element) ? 'is' : 'is not'
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeChecked`,
          'element',
          '',
        ),
        '',
        `Received element ${is} checked:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

function supportedRolesSentence() {
  return toSentence(
    supportedRoles().map(role => `role="${role}"`),
    { lastWordConnector: ' or ' },
  )
}

function supportedRoles() {
  return Array.from(roles.keys()).filter(r => roleSupportsChecked(r))
}

function roleSupportsChecked(role: ARIARoleDefintionKey) {
  return roles.get(role)?.props['aria-checked'] !== undefined
}
