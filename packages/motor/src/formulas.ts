/**
 * Avalia uma fórmula com + − * / (e × ÷), parênteses, números e nomes de colunas.
 * `valor(nome)` devolve o número da coluna ou null. Conta que não fecha (faltou valor, divisão inválida) = null.
 */
export function avaliar(expr: string, valor: (nome: string) => number | null): number | null {
  const t = String(expr || '').match(/\d+(?:[.,]\d+)?|[A-Za-z_]\w*|[-+*/()×÷]/g) || [];
  let i = 0;
  const peek = () => t[i];
  const next = () => t[i++];
  const FALHA = Symbol('falha');
  const prim = (): number => {
    const k = next();
    if (k === '(') {
      const v = soma();
      if (next() !== ')') throw FALHA;
      return v;
    }
    if (k === '-') return -prim();
    if (k === undefined) throw FALHA;
    if (/^\d/.test(k)) return parseFloat(k.replace(',', '.'));
    if (!/^[A-Za-z_]/.test(k)) throw FALHA;
    const v = valor(k.toLowerCase());
    if (v == null) throw FALHA;
    return v;
  };
  const prod = (): number => {
    let v = prim();
    while (['*', '/', '×', '÷'].includes(peek())) {
      const o = next();
      const r = prim();
      v = o === '*' || o === '×' ? v * r : v / r;
    }
    return v;
  };
  const soma = (): number => {
    let v = prod();
    while (peek() === '+' || peek() === '-') {
      const o = next();
      const r = prod();
      v = o === '+' ? v + r : v - r;
    }
    return v;
  };
  try {
    const v = soma();
    return i < t.length || !Number.isFinite(v) ? null : v;
  } catch {
    return null;
  }
}

/** nomes de coluna usados numa fórmula */
export const nomesFormula = (f: string | undefined): string[] => [...new Set((String(f || '').match(/[A-Za-z_]\w*/g) || []).map((x) => x.toLowerCase()))];
