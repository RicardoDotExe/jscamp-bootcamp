import { useEffect, useState } from 'react'

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)
    // Esto es muy importante, cada vez que desmontemos el componente que usa este hook, debemos limpiar el event listener para evitar memory leaks
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  function navigateTo(path) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate')) 
  }

  return {
    currentPath,
    navigateTo
  }
}