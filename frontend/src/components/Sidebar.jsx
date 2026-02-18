import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Sidebar() {
    const { sair } = useContext(AuthContext);
    const navegar = useNavigate();
    
    const localizacao = useLocation(); 

    const fazerLogout = () => {
        sair();
        navegar('/');
    };

    const itensMenu = [
        { caminho: '/dashboard', rotulo: 'Visão Geral', icone: '◱' },
        { caminho: '/transacoes', rotulo: 'Transações', icone: '⇄' },
        { caminho: '/cartoes', rotulo: 'Cartões', icone: '💳' }, 
        { caminho: '/investimentos', rotulo: 'Investimentos', icone: '📈' },
        { caminho: '/metas', rotulo: 'Metas', icone: '🎯' },
    ];

    return (
        <aside className="w-64 min-h-screen bg-[#06090f] border-r border-gray-800 flex flex-col justify-between shadow-2xl">
            
            <div className="p-6">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-8 h-8 rounded bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center font-bold text-white">
                        P
                    </div>
                    <h2 className="text-3xl font-bold text-emerald-400 tracking-widest font-tech">
                        PLOTON
                    </h2>
                </div>

                <nav className="flex flex-col gap-2">
                    {itensMenu.map((item) => {
                        const estaAtivo = localizacao.pathname === item.caminho;

                        return (
                            <Link
                                key={item.caminho}
                                to={item.caminho}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    estaAtivo
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]' // Estilo quando está selecionado (Aceso)
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200' // Estilo padrão apagado
                                }`}
                            >
                                <span className="text-xl opacity-80">{item.icone}</span>
                                {item.rotulo}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            <div className="p-6 border-t border-gray-800">
                <button 
                    onClick={fazerLogout} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-300 font-medium"
                >
                    <span className="text-xl">⎋</span>
                    Sair da Conta
                </button>
            </div>
            
        </aside>
    );
}

export default Sidebar;