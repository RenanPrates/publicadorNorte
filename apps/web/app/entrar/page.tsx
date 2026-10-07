'use client';
import { useState } from 'react';
import { api, json } from '@/componentes/api';
import { Topo } from '@/componentes/Topo';

export default function Entrar() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErro('');
    try {
      await api('/api/entrar', json('POST', { tentativa: senha }));
      location.href = '/';
    } catch (x) {
      setErro((x as Error).message);
      setEntrando(false);
    }
  }

  return (
    <>
      <Topo />
      <div className="shell home">
        <main className="main" style={{ maxWidth: 420, margin: '40px auto 0', width: '100%' }}>
          <form className="card stack" onSubmit={entrar}>
            <h1 style={{ fontSize: 26 }}>Publicador de Hotsites</h1>
            <p className="muted">Ferramenta interna da Norte Marketing.</p>
            <label className="f">Senha da equipe
              <input className="inp" type="password" autoFocus autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </label>
            {erro && <p className="small" style={{ color: 'var(--bad)' }}>{erro}</p>}
            <button className="btn pri" type="submit" disabled={!senha || entrando}>{entrando ? 'Entrando…' : 'Entrar'}</button>
          </form>
        </main>
      </div>
    </>
  );
}
