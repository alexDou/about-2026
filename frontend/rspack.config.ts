import { OctaneRspackPlugin } from "@octanejs/rspack-plugin";
import { defineConfig } from "@rspack/cli";
import {
  CopyRspackPlugin,
  HtmlRspackPlugin,
  LightningCssMinimizerRspackPlugin,
} from "@rspack/core";
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
      // The message files are FormatJS ASTs already, so the bundle needs no ICU parser.
      alias: {
        "@formatjs/icu-messageformat-parser$": "@formatjs/icu-messageformat-parser/no-parser.js",
      },
    },
    optimization: {
      minimizer: [new OxcMinifyRspackPlugin(), new LightningCssMinimizerRspackPlugin()],
    },
    // The router binding spells out dependency arrays the compiler could infer, and the compiler
    // hints at every one. That source is not ours to edit: hide this hint for that package only.
    ignoreWarnings: [
      {
        module: /@octanejs[\\/]tanstack-router/,
        message: /dependency array is redundant/,
      },
    ],
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.(?:tsrx|tsx|ts)$/i,
          // Packages ship compiled JS, except the Octane router binding: it ships TypeScript source.
          exclude: /node_modules(?!.*@octanejs[\\/]tanstack-router)/,
          type: "javascript/auto",
          use: [{ loader: "./tools/oxc-loader.mjs", options: { target: "es2023" } }],
        },
        { test: /\.css$/i, type: "css/auto" },
        { test: /\.(?:svg|woff2)$/i, type: "asset/resource" },
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
      // public/ (robots.txt) is served from the site root.
      new CopyRspackPlugin({
        patterns: [
          { from: "public" },
          // The font is bundled, so its OFL license travels with it.
          { from: "src/styles/fonts/OFL.txt", to: "licenses/OverusedGrotesk-OFL.txt" },
        ],
      }),
    ],
    devServer: {
      port: 5173,
      historyApiFallback: true,
      proxy: [{ context: ["/api"], target: "http://127.0.0.1:8000" }],
    },
  };
});
