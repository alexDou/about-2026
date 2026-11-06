// TSRX compiler entry for @tsrx/content-mapper, so tsrs (`--runExternalCode`) can type-check .tsrx.
// The mapper calls `compile_to_volar_mappings`; octane 0.16.7 exports it as `compileToVolarMappings`.
// Delete this package once octane or @tsrx/content-mapper agree on the name, and point
// tsconfig `tsrx.compiler` at "octane/compiler" directly.
export { compileToVolarMappings as compile_to_volar_mappings } from "octane/compiler";
