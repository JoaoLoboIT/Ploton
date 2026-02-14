// src/pages/Transacoes.jsx

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';

// 1. IMPORTAMOS O CONTEXTO
import { AuthContext } from '../contexts/AuthContext';

function Transacoes() {
    // 2. EXTRAÍMOS O UTILIZADOR DA NUVEM GLOBAL
    const { usuarioLogado } = useContext(AuthContext);

    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // 3. REMOVEMOS O usuarioId DAQUI (Vamos injetá-lo apenas na hora de enviar)
    const [novaTransacao, setNovaTransacao] = useState({
        descricao: '',
        valor: '',
        tipo: 'DESPESA',
        categoria: '',
        data: ''
    });

    const buscarTransacoes = () => {
        // 4. URL DINÂMICA COM TEMPLATE LITERALS
        api.get(`/transacoes/usuario/${usuarioLogado.id}`)
            .then(response => {
                setTransacoes(response.data);
                setCarregando(false);
            })
            .catch(error => {
                console.error("Erro ao buscar transações:", error);
                setCarregando(false);
            });
    };

    // 5. DEPENDÊNCIA ATUALIZADA
    // Se o ID do usuário mudar (ex: fez logout e login com outra conta), ele busca de novo.
    useEffect(() => {
        buscarTransacoes();
    }, [usuarioLogado.id]);

    const lidarComMudanca = (evento) => {
        const { name, value } = evento.target;
        setNovaTransacao({
            ...novaTransacao,
            [name]: value
        });
    };

    const submeterFormulario = (evento) => {
        evento.preventDefault();

        // 6. MONTAMOS O DTO EXATAMENTE ANTES DE ENVIAR
        const dtoEnvio = {
            ...novaTransacao,
            usuarioId: usuarioLogado.id, // Injetamos o ID do contexto aqui
            valor: parseFloat(novaTransacao.valor) // Garantimos que vai como número para o Java
        };

        api.post('/transacoes', dtoEnvio)
            .then(response => {
                alert("Transação guardada com sucesso!");
                // Limpamos apenas os campos digitáveis
                setNovaTransacao({
                    descricao: '',
                    valor: '',
                    tipo: 'DESPESA',
                    categoria: '',
                    data: ''
                });
                buscarTransacoes();
            })
            .catch(error => {
                console.error("Erro ao guardar:", error);
                alert("Ocorreu um erro ao guardar a transação.");
            });
    };

    if (carregando) return <p>A carregar o seu extrato...</p>;

    return (
        <div>
            <h1>Gestão de Transações</h1>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>Nova Transação</h2>
                <form onSubmit={submeterFormulario} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Descrição</label>
                        <input type="text" name="descricao" value={novaTransacao.descricao} onChange={lidarComMudanca} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Valor (R$)</label>
                        <input type="number" step="0.01" name="valor" value={novaTransacao.valor} onChange={lidarComMudanca} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Tipo</label>
                        <select name="tipo" value={novaTransacao.tipo} onChange={lidarComMudanca}>
                            <option value="RECEITA">Receita</option>
                            <option value="DESPESA">Despesa</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Categoria</label>
                        <input type="text" name="categoria" value={novaTransacao.categoria} onChange={lidarComMudanca} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Data</label>
                        <input type="date" name="data" value={novaTransacao.data} onChange={lidarComMudanca} required />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Guardar
                    </button>
                </form>
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e0e0e0' }}>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Valor (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    {transacoes.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma transação encontrada.</td></tr>
                    ) : (
                        transacoes.map((t) => (
                            <tr key={t.id}>
                                <td>{t.data}</td>
                                <td>{t.descricao}</td>
                                <td>{t.categoria}</td>
                                <td style={{ color: t.tipo === 'RECEITA' ? 'green' : 'red', fontWeight: 'bold' }}>{t.tipo}</td>
                                <td>{t.valor}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Transacoes;