import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type Draft = typeof initialDraft;

interface NoteStore {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    }
  )
);

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const initialDraft = {
//   title: "",
//   content: "",
//   tag: "Todo",
// };

// type Draft = typeof initialDraft;

// interface User {
//   email: string;
//   id: string;
// }

// interface AppStore {
//   draft: Draft;
//   setDraft: (note: Partial<Draft>) => void;
//   clearDraft: () => void;

//   isAuthenticated: boolean;
//   user: User | null;
//   setAuth: (user: User) => void;
//   clearAuth: () => void;
// }

// export const useAppStore = create<AppStore>()(
//   persist(
//     (set) => ({
//       draft: initialDraft,
//       setDraft: (note) =>
//         set((state) => ({ draft: { ...state.draft, ...note } })),
//       clearDraft: () => set({ draft: initialDraft }),

//       isAuthenticated: false,
//       user: null,
//       setAuth: (user) => set({ isAuthenticated: true, user }),
//       clearAuth: () => set({ isAuthenticated: false, user: null }),
//     }),
//     {
//       name: "app-store",
//     }
//   )
// );
