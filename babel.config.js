const presets = [
  [
      "@babel/preset-env",
      {
          "targets": {
              "browsers": "cover 90%, > 1%",
              "node": "current"
          },
      },
  ],
];
const plugins = [
  "@babel/plugin-transform-runtime",
]
module.exports = { presets, plugins };