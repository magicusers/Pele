const presets = [
  [
      "@babel/preset-env",
      {
          "targets": {
              "browsers": "last 2 versions, > 5%, ie > 9",
              "node": "current"
          },
      },
  ],
];
const plugins = [
  "@babel/plugin-transform-runtime",
]
module.exports = { presets, plugins };