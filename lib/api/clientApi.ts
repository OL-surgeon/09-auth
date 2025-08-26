// lib/api/clientApi.ts
import { api } from "./api";
import { Note, NewNote } from "@/types/note";
import { User, UpdateUserDto } from "@/types/user";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

const cache: Record<string, NoteResponse> = {};

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
  if (cache[cacheKey]) return cache[cacheKey];

  const data = await api
    .get<NoteResponse>("/notes", { params })
    .then((res) => res.data);
  cache[cacheKey] = data;
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  return api.get<Note>(`/notes/${id}`).then((res) => res.data);
}

export async function createNote(newNote: NewNote): Promise<Note> {
  return api.post<Note>("/notes", newNote).then((res) => res.data);
}

export async function deleteNote(noteId: string): Promise<Note> {
  return api.delete<Note>(`/notes/${noteId}`).then((res) => res.data);
}

export const registerUser = async (
  email: string,
  password: string
): Promise<User> => {
  return api
    .post<User>("/auth/register", { email, password })
    .then((res) => res.data);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  return api
    .post<User>("/auth/login", { email, password })
    .then((res) => res.data);
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout").then((res) => res.data);
};

export const getSession = async (): Promise<{ valid: boolean }> => {
  return api.get<{ valid: boolean }>("/auth/session").then((res) => res.data);
};

export const getCurrentUser = async (): Promise<User> => {
  return api.get<User>("/users/me").then((res) => res.data);
};

export const updateCurrentUser = async (
  payload: UpdateUserDto
): Promise<User> => {
  return api.patch<User>("/users/me", payload).then((res) => res.data);
};

export { api };
