const conversion = require('./conversion')
const getOptions = require('loader-utils').getOptions

module.exports = function loader (source) {
  source = source.trim()
  if (/^\/\/\s*#no\s+compile\s*\n/.test(source)) {
    this.callback(null, source)
    return
  }

  const result = handleSource(source)
  // if no template and script，it's not grass file
  if (!result || (!result.script && !result.template)) {
    this.callback(null, source)
    return
  }

  /**
   * options:
   * lib: string
   * needGrass: boolean
   **/
  result.options = dealWithOptions(getOptions(this))
  const newSource = conversion(result)

  this.callback(null, newSource
    ? newSource
    : source
  )
}

function handleSource (source) {
  if (!source) return null

  const template = getTagContent(/<\s*template(\s*[^<>]*|\s*)>([\s\S]+)<\/\s*template\s*>/, source)
  const script = getTagContent(/<\s*script(\s*[^<>]*|\s*)>([\s\S]+)<\/\s*script\s*>/, source)

  return {
    script,
    template,
    options: null,
  }
}

function getTagContent (reg, source) {
  const res = source.match(reg)
  if (res) {
    return {
      content: res[2].trim(),
      options: getTagOptions(res[1].trim())
    }
  }
  return null
}

function getTagOptions (str) {
  const options = Object.create(null)
  if (!str) return options

  let result, i = 0
  const reg = /\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))/g

  while (result = reg.exec(str)) {
    const name = result[1]
    const val = result[3] || result[4] || result[5]
  
    if (name && val !== undefined) {
      options[name] = val
    }
    if (++i > 2) break
  }

  return options
}

function dealWithOptions (opts) {
  opts = opts || {}
  opts.lib = opts.lib || '@rustle/grass'
  opts.needGrass = opts.needGrass || false
  return opts
}