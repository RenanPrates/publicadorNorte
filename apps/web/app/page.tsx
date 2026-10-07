import { ListaEventos } from '@/componentes/ListaEventos';
import { Topo } from '@/componentes/Topo';

export default function Inicio() {
  return (
    <>
      <Topo />
      <div className="shell home">
        <main className="main">
          <ListaEventos />
        </main>
      </div>
    </>
  );
}
