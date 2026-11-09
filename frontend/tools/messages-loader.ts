// Rspack loader for the ICU message files in src/i18n/: compiles each message to a FormatJS AST at
// build time, so the bundle ships without the ICU parser (the `no-parser` alias in rspack.config.ts).
// The output is the same as `formatjs compile --ast`, made with the parser version that is installed.
import { parse } from "@formatjs/icu-messageformat-parser";
import type { LoaderDefinitionFunction } from "@rspack/core";

/** A message file (`{ id: ICU string }`) as JSON with every message compiled to its AST. */
export function compileMessages(source: string): string {
  const messages = JSON.parse(source) as Record<string, string>;
  const compiled = Object.entries(messages).map(([id, message]) => {
    try {
      return [id, parse(message)];
    } catch (error) {
      throw new Error(`Invalid ICU message "${id}": ${String(error)}`, { cause: error });
    }
  });
  return JSON.stringify(Object.fromEntries(compiled));
}

const messagesLoader: LoaderDefinitionFunction = (source) => compileMessages(source);

export default messagesLoader;
