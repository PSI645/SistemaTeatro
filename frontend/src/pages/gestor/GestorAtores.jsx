import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

const vazio = { nome: '', idade: '', vocacao: 'ator', descricao: '' };

export default function GestorAtores() {
  const navigate = useNavigate();
  const [atores,   setAtores]   = useState([]);
  const [form,     setForm]     = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [erro,     setErro]     = useState('');
  const [sucesso,  setSucesso]  = useState('');

  async function carregar() {
    const { data } = await api.get('/atores');
    setAtores(data);
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
        await api.put(`/atores/${editando}`, form);
        setSucesso('Ator atualizado.');
      } else {
        await api.post('/atores', form);
        setSucesso('Ator cadastrado.');
      }
      setForm(vazio);
      setEditando(null);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar.');
    }
  }

  function iniciarEdicao(a) {
    setEditando(a.id);
    setForm({ nome: a.nome, idade: a.idade || '', vocacao: a.vocacao, descricao: a.descricao || '' });
    setErro(''); setSucesso('');
  }

  function cancelar() {
    setEditando(null);
    setForm(vazio);
    setErro(''); setSucesso('');
  }

  async function remover(id) {
    if (!confirm('Remover este ator?')) return;
    try {
      await api.delete(`/atores/${id}`);
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
          <h2 className="text-2xl font-bold">Atores</h2>
        </div>

        <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">{editando ? 'Editar ator' : 'Novo ator'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="text-[#a0a0b0] text-xs block mb-1">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Idade</label>
                <input name="idade" type="number" value={form.idade} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-[#a0a0b0] text-xs block mb-1">Vocacao</label>
                <select name="vocacao" value={form.vocacao} onChange={handleChange} className={inputClass}>
                  <option value="ator">Ator</option>
                  <option value="cantor">Cantor</option>
                  <option value="musico">Musico</option>
                </select>
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
          {!atores.length && <p className="text-[#a0a0b0]">Nenhum ator cadastrado.</p>}
          {atores.map(a => (
            <div key={a.id} className="bg-[#16213e] border border-[#2a2a4a] rounded-lg px-5 py-4 flex items-start justify-between">
              <div>
                <p className="font-semibold">{a.nome}</p>
                <p className="text-[#a0a0b0] text-sm">{a.vocacao}{a.idade ? ` - ${a.idade} anos` : ''}</p>
                {a.descricao && <p className="text-[#a0a0b0] text-xs mt-1">{a.descricao}</p>}
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button onClick={() => iniciarEdicao(a)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-[#e94560] hover:text-[#e94560] transition-colors">
                  Editar
                </button>
                <button onClick={() => remover(a.id)} className="border border-[#2a2a4a] text-[#a0a0b0] px-3 py-1 rounded-lg text-xs hover:border-red-500 hover:text-red-500 transition-colors">
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