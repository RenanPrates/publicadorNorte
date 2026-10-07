import { converterCardsFixos } from '@norte/motor/conversor';
import { responder } from '@/lib/servidor/rotas';

/** tapume com cards fixos numerados → um card que se repete (não grava nada) */
export async function POST(req: Request) {
  return responder(async () => Response.json(converterCardsFixos(await req.text())));
}
