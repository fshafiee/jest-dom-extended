import { checkHtmlElement, getMessage, normalize } from './utils.js'

// See aria-errormessage spec https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
export function toHaveErrorMessage(
  htmlElement: Element,
  expectedMessage?: string | RegExp,
) {
  checkHtmlElement(htmlElement, toHaveErrorMessage, this)

  if (
    !htmlElement.hasAttribute('aria-invalid') ||
    htmlElement.getAttribute('aria-invalid') === 'false'
  ) {
    const not = this.isNot ? '.not' : ''

    return {
      pass: false,
      message: () => {
        return getMessage(
          this,
          this.utils.matcherHint(`${not}.toHaveErrorMessage`, 'element', ''),
          `Expected the element to have invalid state indicated by`,
          'aria-invalid="true"',
          'Received',
          htmlElement.hasAttribute('aria-invalid')
            ? `aria-invalid="${htmlElement.getAttribute('aria-invalid')}"`
            : this.utils.printReceived(''),
        )
      },
    }
  }

  const expectsErrorMessage = expectedMessage !== undefined

  const errormessageIDRaw = htmlElement.getAttribute('aria-errormessage') || ''
  const errormessageIDs = errormessageIDRaw.split(/\s+/).filter(Boolean)

  let errormessage = ''
  if (errormessageIDs.length > 0) {
    const document = htmlElement.ownerDocument

    const errormessageEls = errormessageIDs
      .map(errormessageID => document.getElementById(errormessageID))
      .filter(Boolean)

    errormessage = normalize(
      errormessageEls.map(el => el?.textContent).join(' '),
    )
  }

  return {
    pass: expectsErrorMessage
      ? expectedMessage instanceof RegExp
        ? expectedMessage.test(errormessage)
        : this.equals(errormessage, expectedMessage)
      : Boolean(errormessage),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveErrorMessage`,
          'element',
          '',
        ),
        `Expected the element ${to} have error message`,
        this.utils.printExpected(expectedMessage),
        'Received',
        this.utils.printReceived(errormessage),
      )
    },
  }
}
