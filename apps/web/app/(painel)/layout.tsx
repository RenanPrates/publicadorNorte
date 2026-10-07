import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { autorizado, COOKIE } from '@/lib/servidor/sessao';

/** todas as telas do publicador pedem a senha da equipe */
export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const c = (await cookies()).get(COOKIE)?.value;
  if (!(await autorizado(h.get('host'), c ? `${COOKIE}=${c}` : null))) redirect('/entrar');
  return children;
}
