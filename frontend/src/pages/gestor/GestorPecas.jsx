import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

const vazio = { nome: '', tema: '', descricao: '' };

export default function GestorPecas() {
  const navigate = useNavigate();
  const [pecas,     setPecas]     = useState([]);
  const [form,      setForm]      = useState(vazio);
  const [editando,  setEditando]  = useState(null);
  const [erro,      setErro]      = useState('');
  const [sucesso,   setSucesso]   = useState('');

  async function carregar() {
    const { data } = await api.get('/pecas');
    setPecas(data);
  }

  useEffect(() => { carregar(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(''); setSucesso('');
    try {
      if (editando) {
        await api.put(`/pecas/${editando}`, form);
        setSucesso('Peca atualizada.');
      } else {
        await api.post('/pecas', form);
        setSucesso('Peca cadastrada.');
      }
      setForm(vazio);
      setEditando(null);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  function iniciarEdicao(p) {
    setEditando(p.id);
    setForm({ nome: p.nome, tema: p.tema || '', descricao: p.descricao || '' });
    setErro(''); setSucesso('');
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
    setErro(''); setSucesso('');
  }

  async function remover(id) {
    if (!confirm('Remover esta peca?')) return;
    try {
      await api.delete(`/pecas/${id}`);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao remover.');
    }
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
          <h2 className="text-2xl font-bold">Pecas</h2>
        </div>

        <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">{editando ? 'Editar peca' : 'Nova peca'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Tema</label>
                <input name="tema" value={form.tema} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[#a0a0b0] text-xs block mb-1">Descricao</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} className={inputClass + " resize-none"} />
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
          {!pecas.length && <p className="text-[#a0a0b0]">Nenhuma peca cadastrada.</p>}
          {pecas.map(p => (
            <div key={p.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4 flex items-start justify-between">
              <div>
                <p className="font-semibold">{p.nome}</p>
                {p.tema && <p className="text-[#a0a0b0] text-sm">{p.tema}</p>}
                {p.descricao && <p className="text-[#a0a0b0] text-xs mt-1">{p.descricao}</p>}
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button onClick={() => iniciarEdicao(p)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-[#e94560] hover:text-[#e94560] transition-colors">
                  Editar
                </button>
                <button onClick={() => remover(p.id)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-red-500 hover:text-red-500 transition-colors">
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}