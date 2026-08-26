import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'
import { Route } from './components/Route'

function App() {

  return (
    <>
      <main>
        <Route path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
      </main>
    </>
  )
}

export default App
