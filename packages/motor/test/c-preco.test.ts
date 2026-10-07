// C. Preço e gratuito (padrão do guia)
import { describe, expect, it } from 'vitest';
import { fmtBR, numBR } from '../src/index.js';
import { praca } from './ajuda.js';

const MODELO =
  '<span class="v"><!-- @se gratuito = sim -->Evento gratuito<!-- @senao --><!-- @se preco_vista -->R$@preco_vista_1<!-- @senao -->A confirmar<!-- @fim --><!-- @fim --></span>';
const valor = (cidade: Record<string, string>, modelo = MODELO) => praca(modelo, cidade).replace(/^<span class="v">|<\/span>$/g, '');

describe('C. Preço e gratuito', () => {
  it('C1: preço preenchido', () => expect(valor({ preco_vista: '150' })).toBe('R$150'));
  it('C2: gratuito', () => expect(valor({ gratuito: 'sim' })).toBe('Evento gratuito'));
  it('C3: gratuito vence o preço', () => expect(valor({ gratuito: 'sim', preco_vista: '150' })).toBe('Evento gratuito'));
  it('C4: tudo vazio', () => expect(valor({})).toBe('A confirmar'));
  it('C5: sem diferença de maiúsculas', () => expect(valor({ gratuito: 'Sim' })).toBe('Evento gratuito'));

  it('C6: _1 no @se é ignorado', () => {
    expect(valor({ gratuito: 'sim' }, MODELO.replace('@se gratuito = sim', '@se gratuito_1 = sim'))).toBe('Evento gratuito');
  });

  it('C7: @se sem operador trata "não" como vazio', () => {
    const m = '<!-- @se gratuito -->Grátis<!-- @senao -->Pago<!-- @fim -->';
    expect(praca(m, { gratuito: 'não' })).toBe('Pago');
    expect(praca(m, { gratuito: 'nao' })).toBe('Pago');
    expect(praca(m, { gratuito: '0' })).toBe('Pago');
    expect(praca(m, { gratuito: 'sim' })).toBe('Grátis');
  });

  const PARC = '<p>@preco_vista_1|@valor_parcelado_1|@{parcelamento_1}x</p>';

  it('C8: preço à vista calculado de parcelamento × parcela', () => {
    expect(praca(PARC, { parcelamento: '10', valor_parcelado: '15' })).toBe('<p>150|15|10x</p>');
  });

  it('C9: parcela calculada de preço ÷ parcelamento', () => {
    expect(praca(PARC, { preco_vista: '150', parcelamento: '10' })).toBe('<p>150|15|10x</p>');
  });

  it('C10: número digitado sai em formato BR', () => {
    expect(praca('<p>@preco_vista_1</p>', { preco_vista: '1720' })).toBe('<p>1.720</p>');
  });

  it('C11: parcela com centavos', () => {
    expect(praca(PARC, { preco_vista: '1425', parcelamento: '10' })).toBe('<p>1.425|142,50|10x</p>');
  });

  it('C12: preço e parcela vazios não entram em loop', () => {
    expect(praca(PARC, { parcelamento: '10' })).toBe('<p>||10x</p>');
  });

  it('C13: trecho opcional some inteiro sem valor', () => {
    const m = '<p>Combo<!-- @se valor_adicional_prime --> + R$@valor_adicional_prime_1<!-- @fim --></p>';
    expect(praca(m, {})).toBe('<p>Combo</p>');
    expect(praca(m + '@preco_prime_1', { preco_vista: '150', preco_prime: '200' })).toBe('<p>Combo + R$50</p>200');
  });

  it('valor digitado vence o calculado', () => {
    expect(praca(PARC, { preco_vista: '150', parcelamento: '10', valor_parcelado: '16' })).toBe('<p>150|16|10x</p>');
  });

  it('fórmulas de desconto', () => {
    const m = '<p>@preco_vista_1|@porcentagem_desconto_1|@preco_comum_1|@desconto_em_reais_1</p>';
    expect(praca(m, { preco_vista: '140', porcentagem_desconto: '30' })).toBe('<p>140|30|200|60</p>');
  });

  it('leitura e escrita de número BR', () => {
    expect(numBR('1.720')).toBe(1720);
    expect(numBR('1.720,50')).toBe(1720.5);
    expect(numBR('R$ 150')).toBe(150);
    expect(numBR('30%')).toBe(30);
    expect(numBR('12x')).toBe(12);
    expect(numBR('abc')).toBe(null);
    expect(fmtBR(1720)).toBe('1.720');
    expect(fmtBR(142.5)).toBe('142,50');
    expect(fmtBR(1234567.891)).toBe('1.234.567,89');
  });
});
