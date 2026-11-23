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
      name: "language",
      title: "Idioma",
      type: "string",
      initialValue: "es",
      options: {
        list: [
          { title: "Español", value: "es" },
          { title: "English", value: "en" },
          { title: "Todos (Español e Inglés)", value: "all" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 96),
      },
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
      description: "Una de las categorías consolidadas (ES: finanzas, bancos, cuentas, tarjetas, ahorro, inversion, fiscalidad, vivienda; EN: accounts, banking, cards, savings, investing, taxes, housing).",
      options: {
        list: [
          { title: "Finanzas (ES)", value: "finanzas" },
          { title: "Bancos (ES)", value: "bancos" },
          { title: "Cuentas (ES)", value: "cuentas" },
          { title: "Tarjetas (ES)", value: "tarjetas" },
          { title: "Ahorro (ES)", value: "ahorro" },
          { title: "Inversión (ES)", value: "inversion" },
          { title: "Fiscalidad (ES)", value: "fiscalidad" },
          { title: "Vivienda (ES)", value: "vivienda" },
          { title: "Accounts (EN)", value: "accounts" },
          { title: "Banking (EN)", value: "banking" },
          { title: "Cards (EN)", value: "cards" },
          { title: "Savings (EN)", value: "savings" },
          { title: "Investing (EN)", value: "investing" },
          { title: "Taxes (EN)", value: "taxes" },
          { title: "Housing (EN)", value: "housing" },
        ],
      },
      validation: (Rule) =>
        Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).error(
          "Usa minúsculas y guiones (slug); elige una categoría de la lista.",
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
            Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).error(
              "Usa minúsculas y guiones (slug), ej: finanzas-personales.",
            ),
        }),
      ],
      options: { layout: "tags" },
      description: "Ej: bancos, finanzas-personales, revolut.",
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
