import { erro } from '@/lib/servidor/rotas';
import { COOKIE, valorSessao } from '@/lib/servidor/sessao';

/** confere a senha da equipe e deixa a pessoa entrar por 30 dias */
export async function POST(req: Request) {
  const senha = process.env.SENHA_EQUIPE;
  if (!senha) return erro(503, 'A senha da equipe ainda não foi configurada no servidor (SENHA_EQUIPE).');
  const { tentativa } = (await req.json().catch(() => ({}))) as { tentativa?: string };
  if (!tentativa || tentativa !== senha) {
    await new Promise((r) => setTimeout(r, 800)); // atrasa quem tenta adivinhar
    return erro(401, 'Senha incorreta.');
  }
  const seguro = new URL(req.url).protocol === 'https:' ? '; Secure' : '';
  return new Response(null, {
    status: 204,
    headers: { 'Set-Cookie': `${COOKIE}=${await valorSessao(senha)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${seguro}` },
  });
}

/** sair */
export async function DELETE() {
  return new Response(null, { status: 204, headers: { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` } });
}
