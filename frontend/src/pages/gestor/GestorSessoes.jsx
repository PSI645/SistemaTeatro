import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

const vazio = { nome: '', peca_id: '', data_inicio: '', hora: '', classificacao: '', disponibilidade: 'em_breve', atores: [] };

export default function GestorSessoes() {
  const navigate = useNavigate();
  const [sessoes,  setSessoes]  = useState([]);
  const [pecas,    setPecas]    = useState([]);
  const [atores,   setAtores]   = useState([]);
  const [form,     setForm]     = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [erro,     setErro]     = useState('');
  const [sucesso,  setSucesso]  = useState('');

  async function carregar() {
    const [s, p, a] = await Promise.all([
      api.get('/sessoes'),
      api.get('/pecas'),
      api.get('/atores'),
    ]);
    setSessoes(s.data);
    setPecas(p.data);
    setAtores(a.data);
  }

  useEffect(() => { carregar(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleAtor(id) {
    const lista = form.atores.includes(id)
      ? form.atores.filter(a => a !== id)
      : [...form.atores, id];
    setForm({ ...form, atores: lista });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(''); setSucesso('');
    try {
      if (editando) {
        await api.put(`/sessoes/${editando}`, form);
        setSucesso('Sessao atualizada.');
      } else {
        await api.post('/sessoes', form);
        setSucesso('Sessao cadastrada.');
      }
      setForm(vazio);
      setEditando(null);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  async function iniciarEdicao(s) {
    const { data } = await api.get(`/sessoes/${s.id}`);
    setEditando(s.id);
    setForm({
      nome:           data.nome,
      peca_id:        data.peca_id,
      data_inicio:    data.data_inicio?.slice(0, 10),
      hora:           data.hora?.slice(0, 5),
      classificacao:  data.classificacao || '',
      disponibilidade: data.disponibilidade,
      atores:         data.atores.map(a => a.id),
    });
    setErro(''); setSucesso('');
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
    setErro(''); setSucesso('');
  }

  async function remover(id) {
    if (!confirm('Remover esta sessao?')) return;
    try {
      await api.delete(`/sessoes/${id}`);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao remover.');
    }
  }

  async function alterarDisponibilidade(id, disponibilidade) {
    try {
      await api.patch(`/sessoes/${id}/disponibilidade`, { disponibilidade });
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao atualizar.');
    }
  }

  const inputClass = "w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded-lg text-[#eaeaea] text-sm focus:outline-none focus:border-[#e94560]";

  function badgeDisp(disp) {
    if (disp === 'disponivel') return 'bg-green-900 text-green-400';
    if (disp === 'esgotada')   return 'bg-red-900 text-red-400';
    return 'bg-[#2a2a4a] text-[#a0a0b0]';
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/gestor')} className="border border-[#2a2a4a] text-[#a0a0b0] px-4 py-1.5 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">
            Voltar
          </button>
          <h2 className="text-2xl font-bold">Sessoes</h2>
        </div>

        <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">{editando ? 'Editar sessao' : 'Nova sessao'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Peca</label>
                <select name="peca_id" value={form.peca_id} onChange={handleChange} required className={inputClass}>
                  <option value="">Selecione</option>
                  {pecas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Data de inicio</label>
                <input name="data_inicio" type="date" value={form.data_inicio} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Hora</label>
                <input name="hora" type="time" value={form.hora} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Classificacao</label>
                <input name="classificacao" value={form.classificacao} onChange={handleChange} placeholder="Livre, 12, 14..." className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Disponibilidade</label>
                <select name="disponibilidade" value={form.disponibilidade} onChange={handleChange} className={inputClass}>
                  <option value="em_breve">Em breve</option>
                  <option value="disponivel">Disponivel</option>
                  <option value="esgotada">Esgotada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[#a0a0b0] text-xs block mb-2">Atores</label>
              <div className="flex flex-wrap gap-2">
                {atores.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAtor(a.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      form.atores.includes(a.id)
                        ? 'bg-[#e94560] border-[#e94560] text-white'
                        : 'border-[#2a2a4a] text-[#a0a0b0] hover:border-[#e94560]'
                    }`}
                  >
                    {a.nome}
                  </button>
                ))}
              </div>
            </div>

            {erro    && <p className="text-[#e94560] text-xs">{erro}</p>}
            {sucesso && <p className="text-green-400 text-xs">{sucesso}</p>}

            <div className="flex gap-3 mt-1">
              <button type="submit" className="bg-[#e94560] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity">
                {editando ? 'Salvar alteracoes' : 'Cadastrar'}
              </button>
              {editando && (
                <button type="button" onClick={cancelar} className="border border-[#2a2a4a] text-[#a0a0b0] px-5 py-2 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-3">
          {!sessoes.length && <p className="text-[#a0a0b0]">Nenhuma sessao cadastrada.</p>}
          {sessoes.map(s => (
            <div key={s.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{s.nome}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeDisp(s.disponibilidade)}`}>
                      {s.disponibilidade}
                    </span>
                  </div>
                  <p className="text-[#a0a0b0] text-sm">{s.peca_nome}</p>
                  <p className="text-[#a0a0b0] text-xs mt-1">
                    {new Date(s.data_inicio).toLocaleDateString('pt-BR')} - {s.hora?.slice(0,5)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button onClick={() => iniciarEdicao(s)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-[#e94560] hover:text-[#e94560] transition-colors">
                    Editar
                  </button>
                  <button onClick={() => remover(s.id)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-red-500 hover:text-red-500 transition-colors">
                    Remover
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {['em_breve', 'disponivel', 'esgotada'].map(d => (
                  <button
                    key={d}
                    onClick={() => alterarDisponibilidade(s.id, d)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      s.disponibilidade === d
                        ? 'bg-[#e94560] border-[#e94560] text-white'
                        : 'border-[#2a2a4a] text-[#a0a0b0] hover:border-[#e94560]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}