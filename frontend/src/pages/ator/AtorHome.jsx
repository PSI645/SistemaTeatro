import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

export default function AtorHome() {
  const { usuario } = useAuth();
  const [sessoes,    setSessoes]    = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/sessoes')
      .then(({ data }) => setSessoes(data))
      .catch(() => setSessoes([]))
      .finally(() => setCarregando(false));
  }, []);

  function badgeStyle(disp) {
    if (disp === 'disponivel') return 'bg-green-900 text-green-400';
    if (disp === 'esgotada')   return 'bg-red-900 text-red-400';
    return 'bg-[#2a2a4a] text-[#a0a0b0]';
  }

  function badgeLabel(disp) {
    if (disp === 'disponivel') return 'Disponivel';
    if (disp === 'esgotada')   return 'Esgotada';
    return 'Em breve';
  }

  const disponiveis = sessoes.filter(s => s.disponibilidade === 'disponivel');
  const emBreve     = sessoes.filter(s => s.disponibilidade === 'em_breve');
  const esgotadas   = sessoes.filter(s => s.disponibilidade === 'esgotada');

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-1">Painel do Ator</h2>
        <p className="text-[#a0a0b0] text-sm mb-8">Bem-vindo, {usuario?.nome}</p>

        <div className="grid grid-cols-3 gap-5 mb-10">
          <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-5">
            <p className="text-[#a0a0b0] text-xs mb-1">Disponiveis</p>
            <p className="text-3xl font-bold text-green-400">{disponiveis.length}</p>
          </div>
          <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-5">
            <p className="text-[#a0a0b0] text-xs mb-1">Em breve</p>
            <p className="text-3xl font-bold text-[#a0a0b0]">{emBreve.length}</p>
          </div>
          <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-5">
            <p className="text-[#a0a0b0] text-xs mb-1">Esgotadas</p>
            <p className="text-3xl font-bold text-[#e94560]">{esgotadas.length}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Todas as sessoes</h3>

        {carregando && <p className="text-[#a0a0b0]">Carregando...</p>}
        {!carregando && !sessoes.length && (
          <p className="text-[#a0a0b0]">Nenhuma sessao cadastrada.</p>
        )}

        <div className="flex flex-col gap-3">
          {sessoes.map(s => (
            <div key={s.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{s.nome}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeStyle(s.disponibilidade)}`}>
                      {badgeLabel(s.disponibilidade)}
                    </span>
                  </div>
                  <p className="text-[#a0a0b0] text-sm">{s.peca_nome}</p>
                  <p className="text-[#a0a0b0] text-xs mt-1">
                    {new Date(s.data_inicio).toLocaleDateString('pt-BR')} - {s.hora?.slice(0,5)}
                  </p>
                </div>
                {s.classificacao && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a4a] text-[#a0a0b0]">
                    {s.classificacao}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}