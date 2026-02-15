// src/components/CartaoMeta.jsx
import { useState } from 'react';
import api from '../services/api';

function CartaoMeta({ meta, aoAtualizar }) {
    const [valorOperacao, setValorOperacao] = useState('');

    const executarOperacao = (tipoOperacao) => {
        if (!valorOperacao || valorOperacao <= 0) { alert("Digite um valor válido."); return; }
        api.patch(`/metas/${meta.id}/saldo`, { valor: parseFloat(valorOperacao), tipo: tipoOperacao })
            .then(() => { setValorOperacao(''); aoAtualizar(); })
            .catch(() => alert("Erro na operação. Verifique o saldo."));
    };

    const progresso = meta.porcentagemConcluida !== undefined ? meta.porcentagemConcluida : (meta.valorAtual / meta.valorAlvo) * 100;
    const progressoFormatado = progresso > 100 ? 100 : Math.round(progresso);
    
    // Usei roxo para metas para diferenciar do verde das transações
    const corBarra = progressoFormatado === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]';
    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 text-sm";

    return (
        // ESTILO DO CARTÃO DARK
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl w-[340px] hover:border-purple-500/30 transition-all duration-300">
            <h3 className="text-xl font-bold text-white font-tech mb-1 flex items-center justify-between">
                {meta.nome}
                {progressoFormatado === 100 && <span className="text-emerald-400 text-sm">✓ Concluído</span>}
            </h3>
            {meta.descricao && <p className="text-sm text-gray-500 mb-4 line-clamp-2" title={meta.descricao}>{meta.descricao}</p>}
            
            <div className="space-y-2 mb-4 font-medium">
                <p className="text-gray-400 text-sm">Alvo: <span className="text-white font-tech text-base">R$ {meta.valorAlvo}</span></p>
                <p className="text-gray-400 text-sm">Guardado: <span className="text-purple-400 font-bold font-tech text-lg">R$ {meta.valorAtual}</span></p>
                <p className="text-gray-500 text-xs">Data limite: {meta.dataLimite}</p>
            </div>
            
            {/* BARRA DE PROGRESSO TECH */}
            <div className="w-full bg-gray-800 h-3 rounded-full mb-1 overflow-hidden border border-gray-700/50">
                <div className={`h-full rounded-full transition-all duration-700 ease-out ${corBarra}`} style={{ width: `${progressoFormatado}%` }}></div>
            </div>
            <p className="text-right text-xs font-bold text-purple-400 font-tech">{progressoFormatado}%</p>

            <hr className="border-t border-gray-800 my-4" />
            
            {/* ÁREA DE OPERAÇÃO DARK */}
            <div className="flex flex-col gap-3">
                <input type="number" step="0.01" placeholder="R$ 0.00" value={valorOperacao} onChange={(e) => setValorOperacao(e.target.value)} className={inputStyle} />
                <div className="flex gap-2">
                    <button onClick={() => executarOperacao('ADICIONAR')} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md text-sm transition-all active:scale-95">
                        + Guardar
                    </button>
                    <button onClick={() => executarOperacao('REMOVER')} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-md text-sm transition-all active:scale-95">
                        - Retirar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartaoMeta;