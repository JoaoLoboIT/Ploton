// src/pages/Investimentos.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Investimentos() {
    const { usuarioLogado } = useContext(AuthContext);
    const [investimentos, setInvestimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [novoAtivo, setNovoAtivo] = useState({ nome: '', tipo: 'RENDA_FIXA' });
    
    const [operacao, setOperacao] = useState({ 
        investimentoId: '', 
        tipoOperacao: 'APORTE', 
        valor: '' // Agora guarda a string da máscara (ex: "1.000,00")
    });

    const buscarInvestimentos = () => {
        if(usuarioLogado) {
            api.get(`/investimentos/usuario/${usuarioLogado.id}`)
                .then(response => { 
                    setInvestimentos(response.data); 
                    setCarregando(false); 
                })
                .catch(error => { 
                    console.error("Erro:", error); 
                    setCarregando(false); 
                });
        }
    };

    useEffect(() => { buscarInvestimentos(); }, [usuarioLogado]);

    const lidarComMudancaAtivo = (e) => setNovoAtivo({ ...novoAtivo, [e.target.name]: e.target.value });
    const lidarComMudancaOperacao = (e) => setOperacao({ ...operacao, [e.target.name]: e.target.value });

    // --- NOVA FUNÇÃO: MÁSCARA DE MOEDA ---
    const lidarComMascaraValorOperacao = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/\D/g, ""); // Remove não numéricos
        
        if (valor === "") {
            setOperacao({ ...operacao, valor: "" });
            return;
        }

        valor = (Number(valor) / 100).toFixed(2);
        valor = valor.replace(".", ",");
        valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        
        setOperacao({ ...operacao, valor: valor });
    };

    // --- NOVA FUNÇÃO: TRADUTOR PARA O BACKEND ---
    const parseParaNumero = (strMoeda) => {
        if (!strMoeda) return 0;
        return parseFloat(String(strMoeda).replace(/\./g, "").replace(",", "."));
    };

    const submeterAtivo = (e) => {
        e.preventDefault();
        api.post('/investimentos', { ...novoAtivo, usuarioId: usuarioLogado.id })
            .then(() => {
                alert("Ativo adicionado à sua carteira!");
                setNovoAtivo({ nome: '', tipo: 'RENDA_FIXA' });
                buscarInvestimentos();
            })
            .catch(() => alert("Erro ao criar o investimento."));
    };

    const submeterOperacao = (e) => {
        e.preventDefault();
        
        // Uso do tradutor numérico antes de enviar
        const valorNumerico = parseParaNumero(operacao.valor);
        const id = operacao.investimentoId;

        if (!id || isNaN(valorNumerico) || valorNumerico <= 0) {
            alert("Preencha os dados corretamente com um valor válido.");
            return;
        }

        const endpoint = operacao.tipoOperacao === 'APORTE' 
            ? `/investimentos/${id}/aporte` 
            : `/investimentos/${id}/rendimento`;

        api.patch(endpoint, { valor: valorNumerico })
            .then(() => {
                alert(operacao.tipoOperacao === 'APORTE' ? "Aporte realizado com sucesso!" : "Rendimento atualizado!");
                setOperacao({ investimentoId: '', tipoOperacao: 'APORTE', valor: '' });
                buscarInvestimentos(); 
            })
            .catch(() => alert("Erro ao registrar a operação."));
    };

    // --- NOVA FUNÇÃO: DELETAR ATIVO ---
    const deletarAtivo = (id) => {
        if (window.confirm("Tem certeza que deseja apagar este ativo da sua carteira? Esta ação não pode ser desfeita.")) {
            api.delete(`/investimentos/${id}`)
                .then(() => {
                    alert("Ativo removido com sucesso.");
                    buscarInvestimentos(); // Recarrega a tabela
                })
                .catch((error) => {
                    console.error("Erro ao deletar:", error);
                    alert("Erro ao remover o ativo.");
                });
        }
    };

    const formatarDinheiro = (valor) => {
        return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (carregando) return <p className="text-gray-400 animate-pulse">A carregar a sua carteira de ativos...</p>;

    const labelStyle = "block text-sm font-medium text-gray-400 mb-1 font-tech tracking-wide";
    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all";
    const cardStyle = "bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl mb-8 relative overflow-hidden";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 font-tech text-white">Meus Investimentos</h1>

            {/* FORMULÁRIO 1: CRIAR ATIVO */}
            <div className={cardStyle}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <span className="text-purple-500">🏦</span> Cadastrar Novo Ativo
                </h2>
                <form onSubmit={submeterAtivo} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10">
                    <div className="md:col-span-1">
                        <label className={labelStyle}>Nome do Ativo</label>
                        <input type="text" name="nome" value={novoAtivo.nome} onChange={lidarComMudancaAtivo} required className={inputStyle} placeholder="Ex: Tesouro Direto 2029" />
                    </div>
                    <div>
                        <label className={labelStyle}>Tipo</label>
                        <select name="tipo" value={novoAtivo.tipo} onChange={lidarComMudancaAtivo} className={inputStyle}>
                            <option value="RENDA_FIXA">Renda Fixa</option>
                            <option value="ACOES">Ações</option>
                            <option value="FII">Fundos Imobiliários</option>
                            <option value="CRIPTOMOEDAS">Criptomoedas</option>
                        </select>
                    </div>
                    <button type="submit" className="h-[50px] bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg px-6 shadow-[0_0_15px_rgba(168,85,247,0.2)] active:scale-95 transition-all">
                        Adicionar à Carteira
                    </button>
                </form>
            </div>

            {/* TABELA DE ATIVOS */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl mb-8 overflow-hidden">
                <div className="p-6 border-b border-gray-800 bg-gray-800/30">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-gray-400">📋</span> Posição Consolidada da Carteira
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 text-gray-400 font-tech uppercase text-xs tracking-wider">
                                <th className="p-4 border-b border-gray-700">Nome do Ativo</th>
                                <th className="p-4 border-b border-gray-700">Valor Investido</th>
                                <th className="p-4 border-b border-gray-700">Saldo Atual (Mercado)</th>
                                <th className="p-4 border-b border-gray-700 text-right">Rentabilidade</th>
                                {/* NOVA COLUNA DE AÇÕES */}
                                <th className="p-4 border-b border-gray-700 text-center w-16">Ações</th> 
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {investimentos.length === 0 ? (
                                <tr><td colSpan="5" className="p-6 text-center text-gray-500 italic">Nenhum investimento cadastrado.</td></tr>
                            ) : (
                                investimentos.map((inv) => {
                                    const investido = inv.valorInvestido || 0;
                                    const mercado = inv.saldo || 0;
                                    const lucroReais = mercado - investido;
                                    const lucroPercentual = investido > 0 ? (lucroReais / investido) * 100 : 0;
                                    
                                    const isPositivo = lucroReais >= 0;
                                    const corLucro = isPositivo ? 'text-emerald-400' : 'text-red-400';

                                    return (
                                        <tr key={inv.id} className="hover:bg-gray-800/40 transition-colors group">
                                            <td className="p-4 border-b border-gray-800">
                                                <p className="font-medium text-white">{inv.nome}</p>
                                                <span className="text-[10px] text-purple-400 uppercase tracking-widest">{inv.tipo}</span>
                                            </td>
                                            <td className="p-4 border-b border-gray-800 font-tech text-gray-400">
                                                {formatarDinheiro(investido)}
                                            </td>
                                            <td className="p-4 border-b border-gray-800 font-bold font-tech text-lg text-white">
                                                {formatarDinheiro(mercado)}
                                            </td>
                                            <td className={`p-4 border-b border-gray-800 text-right font-bold font-tech ${corLucro}`}>
                                                <p>{isPositivo ? '+' : ''}{formatarDinheiro(lucroReais)}</p>
                                                <p className="text-xs opacity-80">{isPositivo ? '+' : ''}{lucroPercentual.toFixed(2)}%</p>
                                            </td>
                                            {/* BOTAO DE DELETAR COM FEEDBACK VISUAL */}
                                            <td className="p-4 border-b border-gray-800 text-center">
                                                <button 
                                                    onClick={() => deletarAtivo(inv.id)}
                                                    className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Apagar Ativo"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FORMULÁRIO 2: CENTRAL DE OPERAÇÕES */}
            <div className={cardStyle}>
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-colors duration-500 ${operacao.tipoOperacao === 'APORTE' ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}></div>
                
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <span className={operacao.tipoOperacao === 'APORTE' ? "text-blue-500" : "text-emerald-500"}>⚡</span> 
                    Painel de Operações
                </h2>

                <form onSubmit={submeterOperacao} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
                    
                    <div className="lg:col-span-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex gap-4">
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input type="radio" name="tipoOperacao" value="APORTE" checked={operacao.tipoOperacao === 'APORTE'} onChange={lidarComMudancaOperacao} className="accent-blue-500 w-5 h-5" />
                            Novo Aporte (+ Dinheiro)
                        </label>
                        <label className="flex items-center gap-2 text-white cursor-pointer ml-6">
                            <input type="radio" name="tipoOperacao" value="RENDIMENTO" checked={operacao.tipoOperacao === 'RENDIMENTO'} onChange={lidarComMudancaOperacao} className="accent-emerald-500 w-5 h-5" />
                            Atualizar Valor de Mercado
                        </label>
                    </div>

                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Selecione o Ativo</label>
                        <select name="investimentoId" value={operacao.investimentoId} onChange={lidarComMudancaOperacao} required className={inputStyle}>
                            <option value="">-- Escolha um ativo --</option>
                            {investimentos.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.nome} (Investido: R$ {inv.valorInvestido || 0} | Mercado: R$ {inv.saldo})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* CAMPO DE VALOR COM MÁSCARA ATIVADA */}
                    <div className="lg:col-span-2 relative">
                        <label className={labelStyle}>
                            {operacao.tipoOperacao === 'APORTE' ? 'Valor do Aporte (R$)' : 'Novo Valor de Mercado (R$)'}
                        </label>
                        <span className="absolute left-4 top-[42px] text-gray-500 text-sm font-bold">R$</span>
                        <input 
                            type="text" // Alterado de number para text
                            name="valor" 
                            value={operacao.valor} 
                            onChange={lidarComMascaraValorOperacao} 
                            required 
                            className={`${inputStyle} pl-10`} // Espaço extra para o "R$"
                            placeholder="0,00" 
                        />
                    </div>

                    <button type="submit" className={`lg:col-span-4 h-[50px] text-white font-bold rounded-lg px-6 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-lg ${operacao.tipoOperacao === 'APORTE' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'}`}>
                        {operacao.tipoOperacao === 'APORTE' ? '💾 Confirmar Aporte' : '📈 Registrar Rendimento'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Investimentos;