"use strict";

// src/ReactWebConfig.js
var webpack = require("webpack");
var { config } = require("dotenv");
function ReactWebConfig(path) {
  const env = config({ path }).parsed;
  return new webpack.DefinePlugin({
    __REACT_WEB_CONFIG__: JSON.stringify(env)
  });
}
module.exports = { ReactWebConfig };
