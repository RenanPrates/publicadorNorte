// I. Golden (ponta a ponta): gera os exemplos reais e compara com a saída aprovada em test/golden/.
// Para regravar depois de uma mudança aprovada: pnpm golden
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { converterCardsFixos, gerar, type ResultadoGerar } from '../src/index.js';
import { exemplo, fixture, linha, semEspacos } from './ajuda.js';

const PASTA = fileURLToPath(new URL('./golden/', import.meta.url));
const REGRAVAR = (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE === 'golden';

/** compara com o arquivo aprovado (ignorando espaços); em modo golden, regrava */
function golden(nome: string, html: string) {
  const arq = PASTA + nome;
  if (REGRAVAR || !existsSync(arq)) {
    mkdirSync(dirname(arq), { recursive: true });
    writeFileSync(arq, html);
    if (!REGRAVAR) throw new Error(`golden ${nome} não existia e foi criado: confira e rode de novo`);
    return;
  }
  expect(semEspacos(html), nome).toBe(semEspacos(readFileSync(arq, 'utf8')));
}

function gravarResumo(nome: string, r: ResultadoGerar) {
  const resumo = {
    paginas: r.paginas.map((p) => ({ arquivo: p.arquivo, titulo: p.titulo, avisos: p.avisos })),
    bloqueado: r.bloqueado,
    avisos: r.avisos.map((a) => `[${a.nivel}] ${a.titulo} — ${a.detalhe}`),
  };
  golden(nome, JSON.stringify(resumo, null, 2) + '\n');
}

const texto = (html: string) => html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('I. Golden', () => {
  it('I1: Makai — SP (150, aberta) e Recife (gratuito)', () => {
    const sp = linha({
      cidade: 'São Paulo', uf: 'SP', status: 'aberta', preco_vista: '150', local: 'Parque Villa-Lobos', referencia_local: 'Portão 10',
      data_inicio: '12/03', data_fim: '14/03', link_inscricao: 'https://inscricoes.exemplo.com/makai-sp', dias_competicao: '3',
      dias_extenso: 'Três', categoria_dia1: 'Iniciante', categoria_dia2: 'Intermediário', total_categorias: '6', premiacao: '20.000', ranking: 'CBBT',
    });
    const recife = linha({ cidade: 'Recife', uf: 'PE', gratuito: 'sim', local: 'Praia de Boa Viagem', data_inicio: '20/04', dias_competicao: '2', dias_extenso: 'Dois', total_categorias: '4' });
    const r = gerar({
      formato: 'tapume_praca',
      modelos: { tapume: '<!doctype html><title>@evento</title>', praca: exemplo('makai-praca.html') },
      gerais: { evento: 'Makai Beach Tennis Tour', ano: '2027' },
      cidades: [sp, recife],
    });
    expect(r.paginas.map((p) => p.arquivo)).toEqual(['index.html', 'sao-paulo.html', 'recife.html']);
    const pSP = r.paginas[1].html;
    const pRec = r.paginas[2].html;
    expect(texto(pSP)).toContain('R$150');
    expect(texto(pSP)).not.toContain('Evento gratuito');
    expect(pSP).toContain('href="https://inscricoes.exemplo.com/makai-sp"');
    expect(texto(pRec)).toContain('Evento gratuito');
    expect(texto(pRec)).not.toMatch(/R\$\s*\d/);
    // nenhuma variável sobrou sem trocar (fora CSS e comentários)
    for (const p of [pSP, pRec]) expect(texto(p.replace(/<!--[\s\S]*?-->/g, ''))).not.toMatch(/@(?!media\b|keyframes\b|font\b)[a-z]/);
    // "Etapas" (@repetir cidades): SP aberta tem link para a própria praça; Recife, em breve, não tem link
    expect(pSP).toContain('<a class="etapa__link" href="sao-paulo.html">São Paulo</a>');
    expect(pSP).not.toContain('href="recife.html"');
    golden('i1-makai/sao-paulo.html', pSP);
    golden('i1-makai/recife.html', pRec);
    gravarResumo('i1-makai/resumo.json', r);
  });

  it('I2: Combo Estações — 3 cidades em 2 regiões', () => {
    const meses = { mes_outono: 'Maio', mes_inverno: 'Julho', mes_primavera: 'Setembro', mes_verao: 'Dezembro' };
    const preco = { parcelamento: '10', preco_vista: '1425', porcentagem_desconto: '25', preco_prime: '1625' };
    const cidades = [
      linha({ cidade: 'São Paulo', uf: 'SP', regiao: 'Sudeste', status: 'aberta', link_inscricao: 'https://inscricoes.exemplo.com/combo-sp', link_inscricao_prime: 'https://inscricoes.exemplo.com/combo-sp-prime', ...meses, ...preco }),
      linha({ cidade: 'Recife', uf: 'PE', regiao: 'Nordeste', status: 'aberta', link_inscricao: 'https://inscricoes.exemplo.com/combo-rec', ...meses, mes_verao: 'Novembro', parcelamento: '10', preco_vista: '1290' }),
      linha({ cidade: 'Rio de Janeiro', uf: 'RJ', regiao: 'Sudeste', ...meses }),
    ];
    const r = gerar({
      formato: 'tapume_praca',
      modelos: { tapume: exemplo('combo-estacoes-tapume.html'), praca: exemplo('combo-estacoes-praca.html') },
      gerais: { evento: 'Circuito das Estações', ano: '2027' },
      cidades,
    });
    expect(r.bloqueado).toBe(false);
    expect(r.paginas.map((p) => p.arquivo)).toEqual(['index.html', 'sao-paulo.html', 'recife.html', 'rio-de-janeiro.html']);
    const idx = r.paginas[0].html;
    // 2 seções de região, na ordem em que aparecem no cadastro, com as contagens do grupo
    expect([...idx.matchAll(/<h3 class="reg-nome">(\w+) <span>(\d+)<\/span><\/h3>/g)].map((m) => [m[1], m[2]])).toEqual([['Sudeste', '2'], ['Nordeste', '1']]);
    expect(idx).toContain('<b>2 com inscrição aberta</b> · 1 em breve');
    // 3 cards: 2 abertos com link para a praça, 1 em breve sem link
    expect([...idx.matchAll(/<a class="praca aberta" href="([^"]+)"/g)].map((m) => m[1])).toEqual(['sao-paulo.html', 'recife.html']);
    expect(idx.split('<div class="praca breve"').length - 1).toBe(1);
    expect(idx).toContain('data-busca="Rio de Janeiro RJ Sudeste"');
    const sp = texto(r.paginas[1].html);
    expect(sp).toContain('São Paulo');
    expect(sp).toMatch(/10x\s*R\$\s*142,50/);
    golden('i2-combo-estacoes/index.html', idx);
    for (const p of r.paginas.slice(1)) golden('i2-combo-estacoes/' + p.arquivo, p.html);
    gravarResumo('i2-combo-estacoes/resumo.json', r);
  });

  it('I3: Combo Geral 2027 — tapume com meses abreviados (@mes_x_abrev vem do @mes_x da praça)', () => {
    const r = gerar({
      formato: 'tapume_praca',
      modelos: { tapume: exemplo('combo-geral-2027-tapume.html'), praca: exemplo('combo-estacoes-praca.html') },
      gerais: { evento: 'Combo Geral', ano: '2027' },
      cidades: [
        linha({ cidade: 'São Paulo', uf: 'SP', regiao: 'Sudeste', status: 'aberta', mes_outono: 'Maio', mes_inverno: 'Julho', mes_primavera: 'Setembro', mes_verao: 'Dezembro' }),
        linha({ cidade: 'Curitiba', uf: 'PR', regiao: 'Sul', mes_outono: 'Abril', mes_inverno: 'Junho', mes_primavera: 'Outubro', mes_verao: 'Janeiro' }),
      ],
    });
    expect(r.vars.mes_outono_abrev.dono).toBe('auto');
    const idx = r.paginas[0].html;
    expect(idx).toContain('--ct:var(--t-outono)">Mai</span>');
    expect(idx).toContain('--ct:var(--t-verao)">Jan</span>');
    golden('i3-combo-geral/index.html', idx);
    gravarResumo('i3-combo-geral/resumo.json', r);
  });

  it('H (golden): conversão dos cards fixos por região', () => {
    golden('h2-regioes-convertido.html', converterCardsFixos(fixture('h-regioes.html')).html!);
  });
});
