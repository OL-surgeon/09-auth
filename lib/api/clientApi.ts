// lib/api/clientApi.ts
import { api } from "./api";
import { Note, NewNote } from "@/types/note";
import { User, UpdateUserDto } from "@/types/user"; // 👈 UpdateUserDto треба додати у types/user.ts
import axios from "axios";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

const cache: Record<string, NoteResponse> = {};

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 429 &&
      retries > 0
    ) {
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
    api.get<NoteResponse>("/notes", { params }).then((res) => res.data)
  );

  cache[cacheKey] = data;
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  return fetchWithRetry(() =>
    api.get<Note>(`/notes/${id}`).then((res) => res.data)
  );
}

export async function createNote(newNote: NewNote): Promise<Note> {
  return fetchWithRetry(() =>
    api.post<Note>("/notes", newNote).then((res) => res.data)
  );
}

export async function deleteNote(noteId: string): Promise<Note> {
  return fetchWithRetry(() =>
    api.delete<Note>(`/notes/${noteId}`).then((res) => res.data)
  );
}

export const registerUser = async (
  email: string,
  password: string
): Promise<User> => {
  return fetchWithRetry(() =>
    api
      .post<User>("/users/register", { email, password })
      .then((res) => res.data)
  );
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  return fetchWithRetry(() =>
    api.post<User>("/auth/login", { email, password }).then((res) => res.data)
  );
};

export const logoutUser = async (): Promise<void> => {
  await fetchWithRetry(() => api.post("/auth/logout").then((res) => res.data));
};

export const getSession = async (): Promise<{ valid: boolean }> => {
  return fetchWithRetry(() =>
    api.get<{ valid: boolean }>("/auth/session").then((res) => res.data)
  );
};

export const getCurrentUser = async (): Promise<User> => {
  return fetchWithRetry(() =>
    api.get<User>("/users/me").then((res) => res.data)
  );
};

export const updateCurrentUser = async (
  payload: UpdateUserDto
): Promise<User> => {
  return fetchWithRetry(() =>
    api.patch<User>("/users/me", payload).then((res) => res.data)
  );
};

export { api };
