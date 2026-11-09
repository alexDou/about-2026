import { OctaneRspackPlugin } from "@octanejs/rspack-plugin";
import { defineConfig } from "@rspack/cli";
import { HtmlRspackPlugin, LightningCssMinimizerRspackPlugin } from "@rspack/core";
import { OxcMinifyRspackPlugin } from "./tools/oxc-minify-plugin.mjs";

// Toolchain: Octane compiler (@tsrx/oxc) -> Oxc TS stripping (tools/oxc-loader.mjs) -> Rspack.
// JS minified by Oxc (tools/oxc-minify-plugin.mjs). No SWC, esbuild or Babel.
// CSS Modules use Rspack's native CSS support. CSS is minified by Lightning CSS (Oxc has no CSS minifier).
export default defineConfig((_env, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: { main: "./src/main.ts" },
    output: { clean: true, publicPath: "/" },
    resolve: {
      extensions: [".tsrx", ".ts", ".tsx", ".js"],
      // The messages arrive precompiled (tools/messages-loader.ts), so FormatJS needs no ICU parser.
      alias: {
        "@formatjs/icu-messageformat-parser$": "@formatjs/icu-messageformat-parser/no-parser.js",
      },
    },
    optimization: {
      minimizer: [new OxcMinifyRspackPlugin(), new LightningCssMinimizerRspackPlugin()],
    },
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.(?:tsrx|tsx|ts)$/i,
          exclude: /node_modules/,
          type: "javascript/auto",
          use: [{ loader: "./tools/oxc-loader.mjs", options: { target: "es2023" } }],
        },
        {
          test: /[\\/]src[\\/]i18n[\\/].+\.json$/i,
          use: [{ loader: "./tools/messages-loader.ts" }],
        },
        { test: /\.css$/i, type: "css/auto" },
        { test: /\.svg$/i, type: "asset/resource" },
      ],
      parser: {
        "css/auto": { namedExports: false },
      },
      generator: {
        "css/auto": {
          exportsConvention: "camel-case-only",
          localIdentName: isProd ? "[hash:base64:6]" : "[folder]__[local]__[hash:base64:4]",
        },
      },
    },
    plugins: [
      new OctaneRspackPlugin({ transpile: false }),
      new HtmlRspackPlugin({ template: "./index.html" }),
    ],
    devServer: {
      port: 5173,
      historyApiFallback: true,
      proxy: [{ context: ["/api"], target: "http://127.0.0.1:8000" }],
    },
  };
});
