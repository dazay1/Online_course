const path = require("path");

module.exports = {
  // Entry point of your app
  entry: "./src/index.js",

  // Output bundle location
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  // Other configurations like loaders...

  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      util: false,
      // Add other polyfills if needed, e.g.:
      // buffer: require.resolve('buffer/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              // Add any options you need here
            },
          },
          "url-loader", // or 'file-loader' if you want to load the SVG as a file
        ],
      },
      // Other rules...
    ],
  },

  // Plugins, devServer etc...
};
