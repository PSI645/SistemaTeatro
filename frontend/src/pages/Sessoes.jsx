import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';

export default function Sessoes() {
  const [sessoes,    setSessoes]    = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

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

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Sessoes em cartaz</h2>

        {carregando && <p className="text-[#a0a0b0]">Carregando...</p>}
        {!carregando && !sessoes.length && <p className="text-[#a0a0b0]">Nenhuma sessao cadastrada.</p>}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {sessoes.map(s => (
            <div
              key={s.id}
              onClick={() => navigate(`/sessoes/${s.id}`)}
              className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-5 cursor-pointer hover:border-[#e94560] hover:-translate-y-0.5 transition-all"
            >
              <div className="flex gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeStyle(s.disponibilidade)}`}>
                  {badgeLabel(s.disponibilidade)}
                </span>
                {s.classificacao && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#2a2a4a] text-[#a0a0b0]">
                    {s.classificacao}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold mb-1">{s.nome}</h3>
              <p className="text-[#a0a0b0] text-sm mb-2">{s.peca_nome}</p>
              <p className="text-[#e94560] text-xs">
                {new Date(s.data_inicio).toLocaleDateString('pt-BR')} - {s.hora?.slice(0,5)}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}