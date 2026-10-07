// E. Blocos
import { describe, expect, it } from 'vitest';
import { gerar } from '../src/index';
import { linha, praca, tapume } from './ajuda';

const CARD = '<!-- @repetir cidades --><a href="@url">@cidade</a><!-- @fim -->';

describe('E. Blocos', () => {
  it('E1: @repetir cidades com 0 cidades não gera card', () => {
    const t = tapume('<div>' + CARD + '</div>', []);
    expect(t.html).toBe('<div></div>');
    expect(t.bloqueado).toBe(true);
    expect(t.avisos[0].codigo).toBe('sem-cidades');
  });

  it('E2: @repetir cidades com 3 cidades gera 3 cards com os seus valores e @url', () => {
    const t = tapume(CARD, [linha({ cidade: 'São Paulo' }), linha({ cidade: 'Recife' }), linha({ cidade: 'Belo Horizonte' })]);
    expect(t.html).toBe('<a href="sao-paulo.html">São Paulo</a><a href="recife.html">Recife</a><a href="belo-horizonte.html">Belo Horizonte</a>');
  });

  it('E3: @repetir etapas na praça percorre só as etapas daquela cidade', () => {
    const sp = linha({ cidade: 'São Paulo' });
    const rj = linha({ cidade: 'Rio' });
    const r = gerar({
      formato: 'tapume_etapa_praca',
      modelos: { tapume: '', praca: '<h1>@cidade_1</h1><!-- @repetir etapas --><a href="@url">@etapa</a><!-- @fim -->', etapa: '<h1>@etapa_1 em @cidade_1</h1>' },
      cidades: [sp, rj],
      etapas: [linha({ etapa: 'Outono', _cidade: sp._id }), linha({ etapa: 'Inverno', _cidade: rj._id }), linha({ etapa: 'Verão', _cidade: sp._id })],
    });
    const p = (a: string) => r.paginas.find((x) => x.arquivo === a)!.html;
    expect(p('sao-paulo.html')).toBe('<h1>São Paulo</h1><a href="sao-paulo-outono.html">Outono</a><a href="sao-paulo-verao.html">Verão</a>');
    expect(p('rio.html')).toBe('<h1>Rio</h1><a href="rio-inverno.html">Inverno</a>');
    expect(p('rio-inverno.html')).toBe('<h1>Inverno em Rio</h1>');
    expect(r.paginas.map((x) => x.arquivo)).toEqual(['index.html', 'sao-paulo.html', 'sao-paulo-outono.html', 'sao-paulo-verao.html', 'rio.html', 'rio-inverno.html']);
  });

  it('E4: @se sem @fim é aviso bloqueante com o nome do bloco', () => {
    const t = tapume('<!-- @se gratuito = sim -->Grátis', [linha({ cidade: 'A' })]);
    const a = t.avisos.find((x) => x.codigo === 'bloco-mal-fechado');
    expect(a?.nivel).toBe('bloqueia');
    expect(a?.detalhe).toContain('@se gratuito sem @fim');
    expect(t.bloqueado).toBe(true);
  });

  it('E5: @fim a mais é aviso bloqueante', () => {
    const t = tapume('<p>x</p><!-- @fim -->', [linha({ cidade: 'A' })]);
    expect(t.avisos.find((x) => x.codigo === 'bloco-mal-fechado')?.detalhe).toContain('um @fim a mais');
    expect(t.bloqueado).toBe(true);
  });

  it('E6: @senao fora de @se é aviso bloqueante', () => {
    const t = tapume('<p>x</p><!-- @senao -->', [linha({ cidade: 'A' })]);
    expect(t.avisos.find((x) => x.codigo === 'bloco-mal-fechado')?.detalhe).toContain('@senao fora de um @se');
    expect(t.bloqueado).toBe(true);
  });

  it('E4b: erro de estrutura na praça aparece uma vez, não uma por cidade', () => {
    const r = gerar({ formato: 'tapume_praca', modelos: { tapume: '', praca: '<!-- @se x -->' }, cidades: [linha({ cidade: 'A' }), linha({ cidade: 'B' })] });
    expect(r.avisos.filter((x) => x.codigo === 'bloco-mal-fechado')).toHaveLength(1);
  });

  it('E7: data de um dia ou período', () => {
    const m = '<!-- @se data_fim -->De @data_inicio_1 a @data_fim_1<!-- @senao -->@data_inicio_1<!-- @fim -->';
    expect(praca(m, { data_inicio: '12/03', data_fim: '14/03' })).toBe('De 12/03 a 14/03');
    expect(praca(m, { data_inicio: '12/03' })).toBe('12/03');
  });

  it('@se coluna != valor', () => {
    const m = '<!-- @se status != aberta -->Fechada<!-- @senao -->Aberta<!-- @fim -->';
    expect(praca(m, {})).toBe('Fechada');
    expect(praca(m, { status: 'aberta' })).toBe('Aberta');
  });

  it('@agrupar com cidades sem valor forma um grupo vazio e avisa', () => {
    const t = tapume('<!-- @agrupar por regiao --><h3>@regiao</h3><!-- @repetir cidades -->@cidade;<!-- @fim --><!-- @fim -->', [
      linha({ cidade: 'SP', regiao: 'Sudeste' }),
      linha({ cidade: 'Recife' }),
    ]);
    expect(t.html).toBe('<h3>Sudeste</h3>SP;<h3></h3>Recife;');
    expect(t.avisos.find((x) => x.codigo === 'campos-vazios')?.detalhe).toContain('@regiao (Recife)');
  });
});
