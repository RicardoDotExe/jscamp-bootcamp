import { HomePage } from './pages/Home.jsx'
import { SearchPage } from './pages/Search.jsx'
import { NotFoundPage } from './pages/404.jsx'
import { Route } from './components/Route.jsx'
import { useRouter } from './hooks/useRouter.jsx'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'

const KNOWN_PATHS = ['/', '/search']

function App() {
  // Importamos useRouter para conocer en qué ruta estamos y lanzar el 404 en caso de que la ruta no exista.
  const { currentPath } = useRouter()

  return (
    <>
      <Header />
      <main>
        <Route path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
        {!KNOWN_PATHS.includes(currentPath) && <NotFoundPage />}
      </main>
      <Footer />
    </>
  )
}

export default App
