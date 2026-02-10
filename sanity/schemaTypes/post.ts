import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Posts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
      description: "Resumen corto para listados y previews.",
    }),
    defineField({
      name: "featured",
      title: "Destacado",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Categoría (slug)",
      type: "string",
      description: "Ej: reviews, entrevistas, noticias.",
      validation: (Rule) =>
        Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).warning(
          "Usa minúsculas y guiones (slug), ej: entrevistas, album-review.",
        ),
    }),
    defineField({
      name: "tags",
      title: "Tags (slugs)",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          validation: (Rule) =>
            Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).warning(
              "Usa minúsculas y guiones (slug), ej: synthwave, rock-progresivo.",
            ),
        }),
      ],
      options: { layout: "tags" },
      description: "Ej: rock, synthwave, festival.",
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "readingTime",
      title: "Tiempo de lectura",
      type: "string",
      description: 'Ej: "7 min". (Opcional)',
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube ID",
      type: "string",
      description: 'Ej: "dQw4w9WgXcQ". (Opcional)',
    }),
    defineField({
      name: "views",
      title: "Vistas",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
