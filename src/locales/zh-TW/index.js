const requireModule = require.context('.', true, /^((?!index).)*\.js$/)
const modulesCache = {}

requireModule.keys().forEach((fileName) => {
  const moduleDefinition = requireModule(fileName)
  const modulePath = fileName
    .replace(/^\.\//, '')
    .replace(/\.\w+$/, '')
    .toUpperCase()
  modulesCache[modulePath] = moduleDefinition.default
})

export default modulesCache
