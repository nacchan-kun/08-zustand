import axios from 'axios';
import type { Note } from '../types/note';

const KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// Only configure axios if we have a valid token
if (KEY && KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDY0NDA0MjF9.YjfRD5_D0c8H7oY_y_vnb4SFhUx8sA83fxamNrWYgss') {
  axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
  axios.defaults.headers.common['Authorization'] = `Bearer ${KEY}`;
  axios.defaults.headers.common['Accept'] = 'application/json';
}

export interface FetchNotesHTTPResponse {
  notes: Note[];
  totalPages: number;
}



interface FetchNotesParams {
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
  if (!KEY || KEY === 'your_token_here') {
    throw new Error(
      'NEXT_PUBLIC_NOTEHUB_TOKEN is not configured. Please add your API token to .env.local'
    );
  }

  const params = {
    page,
    perPage: 12,
    ...(search && { search }),
    ...(tag && { tag }),
  };

  const { data } = await axios.get<FetchNotesHTTPResponse>('/notes', {
    params,
  });
  return data;
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
  // Check if we have a valid API token
  if (!KEY || KEY === 'your_token_here') {
    throw new Error(
      'NEXT_PUBLIC_NOTEHUB_TOKEN is not configured. Please add your API token to .env.local'
    );
  }

  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
}