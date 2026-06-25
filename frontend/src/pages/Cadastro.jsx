import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '', ano_nasc: '' });
  const [erro,    setErro]    = useState('');
  const [sucesso, setSucesso] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(''); setSucesso('');
    try {
      await api.post('/auth/cadastro/cliente', form);
      setSucesso('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar.');
    }
  }

  const inputClass = "w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded-lg text-[#eaeaea] text-sm focus:outline-none focus:border-[#e94560]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
      <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-10 w-full max-w-md shadow-xl">
        <h1 className="text-center text-[#e94560] text-2xl font-bold mb-1">Criar conta</h1>
        <p className="text-center text-[#a0a0b0] text-sm mb-6">Preencha seus dados para se cadastrar</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="text-[#a0a0b0] text-xs mt-2">Nome completo</label>
          <input name="nome" value={form.nome} onChange={handleChange} required className={inputClass} />

          <label className="text-[#a0a0b0] text-xs mt-2">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />

          <label className="text-[#a0a0b0] text-xs mt-2">Senha</label>
          <input name="senha" type="password" value={form.senha} onChange={handleChange} required className={inputClass} />

          <label className="text-[#a0a0b0] text-xs mt-2">Telefone</label>
          <input name="telefone" value={form.telefone} onChange={handleChange} className={inputClass} />

          <label className="text-[#a0a0b0] text-xs mt-2">Ano de nascimento</label>
          <input name="ano_nasc" type="number" min="1900" max="2099" value={form.ano_nasc} onChange={handleChange} required className={inputClass} />

          {erro    && <p className="text-[#e94560] text-xs mt-1">{erro}</p>}
          {sucesso && <p className="text-green-400 text-xs mt-1">{sucesso}</p>}

          <button type="submit" className="mt-4 py-3 bg-[#e94560] text-white rounded-lg font-semibold hover:opacity-85 transition-opacity">
            Cadastrar
          </button>
        </form>

        <p className="text-center text-[#a0a0b0] text-sm mt-5">
          Ja tem conta? <Link to="/login" className="text-[#e94560]">Entrar</Link>
        </p>
      </div>
    </div>
  );
}