import axios from 'axios';
import type { Note } from '../types/note';

const KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// Always configure axios baseURL
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Accept'] = 'application/json';

// Only set authorization if we have a valid token
if (KEY) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${KEY}`;
}

export interface FetchNotesHTTPResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes({
  search,
  page = 1,
  tag,
}: FetchNotesParams): Promise<FetchNotesHTTPResponse> {
  // Check if we have a valid API token
  if (!KEY) {
    console.error('NEXT_PUBLIC_NOTEHUB_TOKEN is not configured');
    return { notes: [], totalPages: 0 };
  }

  const params = {
    page,
    perPage: 12,
    ...(search && { search }),
    ...(tag && tag !== 'All' && { tag }),
  };

  try {
    const { data } = await axios.get<FetchNotesHTTPResponse>('/notes', {
      params,
    });
    return data;
  } catch (error) {
    console.error('API Error in fetchNotes:', error);
    return { notes: [], totalPages: 0 };
  }
}

export async function createNote({
  title,
  content,
  tag,
}: CreateNoteParams): Promise<Note> {
  const response = await axios.post<Note>('/notes', {
    title,
    content,
    tag,
  });
  return response.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function getNoteById(id: number): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
}