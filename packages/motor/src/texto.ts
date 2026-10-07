/** sem acento, minúsculas, o que não é letra ou número vira "-" */
export const slug = (s: unknown): string =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** slug para comparar status: "em breve", "em-breve" e "breve" são o mesmo valor */
export const slugValor = (s: unknown): string => {
  const k = slug(s);
  return k === 'em-breve' ? 'breve' : k;
};

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const escRx = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Lê número em formato BR: "1.720" = 1720, "1.720,50" = 1720.5; ignora R$, %, espaços e "x" no fim. */
export function numBR(x: unknown): number | null {
  let s = String(x ?? '').replace(/R\$|\s|%/g, '').replace(/x$/i, '');
  if (!s) return null;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Número em formato BR: inteiro sem casas ("1.720"), senão 2 casas ("142,50"). */
export function fmtBR(n: number): string {
  const r = Math.round(n * 100) / 100;
  const inteiro = Math.abs(r - Math.round(r)) < 1e-9;
  const abs = Math.abs(r);
  const [i, d] = (inteiro ? Math.round(abs).toFixed(0) : abs.toFixed(2)).split('.');
  const mil = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (r < 0 && abs > 0 ? '-' : '') + mil + (d ? ',' + d : '');
}

/** 3 primeiras letras (para @x_abrev) */
export const abreviar = (v: unknown): string => {
  const s = String(v ?? '').trim();
  return s.length > 3 ? s.slice(0, 3) : s;
};

/** número da linha (1, 2, …) de uma posição do texto */
export function linhaDe(src: string, pos: number): number {
  let n = 1;
  for (let i = 0; i < pos && i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}
