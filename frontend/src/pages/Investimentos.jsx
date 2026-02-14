// src/pages/Investimentos.jsx

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';

// 1. IMPORTAMOS O CONTEXTO GLOBAL
import { AuthContext } from '../contexts/AuthContext';

function Investimentos() {
    // 2. EXTRAÍMOS O UTILIZADOR LOGADO DA NUVEM
    const { usuarioLogado } = useContext(AuthContext);

    // ==========================================
    // ESTADOS DA TELA
    // ==========================================
    const [investimentos, setInvestimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // 3. REMOVEMOS O usuarioId FIXO
    const [novoAtivo, setNovoAtivo] = useState({
        nome: '',
        tipo: 'RENDA_FIXA'
    });

    const [novaMovimentacao, setNovaMovimentacao] = useState({
        investimentoId: '', 
        valor: '',
        tipo: 'APORTE',     
        data: ''
    });

    // ==========================================
    // LÓGICA DE BUSCA (READ)
    // ==========================================
    const buscarInvestimentos = () => {
        // 4. USAMOS O ID DINÂMICO NA URL
        api.get(`/investimentos/usuario/${usuarioLogado.id}`)
            .then(response => {
                setInvestimentos(response.data);
                setCarregando(false);
            })
            .catch(error => {
                console.error("Erro ao buscar carteira:", error);
                setCarregando(false);
            });
    };

    // 5. ATUALIZAMOS A LISTA SEMPRE QUE O UTILIZADOR MUDAR
    useEffect(() => {
        buscarInvestimentos();
    }, [usuarioLogado.id]);

    // ==========================================
    // LÓGICA DE CRIAÇÃO DO ATIVO (CREATE POT)
    // ==========================================
    const lidarComMudancaAtivo = (evento) => {
        const { name, value } = evento.target;
        setNovoAtivo({ ...novoAtivo, [name]: value });
    };

    const submeterAtivo = (evento) => {
        evento.preventDefault();

        // 6. INJETAMOS O ID DO USUÁRIO NO DTO DE ENVIO
        const dtoEnvio = {
            ...novoAtivo,
            usuarioId: usuarioLogado.id
        };

        api.post('/investimentos', dtoEnvio)
            .then(response => {
                alert("Novo ativo adicionado!");
                setNovoAtivo({ nome: '', tipo: 'RENDA_FIXA' });
                buscarInvestimentos();
            })
            .catch(error => {
                console.error("Erro ao criar ativo:", error);
                alert("Erro ao criar o investimento.");
            });
    };

    // ==========================================
    // LÓGICA DA MOVIMENTAÇÃO (UPDATE BALANCE)
    // ==========================================
    const lidarComMudancaMovimentacao = (evento) => {
        const { name, value } = evento.target;
        setNovaMovimentacao({ ...novaMovimentacao, [name]: value });
    };

    const submeterMovimentacao = (evento) => {
        evento.preventDefault();
        
        // 7. GARANTIMOS QUE O VALOR VÁ COMO NÚMERO (FLOAT)
        const dtoEnvio = {
            ...novaMovimentacao,
            valor: parseFloat(novaMovimentacao.valor)
        };

        api.post('/investimentos/movimentacao', dtoEnvio)
            .then(response => {
                alert("Movimentação registrada com sucesso!");
                setNovaMovimentacao({ investimentoId: '', valor: '', tipo: 'APORTE', data: '' });
                buscarInvestimentos();
            })
            .catch(error => {
                console.error("Erro ao movimentar:", error);
                alert("Erro ao registrar a movimentação.");
            });
    };

    if (carregando) return <p>A carregar a sua carteira...</p>;

    // ==========================================
    // RENDERIZAÇÃO DA TELA (JSX)
    // ==========================================
    return (
        <div>
            <h1>Meus Investimentos</h1>

            {/* FORMULÁRIO 1: CRIAR ATIVO (A Caixinha) */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>1. Cadastrar Novo Ativo</h2>
                <form onSubmit={submeterAtivo} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Nome do Ativo</label>
                        <input type="text" name="nome" value={novoAtivo.nome} onChange={lidarComMudancaAtivo} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Tipo</label>
                        <select name="tipo" value={novoAtivo.tipo} onChange={lidarComMudancaAtivo}>
                            <option value="RENDA_FIXA">Renda Fixa</option>
                            <option value="ACOES">Ações</option>
                            <option value="FII">Fundos Imobiliários</option>
                            <option value="CRIPTOMOEDAS">Criptomoedas</option>
                        </select>
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Criar Carteira
                    </button>
                </form>
            </div>

            {/* TABELA DE ATIVOS */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e0e0e0' }}>
                        <th>Nome do Ativo</th>
                        <th>Tipo</th>
                        <th>Saldo Atual (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    {investimentos.length === 0 ? (
                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhum investimento cadastrado.</td></tr>
                    ) : (
                        investimentos.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.nome}</td>
                                <td>{inv.tipo}</td>
                                <td style={{ color: '#0056b3', fontWeight: 'bold' }}>{inv.saldo}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* FORMULÁRIO 2: A "TORNEIRA" (Aportes e Resgates) */}
            <div style={{ backgroundColor: '#f9f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #d0d0ff' }}>
                <h2>2. Registrar Movimentação (Aporte/Resgate)</h2>
                <form onSubmit={submeterMovimentacao} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
                        <label>Selecione o Ativo</label>
                        <select name="investimentoId" value={novaMovimentacao.investimentoId} onChange={lidarComMudancaMovimentacao} required>
                            <option value="">-- Escolha um ativo --</option>
                            {investimentos.map(inv => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.nome} (Saldo: R$ {inv.saldo})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Tipo de Movimentação</label>
                        <select name="tipo" value={novaMovimentacao.tipo} onChange={lidarComMudancaMovimentacao} required>
                            <option value="APORTE">Aporte (Colocar Dinheiro)</option>
                            <option value="RESGATE">Resgate (Tirar Dinheiro)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Valor (R$)</label>
                        <input type="number" step="0.01" name="valor" value={novaMovimentacao.valor} onChange={lidarComMudancaMovimentacao} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Data</label>
                        <input type="date" name="data" value={novaMovimentacao.data} onChange={lidarComMudancaMovimentacao} required />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Confirmar
                    </button>
                </form>
            </div>

        </div>
    );
}

export default Investimentos;