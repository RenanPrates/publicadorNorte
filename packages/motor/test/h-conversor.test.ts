// H. Conversor de cards fixos
import { describe, expect, it } from 'vitest';
import { gerar, temCardsFixos } from '../src/index';
import { converterCardsFixos } from '../src/conversor';
import { exemplo, fixture, linha } from './ajuda';

const conta = (s: string, sub: string) => s.split(sub).length - 1;

describe('H. Conversor de cards fixos', () => {
  it('H1: 16 cards em 2 formatos viram um card com @repetir cidades + @se status = aberta / @senao', () => {
    const html = fixture('h-cards-fixos.html');
    expect(temCardsFixos(html)).toBe(16);
    const c = converterCardsFixos(html);
    expect(c.erro).toBeUndefined();
    expect(c.cards).toBe(16);
    expect(c.status).toEqual({ aberta: 'aberta', outra: 'breve' });
    const h = c.html!;
    expect(conta(h, '<!-- @repetir cidades -->')).toBe(1);
    expect(conta(h, '<!-- @se status = aberta -->')).toBe(1);
    expect(conta(h, '<!-- @senao -->')).toBe(1);
    expect(conta(h, 'class="card aberta"')).toBe(1);
    expect(conta(h, 'class="card breve"')).toBe(1);
    expect(h.replace(/<!--[\s\S]*?-->/g, '')).not.toMatch(/@cidade_\d/);
    expect(h).toContain('href="@url"');
    expect(temCardsFixos(h)).toBe(0);
    expect(c.prefill!.map((p) => p.status)).toEqual([...Array(5).fill('aberta'), ...Array(11).fill('breve')]);
    // o comentário de documentação e o <style> ficam como estavam
    expect(h).toContain('<!-- Cards numerados de @cidade_1 a @cidade_N -->');
    expect(h.startsWith('<!doctype html>')).toBe(true);
  });

  it('H1b: o tapume convertido gera um card por cidade cadastrada', () => {
    const c = converterCardsFixos(fixture('h-cards-fixos.html'));
    const r = gerar({
      formato: 'tapume_praca',
      modelos: { tapume: c.html!, praca: '<p>@cidade_1</p>' },
      cidades: [linha({ cidade: 'São Paulo', status: 'aberta' }), linha({ cidade: 'Recife' }), linha({ cidade: 'Natal' })],
      gerais: { evento: 'Combo', ano: '2027' },
    });
    const t = r.paginas[0].html;
    expect(conta(t, 'class="card aberta"')).toBe(1);
    expect(conta(t, 'class="card breve"')).toBe(2);
    expect(t).toContain('href="sao-paulo.html"');
    expect(t).toContain('<b>1 com inscrição aberta</b> · 2 em breve');
  });

  it('H2: cards em <section data-regiao> viram @agrupar por regiao, com @regiao e @total_cidades no título', () => {
    const c = converterCardsFixos(fixture('h-regioes.html'));
    expect(c.erro).toBeUndefined();
    expect(c.col).toBe('regiao');
    expect(c.grupos).toEqual(['Sudeste', 'Nordeste', 'Sul']);
    const h = c.html!;
    expect(conta(h, '<!-- @agrupar por regiao -->')).toBe(1);
    expect(conta(h, '<section')).toBe(1);
    expect(h).toContain('data-regiao="@regiao"');
    expect(h).toMatch(/<h3 class="reg-nome">@regiao <span>@total_cidades<\/span><\/h3>/);
    expect(h).toContain('data-busca="@cidade @uf @regiao"');
    expect(h).not.toMatch(/Sudeste|Nordeste/);
    expect(c.prefill).toEqual([
      { n: 1, grupo: 'Sudeste', status: 'aberta' },
      { n: 2, grupo: 'Sudeste', status: 'aberta' },
      { n: 3, grupo: 'Sudeste', status: 'breve' },
      { n: 4, grupo: 'Nordeste', status: 'aberta' },
      { n: 5, grupo: 'Nordeste', status: 'breve' },
      { n: 6, grupo: 'Sul', status: 'aberta' },
    ]);
    const r = gerar({
      formato: 'tapume_praca',
      modelos: { tapume: h, praca: '<p>@cidade_1</p>' },
      cidades: c.prefill!.map((p) => linha({ cidade: 'Cidade ' + p.n, regiao: p.grupo, status: p.status })),
    });
    expect(r.avisos.filter((a) => a.nivel === 'bloqueia')).toEqual([]);
    const t = r.paginas[0].html;
    expect(t).toMatch(/<h3 class="reg-nome">Sudeste <span>3<\/span><\/h3>/);
    expect(t).toMatch(/<h3 class="reg-nome">Nordeste <span>2<\/span><\/h3>/);
    expect(t).toMatch(/<h3 class="reg-nome">Sul <span>1<\/span><\/h3>/);
    expect(t).toContain('4 com inscrição aberta · 2 em breve');
  });

  it('H3: contagens soltas viram @total_aberta / @total_breve', () => {
    expect(converterCardsFixos(fixture('h-cards-fixos.html')).html).toContain('<b>@total_aberta com inscrição aberta</b> · @total_breve em breve');
    expect(converterCardsFixos(fixture('h-regioes.html')).html).toContain('@total_aberta com inscrição aberta · @total_breve em breve');
  });

  it('H4: 3 formatos de card diferentes pedem conversão à mão', () => {
    const c = converterCardsFixos(fixture('h-tres-formatos.html'));
    expect(c.html).toBeUndefined();
    expect(c.erro).toContain('converta à mão');
  });

  it('H5: HTML que já tem @repetir não oferece conversão', () => {
    expect(temCardsFixos(exemplo('combo-geral-2027-tapume.html'))).toBe(0);
    expect(temCardsFixos(exemplo('combo-estacoes-tapume.html'))).toBe(0);
  });

  it('tapume com cards fixos gera aviso na geração', () => {
    const r = gerar({ formato: 'tapume_praca', modelos: { tapume: fixture('h-cards-fixos.html'), praca: '' }, cidades: [linha({ cidade: 'SP' })] });
    expect(r.avisos.find((a) => a.codigo === 'cards-fixos')?.titulo).toBe('Tapume com 16 cards fixos e 1 cidade(s) cadastrada(s)');
  });
});
