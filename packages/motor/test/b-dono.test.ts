// B. Dono (em qual tabela o valor é preenchido)
import { describe, expect, it } from 'vitest';
import { colunas, detectar, inferirDonos, sincronizarVars } from '../src/index.js';

describe('B. Dono', () => {
  it('B1: variável sem número é geral', () => {
    const det = detectar({ tapume: '<h1>@evento</h1>', praca: '<h1>@evento</h1>' }, 'tapume_praca');
    expect(inferirDonos(det).evento).toBe('geral');
  });

  it('B2: @cidade_1 na praça é da cidade', () => {
    const det = detectar({ tapume: '', praca: '<h1>@cidade_1</h1>' }, 'tapume_praca');
    expect(inferirDonos(det).cidade).toBe('cidade');
  });

  it('B3: @cidade dentro de @repetir cidades no tapume é da cidade', () => {
    const det = detectar({ tapume: '<!-- @repetir cidades --><a>@cidade</a><!-- @fim -->', praca: '' }, 'tapume_praca');
    expect(inferirDonos(det).cidade).toBe('cidade');
  });

  it('B4: no formato com etapas, variável numerada só no HTML da etapa é da etapa', () => {
    const det = detectar(
      { tapume: '<!-- @repetir cidades -->@cidade<!-- @fim -->', praca: '<h1>@cidade_1</h1>', etapa: '<h1>@cidade_1 · @data_etapa_1</h1>' },
      'tapume_etapa_praca',
    );
    const d = inferirDonos(det);
    expect(d.data_etapa).toBe('etapa');
    expect(d.cidade).toBe('cidade');
  });

  it('B4b: @repetir etapas na praça faz a variável ser da etapa', () => {
    const det = detectar({ tapume: '', praca: '<!-- @repetir etapas --><a>@etapa</a><!-- @fim -->', etapa: '' }, 'tapume_etapa_praca');
    expect(inferirDonos(det).etapa).toBe('etapa');
  });

  it('B4c: coluna de @se só na página da etapa também é da etapa', () => {
    const det = detectar({ tapume: '', praca: '<p>@cidade_1</p>', etapa: '<!-- @se noturna = sim -->Noite<!-- @fim -->' }, 'tapume_etapa_praca');
    expect(inferirDonos(det).noturna).toBe('etapa');
  });

  it('B5: variável movida à mão para geral continua geral depois de reenviar o HTML', () => {
    const det1 = detectar({ tapume: '', praca: '<p>@local_1</p>' }, 'tapume_praca');
    const vars = sincronizarVars(det1);
    expect(vars.local.dono).toBe('cidade');
    vars.local = { ...vars.local, dono: 'geral', manual: true };
    const det2 = detectar({ tapume: '', praca: '<p>@local_1 e @uf_1</p>' }, 'tapume_praca');
    const depois = sincronizarVars(det2, vars);
    expect(depois.local.dono).toBe('geral');
    expect(depois.uf.dono).toBe('cidade');
  });

  it('B5b: sem "manual", o dono é deduzido de novo a cada envio', () => {
    const vars = sincronizarVars(detectar({ tapume: '', praca: '<p>@local</p>' }, 'tapume_praca'));
    expect(vars.local.dono).toBe('geral');
    const depois = sincronizarVars(detectar({ tapume: '', praca: '<p>@local_1</p>' }, 'tapume_praca'), vars);
    expect(depois.local.dono).toBe('cidade');
  });

  it('B6: @media_*, @img_*, @video_* são mídia, nunca coluna de texto', () => {
    const det = detectar({ tapume: '', praca: '<img src="@media_hero_desktop_1"><img src="@img_kit_foto"><img src="@video_arena_cena_1"><p>@cidade_1</p>' }, 'tapume_praca');
    const vars = sincronizarVars(det);
    expect(colunas('cidade', det, vars)).toEqual(['cidade']);
    expect(colunas('geral', det, vars)).toEqual([]);
  });

  it('sincronizarVars não altera o estado recebido e aplica as fórmulas padrão', () => {
    const det = detectar({ tapume: '', praca: '<p>@preco_vista_1 @valor_parcelado_1 @{parcelamento_1}x</p>' }, 'tapume_praca');
    const antes = { preco_vista: { dono: 'cidade' as const, formula: '' } };
    const vars = sincronizarVars(det, antes);
    expect(antes).toEqual({ preco_vista: { dono: 'cidade', formula: '' } });
    expect(vars.preco_vista.formula).toBe(''); // quem tirou a fórmula continua sem
    expect(vars.valor_parcelado.formula).toBe('preco_vista / parcelamento');
  });

  it('ordem das colunas: padrão da base, depois a ordem em que aparecem; a arrastada vence', () => {
    const det = detectar({ tapume: '', praca: '<p>@premiacao_1 @local_1 @uf_1 @cidade_1 @categorias_1</p>' }, 'tapume_praca');
    const vars = sincronizarVars(det);
    expect(colunas('cidade', det, vars)).toEqual(['cidade', 'uf', 'local', 'premiacao', 'categorias']);
    expect(colunas('cidade', det, vars, { cidade: ['categorias'] })).toEqual(['categorias', 'cidade', 'uf', 'local', 'premiacao']);
  });
});
