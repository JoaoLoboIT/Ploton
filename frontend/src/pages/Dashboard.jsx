// src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
// Importando o motor de gráficos!
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

function Dashboard() {
    const { usuarioLogado } = useContext(AuthContext);
    const [resumo, setResumo] = useState(null);
    const [metas, setMetas] = useState([]);
    const [dadosGraficoGastos, setDadosGraficoGastos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // Estados para o Saldo Editável
    const [editandoSaldo, setEditandoSaldo] = useState(false);
    const [valorInputSaldo, setValorInputSaldo] = useState('');

    useEffect(() => {
        if (usuarioLogado) {
            const dataAtual = new Date();
            const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const anoAtual = String(dataAtual.getFullYear());

            // Dispara 3 requisições ao mesmo tempo para o Java!
            Promise.all([
                api.get(`/dashboard/${usuarioLogado.id}`),
                api.get(`/metas/usuario/${usuarioLogado.id}`),
                api.get(`/extrato/usuario/${usuarioLogado.id}?mes=${mesAtual}&ano=${anoAtual}`)
            ])
            .then(([resDashboard, resMetas, resExtrato]) => {
                setResumo(resDashboard.data);
                
                // Ordena as metas da mais próxima de 100% para a menor
                const metasOrdenadas = resMetas.data.sort((a, b) => {
                    const progA = (a.valorAtual / a.valorAlvo) * 100;
                    const progB = (b.valorAtual / b.valorAlvo) * 100;
                    return progB - progA;
                });
                setMetas(metasOrdenadas);

                // Processa o extrato para criar o gráfico de gastos por categoria
                const gastos = resExtrato.data.filter(t => t.tipoFluxo === 'DESPESA');
                const categorias = {};
                gastos.forEach(g => {
                    categorias[g.categoria] = (categorias[g.categoria] || 0) + g.valor;
                });
                // Converte o objeto para um Array que o Recharts entende
                const arrayGrafico = Object.keys(categorias).map(cat => ({
                    nome: cat,
                    valor: categorias[cat]
                }));
                setDadosGraficoGastos(arrayGrafico);

                setCarregando(false);
            })
            .catch(error => {
                console.error("Erro ao buscar dados do dashboard:", error);
                setCarregando(false);
            });
        }
    }, [usuarioLogado]);

    // ==========================================
    // FUNÇÕES DO SALDO EDITÁVEL
    // ==========================================
    const iniciarEdicaoSaldo = () => {
        setValorInputSaldo(resumo.saldoAtual || 0);
        setEditandoSaldo(true);
    };

    const salvarNovoSaldo = () => {
        const valorNumerico = parseFloat(valorInputSaldo);
        if (isNaN(valorNumerico)) {
            setEditandoSaldo(false);
            return;
        }

        // Bate na nova rota PATCH que criamos no Java
        api.patch(`/usuarios/${usuarioLogado.id}/saldo`, { saldoManual: valorNumerico })
            .then(() => {
                // Atualiza a tela sem precisar recarregar
                setResumo({ ...resumo, saldoAtual: valorNumerico });
                setEditandoSaldo(false);
            })
            .catch(() => {
                alert("Erro ao atualizar o saldo.");
                setEditandoSaldo(false);
            });
    };

    const formatarDinheiro = (valor) => {
        if (valor === null || valor === undefined) return 'R$ 0,00';
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Dados de demonstração para o Gráfico de Investimentos (Vamos ligar ao banco depois!)
    const dadosGraficoInvestimentosMock = [
        { dia: '01/Fev', saldo: 1000 }, { dia: '05/Fev', saldo: 1025 },
        { dia: '10/Fev', saldo: 1015 }, { dia: '15/Fev', saldo: 1150 }
    ];

    if (carregando || !resumo) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-tech tracking-widest animate-pulse">CARREGANDO CENTRAL DE COMANDO...</p>
            </div>
        );
    }

    const baseCard = "bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group hover:border-gray-700 transition-all duration-300";

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-bold font-tech text-white mb-2">Visão Geral</h1>
                <p className="text-gray-500 text-sm">Bem-vindo(a), <span className="text-emerald-400">{usuarioLogado.nome}</span>. Seu resumo do mês atual.</p>
            </div>
            
            {/* LINHA 1: OS 3 CARDS DESTACADOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                
                {/* 1. SALDO NA CONTA (EDITÁVEL) */}
                <div className={`${baseCard} border-blue-500/30`}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest font-tech">Saldo na Conta Corrente</p>
                        <span className="text-blue-500 text-xl cursor-pointer hover:scale-110 transition-transform" onClick={iniciarEdicaoSaldo} title="Editar Saldo">✏️</span>
                    </div>
                    
                    <div className="relative z-10 h-10 flex items-center mt-2">
                        {editandoSaldo ? (
                            <div className="flex gap-2 w-full">
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    autoFocus
                                    value={valorInputSaldo} 
                                    onChange={(e) => setValorInputSaldo(e.target.value)}
                                    className="w-full bg-gray-800 border border-blue-500/50 rounded px-2 py-1 text-white font-tech text-xl focus:outline-none"
                                />
                                <button onClick={salvarNovoSaldo} className="bg-blue-600 hover:bg-blue-500 px-3 rounded text-white text-sm">💾</button>
                            </div>
                        ) : (
                            <h2 className="text-4xl font-bold font-tech text-blue-400">
                                {formatarDinheiro(resumo.saldoAtual)}
                            </h2>
                        )}
                    </div>
                </div>

                {/* 2. ENTRADAS DO MÊS */}
                <div className={`${baseCard} border-emerald-500/20`}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4 font-tech relative z-10">Entradas no Mês</p>
                    <h2 className="text-4xl font-bold font-tech text-emerald-400 relative z-10">
                        {formatarDinheiro(resumo.totalReceitas)}
                    </h2>
                </div>

                {/* 3. SAÍDAS DO MÊS */}
                <div className={`${baseCard} border-red-500/20`}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4 font-tech relative z-10">Saídas no Mês</p>
                    <h2 className="text-4xl font-bold font-tech text-red-400 relative z-10">
                        {formatarDinheiro(resumo.totalDespesas)}
                    </h2>
                </div>
            </div>

            {/* LINHA 2: GRÁFICOS E METAS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* COLUNA ESQUERDA: GRÁFICOS (Ocupa 2 espaços) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    
                    {/* GRÁFICO 1: GASTOS POR CATEGORIA */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h3 className="text-white font-tech tracking-widest mb-6 flex items-center gap-2">
                            <span className="text-red-500">📊</span> Mapa de Despesas (Mês Atual)
                        </h3>
                        <div className="h-64 w-full">
                            {dadosGraficoGastos.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dadosGraficoGastos}>
                                        <XAxis dataKey="nome" stroke="#9ca3af" tick={{fontFamily: 'Rajdhani'}} />
                                        <YAxis stroke="#9ca3af" tick={{fontFamily: 'Rajdhani'}} />
                                        <Tooltip 
                                            cursor={{fill: '#1f2937'}}
                                            contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff', fontFamily: 'Rajdhani'}} 
                                            itemStyle={{color: '#f87171'}}
                                        />
                                        <Bar dataKey="valor" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 italic border border-dashed border-gray-700 rounded-lg">
                                    Nenhuma despesa registrada neste mês.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GRÁFICO 2: RENDIMENTO DE INVESTIMENTOS */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h3 className="text-white font-tech tracking-widest mb-6 flex items-center gap-2">
                            <span className="text-purple-500">📈</span> Curva de Patrimônio Investido
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dadosGraficoInvestimentosMock}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="dia" stroke="#9ca3af" tick={{fontFamily: 'Rajdhani'}} />
                                    <YAxis stroke="#9ca3af" tick={{fontFamily: 'Rajdhani'}} domain={['auto', 'auto']} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff', fontFamily: 'Rajdhani'}} 
                                        itemStyle={{color: '#a855f7'}}
                                    />
                                    <Line type="monotone" dataKey="saldo" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: '#a855f7', strokeWidth: 0}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* COLUNA DIREITA: TOP METAS (Ocupa 1 espaço) */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col">
                    <h3 className="text-white font-tech tracking-widest mb-6 flex items-center gap-2">
                        <span className="text-pink-500">🎯</span> Progresso dos Objetivos
                    </h3>
                    
                    <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                        {metas.length === 0 ? (
                            <p className="text-gray-500 italic text-sm text-center mt-10">Nenhuma meta em andamento.</p>
                        ) : (
                            metas.map(meta => {
                                const progresso = (meta.valorAtual / meta.valorAlvo) * 100;
                                const percentual = progresso > 100 ? 100 : Math.round(progresso);
                                const corBarra = percentual === 100 ? 'bg-emerald-500' : 'bg-pink-600';

                                return (
                                    <div key={meta.id}>
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-white font-medium text-sm truncate max-w-[150px]">{meta.nome}</p>
                                            <p className="text-gray-400 font-tech text-xs">
                                                <span className="text-white">R$ {meta.valorAtual}</span> / {meta.valorAlvo}
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${corBarra}`} style={{ width: `${percentual}%` }}></div>
                                        </div>
                                        <p className="text-right text-[10px] font-bold text-gray-500 font-tech mt-1">{percentual}% Concluído</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    
                    <button onClick={() => window.location.href='/metas'} className="mt-auto pt-6 text-sm text-pink-500 font-tech uppercase tracking-widest hover:text-pink-400 text-center transition-colors">
                        Ver todas as metas →
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;