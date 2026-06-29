import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    const rota = tipo === 'usuario' ? '/auth/login/usuario' : '/auth/login/cliente';
    try {
      const { data } = await api.post(rota, { email, senha });
      login(data);
      if (data.perfil === 'gestor') return navigate('/gestor');
      return navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login.');
    }
  }

  const inputClass = "w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4a] rounded-lg text-[#eaeaea] text-sm focus:outline-none focus:border-[#e94560]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
      <div className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-10 w-full max-w-md shadow-xl">
        <h1 className="text-center text-[#e94560] text-2xl font-bold mb-1">SistemaTeatro</h1>
        <p className="text-center text-[#a0a0b0] text-sm mb-6">Faca seu login</p>

        <div className="flex border border-[#2a2a4a] rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => setTipo('cliente')}
            className={`flex-1 py-2 text-sm transition-colors ${tipo === 'cliente' ? 'bg-[#e94560] text-white' : 'text-[#a0a0b0]'}`}
          >
            Cliente / Ator
          </button>
          <button
            onClick={() => setTipo('usuario')}
            className={`flex-1 py-2 text-sm transition-colors ${tipo === 'usuario' ? 'bg-[#e94560] text-white' : 'text-[#a0a0b0]'}`}
          >
            Gestor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="text-[#a0a0b0] text-xs mt-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />

          <label className="text-[#a0a0b0] text-xs mt-2">Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required className={inputClass} />

          {erro && <p className="text-[#e94560] text-xs mt-1">{erro}</p>}

          <button type="submit" className="mt-4 py-3 bg-[#e94560] text-white rounded-lg font-semibold hover:opacity-85 transition-opacity">
            Entrar
          </button>
        </form>

        <p className="text-center text-[#a0a0b0] text-sm mt-5">
          Nao tem conta? <Link to="/cadastro" className="text-[#e94560]">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}