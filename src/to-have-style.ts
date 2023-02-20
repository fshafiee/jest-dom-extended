import chalk from 'chalk'
import { checkHtmlElement } from './utils.js'

function isSubset(
  styles: Record<string, number | string>,
  computedStyle: Partial<CSSStyleDeclaration>,
) {
  return (
    !!Object.keys(styles).length &&
    Object.entries(styles).every(
      ([prop, value]) =>
        computedStyle[prop] === value ||
        (computedStyle.getPropertyValue &&
          computedStyle.getPropertyValue(prop.toLowerCase()) === value),
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
function expectedDiff(
  diffFn,
  expected: Record<string, number | string>,
  computedStyles: CSSStyleDeclaration,
) {
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
  expectedCssStyle: Record<string, string | number>,
) {
  checkHtmlElement(htmlElement, toHaveStyle, this)
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

  const received = getComputedStyle(htmlElement)

  return {
    pass: isSubset(expectedCssStyle, received),
    message: () => {
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`
      return [
        this.utils.matcherHint(matcher, 'element', ''),
        expectedDiff(this.utils.diff, expectedCssStyle, received),
      ].join('\n\n')
    },
  }
}
