import { useEffect } from "octane";

/**
 * Shows `title` as the document title while the caller is mounted, then gives the earlier one
 * back. index.html's static `<title>` stays first in `<head>`, so a rendered `<title>` would never
 * show: the title is set on `document` instead.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  });
}
