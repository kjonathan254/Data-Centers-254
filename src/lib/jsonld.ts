/**
 * Safe JSON-LD serialization for <script type="application/ld+json"> tags.
 *
 * Tech-debt audit 2026-10-11 (finding F011): every structured-data block used
 * to inline `JSON.stringify(jsonLd)` directly into dangerouslySetInnerHTML.
 * JSON.stringify alone does not escape `<`, so any string field containing
 * `</script>` would terminate the JSON-LD script early and allow script
 * injection into the page. The data flowing in is editorial and repo-local
 * (frontmatter, directory dataset), so this was never externally exploitable,
 * but it left a hole at the content-pipeline trust boundary: one bad paste in
 * an article title (e.g. an HTML snippet copied from a source page) would
 * become live XSS on that article.
 *
 * The fix is the standard OWASP hardening: escape `<` (and the line
 * separators U+2028/U+2029, which are valid JSON but illegal inside JS
 * string literals) so the payload stays inert no matter what the CMS
 * pipeline feeds in. Escaping `<` as \u003c is transparent to JSON parsers:
 * Google's structured-data parser reads the decoded value, not the escape.
 *
 * Use this everywhere a JSON-LD object is embedded in server-rendered HTML:
 *
 *   <script type="application/ld+json"
 *           dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
