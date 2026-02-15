// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro'; // <-- 1. IMPORTAÇÃO AQUI
import Dashboard from './pages/Dashboard';
import Transacoes from './pages/Transacoes';
import Investimentos from './pages/Investimentos';
import Metas from './pages/Metas';
import Cartoes from './pages/Cartoes';

function RotaProtegidaEComSidebar({ children }) {
  const { usuarioLogado } = useContext(AuthContext);

  if (!usuarioLogado) {
    return <Navigate to="/" replace />;
  }

  return (
    // Removemos o backgroundColor fixo daqui e trocamos style por className do Tailwind
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ROTAS PÚBLICAS (Sem Sidebar) */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} /> {/* <-- 2. NOVA ROTA AQUI */}

          {/* ROTAS PRIVADAS (Com Sidebar e protegidas) */}
          <Route path="/dashboard" element={
            <RotaProtegidaEComSidebar>
              <Dashboard />
            </RotaProtegidaEComSidebar>
          } />

          <Route path="/transacoes" element={
            <RotaProtegidaEComSidebar>
              <Transacoes />
            </RotaProtegidaEComSidebar>
          } />

          <Route path="/investimentos" element={
            <RotaProtegidaEComSidebar>
              <Investimentos />
            </RotaProtegidaEComSidebar>
          } />

          <Route path="/metas" element={
            <RotaProtegidaEComSidebar>
              <Metas />
            </RotaProtegidaEComSidebar>
          } />

          <Route path="/cartoes" element={
            <RotaProtegidaEComSidebar>
              <Cartoes />
            </RotaProtegidaEComSidebar>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;