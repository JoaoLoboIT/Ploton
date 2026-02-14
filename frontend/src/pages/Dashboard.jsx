// src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from 'react'; // <-- Adicione o useContext aqui
import api from '../services/api';

// Importamos a "chave" para aceder à nuvem
import { AuthContext } from '../contexts/AuthContext';

function Dashboard() {
    const [dados, setDados] = useState(null);
    
    // 1. PUXAMOS O UTILIZADOR LOGADO DA NUVEM GLOBAL
    const { usuarioLogado } = useContext(AuthContext);

    useEffect(() => {
        // 2. USAMOS O ID DINÂMICO! (Se o João sair e a Maria entrar, isto muda sozinho)
        api.get(`/dashboard/${usuarioLogado.id}`)
            .then(response => {
                setDados(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar dashboard:", error);
            });
    }, [usuarioLogado.id]); // <-- O useEffect agora observa se o ID mudar

    if (!dados) return <p>Carregando informações financeiras...</p>;

    return (
        <div className="dashboard-container">
            {/* 3. PODEMOS USAR O NOME DO UTILIZADOR PARA PERSONALIZAR A TELA */}
            <h1>Visão Geral de {usuarioLogado.nome}</h1>
            
            <div className="resumo" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                {/* ... o resto do seu código de cartões do dashboard continua igualzinho aqui em baixo ... */}
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '5px solid #0056b3' }}>
                    <p style={{ margin: 0, color: '#666' }}>Saldo Atual</p>
                    <h2 style={{ margin: '5px 0 0 0' }}>R$ {dados.saldo}</h2>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '5px solid #28a745' }}>
                    <p style={{ margin: 0, color: '#666' }}>Total Investido</p>
                    <h2 style={{ margin: '5px 0 0 0' }}>R$ {dados.totalInvestido}</h2>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;