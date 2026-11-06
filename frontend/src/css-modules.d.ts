declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "*.css";

/** SVG files are emitted as assets; the import is their URL. */
declare module "*.svg" {
  const url: string;
  export default url;
}
