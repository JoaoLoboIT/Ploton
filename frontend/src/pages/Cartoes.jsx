// src/pages/Cartoes.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Cartoes() {
    const { usuarioLogado } = useContext(AuthContext);
    const [cartoes, setCartoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // 1. Estado alinhado com CartaoCreditoRequestDTO.java
    const [novoCartao, setNovoCartao] = useState({ 
        nome: '', 
        limiteTotal: '', 
        diaFechamento: '', 
        diaVencimento: '' 
    });

    // 2. Estado alinhado com CompraCartaoRequestDTO.java
    const [novaCompra, setNovaCompra] = useState({ 
        cartaoId: '', 
        descricao: '', 
        categoria: '',
        valorTotal: '', 
        quantidadeParcelas: 1,
        dataCompra: '' 
    });

    const buscarCartoes = () => {
        if (usuarioLogado) {
            api.get(`/cartoes/usuario/${usuarioLogado.id}`)
                .then(response => { setCartoes(response.data); setCarregando(false); })
                .catch(error => { console.error("Erro:", error); setCarregando(false); });
        }
    };

    useEffect(() => { buscarCartoes(); }, [usuarioLogado]);

    const lidarComMudancaCartao = (e) => setNovoCartao({ ...novoCartao, [e.target.name]: e.target.value });
    const lidarComMudancaCompra = (e) => setNovaCompra({ ...novaCompra, [e.target.name]: e.target.value });

    const submeterCartao = (e) => {
        e.preventDefault();
        
        // Montamos o DTO exatamente como o Java espera
        const dtoEnvio = { 
            nome: novoCartao.nome,
            limiteTotal: parseFloat(novoCartao.limiteTotal),
            diaFechamento: parseInt(novoCartao.diaFechamento),
            diaVencimento: parseInt(novoCartao.diaVencimento),
            usuarioId: usuarioLogado.id
        };

        api.post('/cartoes', dtoEnvio)
            .then(() => {
                alert("Cartão adicionado com sucesso!");
                setNovoCartao({ nome: '', limiteTotal: '', diaFechamento: '', diaVencimento: '' });
                buscarCartoes();
            })
            .catch(() => alert("Erro ao criar o cartão."));
    };

    const submeterCompra = (e) => {
        e.preventDefault();
        
        // Montamos o DTO da Compra
        const dtoEnvio = { 
            cartaoId: parseInt(novaCompra.cartaoId),
            descricao: novaCompra.descricao,
            categoria: novaCompra.categoria,
            valorTotal: parseFloat(novaCompra.valorTotal),
            quantidadeParcelas: parseInt(novaCompra.quantidadeParcelas),
            dataCompra: novaCompra.dataCompra
        };

        api.post('/compras-cartao', dtoEnvio)
            .then(() => {
                alert("Compra registrada com sucesso na fatura!");
                setNovaCompra({ cartaoId: '', descricao: '', categoria: '', valorTotal: '', quantidadeParcelas: 1, dataCompra: '' });
                // Aqui no futuro poderíamos buscar faturas, por agora atualizamos os cartões
                buscarCartoes(); 
            })
            .catch(() => alert("Erro ao registrar a compra."));
    };

    if (carregando) return <p className="text-gray-400 animate-pulse">A carregar a sua carteira digital...</p>;

    // Estilos padrão Dark Tech
    const labelStyle = "block text-sm font-medium text-gray-400 mb-1 font-tech tracking-wide";
    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
    const cardStyle = "bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl mb-8";

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 font-tech text-white">Meus Cartões de Crédito</h1>

            {/* FORMULÁRIO 1: CRIAR CARTÃO */}
            <div className={cardStyle}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-blue-500">💳</span> Cadastrar Novo Cartão
                </h2>
                <form onSubmit={submeterCartao} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className={labelStyle}>Apelido (ex: NuBank)</label>
                        <input type="text" name="nome" value={novoCartao.nome} onChange={lidarComMudancaCartao} required className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Limite Total (R$)</label>
                        <input type="number" step="0.01" name="limiteTotal" value={novoCartao.limiteTotal} onChange={lidarComMudancaCartao} required className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>Dia de Fechamento</label>
                        <input type="number" min="1" max="31" name="diaFechamento" value={novoCartao.diaFechamento} onChange={lidarComMudancaCartao} required className={inputStyle} placeholder="Ex: 25" />
                    </div>
                    <div>
                        <label className={labelStyle}>Dia de Vencimento</label>
                        <input type="number" min="1" max="31" name="diaVencimento" value={novoCartao.diaVencimento} onChange={lidarComMudancaCartao} required className={inputStyle} placeholder="Ex: 5" />
                    </div>
                    <button type="submit" className="lg:col-span-4 h-[50px] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg px-6 shadow-[0_0_15px_rgba(37,99,235,0.2)] active:scale-95 transition-all">
                        Salvar Cartão
                    </button>
                </form>
            </div>

            {/* LISTA DE CARTÕES (Visualização) */}
            <div className="flex gap-6 flex-wrap mb-8">
                {cartoes.length === 0 ? (
                    <p className="text-gray-500 italic border border-gray-800 p-4 rounded-lg">Nenhum cartão cadastrado. Adicione um acima!</p>
                ) : (
                    cartoes.map((cartao) => (
                        <div key={cartao.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-2xl w-[340px] relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            
                            <h3 className="text-2xl font-bold text-white font-tech tracking-widest mb-4 uppercase">{cartao.nome}</h3>
                            <p className="text-emerald-400 font-bold font-tech text-lg mb-6">Limite: R$ {cartao.limiteTotal}</p>
                            
                            <div className="flex justify-between text-xs text-gray-400 font-tech border-t border-gray-700 pt-4">
                                <span>Fecha dia: <strong className="text-white">{cartao.diaFechamento}</strong></span>
                                <span>Vence dia: <strong className="text-white">{cartao.diaVencimento}</strong></span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FORMULÁRIO 2: REGISTRAR COMPRA */}
            <div className={cardStyle}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-emerald-500">🛍️</span> Lançar Compra no Crédito
                </h2>
                <form onSubmit={submeterCompra} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Selecione o Cartão</label>
                        <select name="cartaoId" value={novaCompra.cartaoId} onChange={lidarComMudancaCompra} required className={inputStyle}>
                            <option value="">-- Escolha um cartão --</option>
                            {cartoes.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Descrição da Compra</label>
                        <input type="text" name="descricao" value={novaCompra.descricao} onChange={lidarComMudancaCompra} required className={inputStyle} placeholder="Ex: Geladeira Nova" />
                    </div>
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Categoria</label>
                        <input type="text" name="categoria" value={novaCompra.categoria} onChange={lidarComMudancaCompra} required className={inputStyle} placeholder="Ex: Eletrodomésticos" />
                    </div>
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Valor Total (R$)</label>
                        <input type="number" step="0.01" name="valorTotal" value={novaCompra.valorTotal} onChange={lidarComMudancaCompra} required className={inputStyle} />
                    </div>
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Qtd. Parcelas</label>
                        <input type="number" min="1" max="48" name="quantidadeParcelas" value={novaCompra.quantidadeParcelas} onChange={lidarComMudancaCompra} required className={inputStyle} />
                    </div>
                    <div className="lg:col-span-2">
                        <label className={labelStyle}>Data da Compra</label>
                        <input type="date" name="dataCompra" value={novaCompra.dataCompra} onChange={lidarComMudancaCompra} required className={inputStyle} style={{colorScheme: 'dark'}} />
                    </div>
                    <button type="submit" className="lg:col-span-6 h-[50px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 transition-all">
                        Registrar Compra na Fatura
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Cartoes;