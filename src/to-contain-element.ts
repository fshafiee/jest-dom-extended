import { checkHtmlElement } from './utils.js'

export function toContainElement(container: Element, element: Element) {
  checkHtmlElement(container, toContainElement, this)

  if (element !== null) {
    checkHtmlElement(element, toContainElement, this)
  }

  return {
    pass: container.contains(element),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toContainElement`,
          'element',
          'element',
        ),
        '',
        // eslint-disable-next-line @babel/new-cap
        this.utils.RECEIVED_COLOR(`${this.utils.stringify(
          container.cloneNode(false),
        )} ${
          this.isNot ? 'contains:' : 'does not contain:'
        } ${this.utils.stringify(element ? element.cloneNode(false) : element)}
        `),
      ].join('\n')
    },
  }
}
