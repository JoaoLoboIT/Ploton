import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    const sair = () => {
        setUsuarioLogado(null);
    };

    return (
        <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado, sair }}>
            {children}
        </AuthContext.Provider>
    );
}