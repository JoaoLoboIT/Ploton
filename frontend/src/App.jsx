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

function RotaProtegidaEComSidebar({ children }) {
  const { usuarioLogado } = useContext(AuthContext);

  if (!usuarioLogado) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f5f7' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '30px' }}>
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

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;