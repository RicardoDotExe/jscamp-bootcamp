import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'
import { Route } from './components/Route'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

function App() {

  return (
    <>
      <Header />
      <main>
        <Route path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
      </main>
      <Footer />
    </>
  )
}

export default App
