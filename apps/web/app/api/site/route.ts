import { servicos } from '@/lib/servidor/config';
import { responder } from '@/lib/servidor/rotas';

/** o site está ligado? a última publicação já está no ar? */
export async function GET() {
  return responder(async () => Response.json(await servicos().destino.estado()));
}
