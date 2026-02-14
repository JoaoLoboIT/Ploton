// src/components/CartaoMeta.jsx
import { useState } from 'react';
import api from '../services/api';

function CartaoMeta({ meta, aoAtualizar }) {
    const [valorOperacao, setValorOperacao] = useState('');

    const executarOperacao = (tipoOperacao) => {
        if (!valorOperacao || valorOperacao <= 0) {
            alert("Por favor, digite um valor válido maior que zero.");
            return;
        }

        // DTO EXATAMENTE como o seu MetaOperacaoDTO.java espera
        const dto = {
            valor: parseFloat(valorOperacao),
            tipo: tipoOperacao // Agora é 'ADICIONAR' ou 'REMOVER'
        };

        api.patch(`/metas/${meta.id}/saldo`, dto)
            .then(() => {
                setValorOperacao('');
                aoAtualizar(); // Atualiza a lista do Pai
            })
            .catch(error => {
                console.error(`Erro ao fazer ${tipoOperacao}:`, error);
                alert("Erro na operação. Verifique se o saldo não ficará negativo.");
            });
    };

    // No seu Java, a classe Meta tem um 'getPorcentagemConcluida()'.
    // O Spring Boot transforma isso num campo JSON automaticamente!
    // Se por acaso não vier, temos o cálculo de fallback.
    const progresso = meta.porcentagemConcluida !== undefined 
        ? meta.porcentagemConcluida 
        : (meta.valorAtual / meta.valorAlvo) * 100;

    const progressoFormatado = progresso > 100 ? 100 : Math.round(progresso);

    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '320px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0 }}>{meta.nome}</h3>
            {meta.descricao && <p style={{ fontSize: '14px', color: '#555', margin: '0 0 10px 0' }}>{meta.descricao}</p>}
            
            {/* Usando os nomes exatos da sua Entity Meta.java */}
            <p style={{ margin: '5px 0' }}><strong>Alvo:</strong> R$ {meta.valorAlvo}</p>
            <p style={{ margin: '5px 0', color: '#0056b3' }}><strong>Guardado:</strong> R$ {meta.valorAtual}</p>
            <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Data limite: {meta.dataLimite}</p>
            
            {/* BARRA DE PROGRESSO */}
            <div style={{ width: '100%', backgroundColor: '#e9ecef', height: '15px', borderRadius: '10px', margin: '15px 0', overflow: 'hidden' }}>
                <div style={{ width: `${progressoFormatado}%`, backgroundColor: progressoFormatado === 100 ? '#28a745' : '#6f42c1', height: '100%', transition: 'width 0.5s' }}></div>
            </div>
            <p style={{ textAlign: 'right', margin: '-10px 0 15px 0', fontSize: '12px', fontWeight: 'bold' }}>{progressoFormatado}%</p>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '15px' }} />
            
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                <input 
                    type="number" 
                    step="0.01" 
                    placeholder="R$ 0,00" 
                    value={valorOperacao} 
                    onChange={(e) => setValorOperacao(e.target.value)} 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    {/* Alinhado com o backend: ADICIONAR e REMOVER */}
                    <button onClick={() => executarOperacao('ADICIONAR')} style={{ flex: 1, padding: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        + Guardar
                    </button>
                    <button onClick={() => executarOperacao('REMOVER')} style={{ flex: 1, padding: '8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        - Retirar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartaoMeta;