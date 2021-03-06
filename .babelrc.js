module.exports = function(api) {
  const plugins = ['@babel/plugin-transform-flow-strip-types']
  const presets = [
    [
      '@babel/preset-env',
      api.env('es5')
        ? { forceAllTransforms: true }
        : { targets: { node: 'current' } },
    ],
    '@babel/preset-flow',
  ]

  if (api.env('coverage')) {
    plugins.push('babel-plugin-istanbul')
  }

  return { plugins, presets }
}
