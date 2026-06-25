import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="flex items-center justify-between px-8 h-15 bg-[#16213e] border-b border-[#2a2a4a] sticky top-0 z-50">
      <Link to="/" className="text-[#e94560] font-bold text-lg">SistemaTeatro</Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-[#eaeaea] text-sm hover:text-[#e94560] transition-colors">Sessoes</Link>

        {!usuario && (
          <>
            <Link to="/login"    className="text-[#eaeaea] text-sm hover:text-[#e94560] transition-colors">Entrar</Link>
            <Link to="/cadastro" className="text-[#eaeaea] text-sm hover:text-[#e94560] transition-colors">Cadastrar</Link>
          </>
        )}

        {usuario?.perfil === 'cliente' && (
          <>
            <Link to="/cliente/pedidos" className="text-[#eaeaea] text-sm hover:text-[#e94560] transition-colors">Meus Pedidos</Link>
            <span className="text-[#a0a0b0] text-sm">{usuario.nome}</span>
            <button onClick={handleLogout} className="border border-[#2a2a4a] text-[#eaeaea] px-3 py-1 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">Sair</button>
          </>
        )}

        {usuario?.perfil === 'gestor' && (
          <>
            <Link to="/gestor" className="text-[#eaeaea] text-sm hover:text-[#e94560] transition-colors">Painel Gestor</Link>
            <span className="text-[#a0a0b0] text-sm">{usuario.nome}</span>
            <button onClick={handleLogout} className="border border-[#2a2a4a] text-[#eaeaea] px-3 py-1 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">Sair</button>
          </>
        )}

        {usuario?.perfil === 'ator' && (
          <>
            <Link to="/ator" className="text-[#eaeaea] text-sm hover:text-[#e94560] transition-colors">Painel Ator</Link>
            <span className="text-[#a0a0b0] text-sm">{usuario.nome}</span>
            <button onClick={handleLogout} className="border border-[#2a2a4a] text-[#eaeaea] px-3 py-1 rounded-lg text-sm hover:border-[#e94560] hover:text-[#e94560] transition-colors">Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}