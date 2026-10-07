// A. Detecção de variáveis
import { describe, expect, it } from 'vitest';
import { acharVars, colunas, detectar, ehMidia, inferirDonos, sincronizarVars } from '../src/index';
import { praca } from './ajuda';

const bases = (html: string) => acharVars(html).filter((o) => !o.sint).map((o) => [o.base, o.num]);

describe('A. Detecção de variáveis', () => {
  it('A1: @cidade_1 - @uf_1 são duas variáveis com número 1', () => {
    expect(bases('<p>@cidade_1 - @uf_1</p>')).toEqual([['cidade', 1], ['uf', 1]]);
  });

  it('A2: barra só de um lado não é pacote npm', () => {
    expect(bases('<p>@cidade_1/@uf_1</p>')).toEqual([['cidade', 1], ['uf', 1]]);
  });

  it('A3: pacote npm em URL não é variável', () => {
    expect(bases('<script src="https://cdn.jsdelivr.net/npm/@scope/pkg/x.js"></script>')).toEqual([]);
  });

  it('A4: e-mail não é variável', () => {
    expect(bases('<p>contato@norte.com</p>')).toEqual([]);
  });

  it('A5: comentário não é variável', () => {
    expect(bases('<!-- use @cidade_1 aqui -->')).toEqual([]);
  });

  it('A6: @cidade_N com N literal é documentação', () => {
    expect(bases('<p>Escreva @cidade_N</p>')).toEqual([]);
  });

  it('A7: at-rules de CSS dentro de <style> não são variáveis', () => {
    expect(bases('<style>@media (max-width:600px){a{b:c}} @font-face{font-family:x} @keyframes giro{} @import url(x.css);</style>')).toEqual([]);
    expect(bases('<div style="@media x">oi</div>')).toEqual([]);
  });

  it('A8: @media_hero_desktop_1 fora de style é variável de mídia', () => {
    expect(bases('<img src="@media_hero_desktop_1">')).toEqual([['media_hero_desktop', 1]]);
    expect(ehMidia('media_hero_desktop')).toBe(true);
  });

  it('A9: chaves de JSON-LD não são variáveis', () => {
    expect(bases('<script type="application/ld+json">{"@context":"https://schema.org","@type":"Event","@id":"x"}</script>')).toEqual([]);
  });

  it('A10: @{parcelamento_1}x é a variável parcelamento, com o "x" preservado', () => {
    expect(bases('<b>@{parcelamento_1}x</b>')).toEqual([['parcelamento', 1]]);
    expect(praca('<b>@{parcelamento_1}x</b>', { parcelamento: '10' })).toBe('<b>10x</b>');
  });

  it('A11: coluna só usada em @se é criada, com as opções testadas', () => {
    const det = detectar({ tapume: '', praca: '<!-- @se gratuito = sim -->Grátis<!-- @fim -->' }, 'tapume_praca');
    expect(det.variaveis.has('gratuito')).toBe(true);
    expect(det.opcoes.gratuito).toEqual(['sim']);
    expect(colunas('cidade', det, sincronizarVars(det))).toContain('gratuito');
  });

  it('A12: @total_aberta, @total_breve e @total_cidades são automáticas', () => {
    const det = detectar({ tapume: '<p>@total_aberta @total_breve @total_cidades</p>', praca: '' }, 'tapume_praca');
    expect(inferirDonos(det)).toEqual({ total_aberta: 'auto', total_breve: 'auto', total_cidades: 'auto' });
  });

  it('A13: @total_categorias_1 é variável comum da cidade', () => {
    const det = detectar({ tapume: '', praca: '<p>@total_categorias_1</p>' }, 'tapume_praca');
    expect(inferirDonos(det).total_categorias).toBe('cidade');
    expect(praca('<p>@total_categorias_1</p>', { total_categorias: '6' })).toBe('<p>6</p>');
  });

  it('A14: @mes_outono_abrev com @mes_outono é automática (3 letras)', () => {
    const html = '<p>@mes_outono_1 / @mes_outono_abrev_1</p>';
    const det = detectar({ tapume: '', praca: html }, 'tapume_praca');
    expect(inferirDonos(det).mes_outono_abrev).toBe('auto');
    expect(praca(html, { mes_outono: 'Maio' })).toBe('<p>Maio / Mai</p>');
  });

  it('A14b: @x_abrev sem @x é variável comum', () => {
    const det = detectar({ tapume: '', praca: '<p>@mes_outono_abrev_1</p>' }, 'tapume_praca');
    expect(inferirDonos(det).mes_outono_abrev).toBe('cidade');
  });
});
