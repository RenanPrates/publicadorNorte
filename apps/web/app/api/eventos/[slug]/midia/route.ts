import type { ArquivoMidia } from '@/lib/comum/tipos';
import { servicos } from '@/lib/servidor/config';
import { erro, responder } from '@/lib/servidor/rotas';

type Ctx = { params: Promise<{ slug: string }> };

/** registra no evento arquivos já enviados por /api/arquivos (um commit para a pasta toda) */
export async function POST(req: Request, { params }: Ctx) {
  return responder(async () => {
    const { slug } = await params;
    const { arquivos } = (await req.json()) as { arquivos: ArquivoMidia[] };
    if (!Array.isArray(arquivos) || arquivos.some((a) => !a.caminho || !/^[0-9a-f]{40}$/.test(a.sha) || a.caminho.includes('..'))) {
      return erro(400, 'Lista de arquivos inválida.');
    }
    await servicos().armazenamento.adicionarMidia(slug, arquivos);
    return new Response(null, { status: 204 });
  });
}

/** remove toda a mídia do evento (a interface pede confirmação antes) */
export async function DELETE(_req: Request, { params }: Ctx) {
  return responder(async () => {
    const { slug } = await params;
    await servicos().armazenamento.removerMidia(slug);
    return new Response(null, { status: 204 });
  });
}
