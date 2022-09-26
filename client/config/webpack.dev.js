const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { stylePaths } = require("./stylePaths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const helpers = require("../../server/helpers");
const brandType = process.env["PROFILE"] || "konveyor";
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const deps = require("../../client/package.json").dependencies;

module.exports = merge(common("development"), {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 9000,
    proxy: {
      // NOTE: Any future non-UI paths handled by ../../server/index.js should be added here.
      "/auth": "http://localhost:8080",
      "/hub": "http://localhost:8080",
    },
    historyApiFallback: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({
      // In dev mode, populate window._env at build time
      filename: "index.html",
      template: path.resolve(__dirname, "../public/index.html.ejs"),
      favicon: path.resolve(__dirname, `../public/${brandType}-favicon.ico`),
      templateParameters: {
        _env: helpers.getEncodedEnv(),
        brandType,
      },
    }),
    new ModuleFederationPlugin({
      name: "core",
      remotes: {
        plugin: "plugin@http://localhost:3003/remoteEntry.js",
      },
      shared: {
        react: { eager: true, singleton: true },
        "react-dom": { eager: true, singleton: true },
      },
    }),
    new ExternalTemplateRemotesPlugin(),
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
