import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Orcamentos() {
    const { usuarioLogado } = useContext(AuthContext);
    const [orcamentos, setOrcamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const dataAtual = new Date();
    const [mes, setMes] = useState(dataAtual.getMonth() + 1);
    const [ano, setAno] = useState(dataAtual.getFullYear());

    const [novoOrcamento, setNovoOrcamento] = useState({ categoria: '', valorLimite: '' });

    const buscarOrcamentos = () => {
        if (usuarioLogado) {
            setCarregando(true);
            api.get(`/orcamentos/usuario/${usuarioLogado.id}?mes=${mes}&ano=${ano}`)
                .then(res => {
                    setOrcamentos(res.data);
                    setCarregando(false);
                })
                .catch(() => setCarregando(false));
        }
    };

    useEffect(() => { buscarOrcamentos(); }, [usuarioLogado, mes, ano]);

    const salvarOrcamento = (e) => {
        e.preventDefault();
        const payload = { ...novoOrcamento, mes, ano };
        api.post(`/orcamentos/usuario/${usuarioLogado.id}`, payload)
            .then(() => {
                alert("Limite definido!");
                setNovoOrcamento({ categoria: '', valorLimite: '' });
                buscarOrcamentos();
            });
    };

    const getCorBarra = (porcentagem) => {
        if (porcentagem >= 90) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
        if (porcentagem >= 70) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]';
        return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    };

    if (carregando && orcamentos.length === 0) return <p className="text-gray-400 font-tech">Sincronizando orçamentos...</p>;

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8 font-tech text-white">Planejamento de Gastos</h1>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-10 shadow-xl">
                <h2 className="text-sm font-tech text-gray-400 uppercase tracking-widest mb-6">Definir Novo Limite</h2>
                <form onSubmit={salvarOrcamento} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-2 uppercase font-tech">Categoria</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                            placeholder="Ex: Alimentação"
                            value={novoOrcamento.categoria}
                            onChange={e => setNovoOrcamento({...novoOrcamento, categoria: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-2 uppercase font-tech">Limite Mensal (R$)</label>
                        <input 
                            type="number" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                            placeholder="500.00"
                            value={novoOrcamento.valorLimite}
                            onChange={e => setNovoOrcamento({...novoOrcamento, valorLimite: e.target.value})}
                        />
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-[50px] rounded-lg transition-all shadow-lg shadow-emerald-900/20">
                        Fixar Limite
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {orcamentos.map(o => (
                    <div key={o.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">{o.categoria}</h3>
                                <p className="text-xs text-gray-500 font-tech">Restam R$ {o.valorRestante.toFixed(2)}</p>
                            </div>
                            <span className="text-2xl font-tech font-bold text-gray-400">
                                {Math.round(o.porcentagemConsumida)}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mb-2">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out ${getCorBarra(o.porcentagemConsumida)}`}
                                style={{ width: `${Math.min(o.porcentagemConsumida, 100)}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between text-[10px] text-gray-600 font-tech uppercase tracking-tighter">
                            <span>Gasto: R$ {o.valorGasto.toFixed(2)}</span>
                            <span>Limite: R$ {o.valorLimite.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orcamentos;