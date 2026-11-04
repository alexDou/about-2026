// Rspack loader that strips TypeScript with Oxc (oxc-transform), standing in for
// the SWC step @octanejs/rspack-plugin adds by default (`transpile: false` turns that off).
// It runs after the Octane compiler, so JSX is already compiled to JS by this point.
import { transformSync } from "oxc-transform";

/** @this {import("@rspack/core").LoaderContext<{ target?: string }>} */
export default function oxcLoader(source, inputMap) {
  const { target = "es2023" } = this.getOptions() ?? {};
  const lang = /\.tsx$|\.tsrx$/i.test(this.resourcePath) ? "tsx" : "ts";
  const result = transformSync(this.resourcePath, source, {
    lang,
    sourceType: "module",
    target,
    sourcemap: this.sourceMap,
    typescript: { onlyRemoveTypeImports: false },
  });
  if (result.errors.length > 0) {
    this.callback(new Error(result.errors.map((e) => e.codeframe ?? e.message).join("\n")));
    return;
  }
  this.callback(null, result.code, result.map ?? inputMap);
}
