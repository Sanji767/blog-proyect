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

export const allPostPreviewsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (!defined(language) || language == null || language == "" || language == "all" || language == $locale || coalesce(language, "es") == $locale)
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;

export const postBySlugQuery = groq`
  *[
    _type == "post" &&
    slug.current == $slug &&
    !(_id in path("drafts.**"))
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
    (!defined(language) || language == null || language == "" || language == "all" || language == $locale || coalesce(language, "es") == $locale)
  ]{
    "slug": slug.current
  }
`;

export const postsByTagQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    !(_id in path("drafts.**")) &&
    (!defined(language) || language == null || language == "" || language == "all" || language == $locale || coalesce(language, "es") == $locale) &&
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
    (!defined(language) || language == null || language == "" || language == "all" || language == $locale || coalesce(language, "es") == $locale) &&
    (category == $category || lower(category) == lower($category))
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;
