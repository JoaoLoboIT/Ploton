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

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f5f7' }}>
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Ploton</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Faça login para gerir as suas finanças</p>
                
                <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                        <input type="email" name="email" value={credenciais.email} onChange={lidarComMudanca} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Senha</label>
                        <input type="password" name="senha" value={credenciais.senha} onChange={lidarComMudanca} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    {erro && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{erro}</p>}

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                        Entrar
                    </button>
                </form>

                {/* NOVO LINK PARA CADASTRO */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Não tem uma conta? <span style={{ color: '#0056b3', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => navegar('/cadastro')}>Cadastre-se aqui</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;