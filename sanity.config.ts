import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./sanity/schemaTypes";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_PROJECT_ID ??
  "";

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_DATASET ??
  "production";

const title =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_TITLE ??
  process.env.SANITY_STUDIO_TITLE ??
  "Content Studio";

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title,
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});

