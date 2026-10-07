// Tapume antigo com um card por cidade numerado (@cidade_1, @cidade_2…) → um card só, com @repetir cidades.
// Acha os cards, usa o primeiro de cada formato como modelo e monta os blocos.
import { parseHTML } from 'linkedom';
import { RX_NUM, numsDoTexto } from './cards-fixos';
import { escRx } from './texto';

export { temCardsFixos } from './cards-fixos';

export interface CardPreenchido { n: number; grupo?: string; status?: string }
export interface ResultadoConversao {
  html?: string;
  erro?: string;
  cards?: number;
  /** coluna de grupo (ex.: regiao), quando os cards estão em grupos */
  col?: string | null;
  grupos?: string[];
  /** valores de status dos dois formatos de card */
  status?: { aberta: string; outra: string } | null;
  /** linhas para pré-preencher o cadastro: número do card, grupo e status */
  prefill?: CardPreenchido[];
}

// tipos mínimos do DOM do linkedom que usamos aqui
type El = any;
const TEXTO = 3;
const ELEMENTO = 1;

function textos(raiz: El, pular?: (el: El) => boolean): El[] {
  const out: El[] = [];
  (function anda(n: El) {
    for (const c of [...n.childNodes]) {
      if (c.nodeType === TEXTO) out.push(c);
      else if (c.nodeType === ELEMENTO && !(pular && pular(c))) anda(c);
    }
  })(raiz);
  return out;
}

const cssEscape = (s: string) => s.replace(/([^\w-])/g, '\\$1');
/** classes do elemento (o classList do linkedom não é indexável) */
const classes = (el: El): string[] => String(el.getAttribute?.('class') || '').trim().split(/\s+/).filter(Boolean);

export function converterCardsFixos(html: string): ResultadoConversao {
  const { document: doc } = parseHTML(html) as unknown as { document: El };
  const body = doc.body;
  if (!body) return { erro: 'Não consegui identificar um card por cidade neste HTML.' };
  const tag = (el: El) => String(el.tagName || '').toUpperCase();
  const proprios = (el: El) => {
    const s = new Set<number>();
    for (const a of [...el.attributes]) numsDoTexto(a.value).forEach((n) => s.add(n));
    for (const c of [...el.childNodes]) if (c.nodeType === TEXTO) numsDoTexto(c.nodeValue).forEach((n) => s.add(n));
    return s;
  };
  const sub = new Map<El, Set<number>>();
  (function anda(el: El): Set<number> {
    const s = proprios(el);
    for (const c of [...el.children]) {
      if (/^(SCRIPT|STYLE|TEMPLATE)$/.test(tag(c))) continue;
      anda(c).forEach((n) => s.add(n));
    }
    sub.set(el, s);
    return s;
  })(body);

  // raiz de cada card: o maior elemento que só fala de um número, cujo pai fala de vários
  const raizes = new Map<number, El[]>();
  for (const [el, s] of sub) {
    if (s.size !== 1 || el === body) continue;
    const p = sub.get(el.parentElement);
    if (p && p.size > 1) {
      const n = [...s][0];
      if (!raizes.has(n)) raizes.set(n, []);
      raizes.get(n)!.push(el);
    }
  }
  const nums = [...raizes.keys()].sort((a, b) => a - b);
  if (nums.length < 2 || nums.some((n) => raizes.get(n)!.length !== 1)) return { erro: 'Não consegui identificar um card por cidade neste HTML.' };

  // card sozinho num grupo sobe até o grupo inteiro: desce de volta até o elemento com a mesma "cara" dos outros cards
  const cara = (el: El) => tag(el) + '.' + (classes(el)[0] || '');
  const freq: Record<string, number> = {};
  for (const n of nums) { const k = cara(raizes.get(n)![0]); freq[k] = (freq[k] || 0) + 1; }
  const caraComum = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  const classeComum = caraComum.split('.')[1];
  for (const n of nums) {
    const el = raizes.get(n)![0];
    if (cara(el) === caraComum || !classeComum) continue;
    const dentro = [...el.querySelectorAll('.' + cssEscape(classeComum))].find((x: El) => { const s = sub.get(x); return s && s.size === 1 && s.has(n); });
    if (dentro) raizes.set(n, [dentro]);
  }
  const cards: { n: number; el: El; grupo?: string; status?: string; v?: Variante }[] = nums.map((n) => ({ n, el: raizes.get(n)![0] }));

  // grupos (ex.: uma <section> por região)
  const pais = [...new Set(cards.map((c) => c.el.parentElement))];
  let grupos: { el: El; valor: string; cards: typeof cards }[] | null = null;
  let col: string | null = null;
  if (pais.length > 1) {
    let comum: El = pais[0];
    while (comum && !pais.every((p) => comum.contains(p))) comum = comum.parentElement;
    const secao = (el: El) => { let g = el; while (g.parentElement !== comum) g = g.parentElement; return g; };
    const gs = [...new Set(cards.map((c) => secao(c.el)))];
    const attr = [...gs[0].attributes].find((a: El) => /^data-/.test(a.name) && new Set(gs.map((g) => g.getAttribute(a.name))).size === gs.length) as El;
    const valor = (g: El): string => {
      if (attr) return g.getAttribute(attr.name);
      const h = g.querySelector('h1,h2,h3,h4');
      const t = h?.firstChild;
      return (t && t.nodeType === TEXTO ? t.nodeValue : '').trim();
    };
    col = attr ? attr.name.replace(/^data-/, '').replace(/-/g, '_') : 'grupo';
    grupos = gs.map((g) => ({ el: g, valor: valor(g), cards: cards.filter((c) => g.contains(c.el)) }));
    for (const c of cards) c.grupo = grupos.find((g) => g.cards.includes(c))!.valor;
  }

  // modelo de cada card: sem número e com o grupo virando @coluna
  const modelo = (c: (typeof cards)[number]) => {
    let h: string = c.el.outerHTML.replace(new RegExp(RX_NUM.source, 'g'), (_t: string, a: string, b: string, _n: string, z: string) => '@' + a + b + z);
    if (c.grupo) h = h.replace(new RegExp('(?<![\\w@])' + escRx(c.grupo) + '(?![\\w])', 'gi'), '@' + col);
    return h;
  };
  const chaveVar = (h: string) => h.replace(/@\w+/g, '@');
  interface Variante { k: string; h: string; cards: typeof cards; classes: Set<string> }
  const variantes: Variante[] = [];
  for (const c of cards) {
    const h = modelo(c);
    const k = chaveVar(h);
    let v = variantes.find((x) => x.k === k);
    if (!v) variantes.push((v = { k, h, cards: [], classes: new Set(classes(c.el)) }));
    v.cards.push(c);
    c.v = v;
  }
  if (variantes.length > 2) return { erro: 'Os cards deste HTML têm mais de dois formatos diferentes; converta à mão com @repetir e @se.' };

  let status: { aberta: string; outra: string } | null = null;
  if (variantes.length === 2) {
    const [a, b] = variantes;
    const sa = [...a.classes].filter((x) => !b.classes.has(x));
    const sb = [...b.classes].filter((x) => !a.classes.has(x));
    status = { aberta: sa[0] || 'aberta', outra: sb[0] || 'breve' };
    // o formato com link vem primeiro
    if (!/^<a\b/i.test(a.h) && /^<a\b/i.test(b.h)) { variantes.reverse(); status = { aberta: sb[0] || 'aberta', outra: sa[0] || 'breve' }; }
    for (const c of cards) c.status = c.v === variantes[0] ? status.aberta : status.outra;
  }
  const bloco = variantes.length === 2
    ? `\n<!-- @repetir cidades -->\n<!-- @se status = ${status!.aberta} -->\n${variantes[0].h}\n<!-- @senao -->\n${variantes[1].h}\n<!-- @fim -->\n<!-- @fim -->\n`
    : `\n<!-- @repetir cidades -->\n${variantes[0].h}\n<!-- @fim -->\n`;
  const marca = 'PUBLICADOR_BLOCO_CARDS';
  const trocarCards = (lista: typeof cards) => { lista[0].el.before(doc.createComment(marca)); for (const c of lista) c.el.remove(); };

  if (grupos) {
    const g0 = grupos[0];
    trocarCards(g0.cards);
    // cabeçalho do grupo: nome vira @coluna, número de cards vira @total_cidades
    for (const t of textos(g0.el)) {
      const val = String(t.nodeValue);
      if (val.trim().toLowerCase() === g0.valor.toLowerCase()) t.nodeValue = val.replace(new RegExp(escRx(g0.valor), 'i'), '@' + col);
      else if (val.trim() === String(g0.cards.length)) t.nodeValue = val.replace(String(g0.cards.length), '@total_cidades');
    }
    for (const a of [...g0.el.attributes]) if (a.value === g0.valor) g0.el.setAttribute(a.name, '@' + col);
    g0.el.before(doc.createComment(' @agrupar por ' + col + ' '));
    g0.el.after(doc.createComment(' @fim '));
    for (const g of grupos.slice(1)) g.el.remove();
  } else trocarCards(cards);

  // contagens soltas ("5 com inscrição aberta · 11 em breve")
  if (status) {
    const conta: Record<string, number> = {
      [status.aberta]: cards.filter((c) => c.status === status!.aberta).length,
      [status.outra]: cards.filter((c) => c.status === status!.outra).length,
    };
    for (const t of textos(body, (el) => /^(SCRIPT|STYLE)$/.test(tag(el)))) {
      for (const [s, n] of Object.entries(conta)) {
        const rx = new RegExp('(?<!\\d)' + n + '(?!\\d)');
        if (rx.test(t.nodeValue) && String(t.parentElement?.textContent || '').toLowerCase().includes(s.toLowerCase())) {
          t.nodeValue = String(t.nodeValue).replace(rx, '@total_' + s.replace(/\W+/g, '_'));
        }
      }
    }
  }
  const dt = html.match(/^\s*<!doctype[^>]*>/i)?.[0]?.trim() || '<!doctype html>';
  const final = dt + '\n' + String(doc.documentElement.outerHTML).replace('<!--' + marca + '-->', () => bloco);
  return {
    html: final,
    cards: cards.length,
    col,
    grupos: grupos?.map((g) => g.valor),
    status,
    prefill: cards.map((c) => ({ n: c.n, grupo: c.grupo, status: c.status })),
  };
}
