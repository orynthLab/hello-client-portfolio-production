/** Serialize structured data for an inline `<script type="application/ld+json">`.
 *
 *  `<` is escaped to its unicode form. That is still valid JSON and identical
 *  to any parser, but it means a value containing `</script>` can no longer
 *  close the surrounding tag and turn structured data into an injection point.
 *
 *  Shared rather than repeated: the root layout, the project pages and the
 *  service pages all emit schema, and an escaping rule that only some of them
 *  apply is the same as not having one.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
