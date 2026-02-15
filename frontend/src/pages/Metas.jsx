// src/pages/Metas.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import CartaoMeta from '../components/CartaoMeta';
import { AuthContext } from '../contexts/AuthContext';

function Metas() {
    const { usuarioLogado } = useContext(AuthContext);
    const [metas, setMetas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [novaMeta, setNovaMeta] = useState({ nome: '', descricao: '', valorAlvo: '', valorAtual: 0, dataLimite: '' });

    const buscarMetas = () => {
        if (usuarioLogado) {
            api.get(`/metas/usuario/${usuarioLogado.id}`)
                .then(response => { setMetas(response.data); setCarregando(false); })
                .catch(error => { console.error("Erro:", error); setCarregando(false); });
        }
    };

    useEffect(() => { buscarMetas(); }, [usuarioLogado]);

    const lidarComMudancaMeta = (e) => setNovaMeta({ ...novaMeta, [e.target.name]: e.target.value });

    const submeterMeta = (e) => {
        e.preventDefault();
        api.post('/metas', { ...novaMeta, usuarioId: usuarioLogado.id, valorAlvo: parseFloat(novaMeta.valorAlvo), valorAtual: parseFloat(novaMeta.valorAtual) })
            .then(() => {
                alert("Nova meta criada!");
                setNovaMeta({ nome: '', descricao: '', valorAlvo: '', valorAtual: 0, dataLimite: '' });
                buscarMetas();
            })
            .catch(() => alert("Erro ao criar a meta. Verifique a data."));
    };

    if (carregando) return <p className="text-gray-400 animate-pulse">A carregar os seus sonhos...</p>;

    // Estilos padrão
    const labelStyle = "block text-sm font-medium text-gray-400 mb-1 font-tech tracking-wide";
    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
    const cardStyle = "bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl mb-8";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 font-tech text-white">Meus Objetivos</h1>

            {/* FORMULÁRIO DE CRIAÇÃO DARK */}
            <div className={cardStyle}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-purple-500">🚀</span> Definir Novo Objetivo
                </h2>
                <form onSubmit={submeterMeta} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Nome (ex: Carro Novo)</label>
                        <input type="text" name="nome" value={novaMeta.nome} onChange={lidarComMudancaMeta} required className={inputStyle} />
                    </div>
                    <div className="lg:col-span-3">
                        <label className={labelStyle}>Descrição (opcional)</label>
                        <input type="text" name="descricao" value={novaMeta.descricao} onChange={lidarComMudancaMeta} className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Valor Necessário (R$)</label>
                        <input type="number" step="0.01" name="valorAlvo" value={novaMeta.valorAlvo} onChange={lidarComMudancaMeta} required className={inputStyle} placeholder="0.00" />
                    </div>
                    <div>
                        <label className={labelStyle}>Data Limite</label>
                        <input type="date" name="dataLimite" value={novaMeta.dataLimite} onChange={lidarComMudancaMeta} required className={inputStyle} style={{colorScheme: 'dark'}} />
                    </div>
                    <button type="submit" className="h-[50px] bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg px-6 shadow-[0_0_15px_rgba(147,51,234,0.2)] active:scale-95 transition-all">
                        Criar Meta
                    </button>
                </form>
            </div>

            {/* LISTA DOS COMPONENTES (CartaoMeta) */}
            <div className="flex gap-6 flex-wrap">
                {metas.length === 0 ? (
                    <p className="text-gray-500 italic border border-gray-800 p-4 rounded-lg">Nenhuma meta definida. Comece a sonhar!</p>
                ) : (
                    metas.map((meta) => (
                        <CartaoMeta key={meta.id} meta={meta} aoAtualizar={buscarMetas} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Metas;