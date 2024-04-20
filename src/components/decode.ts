// more robust implementation https://github.com/mdevils/html-entities
export function decode(x: string) {
  return x
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}
