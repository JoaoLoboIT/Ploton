// src/pages/Cadastro.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
    // Estado espelhando o UsuarioRequestDTO do Java
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

        // Dispara para a rota raiz de usuários (que cria a conta)
        api.post('/usuarios', novoUsuario)
            .then(() => {
                alert("Conta criada com sucesso! Faça login para continuar.");
                navegar('/'); // Redireciona de volta para a tela de Login
            })
            .catch(error => {
                console.error("Erro no cadastro:", error);
                // Pode dar erro se o email já existir no banco (devido ao unique=true)
                setErro("Erro ao criar conta. Este email já pode estar em uso.");
            });
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f5f7' }}>
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Criar Conta</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Junte-se ao Ploton e organize suas finanças</p>
                
                <form onSubmit={fazerCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo</label>
                        <input type="text" name="nome" value={novoUsuario.nome} onChange={lidarComMudanca} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                        <input type="email" name="email" value={novoUsuario.email} onChange={lidarComMudanca} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Senha</label>
                        <input type="password" name="senha" value={novoUsuario.senha} onChange={lidarComMudanca} required minLength="4" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>

                    {erro && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{erro}</p>}

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                        Cadastrar
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Já tem uma conta? <span style={{ color: '#0056b3', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => navegar('/')}>Voltar ao Login</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;