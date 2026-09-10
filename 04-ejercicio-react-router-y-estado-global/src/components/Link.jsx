import { Link as RouterLink } from 'react-router'; // Ojo con usar NavLink como alias, ya hay un componente con ese nombre dentro de `react-router` y puede generar confusión

export function Link ({ href, children, ...restOfProps }) {

  return (
    <RouterLink to={href} {...restOfProps}>
      {children}
    </RouterLink>
  )
}
