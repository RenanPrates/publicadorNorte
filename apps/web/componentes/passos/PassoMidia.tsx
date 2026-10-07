'use client';
import { ehMidia, FORMATOS, NOME_PAGINA, opcoesMidia, pastasMidia, secaoMidia, sincronizarVars, valorMidia, type TipoPagina } from '@norte/motor';
import { useDeferredValue, useMemo, useState } from 'react';
import { gerarEvento } from '@/lib/comum/montagem';
import { urlArquivo } from '../api';
import { Cabecalho, NavPassos, useEditor } from '../Editor';
import { Previa } from '../Previa';

const ehVideo = (c: string) => /\.(mp4|webm)$/i.test(c);

export function PassoMidia() {
  const { evento, modelos, arquivos, det, cad, alterar } = useEditor();
  const paginas = FORMATOS[evento.formato].paginas.filter((k) => modelos[k] != null);
  const [pag, setPag] = useState<TipoPagina>(paginas.includes('praca') ? 'praca' : paginas[0]);
  const [linhaId, setLinhaId] = useState<string>(evento.cidades[0]?._id || '');
  const caminhos = useMemo(() => arquivos.map((a) => a.caminho), [arquivos]);
  const porCaminho = useMemo(() => new Map(arquivos.map((a) => [a.caminho, a])), [arquivos]);

  // variáveis de mídia desta página, por seção
  const secoes = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const d of det.variaveis.values()) {
      if (!ehMidia(d.base) || !(pag in d.por) || cad.vars[d.base]?.ignorar || cad.vars[d.base]?.excluida) continue;
      const s = secaoMidia(d.base);
      m.set(s, [...(m.get(s) || []), d.base]);
    }
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  }, [det, pag, cad.vars]);

  const tipoLinha = (b: string) => (cad.vars[b]?.dono === 'etapa' ? 'etapa' : 'cidade');
  const linhaDe = (b: string) => (tipoLinha(b) === 'etapa' ? evento.etapas.find((e) => e._cidade === linhaId) || evento.etapas[0] : evento.cidades.find((c) => c._id === linhaId));

  function escolher(b: string, caminho: string) {
    alterar((e) => {
      e.vars = sincronizarVars(det, e.vars);
      if (e.vars[b].dono === 'geral') e.imagens[b] = caminho;
      else {
        const l = linhaDe(b);
        const alvo = (tipoLinha(b) === 'etapa' ? e.etapas : e.cidades).find((x) => x._id === l?._id);
        if (alvo) alvo[b] = caminho;
      }
    });
  }

  const ev = useDeferredValue(evento);
  const resultado = useMemo(() => gerarEvento(ev, modelos, arquivos), [ev, modelos, arquivos]);
  const pagina = resultado.paginas.find((p) => p.tipo === pag && (pag === 'tapume' || pag === 'unica' || p.cidadeId === linhaId)) || resultado.paginas.find((p) => p.tipo === pag);

  return (
    <>
      <Cabecalho passo="midia" titulo="Mídia">Escolha a imagem ou o vídeo de cada lugar. Cada lugar só mostra os arquivos da pasta da sua seção.</Cabecalho>
      <div className="row">
        <div className="seg" role="group" aria-label="Página">
          {paginas.map((k) => <button key={k} type="button" aria-pressed={pag === k} onClick={() => setPag(k)}>{NOME_PAGINA[k]}</button>)}
        </div>
        {evento.cidades.length > 0 && (
          <label className="row small" style={{ gap: 6 }}>Cidade:
            <select className="inp" style={{ width: 'auto', padding: '6px 10px' }} value={linhaId} onChange={(e) => setLinhaId(e.target.value)}>
              {evento.cidades.map((c) => <option key={c._id} value={c._id}>{cad.nomeItem('cidade', c)}</option>)}
            </select>
          </label>
        )}
      </div>
      <div className="split">
        <div className="stack" style={{ minWidth: 0 }}>
          {!arquivos.length && <div className="w-item warn"><span className="ic">!</span><div><b>Nenhum arquivo enviado</b>Envie a pasta _media no passo Páginas.</div></div>}
          {!secoes.length && <div className="card empty">Esta página não tem imagens ou vídeos trocáveis (variáveis @img_, @video_ ou @media_).</div>}
          {secoes.map(([s, bases]) => (
            <section key={s} className="img-sec">
              <h2 style={{ fontSize: 16 }}>{s}</h2>
              {bases.map((b) => {
                const ops = opcoesMidia(b, det, caminhos);
                const geral = cad.vars[b]?.dono === 'geral';
                const l = geral ? null : linhaDe(b);
                const atual = valorMidia(b, geral ? evento.imagens[b] : l?.[b], det, caminhos);
                return (
                  <div key={b} className="img-slot">
                    <div className="row" style={{ gap: 8 }}>
                      <span className="v">@{b}</span>
                      <span className="small muted">{geral ? 'igual em todas as páginas' : `escolha de ${l ? cad.nomeItem(tipoLinha(b), l) : '—'}`}</span>
                    </div>
                    {ops.length ? (
                      <div className="thumbs" role="radiogroup" aria-label={b}>
                        {ops.map((o) => {
                          const a = porCaminho.get(o.arquivo);
                          const src = a ? urlArquivo(a.sha, a.caminho) : '';
                          return (
                            <button key={o.caminho} type="button" role="radio" className="thumb" aria-checked={atual === o.caminho} disabled={!geral && !l} onClick={() => escolher(b, o.caminho)} title={o.caminho}>
                              {ehVideo(o.caminho) ? <video src={src} preload="metadata" muted /> : <img src={src} alt="" loading="lazy" />}
                              <span>{o.caminho.split('/').pop()}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="small" style={{ color: 'var(--warn)' }}>Sem arquivo. Esperado em: <span className="mono">{pastasMidia(b, det).filter((p) => p.startsWith('_media')).join(', ')}</span></p>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
        <div className="lado"><Previa html={pagina?.html ?? null} titulo={pagina ? `${pagina.titulo} · ${pagina.arquivo}` : 'Prévia'} altura={560} /></div>
      </div>
      <NavPassos passo="midia" />
    </>
  );
}
