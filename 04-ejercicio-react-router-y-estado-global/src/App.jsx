import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))
const JobDetail = lazy(() => import('./pages/Detail.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))

function App() {
  return (
    <>
      <Header />

      <main>
        <Suspense fallback={<p>Cargando...</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/search" element={<SearchPage />} />

            /* Lo que hiciste está genial! Paso el path a este formato porque lo vas a ver en muchos sitios. Primero el nombre en singular y segundo el id explicito */
            <Route path="/job/:id" element={<JobDetail />} />

            <Route path="/profile" element={
              <ProtectedRoute redirectTo="/login">
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  )
}

export default App
