/** What a `ref` holds: the element once it is mounted. */
export type RefObject<T> = { readonly current: T | null };
