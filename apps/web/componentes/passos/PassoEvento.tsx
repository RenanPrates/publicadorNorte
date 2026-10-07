'use client';
import { FORMATOS, slug as fazerSlug, type Formato } from '@norte/motor';
import { useState } from 'react';
import { api, json } from '../api';
import { Cabecalho, NavPassos, useEditor, varsSincronizadas } from '../Editor';
import { DESC } from '../ListaEventos';

export function PassoEvento() {
  const { evento, modelos, alterar, salvarJa } = useEditor();
  const [novoSlug, setNovoSlug] = useState(evento.slug);
  const [msg, setMsg] = useState('');
  const [mudando, setMudando] = useState(false);

  async function mudarEndereco() {
    setMudando(true);
    setMsg('');
    try {
      await salvarJa();
      const r = await api<{ slug: string }>(`/api/eventos/${evento.slug}/renomear`, json('POST', { novo: novoSlug }));
      // recarrega pelo endereço novo (o evento foi movido no armazenamento)
      location.href = `/eventos/${r.slug}/evento`;
    } catch (e) {
      setMsg((e as Error).message);
      setMudando(false);
    }
  }

  return (
    <>
      <Cabecalho passo="evento" titulo="Evento">O nome aparece na lista de eventos. O formato diz quais páginas o site tem.</Cabecalho>
      <section className="card stack">
        <label className="f">Nome do evento
          <input className="inp big" value={evento.nome} onChange={(e) => { const v = e.target.value; alterar((x) => { x.nome = v; }); }} />
        </label>
        <div className="grid3" role="radiogroup" aria-label="Formato">
          {(Object.keys(FORMATOS) as Formato[]).map((f) => (
            <button key={f} type="button" className="fmt" role="radio" aria-checked={evento.formato === f}
              onClick={() => alterar((x) => { x.formato = f; x.vars = varsSincronizadas(x, modelos); })}>
              <h3>{FORMATOS[f].nome}</h3>
              <p>{DESC[f]}</p>
            </button>
          ))}
        </div>
      </section>
      <section className="card stack">
        <label className="f">Endereço do site
          <small>Vira o caminho da URL: …/<b>{novoSlug || '…'}</b>/. Só letras minúsculas, números e hífen. Mudar o endereço de um evento já publicado deixa o endereço antigo no ar até você republicar.</small>
          <div className="row">
            <input className="inp mono" style={{ maxWidth: 360 }} value={novoSlug} onChange={(e) => setNovoSlug(fazerSlug(e.target.value) + (e.target.value.endsWith('-') ? '-' : ''))} />
            <button className="btn" type="button" disabled={mudando || novoSlug === evento.slug || !novoSlug} onClick={mudarEndereco}>{mudando ? 'Mudando…' : 'Mudar endereço'}</button>
          </div>
        </label>
        {msg && <p className="small" style={{ color: 'var(--bad)' }}>{msg}</p>}
        <label className="f">URL base para referências absolutas <small>Opcional. Só se o HTML usar caminhos começando com “/”.</small>
          <input className="inp mono" value={evento.baseUrl} placeholder="https://…" onChange={(e) => { const v = e.target.value; alterar((x) => { x.baseUrl = v; }); }} />
        </label>
      </section>
      <NavPassos passo="evento" />
    </>
  );
}
