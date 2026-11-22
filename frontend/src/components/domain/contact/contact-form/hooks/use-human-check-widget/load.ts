/**
 * The ALTCHA widget (its custom element and its workers, about 122 KB) is its own chunk: the
 * Contact form asks for it when it opens, and no other page pays for it. The default bundle
 * starts its workers from `blob:` URLs, so a future CSP needs `worker-src blob:`; the strict-CSP
 * build is `altcha/external`.
 */
export async function loadHumanCheckWidget(): Promise<void> {
  await import("altcha");
}
