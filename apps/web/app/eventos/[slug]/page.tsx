import { redirect } from 'next/navigation';

export default async function Evento({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/eventos/${slug}/paginas`);
}
