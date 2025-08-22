"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, type NoteResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import Link from "next/link";

import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialData: NoteResponse;
  initialPage?: number;
  perPage?: number;
  initialSearch?: string;
  tag?: string | undefined;
}

export default function NotesClient({
  initialData,
  initialPage = 1,
  perPage = 12,
  initialSearch = "",
  tag,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<NoteResponse, Error>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch, tag),
    initialData,
    placeholderData: initialData,
  });

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.wrapper}>
      <h1>NoteHub</h1>

      <div className={css.header}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p className={css.centered}>Loading, please wait...</p>}
      {isError && <p className={css.centered}>Something went wrong.</p>}

      {data?.notes?.length ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading &&
        !isError && <p className={css.centered}>No notes found.</p>
      )}

      {data && data.totalPages > 1 && (
        <div className={css.centered}>
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
