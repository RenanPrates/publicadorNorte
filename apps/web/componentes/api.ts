// Chamadas do navegador para as rotas do app, com mensagens de erro em português.

export class ErroApi extends Error {
  constructor(readonly status: number, mensagem: string, readonly dados?: unknown) {
    super(mensagem);
  }
}

export async function api<T = unknown>(caminho: string, init: RequestInit = {}): Promise<T> {
  let r: Response;
  try {
    r = await fetch(caminho, init);
  } catch {
    throw new ErroApi(0, 'Sem conexão com o publicador. Ele está rodando?');
  }
  // sessão expirou ou senha trocada: volta para a tela de entrada
  if (r.status === 401 && caminho !== '/api/entrar') {
    location.href = '/entrar';
    throw new ErroApi(401, 'Entre com a senha da equipe.');
  }
  if (!r.ok) {
    let dados: { erro?: string } | undefined;
    try { dados = await r.json(); } catch { /* sem corpo */ }
    throw new ErroApi(r.status, dados?.erro || `Erro ${r.status}`, dados);
  }
  if (r.status === 204) return undefined as T;
  return (await r.json()) as T;
}

export const json = (metodo: string, corpo: unknown): RequestInit => ({
  method: metodo,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(corpo),
});

export const urlArquivo = (sha: string, caminho: string) => `/api/arquivos/${sha}?n=${encodeURIComponent(caminho.split('/').pop() || '')}`;
