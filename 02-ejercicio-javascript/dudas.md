<!-- Aquí puedes poner las dudas de la corrección o del ejercicio -->
## Duda 1. Estoy intentando dejar una estructura de carpetas más o menos correcta y descriptiva. Estaría correcta la que tengo?
## Duda 2. He agrupado todo el js en un mismo archivo llamado empleos.js, donde va toda la lógica relacionada con empleos. Es correcto eso, o es mejor agruparlo por funcionalidad? (archivo js para botones, otro para datos, etc...)
## Duda 3. La página de detalles de oferta está creada, pero no carga los datos dinámicamente. Creo que Midu no pidió eso y no lo he querido intentar por si me adelantaba a futuras clases. Lo comento porque no se si lo vais a revisar en esta lección. Si es así decidmelo y me pongo con ello :D 

---

## Respuestas

Hola Ricardo! Como estas?
Excelente trabajo y muy buenas preguntas!

Vamos respondiendo una por una aquí abajo:

### Duda 1:
La carpeta de `assets` me encantó! Muy bien elegida para el tipo de archivos que hay, y muy bien pensado para separar el código.
En donde si haría cambios es en los archivos `.js`, que está vinculado a tu segunda duda:

### Duda 2:
Está muy bien agrupar funcionalidades y responsabilidades bajo el mismo concepto, sobre todo cuando el proyecto crece y hay muchos módulos. Por ejemplo, podríamos tener este proyecto aún más escalado y una posible estructura de carpetas sería:

```
├── empleos/
│   ├── servicios/
│   │   ├── get-jobs.js
│   │   └── filter-jobs.js
│   └── ui/
│       ├── card.js
│       └── list-of-cards.css
├── usuarios/
│   ├── servicios/
│   │   ├── sign-in.js
│   │   └── sign-up.js
│   └── ui/
│       └── form.js
├── admin/
│   ├── servicios/
│   │   ├── create-job.js
│   │   └── update-job.js
│   └── ui/
│       └── form.js
```

Pero **esto hay que tomarlo con mucha calma y paciencia**, que quiero decir con esto? Que lo mejor es hacer las cosas simples, declarativas, y sin mucha complejidad innecesaria, hasta que el proyecto realmente lo requiera.

En nuestro caso, una estructura compleja no es necesaria y más que simplificar, haría el proyecto más complejo.

Ahora explicado esto, yendo hacia tu duda, lo mejor es separar responsabilidades en el JS. Por lo que lo ideal sería tener la lógica del fetch en el archivo `fetch-data.js`, el de los filtros en `filters.js`, el de aplicar en `apply-button.js` y si quieres hacer la paginación, tener otro archivo `pagination.js` para eso.

Esto hace que podamos trabajar en una sola cosa sin mezclar responsabilidades, lo que facilita el mantenimiento y la lectura del código.

Hay unos errores en el filtrado y se debe a esto, se mezcla el fetch de datos con el filtro, cada vez que hacemos un filtrado, repintamos todos los elementos, por lo que el botón de Aplicar no mantiene su estado.

### Duda 3:

Sobre la revisión, no te preocupes con eso! Céntrate en los puntos del `README.md` y con eso ya es más que suficiente. Luego iremos agregando más ejercicios que tengan que ver con el resto de partes de la aplicación.

---

## Cómo seguir:

Estuvimos haciendo unos cambios en el HTML de `empleos.html` y en tu código de JS. Como comentamos en la **Duda 2**, lo ideal sería que puedas separar la responsabilidad de tu código en archivos más pequeños y específicos.

Algunos tips que te queremos dar para ello:

- Lo primero que debemos ejecutar es el fetch de datos, esto tiene sentido porque tanto el filtrado como el botón de Aplicar funcionan solo si existen elementos. Y sin fetch previo, no hay elementos.
- Con el fetch nos debemos traer todos los elementos y dibujarlos en el DOM. Sin pensar en filtros ni nada. Solo queremos en este punto que los elementos queden pintados.
- Pasamos al filtro, el filtro lo que debe hacer es mostrar/ocultar elementos según los criterios seleccionados, y esto lo hacemos por CSS. No queremos que se eliminen los archivos del DOM
- Por último, el botón de Aplicar. Si lo anterior se hizo bien, podremos dar click a Aplicar y el estado no se borrará. Esto porque no estamos eliminando/creando elementos del DOM, sino que solo lo estamos ocultando/mostrando por CSS.

Luego, si quieres hacer lo de la paginación, más que bienvenido!
De momento intenta hacer esos cambios y luego seguimos con la revisión :)
Cualquier duda nos puedes escribir por este archivo o en Discord por privado, estamos para ayudarte 

Y con calma! Es mucho concepto nuevo, es un desafío complejo y no hay prisa.