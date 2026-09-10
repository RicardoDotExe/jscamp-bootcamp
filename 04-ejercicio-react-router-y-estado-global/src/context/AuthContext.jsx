import { createContext, useState, use } from "react";

// Creamos el contexto
export const AuthContext = createContext()

// Custom hook para consumir el contexto
export function useAuth() {
  const context = use(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}

// Provider
export function AuthProvider ({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const login = () => {
        setIsLoggedIn(true)
    }

    const logout = () => {
        setIsLoggedIn(false)
    }
    const value   = {
        isLoggedIn, 
        login,
        logout
    }  

    return <AuthContext value={value}>
        {children}
    </AuthContext>
}