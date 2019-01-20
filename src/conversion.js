module.exports = function conversion (file) {
  return !file.template
    ? onlyScript(file)
    : !file.script
        ? onlyTemplate(file)
        : completeFormat(file)
}

function completeFormat (file) {
  let newCode
  const scrCode = file.script.content
  const tempStr = file.template.content.replace(/`/g, '\\`')
  const string = `\`${tempStr}\`\n`
  const method = `template () { return \`${tempStr}\`; }\n`

  newCode = replaceMethod(scrCode, method)
  newCode = replaceString(newCode, string)
  
  if (file.options.needGrass) {
    newCode = `import Grass from '${file.options.lib}';\n` + newCode
  }
  return newCode
}

function onlyTemplate (file) {
  /**
   * optsion
   * name: function name -> string
   * styleSrc: string
   */
  const options = file.template.options
  const tempStr = file.template.content.replace(/`/g, '\\`')

  let method = options.name
    ? `function ${options.name}()`
    : 'function ()'

  method += ` { return \`${tempStr}\`; }`

  if (options.styleSrc) {
    let newCode = `import Grass from '${file.options.lib}';\n`
    newCode += `import _style from ${options.styleSrc};\n`
    newCode += `export default Grass.CSSModules(_style)(${method})`
    return newCode
  }

  return `export default ${method}`
}

function onlyScript (file) {
  const { lib, needGrass } = file.options
  const content = file.script.content

  if (!needGrass) return content
  return `import Grass from '${lib}';\n` + content
}

function replaceMethod (code, method) {
  // "//#temp method" or "//#temp"
  return code.replace(/\/\/\s*#temp(\s+method)?\s*\n/g, method)
}

function replaceString(code, string) {
  // "//#temp string" or "/*#temp string*/"
  const newCode = code.replace(/\/\/\s*#temp\s+string?\s*\n/g, string)
  return newCode.replace(/\/\*\s*#temp\s+string?\s*\*\//g, string)
}