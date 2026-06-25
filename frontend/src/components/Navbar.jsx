import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">SistemaTeatro</Link>

      <div className="navbar-links">
        <Link to="/">Sessoes</Link>

        {!usuario && (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
          </>
        )}

        {usuario?.perfil === 'cliente' && (
          <>
            <Link to="/cliente/pedidos">Meus Pedidos</Link>
            <span className="navbar-nome">{usuario.nome}</span>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </>
        )}

        {usuario?.perfil === 'gestor' && (
          <>
            <Link to="/gestor">Painel Gestor</Link>
            <span className="navbar-nome">{usuario.nome}</span>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </>
        )}

        {usuario?.perfil === 'ator' && (
          <>
            <Link to="/ator">Painel Ator</Link>
            <span className="navbar-nome">{usuario.nome}</span>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}