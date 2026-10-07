import { servicos } from '@/lib/servidor/config';
import { erro, responder } from '@/lib/servidor/rotas';

const LIMITE = 100 * 1024 * 1024; // limite do GitHub por arquivo

/** guarda o conteúdo de um arquivo e devolve o sha (ainda não pertence a nenhum evento) */
export async function POST(req: Request) {
  return responder(async () => {
    const bytes = new Uint8Array(await req.arrayBuffer());
    if (!bytes.length) return erro(400, 'Arquivo vazio.');
    if (bytes.length > LIMITE) return erro(413, 'Arquivo acima de 100 MB: o GitHub não aceita. Comprima o vídeo e envie de novo.');
    return Response.json({ sha: await servicos().armazenamento.enviarArquivo(bytes) });
  });
}
