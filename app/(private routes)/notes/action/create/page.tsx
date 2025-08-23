import CreateNote from "./CreateNote";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NoteHub — Create Note",
  description: "Створіть нову нотатку у NoteHub",
  openGraph: {
    title: "NoteHub — Create Note",
    description: "Створіть нову нотатку у NoteHub",
    url: "https://your-domain.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — Create Note",
      },
    ],
  },
};

const CreateNotePage = async () => {
  return (
    <div>
      <CreateNote />
    </div>
  );
};

export default CreateNotePage;
