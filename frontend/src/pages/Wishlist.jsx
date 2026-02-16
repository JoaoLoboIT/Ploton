// src/pages/Wishlist.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Wishlist() {
    const { usuarioLogado } = useContext(AuthContext);
    const [desejos, setDesejos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // Estado para o formulário alinhado ao MetaRequestDTO
    const [novoDesejo, setNovoDesejo] = useState({
        nome: '',
        descricao: '',
        valorAlvo: '',
        valorAtual: 0,
        dataLimite: '',
        prioridade: 'MEDIO',
        tipoPeriodo: 'MENSAL',
        ehWishlist: true
    });

    const buscarDesejos = () => {
        if (usuarioLogado) {
            api.get(`/metas/usuario/${usuarioLogado.id}`)
                .then(res => {
                    // Filtramos apenas o que é marcado como Wishlist no banco
                    const apenasWishlist = res.data.filter(m => m.ehWishlist);
                    setDesejos(apenasWishlist);
                    setCarregando(false);
                })
                .catch(() => setCarregando(false));
        }
    };

    useEffect(() => { buscarDesejos(); }, [usuarioLogado]);

    const salvarDesejo = (e) => {
        e.preventDefault();
        api.post('/metas', { ...novoDesejo, usuarioId: usuarioLogado.id })
            .then(() => {
                alert("Desejo adicionado ao seu mural!");
                setNovoDesejo({ ...novoDesejo, nome: '', valorAlvo: '', descricao: '', dataLimite: '' });
                buscarDesejos();
            });
    };

    // Lógica visual de prioridades
    const renderPrioridade = (p) => {
        const estilos = {
            URGENTE: { cor: 'text-red-500', bg: 'bg-red-500/10', borda: 'border-red-500/30', icone: '🔥' },
            MEDIO: { cor: 'text-yellow-500', bg: 'bg-yellow-500/10', borda: 'border-yellow-500/30', icone: '⏳' },
            BAIXO: { cor: 'text-blue-500', bg: 'bg-blue-500/10', borda: 'border-blue-500/30', icone: '🍃' }
        };
        const config = estilos[p] || estilos.MEDIO;
        return (
            <span className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.cor} border ${config.borda}`}>
                {config.icone} {p}
            </span>
        );
    };

    if (carregando) return <p className="text-gray-500 font-tech animate-pulse">Carregando seus sonhos...</p>;

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2 font-tech text-white">Wishlist</h1>
            <p className="text-gray-500 text-sm mb-8">Itens que você almeja conquistar. Organize por urgência.</p>

            {/* FORMULÁRIO DE CADASTRO */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🛍️</div>
                <form onSubmit={salvarDesejo} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                    <div className="md:col-span-2">
                        <label className="text-[10px] text-gray-500 uppercase font-tech mb-1 block">O que você quer comprar?</label>
                        <input 
                            type="text" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition-all"
                            placeholder="Ex: Novo MacBook Pro, Troca de Carro..."
                            value={novoDesejo.nome}
                            onChange={e => setNovoDesejo({...novoDesejo, nome: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-tech mb-1 block">Valor Estimado (R$)</label>
                        <input 
                            type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                            placeholder="0.00"
                            value={novoDesejo.valorAlvo}
                            onChange={e => setNovoDesejo({...novoDesejo, valorAlvo: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-tech mb-1 block">Prioridade</label>
                        <select 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none appearance-none"
                            value={novoDesejo.prioridade}
                            onChange={e => setNovoDesejo({...novoDesejo, prioridade: e.target.value})}
                        >
                            <option value="URGENTE">🔥 Urgente</option>
                            <option value="MEDIO">⏳ Médio</option>
                            <option value="BAIXO">🍃 Pouco</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <input 
                            type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 outline-none"
                            placeholder="Descrição ou motivo desse desejo..."
                            value={novoDesejo.descricao}
                            onChange={e => setNovoDesejo({...novoDesejo, descricao: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <input 
                            type="date" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none"
                            value={novoDesejo.dataLimite}
                            onChange={e => setNovoDesejo({...novoDesejo, dataLimite: e.target.value})}
                        />
                    </div>
                    <button className="md:col-span-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20">
                        Adicionar à Lista de Desejos
                    </button>
                </form>
            </div>

            {/* LISTAGEM DE DESEJOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {desejos.map(d => (
                    <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            {renderPrioridade(d.prioridade)}
                            <span className="text-[10px] text-gray-600 font-tech">{new Date(d.dataLimite).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors">{d.nome}</h3>
                        <p className="text-gray-500 text-xs mb-4 line-clamp-2">{d.descricao || 'Sem descrição.'}</p>
                        
                        <div className="mt-auto">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-gray-400">Progresso</span>
                                <span className="text-white font-tech">R$ {d.valorAtual} / {d.valorAlvo}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-purple-500 h-full transition-all duration-1000"
                                    style={{ width: `${(d.valorAtual / d.valorAlvo) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;