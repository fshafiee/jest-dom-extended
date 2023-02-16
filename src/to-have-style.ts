import chalk from 'chalk'
import { checkHtmlElement, parseCSS } from './utils.js'

function getStyleDeclaration(document, css) {
  const styles = {}

  // The next block is necessary to normalize colors
  const copy = document.createElement('div')
  Object.keys(css).forEach(property => {
    copy.style[property] = css[property]
    styles[property] = copy.style[property]
  })

  return styles
}

function isSubset(styles, computedStyle) {
  return (
    !!Object.keys(styles).length &&
    Object.entries(styles).every(
      ([prop, value]) =>
        computedStyle[prop] === value ||
        computedStyle.getPropertyValue(prop.toLowerCase()) === value,
    )
  )
}

function printoutStyles(styles) {
  return Object.keys(styles)
    .sort()
    .map(prop => `${prop}: ${styles[prop]};`)
    .join('\n')
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(diffFn, expected, computedStyles: CSSStyleDeclaration) {
  const received = Array.from(computedStyles)
    .filter(prop => expected[prop] !== undefined)
    .reduce(
      (obj, prop) =>
        Object.assign(obj, { [prop]: computedStyles.getPropertyValue(prop) }),
      {},
    )
  const diffOutput = diffFn(printoutStyles(expected), printoutStyles(received))
  // Remove the "+ Received" annotation because this is a one-way diff
  return diffOutput.replace(`${chalk.red('+ Received')}\n`, '')
}

export function toHaveStyle(
  htmlElement: Element,
  css: Partial<CSSStyleDeclaration> | Record<string, number | string> | string,
) {
  checkHtmlElement(htmlElement, toHaveStyle, this)
  const parsedCSS =
    typeof css === 'object' ? css : parseCSS(css, toHaveStyle, this)
  const { getComputedStyle } = htmlElement.ownerDocument.defaultView ?? {}

  if (!getComputedStyle) {
    return {
      pass: false,
      message: () => {
        const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`
        return [
          this.utils.matcherHint(matcher, 'element', ''),
          'Unable to get computed style. Document does not have a defaultView ',
        ].join('\n\n')
      },
    }
  }

  const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS)
  const received = getComputedStyle(htmlElement)

  return {
    pass: isSubset(expected, received),
    message: () => {
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`
      return [
        this.utils.matcherHint(matcher, 'element', ''),
        expectedDiff(this.utils.diff, expected, received),
      ].join('\n\n')
    },
  }
}
