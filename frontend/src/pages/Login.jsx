// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
    const [credenciais, setCredenciais] = useState({ email: '', senha: '' });
    const [erro, setErro] = useState('');
    const { setUsuarioLogado } = useContext(AuthContext);
    const navegar = useNavigate();

    const lidarComMudanca = (evento) => {
        const { name, value } = evento.target;
        setCredenciais({ ...credenciais, [name]: value });
    };

    const fazerLogin = (evento) => {
        evento.preventDefault();
        setErro('');
        api.post('/usuarios/login', credenciais)
            .then(response => {
                setUsuarioLogado(response.data);
                navegar('/dashboard');
            })
            .catch(error => {
                console.error("Erro no login:", error);
                setErro("Email ou senha incorretos. Tente novamente.");
            });
    };

    const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

    return (
        <div className="h-screen flex justify-center items-center bg-[#0b0f19]">
            <div className="bg-gray-900 p-10 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-sm">
                
                {/* Logo Tech */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center font-bold text-white text-2xl">
                        P
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center text-emerald-400 mb-2 font-tech tracking-widest">PLOTON</h1>
                
                <form onSubmit={fazerLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-400 font-tech">Email</label>
                        <input type="email" name="email" value={credenciais.email} onChange={lidarComMudanca} required className={inputStyle} />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-400 font-tech">Senha</label>
                        <input type="password" name="senha" value={credenciais.senha} onChange={lidarComMudanca} required className={inputStyle} />
                    </div>

                    {erro && <p className="text-red-400 text-sm font-semibold text-center bg-red-400/10 p-2 rounded">{erro}</p>}

                    <button type="submit" className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95">
                        Entrar
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-800 pt-6">
                    <p className="text-sm text-gray-500">
                        Não tem uma conta?{' '}
                        <span onClick={() => navegar('/cadastro')} className="text-emerald-400 font-bold cursor-pointer hover:underline">
                            Cadastre-se
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;