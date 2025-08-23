import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const tag = slug[0] === "all" ? undefined : slug[0];
  return {
    title: `Note tag: ${tag}`,
    description: `Browse notes filtered by the "${tag}" tag.`,
    openGraph: {
      title: `Note tag: ${tag}`,
      description: `Browse notes filtered by the "${tag}" tag.`,
      url: `http://localhost:3001/notes/filter/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
      type: "article",
    },
  };
}
const NotesByCategory = async ({ params }: Props) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const page = 1;
  const perPage = 12;
  const search = "";
  const tag = slug[0] === "all" ? undefined : slug[0];
  const data = await fetchNotes(page, perPage, search, tag);

  return <NotesClient initialData={data} tag={tag || "All"} />;
};

export default NotesByCategory;
