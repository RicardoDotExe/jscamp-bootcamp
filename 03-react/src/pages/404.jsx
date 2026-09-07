import { Link } from '../components/Link'

export function NotFoundPage() {
    return (
        <section>
            <h1>404</h1>
            <p>Ups, la página que buscas no existe</p>
            <Link href="/">Volver al inicio</Link>
        </section>
    )
}
