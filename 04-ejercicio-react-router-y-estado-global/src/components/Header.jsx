import { NavLink } from 'react-router'
import { Link } from "./Link"
import { useAuthStore } from '../store/authStore'
import { useFavoritesStore } from '../store/favoritesStore'

export function Header() {
    const { isLoggedIn } = useAuthStore()
    const { countFavorites } = useFavoritesStore()
    const numberOfFavorites = countFavorites()

    return (
        <>
            <header>
                <Link href='/' style={{ textDecoration: 'none' }}>
                    <h1>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round"
                            strokeLinejoin="round" strokeWidth="2"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                        DevJobs
                    </h1>
                </Link>

                <nav>
                    <NavLink className={({ isActive }) => isActive ? 'nav-link-active' : ''} to="/" >
                        Inicio
                    </NavLink>

                    <NavLink className={({ isActive }) => isActive ? 'nav-link-active' : ''} to="/search" >
                        Empleos
                    </NavLink> 
                    {
                        isLoggedIn && (
                            <NavLink 
                                className={({ isActive }) => isActive ? 'nav-link-active' : ''} to="/profile">
                                    Perfil ❤️ {numberOfFavorites}
                                </NavLink>
                        )
                    }
                </nav>

                <div>
                    { /* <button className="upload-cv-button">Subir CV</button>
                    <devjobs-avatar service="github" username="RicardoDotExe"
                        size="50">
                    </devjobs-avatar> */ }
                </div>

                <HeaderUserButton/>


            </header>
        </>
    )
}

const HeaderUserButton = () => {

    const { isLoggedIn, login, logout } = useAuthStore()
    const { clearFavorites } = useFavoritesStore()

    const handleLogout = () => {
    logout()
    clearFavorites()
  }

  return isLoggedIn
    ? <button onClick={handleLogout}>Cerrar sesión</button>
    : <button onClick={login}>Iniciar sesión</button>

}
