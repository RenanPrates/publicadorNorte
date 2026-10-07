import { Editor } from '@/componentes/Editor';

export default async function LayoutEvento({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Editor slug={slug}>{children}</Editor>;
}
