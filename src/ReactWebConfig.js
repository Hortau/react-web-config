'use strict';

const webpack = require('webpack');
const { config } = require('dotenv');

function ReactWebConfig(path) {
  const env = config({ path }).parsed;
  return new webpack.DefinePlugin({
    '__REACT_WEB_CONFIG__': JSON.stringify(env)
  });
}

module.exports = { ReactWebConfig };
