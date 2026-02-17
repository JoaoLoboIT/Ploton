import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import CartaoMeta from '../components/CartaoMeta';
import { AuthContext } from '../contexts/AuthContext';

function Metas() {
    const { usuarioLogado } = useContext(AuthContext);
    
    const [metas, setMetas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [novaMeta, setNovaMeta] = useState({
        nome: '',
        descricao: '',
        valorAlvo: '', 
        valorAtual: 0,
        dataLimite: ''
    });

    const [filtroTexto, setFiltroTexto] = useState('');

    const buscarMetas = () => {
        if (usuarioLogado) {
            api.get(`/metas/usuario/${usuarioLogado.id}`)
                .then(response => {
                    setMetas(response.data);
                    setCarregando(false);
                })
                .catch(error => { 
                    console.error("Erro:", error); 
                    setCarregando(false); 
                });
        }
    };

    useEffect(() => { buscarMetas(); }, [usuarioLogado]);

    // Filtro apenas por texto agora
    const metasFiltradas = metas.filter(meta => 
        meta.nome?.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    const lidarComMudancaMeta = (e) => {
        const { name, value } = e.target;
        setNovaMeta(prev => ({ ...prev, [name]: value }));
    };

    const lidarComMascaraValor = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/\D/g, "");
        if (valor === "") {
            setNovaMeta(prev => ({ ...prev, valorAlvo: "" }));
            return;
        }
        valor = (Number(valor) / 100).toFixed(2);
        valor = valor.replace(".", ",");
        valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setNovaMeta(prev => ({ ...prev, valorAlvo: valor }));
    };

    const parseParaNumero = (strMoeda) => {
        if (!strMoeda) return 0;
        return parseFloat(String(strMoeda).replace(/\./g, "").replace(",", "."));
    };

    const submeterMeta = (e) => {
        e.preventDefault();

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataEscolhida = new Date(novaMeta.dataLimite);

        if (dataEscolhida <= hoje) {
            alert("A data limite deve ser no futuro!");
            return;
        }

        const valorAlvoNumerico = parseParaNumero(novaMeta.valorAlvo);
        if (valorAlvoNumerico <= 0) {
            alert("Digite um valor válido maior que zero.");
            return;
        }

        const metaParaEnviar = {
            usuarioId: usuarioLogado.id,
            nome: novaMeta.nome,
            descricao: novaMeta.descricao,
            valorAlvo: valorAlvoNumerico,
            valorAtual: 0,
            dataLimite: novaMeta.dataLimite,
            tipoPeriodo: 'MENSAL'
        };

        api.post('/metas', metaParaEnviar)
            .then(() => {
                setNovaMeta({ nome: '', descricao: '', valorAlvo: '', valorAtual: 0, dataLimite: '' });
                buscarMetas(); 
            })
            .catch((error) => {
                console.error("Erro ao criar meta:", error);
                alert("Erro ao criar a meta. Verifique se o backend exige a prioridade.");
            });
    };

    if (carregando) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
    );

    const labelStyle = "block text-sm font-medium text-gray-400 mb-1 font-tech tracking-wide";
    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all";
    const cardStyle = "bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl mb-8";

    return (
        <div className="animate-fadeIn pb-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white font-tech">Meus Objetivos</h1>
            </header>

            <div className={cardStyle}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-purple-500">🚀</span> Definir Novo Objetivo
                </h2>
                <form onSubmit={submeterMeta} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>Nome da Meta *</label>
                            <input type="text" name="nome" value={novaMeta.nome} onChange={lidarComMudancaMeta} required className={inputStyle} placeholder="Ex: Carro Novo" />
                        </div>
                        <div>
                            <label className={labelStyle}>Descrição (opcional)</label>
                            <input type="text" name="descricao" value={novaMeta.descricao} onChange={lidarComMudancaMeta} className={inputStyle} placeholder="Detalhes sobre sua meta" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className={labelStyle}>Valor Necessário (R$) *</label>
                            <span className="absolute left-4 top-[42px] text-gray-500 text-sm font-bold">R$</span>
                            <input type="text" name="valorAlvo" value={novaMeta.valorAlvo} onChange={lidarComMascaraValor} required className={`${inputStyle} pl-10`} placeholder="0,00" />
                        </div>
                        <div>
                            <label className={labelStyle}>Data Limite *</label>
                            <input type="date" name="dataLimite" value={novaMeta.dataLimite} onChange={lidarComMudancaMeta} required className={inputStyle} style={{ colorScheme: 'dark' }} min={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg px-8 py-3 active:scale-95 transition-all">
                            ✨ Criar Meta
                        </button>
                    </div>
                </form>
            </div>

            <div className="mb-8 bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-lg">
                <input type="text" placeholder="Buscar meta pelo nome..." onChange={(e) => setFiltroTexto(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm" />
            </div>

            <div className="flex flex-wrap gap-6">
                {metasFiltradas.length === 0 ? (
                    <div className="w-full text-center py-12 bg-gray-900 border border-gray-800 rounded-xl shadow-inner">
                        <p className="text-gray-500 font-tech uppercase tracking-widest text-sm">Nenhuma meta encontrada.</p>
                    </div>
                ) : (
                    metasFiltradas.map((meta) => (
                        <CartaoMeta key={meta.id} meta={meta} aoAtualizar={buscarMetas} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Metas;