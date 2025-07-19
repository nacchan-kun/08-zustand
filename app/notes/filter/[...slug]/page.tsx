import { fetchNotes } from '@/lib/api';
import NoteClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const response = await fetchNotes({ page: 1, search: '', tag: tag });

  return (
    <section>
      <NoteClient initialData={response} tag={tag} />
    </section>
  );
};

export default Page;
