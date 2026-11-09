# FormatJS core instead of react-intl

UI text and Panel content are ICU messages formatted by `@formatjs/intl`, the engine react-intl is built on, behind our own thin Octane binding (an `IntlProvider` and a `useIntl()` hook). react-intl itself cannot run in Octane components: there is no Octane port, and `octane/react` offers no React-compatible API to alias. It only hosts real React 19 subtrees in separate islands (`ReactCompat`). The FormatJS core keeps react-intl's message format, `formatMessage`/`defineMessages` API and CLI, so nothing about the content changes. Message ids are typed from the English JSON, so an unknown id fails the type check.

## Considered Options

- react-intl inside `ReactCompat` islands: ships React and ReactDOM beside Octane, and every translated text becomes a separate React root that cannot read Octane context.
- `@octanejs/i18next`, Octane's maintained port of react-i18next: it works, but i18next's own message format (ICU only through a plugin) would replace the ICU JSON that ADR 0001 builds on.
