import { useState } from 'react';
import api from '../services/api';

function CartaoMeta({ meta, aoAtualizar }) {
    const [valorOperacao, setValorOperacao] = useState('');

    const formatarMoeda = (valor) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

    const porcentagem = Math.min((meta.valorAtual / meta.valorAlvo) * 100, 100).toFixed(0);

    const lidarComMascara = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/\D/g, "");
        if (valor === "") { setValorOperacao(""); return; }
        valor = (Number(valor) / 100).toFixed(2);
        valor = valor.replace(".", ",");
        valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setValorOperacao(valor);
    };

    const parseParaNumero = (strMoeda) => {
        if (!strMoeda) return 0;
        return parseFloat(String(strMoeda).replace(/\./g, "").replace(",", "."));
    };

    const handleOperacao = async (tipo) => {
        const valorNumerico = parseParaNumero(valorOperacao);
        if (valorNumerico <= 0) return;
        
        try {
            await api.patch(`/metas/${meta.id}/saldo`, { 
                valor: valorNumerico, 
                tipo: tipo.toUpperCase() 
            });
            setValorOperacao('');
            aoAtualizar();
        } catch (error) {
            console.error("Erro ao atualizar meta:", error);
            alert("Erro na operação.");
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col w-full md:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)] transition-all hover:border-purple-500/30">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white font-tech">{meta.nome}</h3>
                {meta.descricao && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{meta.descricao}</p>}
            </div>

            <div className="space-y-3 flex-grow">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Alvo:</span>
                    <span className="text-white font-bold">{formatarMoeda(meta.valorAlvo)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Guardado:</span>
                    <span className="text-purple-400 font-bold">{formatarMoeda(meta.valorAtual)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Data limite:</span>
                    <span>{new Date(meta.dataLimite).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                        <div className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${porcentagem}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
                        </div>
                    </div>
                    <p className="text-right text-xs text-purple-400 mt-1 font-bold">{porcentagem}%</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="relative mb-3">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-bold">R$</span>
                    <input type="text" value={valorOperacao} onChange={lidarComMascara} placeholder="0,00" className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-purple-500 outline-none transition-all font-tech" />
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleOperacao('adicionar')} className="flex-1 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold py-2 rounded text-sm transition-colors active:scale-95">+ Guardar</button>
                    <button onClick={() => handleOperacao('remover')} className="flex-1 bg-red-600/90 hover:bg-red-500 text-white font-bold py-2 rounded text-sm transition-colors active:scale-95">- Retirar</button>
                </div>
            </div>
        </div>
    );
}

export default CartaoMeta;