const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { stylePaths } = require("./stylePaths");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const deps = require("../../client/package.json").dependencies;

const helpers = require("../../server/helpers");

module.exports = merge(common("development"), {
  mode: "development",
  devtool: "eval-source-map",
  watch: true,
  watchOptions: {
    ignored: ["../node_modules"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // In dev mode, populate window._env at build time
      filename: "index.html",
      template: path.resolve(__dirname, "../public/index.html.ejs"),
      favicon: path.resolve(__dirname, "../public/favicon.ico"),
      templateParameters: {
        _env: helpers.getEncodedEnv(),
      },
    }),
    new ExternalTemplateRemotesPlugin(),

    new ModuleFederationPlugin({
      name: "core",
      remotes: {
        plugin: "plugin@http://localhost:3003/remoteEntry.js",
      },
      // shared: {
      //   ...deps,
      //   react: {
      //     eager: true,
      //     singleton: true,
      //     requiredVersion: deps.react,
      //   },
      //   "react-dom": {
      //     singleton: true,
      //     requiredVersion: deps["react-dom"],
      //   },
      // },
      shared: {
        react: { eager: true, singleton: true },
        "react-dom": { eager: true, singleton: true },
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        include: [...stylePaths],
        use: ["style-loader", "css-loader"],
      },
    ],
  },
});
