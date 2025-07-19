export interface Note {
  id: number;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}
export type Tag = 'Work' | 'Todo' | 'Personal' | 'Meeting' | 'Shopping';