import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    ComposedChart, Line, CartesianGrid, Legend, ReferenceLine
} from 'recharts';

function Dashboard() {
    const { usuarioLogado } = useContext(AuthContext);
    const [resumo, setResumo] = useState(null);
    const [historicoGastos, setHistoricoGastos] = useState([]);
    const [performanceInvest, setPerformanceInvest] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [editandoSaldo, setEditandoSaldo] = useState(false);
    const [novoSaldo, setNovoSaldo] = useState('');

    // Helper para formatar moeda brasileira
    const formatarMoeda = (valor) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

    const carregarDados = async () => {
        if (!usuarioLogado) return;
        try {
            // Chamada tripla para as novas rotas híbridas
            const [resDashboard, resHistorico, resPerformance] = await Promise.all([
                api.get(`/dashboard/${usuarioLogado.id}`),
                api.get(`/analytics/gastos-mensais/${usuarioLogado.id}`),
                api.get(`/analytics/investimentos/${usuarioLogado.id}`)
            ]);

            setResumo(resDashboard.data);
            setHistoricoGastos(resHistorico.data);
            setPerformanceInvest(resPerformance.data);
            setCarregando(false);
        } catch (error) {
            console.error("Erro ao sincronizar dashboard:", error);
            setCarregando(false);
        }
    };

    useEffect(() => { carregarDados(); }, [usuarioLogado]);

    const handleSalvarSaldo = () => {
        api.patch(`/usuarios/${usuarioLogado.id}/saldo`, { saldoManual: parseFloat(novoSaldo) })
            .then(() => {
                setResumo({ ...resumo, saldoAtual: parseFloat(novoSaldo) });
                setEditandoSaldo(false);
            });
    };

    if (carregando || !resumo) return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-tech animate-pulse uppercase tracking-widest">Sincronizando Ploton...</p>
        </div>
    );

    return (
        <div className="animate-fadeIn pb-10">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white font-tech">VISÃO GERAL</h1>
                <p className="text-gray-500 text-xs uppercase tracking-tighter">Central de Inteligência Financeira</p>
            </header>

            {/* 1. CARDS DE PERFORMANCE MENSAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-900 p-6 rounded-2xl border border-blue-500/20 shadow-2xl relative group">
                    <p className="text-[10px] text-gray-500 uppercase font-tech mb-1">Saldo Real Disponível</p>
                    <div className="flex justify-between items-center">
                        {editandoSaldo ? (
                            <div className="flex gap-2">
                                <input type="number" className="bg-gray-800 border border-blue-500 rounded px-2 py-1 text-white w-28 outline-none"
                                    value={novoSaldo} onChange={e => setNovoSaldo(e.target.value)} />
                                <button onClick={handleSalvarSaldo} className="text-[10px] bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded font-bold transition-colors">SALVAR</button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-white font-tech tracking-tight">{formatarMoeda(resumo.saldoAtual)}</h2>
                                <button onClick={() => { setNovoSaldo(resumo.saldoAtual); setEditandoSaldo(true) }} 
                                        className="text-gray-600 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">✏️</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-emerald-500/20 shadow-2xl">
                    <p className="text-[10px] text-gray-500 uppercase font-tech mb-1">Entradas em Fevereiro</p>
                    <h2 className="text-3xl font-bold text-emerald-400 font-tech tracking-tight">{formatarMoeda(resumo.totalReceitas)}</h2>
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-red-500/20 shadow-2xl">
                    <p className="text-[10px] text-gray-500 uppercase font-tech mb-1">Despesas em Fevereiro</p>
                    <h2 className="text-3xl font-bold text-red-400 font-tech tracking-tight">{formatarMoeda(resumo.totalDespesas)}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. GRÁFICO DE HISTÓRICO E PROJEÇÃO DE FATURAS */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-white font-tech text-sm uppercase tracking-widest">Fluxo de Caixa Híbrido</h3>
                            <p className="text-[10px] text-gray-600 uppercase">3 meses passados + Projeção de parcelas</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicoGastos} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="mes" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                                <Tooltip 
                                    cursor={{fill: '#1f2937'}}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} 
                                    formatter={(value) => formatarMoeda(value)}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase' }} />
                                <Bar dataKey="valorAVista" name="Débito / PIX" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={30} />
                                <Bar dataKey="valorCredito" name="Cartão (Projetado)" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                {/* Linha de referência para o mês atual */}
                                <ReferenceLine x={new Date().toLocaleDateString('pt-BR', {month: '2-digit', year: 'numeric'})} stroke="#6366f1" strokeDasharray="3 3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. PERFORMANCE DA CARTEIRA (INVESTIDO VS ATUAL) */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-white font-tech text-sm uppercase tracking-widest">Performance da Carteira</h3>
                            <p className="text-[10px] text-gray-600 uppercase">Patrimônio Aportado vs Valor de Mercado</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={performanceInvest} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="nomeAtivo" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                                    formatter={(value) => formatarMoeda(value)}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase' }} />
                                <Bar dataKey="valorInvestido" name="Total Aportado" fill="#374151" radius={[4, 4, 0, 0]} barSize={40} minBarSize={4} />
                                <Line type="monotone" dataKey="valorMercado" name="Valor Atual" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2 }} connectNulls={true} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;