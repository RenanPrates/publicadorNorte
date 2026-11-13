// Odoo: o que a tela e o servidor usam igual (a consulta fica em lib/servidor/odoo.ts)

/** ID do produto no fim do link da loja: https://…/shop/cde27combo4ct-combo-…-curitiba-415 → 415 (também /shop/combos/…-415) */
export function idDoCombo(link: unknown): number | null {
  const m = String(link ?? '').trim().match(/\/shop\/(?:[^?#]*[/-])?(\d+)\/?(?:[?#]|$)/);
  return m ? Number(m[1]) : null;
}

/**
 * Combos gerais: vários combos na mesma página (ex.: Running Pass), cada um com o link nos gerais (combo1_link_inscricao,
 * combo2_link_inscricao…). Os preços desse combo vão para os gerais com o mesmo prefixo (combo1_preco_vista…).
 */
export function combosGerais(gerais: Record<string, unknown> | undefined): { prefixo: string; id: number }[] {
  const out: { prefixo: string; id: number }[] = [];
  for (const [k, v] of Object.entries(gerais || {})) {
    const m = /^(combo\d+)_link_inscricao$/.exec(k);
    const id = m ? idDoCombo(v) : null;
    if (m && id != null) out.push({ prefixo: m[1], id });
  }
  return out.sort((a, b) => Number(a.prefixo.slice(5)) - Number(b.prefixo.slice(5)));
}
