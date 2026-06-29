import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

export default function MeusPedidos() {
  const navigate = useNavigate();
  const [pedidos,    setPedidos]    = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/ingressos/meus-pedidos')
      .then(({ data }) => setPedidos(data))
      .catch(() => setPedidos([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="border border-[#2a2a4a] text-[#a0a0b0] px-4 py-1.5 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors"
          >
            Voltar
          </button>
          <h2 className="text-2xl font-bold">Meus pedidos</h2>
        </div>

        {carregando && <p className="text-[#a0a0b0]">Carregando...</p>}
        {!carregando && !pedidos.length && (
          <p className="text-[#a0a0b0]">Voce ainda nao realizou nenhuma compra.</p>
        )}

        <div className="flex flex-col gap-4">
          {pedidos.map(p => (
            <div key={p.ingresso_id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-lg">{p.sessao_nome}</p>
                  <p className="text-[#e94560] text-sm">{p.peca_nome}</p>
                </div>
                <p className="font-bold text-lg">R$ {parseFloat(p.valor).toFixed(2)}</p>
              </div>

              <div className="border-t border-[#2a2a4a] pt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-[#a0a0b0] text-xs">Data da sessao</p>
                  <p>{new Date(p.data_inicio).toLocaleDateString('pt-BR')} - {p.hora?.slice(0,5)}</p>
                </div>
                <div>
                  <p className="text-[#a0a0b0] text-xs">Data da compra</p>
                  <p>{new Date(p.comprado_em).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[#a0a0b0] text-xs">Validade do ingresso</p>
                  <p>{p.data_validade ? new Date(p.data_validade).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
                <div>
                  <p className="text-[#a0a0b0] text-xs">Pedido</p>
                  <p># {p.pedido_id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}