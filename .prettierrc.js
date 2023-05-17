const organizeImports = require('prettier-plugin-organize-imports')

module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  plugins: [organizeImports],
  organizeImportsSkipDestructiveCodeActions: true, // default: false
}
