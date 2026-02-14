// src/components/Sidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

// 1. IMPORTAMOS O CONTEXTO PARA PODER FAZER LOGOUT
import { AuthContext } from '../contexts/AuthContext';

function Sidebar() {
    // 2. EXTRAÍMOS A FUNÇÃO DE SAIR DA NUVEM GLOBAL
    const { sair } = useContext(AuthContext);
    const navegar = useNavigate();

    const fazerLogout = () => {
        sair(); // Limpa a memória do React
        navegar('/'); // Atira o utilizador de volta para o ecrã de Login
    };

    // 3. A MAGIA DO TAILWIND NUMA VARIÁVEL
    // Em vez de repetir classes em todo o link, guardamos numa string.
    // text-gray-400 = Cinza claro | hover:text-white = Fica branco ao passar o rato | transition-colors = Suaviza a troca de cor
    const estiloLink = "text-gray-400 hover:text-white text-lg font-medium transition-colors duration-200";

    return (
        // w-64 = Largura fixa | h-screen = 100% da altura da tela | bg-gray-900 = Fundo muito escuro | justify-between = Empurra o menu para cima e o botão de sair para baixo
        <aside className="w-64 h-screen bg-gray-900 text-white p-6 flex flex-col justify-between shadow-xl">
            
            <div>
                {/* Título com uma cor azul vibrante do Tailwind */}
                <h2 className="text-3xl font-bold mb-10 text-blue-500 tracking-wider">Ploton</h2>
                
                <nav className="flex flex-col gap-5">
                    {/* O LINK CORRIGIDO PARA /dashboard */}
                    <Link to="/dashboard" className={estiloLink}>Visão Geral</Link>
                    
                    <Link to="/transacoes" className={estiloLink}>Transações</Link>
                    <Link to="/investimentos" className={estiloLink}>Investimentos</Link>
                    
                    {/* O NOME ALTERADO PARA "Metas" */}
                    <Link to="/metas" className={estiloLink}>Metas</Link>
                </nav>
            </div>
            
            {/* O NOVO BOTÃO DE LOGOUT NO FUNDO DA SIDEBAR */}
            <button 
                onClick={fazerLogout} 
                className="text-left text-red-400 hover:text-red-300 font-medium transition-colors duration-200 mt-8 py-2"
            >
                ← Sair da Conta
            </button>
            
        </aside>
    );
}

export default Sidebar;