import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'
/* Faltó agregar una página de 404 */
import { Route } from './components/Route'
import { useRouter } from './hooks/useRouter'
import { NotFoundPage } from './pages/404'
// import Header from './components/Header.jsx'
// import Footer from './components/Footer.jsx'
// Header y Footer ahora se importan de forma nombrada. Para tener una mejor DX es recomendable usar imports nombrados siempre cuando hablamos de componentes
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'

const KNOWN_PATHS = ['/', '/search']

function App() {
  // Necesitamos importar useRouter para conocer en qué ruta estamos y lanzar el 404 en caso de que la ruta no exista.
  const { currentPath } = useRouter()

  return (
    <>
      <Header />
      <main>
        <Route path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
        {/* El 404 solo aparece cuando la URL no coincide con ninguna ruta conocida, para eso necesitamos `currentPath` */}
        {!KNOWN_PATHS.includes(currentPath) && <NotFoundPage />}
      </main>
      <Footer />
    </>
  )
}

export default App
