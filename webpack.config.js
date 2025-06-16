const path = require('path');

module.exports = {
  // Entry point of your app
  entry: './src/index.js',

  // Output bundle location
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Other configurations like loaders...

  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      util: false,
      // Add other polyfills if needed, e.g.:
      // buffer: require.resolve('buffer/'),
    },
  },

  // Plugins, devServer etc...
};
