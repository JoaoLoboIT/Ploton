// src/pages/Cadastro.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
    const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '' });
    const [erro, setErro] = useState('');
    const navegar = useNavigate();

    const lidarComMudanca = (evento) => {
        const { name, value } = evento.target;
        setNovoUsuario({ ...novoUsuario, [name]: value });
    };

    const fazerCadastro = (evento) => {
        evento.preventDefault();
        setErro('');
        api.post('/usuarios', novoUsuario)
            .then(() => {
                alert("Conta criada com sucesso! Faça login para continuar.");
                navegar('/');
            })
            .catch(error => {
                console.error("Erro no cadastro:", error);
                setErro("Erro ao criar conta. Este email já pode estar em uso.");
            });
    };

    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

    return (
        <div className="h-screen flex justify-center items-center bg-[#0b0f19]">
            <div className="bg-gray-900 p-10 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-sm">
                
                <h1 className="text-2xl font-bold text-center text-white mb-2 font-tech tracking-wider">Novo Operador</h1>
                
                <form onSubmit={fazerCadastro} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-400 font-tech">Nome Completo</label>
                        <input type="text" name="nome" value={novoUsuario.nome} onChange={lidarComMudanca} required className={inputStyle} />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-400 font-tech">Email</label>
                        <input type="email" name="email" value={novoUsuario.email} onChange={lidarComMudanca} required className={inputStyle} />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-400 font-tech">Senha</label>
                        <input type="password" name="senha" value={novoUsuario.senha} onChange={lidarComMudanca} required minLength="4" className={inputStyle} />
                    </div>

                    {erro && <p className="text-red-400 text-sm font-semibold text-center bg-red-400/10 p-2 rounded">{erro}</p>}

                    <button type="submit" className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95">
                        Cadastrar
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-800 pt-6">
                    <p className="text-sm text-gray-500">
                        Já tem uma conta?{' '}
                        <span onClick={() => navegar('/')} className="text-emerald-400 font-bold cursor-pointer hover:underline">
                            Voltar ao Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;