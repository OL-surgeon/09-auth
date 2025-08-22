// lib/api.ts
import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${API_TOKEN}` },
});

const cache: Record<string, NoteResponse> = {};

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 429 &&
      retries > 0
    ) {
      console.warn(
        `429 Too Many Requests — чекаю ${delay / 1000}s і пробую ще раз...`
      );
      await new Promise((res) => setTimeout(res, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = "",
  category?: string
): Promise<NoteResponse> {
  const params: FetchNotesParams = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (category && category.toLowerCase() !== "all") params.tag = category;

  const cacheKey = JSON.stringify(params);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const data = await fetchWithRetry(() =>
    instance.get<NoteResponse>("/notes", { params }).then((res) => res.data)
  );

  cache[cacheKey] = data;
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  return fetchWithRetry(() =>
    instance.get<Note>(`/notes/${id}`).then((res) => res.data)
  );
}

export async function createNote(newNote: NewNote): Promise<Note> {
  return fetchWithRetry(() =>
    instance.post<Note>("/notes", newNote).then((res) => res.data)
  );
}

export async function deleteNote(noteId: string): Promise<Note> {
  return fetchWithRetry(() =>
    instance.delete<Note>(`/notes/${noteId}`).then((res) => res.data)
  );
}
