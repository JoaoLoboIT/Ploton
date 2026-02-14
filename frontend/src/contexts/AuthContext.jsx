// src/contexts/AuthContext.jsx
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // 1. O ESTADO COMEÇA NULO (Ninguém está logado quando o site abre)
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // 2. FUNÇÃO DE LOGOUT (Limpa a nuvem)
    const sair = () => {
        setUsuarioLogado(null);
    };

    return (
        <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado, sair }}>
            {children}
        </AuthContext.Provider>
    );
}