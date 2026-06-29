import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

export default function ClienteHome() {
  const { usuario } = useAuth();
  const navigate    = useNavigate();
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
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-1">Minha conta</h2>
        <p className="text-[#a0a0b0] text-sm mb-8">Bem-vindo, {usuario?.nome}</p>

        <div className="grid grid-cols-2 gap-5 mb-10">
          <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6">
            <p className="text-[#a0a0b0] text-sm mb-1">Total de pedidos</p>
            <p className="text-3xl font-bold text-[#e94560]">{pedidos.length}</p>
          </div>
          <div
            onClick={() => navigate('/')}
            className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 cursor-pointer hover:border-[#e94560] transition-colors"
          >
            <p className="text-[#a0a0b0] text-sm mb-1">Sessoes disponiveis</p>
            <p className="text-sm text-[#e94560] mt-2">Ver sessoes</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Meus pedidos recentes</h3>
            <button
              onClick={() => navigate('/cliente/pedidos')}
              className="text-[#e94560] text-sm hover:opacity-75 transition-opacity"
            >
              Ver todos
            </button>
          </div>

          {carregando && <p className="text-[#a0a0b0]">Carregando...</p>}
          {!carregando && !pedidos.length && (
            <p className="text-[#a0a0b0]">Voce ainda nao realizou nenhuma compra.</p>
          )}

          <div className="flex flex-col gap-3">
            {pedidos.slice(0, 3).map(p => (
              <div key={p.ingresso_id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.sessao_nome}</p>
                    <p className="text-[#a0a0b0] text-sm">{p.peca_nome}</p>
                    <p className="text-[#a0a0b0] text-xs mt-1">
                      {new Date(p.data_inicio).toLocaleDateString('pt-BR')} - {p.hora?.slice(0,5)}
                    </p>
                  </div>
                  <p className="font-semibold text-[#e94560]">R$ {parseFloat(p.valor).toFixed(2)}</p>
                </div>
                <p className="text-[#a0a0b0] text-xs mt-2">
                  Comprado em {new Date(p.comprado_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}