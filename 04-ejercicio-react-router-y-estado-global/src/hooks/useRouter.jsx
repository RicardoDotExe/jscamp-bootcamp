import { useNavigate, useLocation } from 'react-router'
import { useCallback } from 'react'

export function useRouter() {
    const navigate = useNavigate()
    const location = useLocation()

    const navigateTo = useCallback((path) => {
        navigate(path)
    }, [navigate])

    return {
        currentPath: location.pathname,
        navigateTo
    }
}