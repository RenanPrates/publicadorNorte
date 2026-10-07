import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gerar, type EntradaGerar, type Linha } from '../src/index.js';

export const raizRepo = fileURLToPath(new URL('../../../', import.meta.url));
export const exemplo = (nome: string) => readFileSync(raizRepo + 'exemplos/' + nome, 'utf8');
export const fixture = (nome: string) => readFileSync(fileURLToPath(new URL('./fixtures/' + nome, import.meta.url)), 'utf8');

let seq = 0;
/** linha de cadastro com _id automático */
export const linha = (valores: Record<string, string | undefined> = {}): Linha => ({ _id: 'l' + ++seq, ...valores });

/** junta espaços para comparar HTML sem depender de quebras de linha */
export const semEspacos = (s: string) => s.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();

/** gera só a praça (formato tapume + praça, tapume vazio) e devolve o HTML da primeira cidade */
export function praca(html: string, cidade: Record<string, string | undefined>, extra: Partial<EntradaGerar> = {}): string {
  const r = gerar({ formato: 'tapume_praca', modelos: { tapume: '', praca: html }, cidades: [linha(cidade)], ...extra });
  return r.paginas.find((p) => p.tipo === 'praca')!.html;
}

/** gera e devolve o tapume */
export function tapume(html: string, cidades: Linha[], extra: Partial<EntradaGerar> = {}) {
  const r = gerar({ formato: 'tapume_praca', modelos: { tapume: html, praca: '<p>@cidade_1</p>' }, cidades, ...extra });
  return { ...r, html: r.paginas.find((p) => p.tipo === 'tapume')!.html };
}
