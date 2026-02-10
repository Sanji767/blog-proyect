import { createClient } from "next-sanity";

import {
  sanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

let client: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (!sanityConfigured) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  }

  if (client) return client;

  client = createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: process.env.NODE_ENV === "production",
  });

  return client;
}
