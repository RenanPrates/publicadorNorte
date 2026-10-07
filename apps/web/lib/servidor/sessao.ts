// Senha única da equipe (fase 1, sem login individual). Quem acerta a senha recebe um cookie assinado.
// Sem SENHA_EQUIPE configurada, o publicador só abre no próprio computador (localhost).

export const COOKIE = 'publicador_sessao';

const local = (host: string | null) => /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host || '');

/** valor do cookie: assinatura da senha (trocar a senha desconecta todo mundo) */
export async function valorSessao(senha: string): Promise<string> {
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode('publicador-norte/sessao')));
  return [...sig].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const lerCookie = (cabecalho: string | null, nome: string) =>
  (cabecalho || '').split(/;\s*/).find((c) => c.startsWith(nome + '='))?.slice(nome.length + 1) || '';

/** a pessoa pode usar o publicador? */
export async function autorizado(host: string | null, cookieHeader: string | null): Promise<boolean> {
  const senha = process.env.SENHA_EQUIPE;
  if (!senha) return local(host);
  return lerCookie(cookieHeader, COOKIE) === (await valorSessao(senha));
}

export const autorizadoReq = (req: Request) => autorizado(req.headers.get('host'), req.headers.get('cookie'));
