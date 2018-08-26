module.exports = function conversion ({script, template}, options) {
  return script
    ? classCompInsertTemplate(script, template.html)
    : createNoStateComp(template, options)
}

function classCompInsertTemplate (script, html) {
  const method = createTemplate(html)
  const positionReg = /(extends\s[\w]*\.?Component+\s*\{)([\s\S]*)(constructor\s*\([^\(\)]*\)\s*\{)/

  return script.code.replace(positionReg, (k1, k2, k3, k4) => {
    return k2 + '\n' + k3 + '\n' + method + '\n' + k4
  })
}

function createTemplate (html) {
  return 'template () { return `' + escapeTemplate(html) + '`}'
}

function createNoStateComp ({html, attrs}, options) {
  const GrassLibPath = options.libPath || 'tt-grass'
  const funName = attrs.name || 'unknow'
  const styleSrc = attrs.styleSrc
  let scopeStyle = ''

  if (styleSrc) {
    scopeStyle = `
      var style = require('${styleSrc}')

      require('${GrassLibPath}').CSSModules(style)(${funName})
    `
  }

  return scopeStyle + '\n\n' +
    `
      function ${funName} () {
        return \`${escapeTemplate(html)}\`
      }

      module.exports = ${funName}
    `
}

function escapeTemplate (html) {
  return html.replace(/`/g, '\`')
}