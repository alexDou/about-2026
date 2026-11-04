// Rspack JS minimizer backed by Oxc (oxc-minify), replacing Rspack's default SwcJsMinimizerRspackPlugin.
import { minifySync } from "oxc-minify";

const PLUGIN = "OxcMinifyRspackPlugin";

export class OxcMinifyRspackPlugin {
  /** @param {import("@rspack/core").Compiler} compiler */
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.compilation.tap(PLUGIN, (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: PLUGIN, stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE },
        (assets) => {
          for (const name of Object.keys(assets)) {
            if (!/\.[cm]?js$/i.test(name)) continue;
            const asset = compilation.getAsset(name);
            if (!asset || asset.info.minimized) continue;
            const { source: original, map: originalMap } = asset.source.sourceAndMap();
            const result = minifySync(name, String(original), {
              module: false,
              compress: true,
              mangle: true,
              sourcemap: true,
            });
            if (result.errors.length > 0) {
              const message = result.errors.map((e) => e.codeframe ?? e.message).join("\n");
              compilation.errors.push(
                new compiler.webpack.WebpackError(`${PLUGIN} ${name}\n${message}`),
              );
              continue;
            }
            const minified = result.map
              ? new sources.SourceMapSource(
                  result.code,
                  name,
                  result.map,
                  String(original),
                  originalMap ?? undefined,
                  true,
                )
              : new sources.RawSource(result.code);
            compilation.updateAsset(name, minified, { ...asset.info, minimized: true });
          }
        },
      );
    });
  }
}
