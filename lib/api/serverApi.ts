import { api } from "./api";
import type { Note } from "@/types/note";
import { cookies } from "next/headers";
import type { User } from "@/types/user";

export const serverGetSession = async () => {
  const cookieStore = await cookies();
  const { data } = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.patch<User>("/users/me", payload, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
