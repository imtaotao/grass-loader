const conversion = require('./conversion')
const getOptions = require('loader-utils').getOptions

module.exports = function grassLoader (source) {
  const result = handleSource(source)

  if (!result) {
    this.callback(null, source)
    return
  }
  const options = getOptions(this)
  const newSource = conversion(result, options)

  this.callback(
      null,
      newSource
        ? newSource
        : source
  )

  return
}

function handleSource (source) {
  const templateReg = /<\s*template(\s*[^<>]*|\s*)>([\s\S]+)<\/\s*template\s*>/
  const scripteReg = /<\s*script(\s*[^<>]*|\s*)>([\s\S]+)<\/\s*script\s*>/
  let template
  let script
  let scriptRes

  if (script = source.match(scripteReg)) {
    const code = script[2]
  
    if (code) {
      const hasTemplateMethod = /(extends\s[\w]*\.?Component+\s*\{)([\s\S]+(template))/
      if (hasTemplateMethod.test(code)) {
        return false
      }
    }

    const attrs = getTagAttrs(script[1])

    srouce = source.replace(script[0], '')

    scriptRes = { code, attrs }
  }

  if (template = source.match(templateReg)) {
    const html = template[2]

    if (html) {
      const attrs = getTagAttrs(template[1])

      return {
        script: scriptRes,
        template: {
          html,
          attrs,
        }
      }
    }
  }
  
  return false
}

function getTagAttrs (str) {
  const reg = /\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))/g
  const attrs = Object.create(null)
  let result
  let i = 0
  
  while (result = reg.exec(str)) {
    const attrName = result[1]
    const attrValue = result[3]

    if (attrName  && attrValue !== undefined) {
      attrs[attrName] = attrValue
    }

    if (i++ > 999) {
      break
    }
  }
  
  return attrs
}