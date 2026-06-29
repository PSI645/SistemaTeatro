import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

export default function GestorIngressos() {
  const navigate = useNavigate();
  const [sessoes,   setSessoes]   = useState([]);
  const [sessaoId,  setSessaoId]  = useState('');
  const [ingressos, setIngressos] = useState([]);
  const [form,      setForm]      = useState({ valor: '', descricao: '' });
  const [editando,  setEditando]  = useState(null);
  const [erro,      setErro]      = useState('');
  const [sucesso,   setSucesso]   = useState('');

  useEffect(() => {
    api.get('/sessoes').then(({ data }) => setSessoes(data));
  }, []);

  async function carregarIngressos(id) {
    const { data } = await api.get(`/ingressos/sessao/${id}`);
    setIngressos(data);
  }

  function handleSessao(e) {
    setSessaoId(e.target.value);
    setIngressos([]);
    if (e.target.value) carregarIngressos(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(''); setSucesso('');
    try {
      if (editando) {
        await api.put(`/ingressos/${editando}`, form);
        setSucesso('Ingresso atualizado.');
        setEditando(null);
      } else {
        await api.post('/ingressos', { ...form, sessao_id: sessaoId });
        setSucesso('Ingresso criado.');
      }
      setForm({ valor: '', descricao: '' });
      carregarIngressos(sessaoId);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  function iniciarEdicao(i) {
    setEditando(i.id);
    setForm({ valor: i.valor, descricao: i.descricao || '' });
    setErro(''); setSucesso('');
  }

  function cancelar() {
    setEditando(null);
    setForm({ valor: '', descricao: '' });
    setErro(''); setSucesso('');
  }

  const inputClass = "w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded-lg text-[#eaeaea] text-sm focus:outline-none focus:border-[#e94560]";

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/gestor')} className="border border-[#2a2a4a] text-[#a0a0b0] px-4 py-1.5 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">
            Voltar
          </button>
          <h2 className="text-2xl font-bold">Ingressos</h2>
        </div>

        <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 mb-6">
          <label className="text-[#a0a0b0] text-xs block mb-1">Selecione a sessao</label>
          <select value={sessaoId} onChange={handleSessao} className={inputClass}>
            <option value="">Selecione</option>
            {sessoes.map(s => (
              <option key={s.id} value={s.id}>
                {s.nome} - {new Date(s.data_inicio).toLocaleDateString('pt-BR')}
              </option>
            ))}
          </select>
        </div>

        {sessaoId && (
          <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">{editando ? 'Editar ingresso' : 'Novo ingresso'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a0a0b0] text-xs block mb-1">Valor (R$)</label>
                  <input name="valor" type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className="text-[#a0a0b0] text-xs block mb-1">Descricao</label>
                  <input name="descricao" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Meia-entrada, VIP..." className={inputClass} />
                </div>
              </div>

              {erro    && <p className="text-[#e94560] text-xs">{erro}</p>}
              {sucesso && <p className="text-green-400 text-xs">{sucesso}</p>}

              <div className="flex gap-3 mt-1">
                <button type="submit" className="bg-[#e94560] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity">
                  {editando ? 'Salvar alteracoes' : 'Criar ingresso'}
                </button>
                {editando && (
                  <button type="button" onClick={cancelar} className="border border-[#2a2a4a] text-[#a0a0b0] px-5 py-2 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {sessaoId && (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Ingressos desta sessao</h3>
            {!ingressos.length && <p className="text-[#a0a0b0]">Nenhum ingresso criado para esta sessao.</p>}
            {ingressos.map(i => (
              <div key={i.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4 flex items-center justify-between">
                <div>.
                  <p className="font-semibold">R$ {parseFloat(i.valor).toFixed(2)}</p>
                  {i.descricao && <p className="text-[#a0a0b0] text-sm">{i.descricao}</p>}
                  <p className="text-xs mt-1">
                    {i.cliente_id
                      ? <span className="text-green-400">Vendido</span>
                      : <span className="text-[#a0a0b0]">Disponivel</span>
                    }
                  </p>
                </div>
                {!i.cliente_id && (
                  <button onClick={() => iniciarEdicao(i)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-[#e94560] hover:text-[#e94560] transition-colors">
                    Editar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}