// src/pages/Transacoes.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Transacoes() {
    const { usuarioLogado } = useContext(AuthContext);
    const [extrato, setExtrato] = useState([]);
    const [cartoes, setCartoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const dataAtual = new Date();
    const [mesFiltro, setMesFiltro] = useState(String(dataAtual.getMonth() + 1).padStart(2, '0'));
    const [anoFiltro, setAnoFiltro] = useState(String(dataAtual.getFullYear()));

    // 1. ESTADO SEPARADO PARA A MÁSCARA DE MOEDA
    const [valorInput, setValorInput] = useState('');

    const [novaOperacao, setNovaOperacao] = useState({
        formaPagamento: 'A_VISTA', 
        descricao: '',
        tipo: 'DESPESA', 
        categoria: '',
        data: '',
        cartaoId: '', 
        qtdParcelas: 1 
    });

    const buscarDados = () => {
        if (usuarioLogado) {
            setCarregando(true);
            Promise.all([
                api.get(`/extrato/usuario/${usuarioLogado.id}?mes=${mesFiltro}&ano=${anoFiltro}`),
                api.get(`/cartoes/usuario/${usuarioLogado.id}`)
            ]).then(([resExtrato, resCartoes]) => {
                setExtrato(resExtrato.data);
                setCartoes(resCartoes.data);
                setCarregando(false);
            }).catch(error => {
                console.error("Erro ao buscar dados:", error);
                setCarregando(false);
            });
        }
    };

    useEffect(() => { buscarDados(); }, [usuarioLogado, mesFiltro, anoFiltro]);

    const lidarComMudanca = (e) => setNovaOperacao({ ...novaOperacao, [e.target.name]: e.target.value });

    // 2. FUNÇÃO DA MÁSCARA DE R$ EM TEMPO REAL
    const lidarComMudancaMoeda = (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Remove tudo o que não é número
        if (valor === '') {
            setValorInput('');
            return;
        }
        const valorFloat = parseFloat(valor) / 100;
        // Formata para o padrão R$ brasileiro
        setValorInput(valorFloat.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    };

    // 3. FUNÇÃO PARA REVERTER A MÁSCARA EM NÚMERO (Para enviar ao Java)
    const reverterParaNumero = (valorFormatado) => {
        if (!valorFormatado) return 0;
        return parseFloat(valorFormatado.replace(/\D/g, '')) / 100;
    };

    const submeterFormulario = (e) => {
        e.preventDefault();
        
        // Pega no valor digitado e converte para decimal
        const valorReal = reverterParaNumero(valorInput);
        if (valorReal <= 0) {
            alert("Por favor, introduza um valor válido.");
            return;
        }

        if (novaOperacao.formaPagamento === 'A_VISTA') {
            const dtoTransacao = {
                descricao: novaOperacao.descricao,
                valor: valorReal,
                tipo: novaOperacao.tipo,
                categoria: novaOperacao.categoria,
                data: novaOperacao.data,
                usuarioId: usuarioLogado.id
            };

            api.post('/transacoes', dtoTransacao)
                .then(() => {
                    alert("Transação guardada!");
                    limparFormulario();
                    buscarDados();
                })
                .catch(() => alert("Erro ao guardar transação."));

        } else if (novaOperacao.formaPagamento === 'CREDITO') {
            // A MÁGICA DOS JUROS ACONTECE AQUI!
            // Multiplicamos o valor da parcela pela quantidade para enviar o Total correto ao Java
            const totalComJuros = valorReal * parseInt(novaOperacao.qtdParcelas);

            const dtoCompraCartao = {
                cartaoId: parseInt(novaOperacao.cartaoId),
                descricao: novaOperacao.descricao,
                categoria: novaOperacao.categoria,
                valorTotal: totalComJuros, 
                quantidadeParcelas: parseInt(novaOperacao.qtdParcelas),
                dataCompra: novaOperacao.data
            };

            api.post('/compras-cartao', dtoCompraCartao)
                .then(() => {
                    alert("Compra lançada no cartão!");
                    limparFormulario();
                    buscarDados();
                })
                .catch(() => alert("Erro ao lançar compra no cartão."));
        }
    };

    const limparFormulario = () => {
        setNovaOperacao({ formaPagamento: 'A_VISTA', descricao: '', tipo: 'DESPESA', categoria: '', data: '', cartaoId: '', qtdParcelas: 1 });
        setValorInput(''); // Limpa a máscara
    };

    // Função utilitária para imprimir dinheiro na tela bonito
    const formatarDinheiro = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const totalReceitas = extrato.filter(t => t.tipoFluxo === 'RECEITA').reduce((acc, curr) => acc + curr.valor, 0);
    const totalDespesas = extrato.filter(t => t.tipoFluxo === 'DESPESA').reduce((acc, curr) => acc + curr.valor, 0);
    const balancoMensal = totalReceitas - totalDespesas;

    if (carregando && extrato.length === 0) return <p className="text-gray-400 animate-pulse">A carregar os seus registos...</p>;

    const labelStyle = "block text-sm font-medium text-gray-400 mb-1 font-tech tracking-wide";
    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 font-tech text-white">Gestão de Transações</h1>

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl mb-8 relative overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-colors duration-700 ${novaOperacao.formaPagamento === 'A_VISTA' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}></div>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <span className={novaOperacao.formaPagamento === 'A_VISTA' ? "text-emerald-500" : "text-blue-500"}>⚡</span> Central de Lançamentos
                </h2>
                
                <form onSubmit={submeterFormulario} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end relative z-10">
                    
                    <div className="lg:col-span-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex gap-4">
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input type="radio" name="formaPagamento" value="A_VISTA" checked={novaOperacao.formaPagamento === 'A_VISTA'} onChange={lidarComMudanca} className="accent-emerald-500 w-5 h-5" />
                            À Vista (PIX / Débito)
                        </label>
                        <label className="flex items-center gap-2 text-white cursor-pointer ml-6">
                            <input type="radio" name="formaPagamento" value="CREDITO" checked={novaOperacao.formaPagamento === 'CREDITO'} onChange={lidarComMudanca} className="accent-blue-500 w-5 h-5" />
                            Cartão de Crédito
                        </label>
                    </div>

                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Descrição</label>
                        <input type="text" name="descricao" value={novaOperacao.descricao} onChange={lidarComMudanca} required className={inputStyle} placeholder="Ex: Mercado" />
                    </div>

                    {/* MUDANÇA DE NOME E APLICAÇÃO DA MÁSCARA AQUI */}
                    <div>
                        <label className={labelStyle}>
                            {novaOperacao.formaPagamento === 'A_VISTA' ? 'Valor Total (R$)' : 'Valor da Parcela (R$)'}
                        </label>
                        <input type="text" value={valorInput} onChange={lidarComMudancaMoeda} required className={inputStyle} placeholder="R$ 0,00" />
                    </div>

                    <div>
                        <label className={labelStyle}>Categoria</label>
                        <input type="text" name="categoria" value={novaOperacao.categoria} onChange={lidarComMudanca} required className={inputStyle} placeholder="Ex: Alimentação" />
                    </div>

                    <div>
                        <label className={labelStyle}>Data da Compra</label>
                        <input type="date" name="data" value={novaOperacao.data} onChange={lidarComMudanca} required className={inputStyle} style={{colorScheme: 'dark'}} />
                    </div>

                    {novaOperacao.formaPagamento === 'A_VISTA' && (
                        <div>
                            <label className={labelStyle}>Tipo de Fluxo</label>
                            <select name="tipo" value={novaOperacao.tipo} onChange={lidarComMudanca} className={inputStyle}>
                                <option value="DESPESA">Despesa (Saiu)</option>
                                <option value="RECEITA">Receita (Entrou)</option>
                            </select>
                        </div>
                    )}

                    {novaOperacao.formaPagamento === 'CREDITO' && (
                        <>
                            <div>
                                <label className={labelStyle}>Qual Cartão?</label>
                                <select name="cartaoId" value={novaOperacao.cartaoId} onChange={lidarComMudanca} required className={inputStyle}>
                                    <option value="">-- Selecione --</option>
                                    {cartoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelStyle}>Parcelas</label>
                                <input type="number" min="1" max="48" name="qtdParcelas" value={novaOperacao.qtdParcelas} onChange={lidarComMudanca} required className={inputStyle} />
                            </div>
                        </>
                    )}

                    <button type="submit" className={`lg:col-span-4 h-[50px] text-white font-bold rounded-lg px-6 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-lg ${novaOperacao.formaPagamento === 'A_VISTA' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}>
                        <span>💾</span> Guardar Lançamento
                    </button>
                </form>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-gray-400">📅</span> Extrato Unificado
                    </h2>
                    
                    <div className="flex gap-2">
                        <select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)} className="bg-gray-900 border border-gray-700 rounded text-white p-2 font-tech focus:ring-1 focus:ring-emerald-500">
                            <option value="01">Janeiro</option> <option value="02">Fevereiro</option>
                            <option value="03">Março</option> <option value="04">Abril</option>
                            <option value="05">Maio</option> <option value="06">Junho</option>
                            <option value="07">Julho</option> <option value="08">Agosto</option>
                            <option value="09">Setembro</option> <option value="10">Outubro</option>
                            <option value="11">Novembro</option> <option value="12">Dezembro</option>
                        </select>
                        <select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)} className="bg-gray-900 border border-gray-700 rounded text-white p-2 font-tech focus:ring-1 focus:ring-emerald-500">
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800 bg-gray-900/50">
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-tech mb-1">Entradas no Mês</p>
                        <p className="text-emerald-400 font-bold font-tech text-xl">{formatarDinheiro(totalReceitas)}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-tech mb-1">Saídas no Mês</p>
                        <p className="text-red-400 font-bold font-tech text-xl">{formatarDinheiro(totalDespesas)}</p>
                    </div>
                    <div className="p-4 text-center bg-gray-800/20">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-tech mb-1">Balanço do Mês</p>
                        <p className={`font-bold font-tech text-xl ${balancoMensal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatarDinheiro(balancoMensal)}
                        </p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/80 text-gray-400 font-tech uppercase text-xs tracking-wider">
                                <th className="p-4 font-medium">Data</th>
                                <th className="p-4 font-medium">Origem</th>
                                <th className="p-4 font-medium">Descrição</th>
                                <th className="p-4 font-medium">Categoria</th>
                                <th className="p-4 font-medium text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300 divide-y divide-gray-800/50">
                            {extrato.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                                        Nenhuma movimentação encontrada para {mesFiltro}/{anoFiltro}.
                                    </td>
                                </tr>
                            ) : (
                                extrato.map((item) => (
                                    <tr key={item.idOrigem} className="hover:bg-gray-800/40 transition-colors">
                                        <td className="p-4 text-sm text-gray-400">
                                            {item.data.split('-').reverse().join('/')}
                                        </td>
                                        
                                        <td className="p-4">
                                            {item.formaPagamento === 'CREDITO' ? (
                                                <span className="bg-blue-900/40 text-blue-400 px-2 py-1 rounded text-xs border border-blue-800/50 flex items-center gap-1 w-max">
                                                    💳 Crédito
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-800/50 flex items-center gap-1 w-max">
                                                    ⚡ À Vista
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <p className="text-white font-medium">{item.descricao}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.detalhesExtra}</p>
                                        </td>
                                        
                                        <td className="p-4">
                                            <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-700">
                                                {item.categoria}
                                            </span>
                                        </td>
                                        
                                        <td className={`p-4 text-right font-bold font-tech text-lg ${item.tipoFluxo === 'RECEITA' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {item.tipoFluxo === 'RECEITA' ? '+' : '-'} {formatarDinheiro(item.valor)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Transacoes;