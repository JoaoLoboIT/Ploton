// src/pages/Metas.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';

// 1. IMPORTAMOS O COMPONENTE ISOLADO E O CONTEXTO
import CartaoMeta from '../components/CartaoMeta';
import { AuthContext } from '../contexts/AuthContext';

function Metas() {
    // 2. EXTRAÍMOS O UTILIZADOR LOGADO DA NUVEM
    const { usuarioLogado } = useContext(AuthContext);

    const [metas, setMetas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // 3. REMOVEMOS O usuarioId FIXO
    const [novaMeta, setNovaMeta] = useState({
        nome: '',
        descricao: '',
        valorAlvo: '',
        valorAtual: 0, 
        dataLimite: '' 
    });

    const buscarMetas = () => {
        // 4. URL DINÂMICA
        api.get(`/metas/usuario/${usuarioLogado.id}`)
            .then(response => {
                setMetas(response.data);
                setCarregando(false);
            })
            .catch(error => {
                console.error("Erro ao buscar metas:", error);
                setCarregando(false);
            });
    };

    // 5. ATUALIZAMOS SEMPRE QUE O UTILIZADOR MUDAR
    useEffect(() => {
        buscarMetas();
    }, [usuarioLogado.id]);

    const lidarComMudancaMeta = (evento) => {
        const { name, value } = evento.target;
        setNovaMeta({ ...novaMeta, [name]: value });
    };

    const submeterMeta = (evento) => {
        evento.preventDefault();
        
        // 6. INJETAMOS O usuarioId E FORMATAMOS OS NÚMEROS NO DTO
        const dtoEnvio = {
            ...novaMeta,
            usuarioId: usuarioLogado.id, // O ID vem do contexto!
            valorAlvo: parseFloat(novaMeta.valorAlvo),
            valorAtual: parseFloat(novaMeta.valorAtual)
        };

        api.post('/metas', dtoEnvio)
            .then(() => {
                alert("Nova meta criada com sucesso!");
                setNovaMeta({ nome: '', descricao: '', valorAlvo: '', valorAtual: 0, dataLimite: '' });
                buscarMetas();
            })
            .catch(error => {
                console.error("Erro ao criar meta:", error);
                alert("Erro ao criar a meta. Verifique se a data está no futuro (exigência do seu DTO).");
            });
    };

    if (carregando) return <p>A carregar os seus sonhos...</p>;

    return (
        <div>
            <h1>Meus Objetivos</h1>

            {/* FORMULÁRIO DE CRIAÇÃO */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>Definir Novo Objetivo</h2>
                <form onSubmit={submeterMeta} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Nome (ex: Carro Novo)</label>
                        <input type="text" name="nome" value={novaMeta.nome} onChange={lidarComMudancaMeta} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Descrição (opcional)</label>
                        <input type="text" name="descricao" value={novaMeta.descricao} onChange={lidarComMudancaMeta} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Valor Necessário (R$)</label>
                        <input type="number" step="0.01" name="valorAlvo" value={novaMeta.valorAlvo} onChange={lidarComMudancaMeta} required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Data Limite</label>
                        <input type="date" name="dataLimite" value={novaMeta.dataLimite} onChange={lidarComMudancaMeta} required />
                    </div>

                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Criar Meta
                    </button>
                </form>
            </div>

            {/* LISTA DOS COMPONENTES (CartaoMeta) */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {metas.length === 0 ? (
                    <p>Nenhuma meta definida. Comece a sonhar!</p>
                ) : (
                    metas.map((meta) => (
                        <CartaoMeta 
                            key={meta.id} 
                            meta={meta} 
                            aoAtualizar={buscarMetas} 
                        />
                    ))
                )}
            </div>

        </div>
    );
}

export default Metas;