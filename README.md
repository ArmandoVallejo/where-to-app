# Where To App

Inserte descripción de la aplicación, del framework y plugins aquí.

## Instalación

Inserte manual de instalación aquí.

## Notas acerca de la navegación para el desarrollador

3 métodos de navegación:

``` tsx
router.push()
router.replace()
router.navigate()
```

- `router.push()`

👉 Agrega una nueva ruta al historial (como un “click en un enlace”).

Guarda la página anterior en el historial.

El usuario puede volver atrás con el botón de “Back”.

Es el comportamiento más común al navegar entre pantallas.

- `router.replace()`

👉 Reemplaza la ruta actual (no se puede volver atrás).

No agrega nada nuevo al historial.

La pantalla anterior se pierde.

Muy útil para redirecciones o pantallas de login/splash.

- `router.navigate()`

👉 Similar a push, pero si ya estás en esa ruta, no hace nada.

Evita abrir la misma pantalla otra vez.

Útil para navegación condicional o cuando no quieres duplicar pantallas en el historial.
