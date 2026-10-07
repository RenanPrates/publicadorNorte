// Arquivos enviados pelo navegador: caminho guardado e identificação do conteúdo (igual à do git).
import { arquivoAceito } from '@norte/motor';

/**
 * Caminho em que o arquivo fica guardado: a partir de _media/ ou _images/ quando houver;
 * senão sem a pasta escolhida (ex.: "site/assets/a.png" → "assets/a.png").
 */
export function caminhoGuardado(relativo: string): string {
  const c = relativo.replace(/\\/g, '/').replace(/^\/+/, '');
  const m = c.match(/(^|\/)(_media|_images)\//);
  if (m) return c.slice(m.index! + m[1].length);
  const partes = c.split('/');
  return partes.length > 1 ? partes.slice(1).join('/') : c;
}

export { arquivoAceito };

/** sha do blob no git: sha1("blob <tamanho>\0" + conteúdo). Arquivo igual = sha igual = não sobe de novo. */
export async function shaGit(bytes: Uint8Array): Promise<string> {
  const cab = new TextEncoder().encode(`blob ${bytes.length}\0`);
  const tudo = new Uint8Array(cab.length + bytes.length);
  tudo.set(cab);
  tudo.set(bytes, cab.length);
  const h = new Uint8Array(await crypto.subtle.digest('SHA-1', tudo));
  return [...h].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const tamanho = (n: number) => (n > 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
