'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes, FetchNotesHTTPResponse } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import css from '@/app/notes/filter/[...slug]/Notes.client.module.css';
import Loader from '@/components/Loader/Loader';

interface NotesClientProps {
  initialData?: FetchNotesHTTPResponse;
  tag?: string;
}

export default function NotesClient({ tag, initialData }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, isFetching } =
    useQuery<FetchNotesHTTPResponse>({
      queryKey: ['notes', tag, debouncedSearch, page],
      queryFn: () => fetchNotes({ search: debouncedSearch, page, tag }),
      placeholderData: keepPreviousData,
      initialData,
    });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          onChange={query => {
            setSearchQuery(query);
            setPage(1);
          }}
        />
        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
            totalPages={data?.totalPages ?? 0}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      {error instanceof Error && <p>{error.message}</p>}
      {error && !(error instanceof Error) && <p>Failed to load notes.</p>}
      {isFetching && !isLoading && <Loader />}
      {data?.notes?.length === 0 && !isLoading && <p>No notes found.</p>}
      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}