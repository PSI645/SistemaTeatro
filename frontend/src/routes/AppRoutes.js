import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Login          from '../pages/Login';
import Cadastro       from '../pages/Cadastro';
import Sessoes        from '../pages/Sessoes';
import DetalhesSessao from '../pages/DetalhesSessao';

import GestorHome     from '../pages/gestor/GestorHome';
import GestorPecas    from '../pages/gestor/GestorPecas';
import GestorAtores   from '../pages/gestor/GestorAtores';
import GestorSessoes  from '../pages/gestor/GestorSessoes';
import GestorIngressos from '../pages/gestor/GestorIngressos';

import AtorHome       from '../pages/ator/AtorHome';

import ClienteHome    from '../pages/cliente/ClienteHome';
import MeusPedidos    from '../pages/cliente/MeusPedidos';

function Protegida({ children, perfis }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (perfis && !perfis.includes(usuario.perfil)) return <Navigate to="/" />;
  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publicas */}
        <Route path="/"            element={<Sessoes />} />
        <Route path="/sessoes/:id" element={<DetalhesSessao />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/cadastro"    element={<Cadastro />} />

        {/* Cliente */}
        <Route path="/cliente" element={
          <Protegida perfis={['cliente']}>
            <ClienteHome />
          </Protegida>
        } />
        <Route path="/cliente/pedidos" element={
          <Protegida perfis={['cliente']}>
            <MeusPedidos />
          </Protegida>
        } />

        {/* Gestor */}
        <Route path="/gestor" element={
          <Protegida perfis={['gestor']}>
            <GestorHome />
          </Protegida>
        } />
        <Route path="/gestor/pecas" element={
          <Protegida perfis={['gestor']}>
            <GestorPecas />
          </Protegida>
        } />
        <Route path="/gestor/atores" element={
          <Protegida perfis={['gestor']}>
            <GestorAtores />
          </Protegida>
        } />
        <Route path="/gestor/sessoes" element={
          <Protegida perfis={['gestor']}>
            <GestorSessoes />
          </Protegida>
        } />
        <Route path="/gestor/ingressos" element={
          <Protegida perfis={['gestor']}>
            <GestorIngressos />
          </Protegida>
        } />

        {/* Ator */}
        <Route path="/ator" element={
          <Protegida perfis={['ator']}>
            <AtorHome />
          </Protegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}