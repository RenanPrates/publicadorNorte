import { tipoArquivo } from '@norte/motor';
import { servicos } from '@/lib/servidor/config';
import { erro, responder } from '@/lib/servidor/rotas';

/**
 * Conteúdo de um arquivo guardado, para a prévia. O sha identifica o conteúdo, então pode ficar em cache.
 * Rota pública: a prévia roda isolada e não envia o cookie; o sha (40 caracteres) não dá para adivinhar.
 */
export async function GET(req: Request, { params }: { params: Promise<{ sha: string }> }) {
  return responder(req, async () => {
    const { sha } = await params;
    if (!/^[0-9a-f]{40}$/.test(sha)) return erro(400, 'Arquivo inválido.');
    const nome = new URL(req.url).searchParams.get('n') || '';
    const bytes = await servicos().armazenamento.lerArquivo(sha);
    return new Response(bytes as unknown as BodyInit, {
      headers: { 'Content-Type': tipoArquivo(nome) || 'application/octet-stream', 'Cache-Control': 'private, max-age=31536000, immutable' },
    });
  }, { publico: true });
}
