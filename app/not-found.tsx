import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сторінку не знайдено — NoteHub",
  description: "Ця сторінка не існує у NoteHub",
  openGraph: {
    title: "Сторінку не знайдено — NoteHub",
    description: "Ця сторінка не існує у NoteHub",
    url: "https://your-domain.com/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — зручний застосунок",
      },
    ],
    type: "article",
  },
};
export const dynamic = "force-dynamic";
const NotFound = () => {
  return (
    <div>
      <h1>404 - Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
