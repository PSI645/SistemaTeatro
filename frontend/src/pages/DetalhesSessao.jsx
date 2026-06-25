import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Navbar from '../components/Navbar';

export default function DetalhesSessao() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate    = useNavigate();

  const [sessao,     setSessao]     = useState(null);
  const [ingressos,  setIngressos]  = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem,   setMensagem]   = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/sessoes/${id}`),
      api.get(`/ingressos/sessao/${id}`)
    ]).then(([{ data: s }, { data: i }]) => {
      setSessao(s);
      setIngressos(i);
    }).finally(() => setCarregando(false));
  }, [id]);

  async function comprar(ingresso_id) {
    if (!usuario) return navigate('/login');
    if (usuario.perfil !== 'cliente') return;
    try {
      await api.post('/ingressos/comprar', { ingresso_id });
      setMensagem('Compra realizada com sucesso!');
      const { data } = await api.get(`/ingressos/sessao/${id}`);
      setIngressos(data);
    } catch (err) {
      setMensagem(err.response?.data?.erro || 'Erro ao comprar ingresso.');
    }
  }

  if (carregando) return <><Navbar /><p className="p-8 text-[#a0a0b0]">Carregando...</p></>;
  if (!sessao)    return <><Navbar /><p className="p-8 text-[#a0a0b0]">Sessao nao encontrada.</p></>;

  const disponiveis = ingressos.filter(i => !i.cliente_id);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="border border-[#2a2a4a] text-[#a0a0b0] px-4 py-1.5 rounded-lg text-sm mb-6 hover:border-[#e94560] hover:text-[#e94560] transition-colors"
        >
          Voltar
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1">{sessao.nome}</h2>
          <p className="text-[#e94560] mb-1">{sessao.peca_nome}</p>
          <p className="text-[#a0a0b0] text-sm mb-3">
            {new Date(sessao.data_inicio).toLocaleDateString('pt-BR')} - {sessao.hora?.slice(0,5)}
            {sessao.classificacao && (
              <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-[#2a2a4a] text-[#a0a0b0]">
                {sessao.classificacao}
              </span>
            )}
          </p>
          {sessao.peca_descricao && <p className="text-[#a0a0b0] leading-relaxed">{sessao.peca_descricao}</p>}
        </div>

        {sessao.atores?.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Elenco</h3>
            <div className="flex flex-wrap gap-3">
              {sessao.atores.map(a => (
                <div key={a.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-full px-4 py-1.5">
                  <span className="text-sm">{a.nome}</span>
                  <span className="text-xs text-[#a0a0b0] ml-2">{a.vocacao}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-lg font-semibold mb-4">Ingressos disponiveis ({disponiveis.length})</h3>

          {mensagem && <p className="text-green-400 text-sm mb-4">{mensagem}</p>}
          {!disponiveis.length && <p className="text-[#a0a0b0]">Nenhum ingresso disponivel no momento.</p>}

          <div className="flex flex-col gap-3">
            {disponiveis.map(i => (
              <div key={i.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">R$ {parseFloat(i.valor).toFixed(2)}</p>
                  {i.descricao && <p className="text-[#a0a0b0] text-sm mt-0.5">{i.descricao}</p>}
                </div>
                {usuario?.perfil === 'cliente' && (
                  <button onClick={() => comprar(i.id)} className="bg-[#e94560] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity">
                    Comprar
                  </button>
                )}
                {!usuario && (
                  <button onClick={() => navigate('/login')} className="bg-[#e94560] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity">
                    Entrar para comprar
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}