module.exports = {
  presets: [ ['@vue/app',{useBuiltIns: 'entry' }]],
  "plugins": [
    "@babel/plugin-syntax-optional-chaining",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
};
