const config = require('@expo/webpack-config/webpack/webpack.dev.js');
const merge = require('webpack-merge');

const modelLoaderConfiguration = {
  test: /\.(obj|mtl)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
      },
    },
  ],
};

module.exports = function(env = {}) {
  return merge(config(env), {
    module: {
      rules: [modelLoaderConfiguration],
    },
  });
};
