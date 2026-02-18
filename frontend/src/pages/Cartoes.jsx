import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Cartoes() {
    const { usuarioLogado } = useContext(AuthContext);
    const [cartoes, setCartoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [novoCartao, setNovoCartao] = useState({ 
        nome: '', 
        limiteTotal: '', 
        diaFechamento: '', 
        diaVencimento: '' 
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

    const submeterCartao = (e) => {
        e.preventDefault();
        
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

    if (carregando) return <p className="text-gray-400 animate-pulse">A carregar a sua carteira digital...</p>;

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
                        <label className={labelStyle}>Apelido</label>
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
                        <div key={cartao.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-2xl w-[340px] relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <h3 className="text-2xl font-bold text-white font-tech tracking-widest uppercase">{cartao.nome}</h3>
                            </div>

                            <p className="text-emerald-400 font-bold font-tech text-lg mb-6 relative z-10">Limite: R$ {cartao.limiteTotal}</p>
                            
                            <div className="flex justify-between text-xs text-gray-400 font-tech border-t border-gray-700 pt-4 relative z-10">
                                <span>Fecha dia: <strong className="text-white">{cartao.diaFechamento}</strong></span>
                                <span>Vence dia: <strong className="text-white">{cartao.diaVencimento}</strong></span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Cartoes;