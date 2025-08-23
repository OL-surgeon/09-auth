// import { cookies } from "next/headers";
// import { api } from "./api";
// import { User } from "@/types/user";

// export const serverGetSession = async (): Promise<User | null> => {
//   try {
//     const cookieStore = cookies();

//     const cookieHeader = (await cookieStore)
//       .getAll()
//       .map((c) => `${c.name}=${c.value}`)
//       .join("; ");

//     const res = await api.get<User>("/auth/session", {
//       headers: { Cookie: cookieHeader },
//     });

//     return res.data || null;
//   } catch (err) {
//     console.error("Failed to get session", err);
//     return null;
//   }
// };

// export const serverGetNotes = async () => {
//   const cookieStore = cookies();
//   const cookieHeader = (await cookieStore)
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join("; ");

//   const res = await api.get("/notes", {
//     headers: { Cookie: cookieHeader },
//   });

//   return res.data;
// };
import { api } from "./api";
import type { Note } from "@/types/note";
import { cookies } from "next/headers";
import { User } from "@/types/user";

export const serverGetSession = async () => {
  const cookieStore = await cookies();
  const response = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get("/users/me", {
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
  perPage: 12,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};
