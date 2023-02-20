import redent from 'redent'
import isEqual from 'lodash.isequal'

class GenericTypeError extends Error {
  constructor(expectedString, received, matcherFn, context) {
    super()

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn)
    }
    let withType = ''
    try {
      withType = context.utils.printWithType(
        'Received',
        received,
        context.utils.printReceived,
      )
    } catch (e) {
      // Can throw for Document:
      // https://github.com/jsdom/jsdom/issues/2304
    }
    this.message = [
      context.utils.matcherHint(
        `${context.isNot ? '.not' : ''}.${matcherFn.name}`,
        'received',
        '',
      ),
      '',
      // eslint-disable-next-line @babel/new-cap
      `${context.utils.RECEIVED_COLOR(
        'received',
      )} value must ${expectedString}.`,
      withType,
    ].join('\n')
  }
}

class HtmlElementTypeError extends GenericTypeError {
  constructor(received, matcherFn, context) {
    super('be an HTMLElement or an SVGElement', received, matcherFn, context)
  }
}

class NodeTypeError extends GenericTypeError {
  constructor(received, matcherFn, context) {
    super('be a Node', received, matcherFn, context)
  }
}

function checkHasWindow(htmlElement, ErrorClass, ...args) {
  if (
    !htmlElement ||
    !htmlElement.ownerDocument ||
    !htmlElement.ownerDocument.defaultView
  ) {
    throw new ErrorClass(htmlElement, ...args)
  }
}

function checkNode(node, matcherFn, context) {
  checkHasWindow(node, NodeTypeError, matcherFn, context)
  const window = node.ownerDocument.defaultView

  if (!(node instanceof window.Node)) {
    throw new NodeTypeError(node, matcherFn, context)
  }
}

function checkHtmlElement(htmlElement, matcherFn, context) {
  checkHasWindow(htmlElement, HtmlElementTypeError, matcherFn, context)
  const window = htmlElement.ownerDocument.defaultView

  if (
    !(htmlElement instanceof window.HTMLElement) &&
    !(htmlElement instanceof window.SVGElement)
  ) {
    throw new HtmlElementTypeError(htmlElement, matcherFn, context)
  }
}

function display(context, value) {
  return typeof value === 'string' ? value : context.utils.stringify(value)
}

function getMessage(
  context,
  matcher,
  expectedLabel,
  expectedValue,
  receivedLabel,
  receivedValue,
) {
  return [
    `${matcher}\n`,
    // eslint-disable-next-line @babel/new-cap
    `${expectedLabel}:\n${context.utils.EXPECTED_COLOR(
      redent(display(context, expectedValue), 2),
    )}`,
    // eslint-disable-next-line @babel/new-cap
    `${receivedLabel}:\n${context.utils.RECEIVED_COLOR(
      redent(display(context, receivedValue), 2),
    )}`,
  ].join('\n')
}

function matches(textToMatch, matcher) {
  if (matcher instanceof RegExp) {
    return matcher.test(textToMatch)
  } else {
    return textToMatch.includes(String(matcher))
  }
}

function deprecate(name: string, replacementText?: string) {
  // Notify user that they are using deprecated functionality.
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: ${name} has been deprecated and will be removed in future updates.`,
    replacementText,
  )
}

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim()
}

function getTag(element) {
  return element.tagName && element.tagName.toLowerCase()
}

function getSelectValue(
  multiple: boolean,
  options: HTMLSelectElement['options'],
) {
  const selectedOptions = [...options].filter(option => option.selected)

  if (multiple) {
    return [...selectedOptions].map(opt => opt.value)
  }
  /* istanbul ignore if */
  if (selectedOptions.length < 1) {
    return undefined // Couldn't make this happen, but just in case
  }
  return selectedOptions.at(0)?.value
}

function getInputValue(inputElement: HTMLInputElement) {
  switch (inputElement.type) {
    case 'number':
      return inputElement.value === '' ? null : Number(inputElement.value)
    case 'checkbox':
      return inputElement.checked
    default:
      return inputElement.value
  }
}

function getSingleElementValue(element: HTMLElement) {
  /* istanbul ignore if */
  if (!element) {
    return undefined
  }
  if (isInputElement(element)) {
    return getInputValue(element)
  }
  if (isSelectElement(element)) {
    return getSelectValue(element.multiple, element.options)
  }
  if (isTextareaElement(element)) {
    return element.value
  }
  return ''
}

function compareArraysAsSet(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return isEqual(new Set(a), new Set(b))
  }
  return undefined
}

function toSentence(
  array,
  { wordConnector = ', ', lastWordConnector = ' and ' } = {},
) {
  return [array.slice(0, -1).join(wordConnector), array[array.length - 1]].join(
    array.length > 1 ? lastWordConnector : '',
  )
}

const isInputElement = (el: Element): el is HTMLInputElement => {
  return el.tagName.toLowerCase() === 'input'
}

const isSelectElement = (el: Element): el is HTMLSelectElement => {
  return el.tagName.toLowerCase() === 'select'
}

const isOptionElement = (el: Element): el is HTMLOptionElement => {
  return el.tagName.toLowerCase() === 'option'
}

const isTextareaElement = (el: Element): el is HTMLTextAreaElement => {
  return el.tagName.toLowerCase() === 'textarea'
}

const isCheckableInput = (el: Element) => {
  return isInputElement(el) && ['checkbox', 'radio'].includes(el.type)
}

export {
  HtmlElementTypeError,
  NodeTypeError,
  checkHtmlElement,
  checkNode,
  deprecate,
  getMessage,
  matches,
  normalize,
  getTag,
  getSingleElementValue,
  compareArraysAsSet,
  toSentence,
  isInputElement,
  isSelectElement,
  isOptionElement,
  isTextareaElement,
  isCheckableInput,
}
