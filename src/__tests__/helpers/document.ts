let _document: Document
if (global.document) {
  _document = global.document
} else {
  const { JSDOM } = require('jsdom')
  const { window } = new JSDOM()

  _document = window.document
}

export const document: Document = _document
