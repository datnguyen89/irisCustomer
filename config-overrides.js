const {
  override,
  fixBabelImports,
  addLessLoader,
  disableEsLint,
  addDecoratorsLegacy,
  useBabelRc,
} = require('customize-cra')

module.exports = override(
  disableEsLint(),
  useBabelRc(),
  addDecoratorsLegacy(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  }),
)