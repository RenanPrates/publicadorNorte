// Detecção de tapume com cards fixos numerados (sem DOM: pode rodar no navegador).

export const RX_NUM = /@(\{?)([A-Za-z][A-Za-z0-9_]*?)_(\d+)(\}?)(?![\w])/g;

export function numsDoTexto(s: string | null | undefined): Set<number> {
  const out = new Set<number>();
  const rx = new RegExp(RX_NUM.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = rx.exec(s || ''))) out.add(+m[3]);
  return out;
}

/** Quantos cards fixos o tapume tem (0 = nenhum): sem @repetir e com 2+ sufixos numéricos fora de comentário, script e style. */
export function temCardsFixos(html: string): number {
  if (!html || /<!--\s*@repetir/i.test(html)) return 0;
  const sem = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const n = numsDoTexto(sem);
  return n.size >= 2 ? Math.max(...n) : 0;
}

