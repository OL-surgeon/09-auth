"use client";

import React from "react";
import css from "./NoteForm.module.css";
import { NoteTag } from "@/types/note";
import { createNote } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/lib/store/noteStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const allowedTags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

const NoteForm: React.FC = () => {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = async (formData: FormData) => {
    const note = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    mutation.mutate(note);
  };

  const handleCancel = () => router.back();

  return (
    <form action={handleSubmit} className={css.form}>
      <label htmlFor="title" className={css.label}>
        Заголовок:
      </label>
      <input
        id="title"
        name="title"
        type="text"
        value={draft.title}
        onChange={handleChange}
        required
        className={css.input}
      />

      <label htmlFor="content" className={css.label}>
        Вміст:
      </label>
      <textarea
        id="content"
        name="content"
        rows={5}
        value={draft.content}
        onChange={handleChange}
        className={css.textarea}
      />

      <label htmlFor="tag" className={css.label}>
        Тег:
      </label>
      <select
        id="tag"
        name="tag"
        value={draft.tag}
        onChange={handleChange}
        className={css.select}
      >
        {allowedTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <div className={css.buttons}>
        <button type="submit" className={css.submitButton}>
          Створити
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Відміна
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
