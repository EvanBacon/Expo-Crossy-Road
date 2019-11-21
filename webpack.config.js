const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const isProd = env.mode === 'production';
  const config = await createExpoWebpackConfigAsync({ ...env, removeUnusedImportExports: isProd, report: isProd }, argv);
  // Customize the config before returning it.
  return config;
};
