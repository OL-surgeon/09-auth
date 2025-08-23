// import axios from "axios";
// import type { Note, NewNote } from "@/types/note";

// export interface NoteResponse {
//   notes: Note[];
//   totalPages: number;
// }

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

// export const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// const cache: Record<string, NoteResponse> = {};

// async function fetchWithRetry<T>(
//   fn: () => Promise<T>,
//   retries = 3,
//   delay = 2000
// ): Promise<T> {
//   try {
//     return await fn();
//   } catch (err: unknown) {
//     if (
//       axios.isAxiosError(err) &&
//       err.response?.status === 429 &&
//       retries > 0
//     ) {
//       console.warn(
//         `429 Too Many Requests — чекаю ${delay / 1000}s і пробую ще раз...`
//       );
//       await new Promise((res) => setTimeout(res, delay));
//       return fetchWithRetry(fn, retries - 1, delay * 2);
//     }
//     throw err;
//   }
// }

// interface FetchNotesParams {
//   page: number;
//   perPage: number;
//   search?: string;
//   tag?: string;
// }

// export async function fetchNotes(
//   page = 1,
//   perPage = 12,
//   search = "",
//   category?: string
// ): Promise<NoteResponse> {
//   const params: FetchNotesParams = { page, perPage };
//   if (search.trim()) params.search = search.trim();
//   if (category && category.toLowerCase() !== "all") params.tag = category;

//   const cacheKey = JSON.stringify(params);
//   if (cache[cacheKey]) return cache[cacheKey];

//   const data = await fetchWithRetry(() =>
//     api.get<NoteResponse>("/notes", { params }).then((res) => res.data)
//   );

//   cache[cacheKey] = data;
//   return data;
// }

// export async function fetchNoteById(id: string): Promise<Note> {
//   return fetchWithRetry(() =>
//     api.get<Note>(`/notes/${id}`).then((res) => res.data)
//   );
// }

// export async function createNote(newNote: NewNote): Promise<Note> {
//   return fetchWithRetry(() =>
//     api.post<Note>("/notes", newNote).then((res) => res.data)
//   );
// }

// export async function deleteNote(noteId: string): Promise<Note> {
//   return fetchWithRetry(() =>
//     api.delete<Note>(`/notes/${noteId}`).then((res) => res.data)
//   );
// }
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
