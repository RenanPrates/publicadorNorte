// Respostas das rotas de API: erros viram mensagens em português para a interface.
import { Conflito, NaoEncontrado } from './armazenamento';
import { ConfigFaltando } from './config';
import { ErroGitHub } from './github';

export const erro = (status: number, mensagem: string) => Response.json({ erro: mensagem }, { status });

export async function responder(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Conflito) return erro(409, e.message);
    if (e instanceof NaoEncontrado) return erro(404, e.message);
    if (e instanceof ConfigFaltando) return erro(500, e.message);
    if (e instanceof ErroGitHub) {
      if (e.status === 401) return erro(502, 'A chave do GitHub não foi aceita. Confira o GITHUB_TOKEN no .env.local.');
      if (e.status === 403) return erro(502, 'A chave do GitHub não tem permissão para isso. Ela precisa de Contents e Pages com leitura e escrita. (' + e.message + ')');
      if (e.status === 404) return erro(502, 'O GitHub não encontrou o repositório. Confira GITHUB_REPO e o acesso da chave.');
      return erro(502, 'O GitHub recusou a operação: ' + e.message);
    }
    console.error(e);
    return erro(500, 'Erro inesperado: ' + (e instanceof Error ? e.message : String(e)));
  }
}

/** slug válido para pasta e URL */
export const slugValido = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 60;
