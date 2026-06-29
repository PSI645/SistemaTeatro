import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function GestorHome() {
  const { usuario } = useAuth();

  const cards = [
    { label: 'Pecas',     descricao: 'Cadastrar e gerenciar pecas',           path: '/gestor/pecas'     },
    { label: 'Atores',    descricao: 'Cadastrar e gerenciar atores',          path: '/gestor/atores'    },
    { label: 'Sessoes',   descricao: 'Criar sessoes e vincular pecas/atores', path: '/gestor/sessoes'   },
    { label: 'Ingressos', descricao: 'Definir valor e gerenciar ingressos',   path: '/gestor/ingressos' },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-1">Painel do Gestor</h2>
        <p className="text-[#a0a0b0] text-sm mb-8">Bem-vindo, {usuario?.nome}</p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {cards.map(c => (
            <Link
              key={c.path}
              to={c.path}
              className="bg-[#16213e] border border-[#2a2a4a] rounded-lg p-6 hover:border-[#e94560] hover:-translate-y-0.5 transition-all"
            >
              <h3 className="text-lg font-semibold mb-1">{c.label}</h3>
              <p className="text-[#a0a0b0] text-sm">{c.descricao}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}