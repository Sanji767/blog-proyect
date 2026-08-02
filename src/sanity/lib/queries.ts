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
    (coalesce(language, "es") == $locale || language == "all" || !defined(language)) &&
    defined(slug.current) &&
    coalesce(publishedAt, _createdAt) <= now() &&
    !(_id in path("drafts.**"))
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;

export const postBySlugQuery = groq`
  *[
    _type == "post" &&
    slug.current == $slug &&
    coalesce(publishedAt, _createdAt) <= now() &&
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
    coalesce(publishedAt, _createdAt) <= now() &&
    !(_id in path("drafts.**"))
  ]{
    "slug": slug.current
  }
`;

export const postsByTagQuery = groq`
  *[
    _type == "post" &&
    (coalesce(language, "es") == $locale || language == "all" || !defined(language)) &&
    defined(slug.current) &&
    coalesce(publishedAt, _createdAt) <= now() &&
    !(_id in path("drafts.**")) &&
    $tag in tags[]
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;

export const postsByCategoryQuery = groq`
  *[
    _type == "post" &&
    (coalesce(language, "es") == $locale || language == "all" || !defined(language)) &&
    defined(slug.current) &&
    coalesce(publishedAt, _createdAt) <= now() &&
    !(_id in path("drafts.**")) &&
    category == $category
  ]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${postPreviewFields}
  }
`;
