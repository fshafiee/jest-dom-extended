import { checkHtmlElement } from './utils.js'

export function toBeInTheDocument(element: Element) {
  if (element !== null || !this.isNot) {
    checkHtmlElement(element, toBeInTheDocument, this)
  }

  const pass =
    element === null
      ? false
      : element.ownerDocument === element.getRootNode({ composed: true })

  const errorFound = () => {
    return `expected document not to contain element, found ${this.utils.stringify(
      element.cloneNode(true),
    )} instead`
  }
  const errorNotFound = () => {
    return `element could not be found in the document`
  }

  return {
    pass,
    message: () => {
      const messageParts: Array<string> = [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeInTheDocument`,
          'element',
          '',
        ),
        '',
        // eslint-disable-next-line @babel/new-cap
        this.utils.RECEIVED_COLOR(this.isNot ? errorFound() : errorNotFound()),
      ]
      return messageParts.join('\n')
    },
  }
}
