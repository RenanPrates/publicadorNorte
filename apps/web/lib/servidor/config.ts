// Liga as implementações (GitHub hoje) a partir das variáveis de ambiente.
import { ArmazenamentoGitHub, type Armazenamento } from './armazenamento';
import { DestinoGitHubPages, type DestinoPublicacao } from './destino';
import { GitHub } from './github';

export class ConfigFaltando extends Error {}

export function servicos(): { armazenamento: Armazenamento; destino: DestinoPublicacao } {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) throw new ConfigFaltando('Falta configurar GITHUB_TOKEN e GITHUB_REPO no arquivo apps/web/.env.local.');
  const gh = new GitHub(token, repo);
  return {
    armazenamento: new ArmazenamentoGitHub(gh, process.env.GITHUB_BRANCH_DADOS || 'dados'),
    destino: new DestinoGitHubPages(gh, process.env.GITHUB_BRANCH_SITE || 'gh-pages'),
  };
}
