import { groq } from "next-sanity";

export const postPreviewFields = groq`
  "slug": slug.current,
  title,
  description,
  excerpt,
  "date": coalesce(publishedAt, _createdAt),
  category,
  tags,
  featured,
  readingTime,
  author,
  youtubeId,
  views,
  "coverImage": coverImage.asset->url,
  "image": coverImage.asset->url
`;

// A4 — language filter, shared by every post query below.
//
// A post belongs to a locale when:
//   - its `language` is "all" (explicitly bilingual), or
//   - its `language` matches the requested locale, or
//   - it has NO language set AND the locale is Spanish.
//
// The third rule is the fix: the `language` field postdates the oldest
// Sanity posts, so an unset language means Spanish (the site's original
// and default locale) — never English. The old predicate admitted
// language-less posts in BOTH locales, which is why the three ES-only
// articles (guia-inversion-principiantes, ahorro-vs-inversion-guia-maestra,
// tarjetas-de-credito-y-debito-ventajas-y-consejos — all language: null
// in the live dataset) were served in full under /en/blog/ with false
// hreflang, and why postBySlugQuery (which had no language filter at
// all) also served the English posts under /blog/.
//
// Verified against the live dataset (2026-11-20, public GROQ query):
// the three English posts all carry language: "en", so this filter does
// not remove any English content from /en/. The Studio-side follow-up is
// to set language: "es" explicitly on the three language-less articles
// (needs Studio access; no token here) — the code default above already
// treats them as Spanish, so that step is belt-and-braces, not a blocker.
const languageFilter = groq`
  (
    language == "all" ||
    language == $locale ||
    ((!defined(language) || language == null || language == "") && $locale == "es")
  )
`;

export const allPostPreviewsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    ${languageFilter}
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;

export const postBySlugQuery = groq`
  *[
    _type == "post" &&
    slug.current == $slug &&
    !(_id in path("drafts.**")) &&
    ${languageFilter}
  ][0] {
    ${postPreviewFields},
    "content": body[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url
      }
    }
  }
`;

export const allPostSlugsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    ${languageFilter}
  ]{
    "slug": slug.current
  }
`;

export const postsByTagQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    ${languageFilter} &&
    $tag in tags[]
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;

export const postsByCategoryQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    ${languageFilter} &&
    (category == $category || lower(category) == lower($category))
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;
