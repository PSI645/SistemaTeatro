import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token  = localStorage.getItem('token');
    const perfil = localStorage.getItem('perfil');
    const nome   = localStorage.getItem('nome');
    if (token) {
      setUsuario({ token, perfil, nome });
    }
  }, []);

  function login(dados) {
    localStorage.setItem('token',  dados.token);
    localStorage.setItem('perfil', dados.perfil);
    localStorage.setItem('nome',   dados.nome);
    setUsuario(dados);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    localStorage.removeItem('nome');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}