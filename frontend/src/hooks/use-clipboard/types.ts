export type UseClipboardResult = {
  /** True for a moment after a copy succeeded. */
  copied: boolean;
  /** Writes `text` to the clipboard. Resolves either way: a refusal only leaves `copied` false. */
  copy: (text: string) => Promise<void>;
};
