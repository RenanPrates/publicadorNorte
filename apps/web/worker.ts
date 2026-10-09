// Entrada do Worker na Cloudflare: domínios dos sites em produção são servidos aqui (sem passar pelo
// painel); o resto (publicador) vai para o Next.js gerado pelo OpenNext.
// @ts-ignore: .open-next/worker.js só existe depois do build (pnpm cf:build)
import { default as next } from './.open-next/worker.js';
import { servirProducao, type AmbienteSites } from './lib/servidor/sitesProducao';

export default {
  async fetch(req: Request, env: AmbienteSites, ctx: unknown) {
    return (await servirProducao(req, env)) ?? next.fetch(req, env, ctx);
  },
};

// @ts-ignore: classes que o OpenNext exporta (cache), quando usadas
export * from './.open-next/worker.js';
