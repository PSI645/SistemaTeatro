import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [tipo,  setTipo]  = useState('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro,  setErro]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    const rota = tipo === 'cliente' ? '/auth/login/cliente' : '/auth/login/usuario';

    try {
      const { data } = await api.post(rota, { email, senha });
      login(data);

      if (data.perfil === 'gestor') return navigate('/gestor');
      if (data.perfil === 'ator')   return navigate('/ator');
      return navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login.');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>SistemaTeatro</h1>
        <p className="login-subtitulo">Faca seu login</p>

        <div className="login-tipo">
          <button
            className={tipo === 'cliente' ? 'ativo' : ''}
            onClick={() => setTipo('cliente')}
          >
            Cliente
          </button>
          <button
            className={tipo === 'usuario' ? 'ativo' : ''}
            onClick={() => setTipo('usuario')}
          >
            Gestor / Ator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />

          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="btn-primario">Entrar</button>
        </form>

        <p className="login-cadastro">
          Nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}