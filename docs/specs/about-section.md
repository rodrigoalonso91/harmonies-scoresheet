# Spec: Sección "Acerca de"

**Estado:** Propuesta
**Fecha:** 2026-08-09
**Alcance:** Agregar la atribución del juego y su autoría al cajón de créditos existente, en los tres idiomas.

---

## 1. Historia de usuario

> **Como** jugador que abre la app por primera vez,
> **quiero** ver de quién es el juego y quién hizo esta herramienta,
> **para** entender que es un proyecto de un fan y no algo oficial de la editorial.

## 2. Situación actual

`DeveloperFooter` es un cajón plegable fijo al borde inferior, cerrado por defecto, que se abre con una pestaña (`ChevronUp`). Adentro hay una sola línea con el autor de la app: WhatsApp, mail y el botón de GitHub.

Hoy **no hay ninguna mención al juego ni a sus autores** en toda la app. La única referencia a Harmonies es el logotipo de la cabecera.

## 3. Contenido

Dos frases, cada una con su propia clave de traducción:

1. **Naturaleza del proyecto** — deja claro que es independiente.
2. **Créditos del juego** — diseño, ilustración y edición.

| | Texto |
|---|---|
| **EN** | `about.title`: About<br>`about.independent`: Independent companion project created for Harmonies players.<br>`about.gameCredits`: Harmonies is designed by Johan Benvenuto, illustrated by Maëva Da Silva and published by Libellud. |
| **ES** | `about.title`: Acerca de<br>`about.independent`: Proyecto complementario independiente, creado para los jugadores de Harmonies.<br>`about.gameCredits`: Harmonies es un juego diseñado por Johan Benvenuto, ilustrado por Maëva Da Silva y publicado por Libellud. |
| **FR** | `about.title`: À propos<br>`about.independent`: Projet indépendant, créé pour les joueurs d'Harmonies.<br>`about.gameCredits`: Harmonies est un jeu conçu par Johan Benvenuto, illustré par Maëva Da Silva et édité par Libellud. |

### Decisiones de traducción

- **`édité par`** en francés: es el término habitual para la editorial de un juego de mesa, no `publié par`.
- **`d'Harmonies`** con elisión: la *h* de *harmonie* es muda.
- **Los nombres propios no se traducen ni se transliteran**: Johan Benvenuto, Maëva Da Silva y Libellud quedan idénticos en los tres idiomas.

## 4. Ubicación y comportamiento

```
┌──────────────────────────────────────────┐
│                   ⌃                       │  ← pestaña (sin cambios)
├──────────────────────────────────────────┤
│  ACERCA DE                                │
│  Proyecto complementario independiente,   │
│  creado para los jugadores de Harmonies.  │
│  Harmonies es un juego diseñado por Johan │
│  Benvenuto, ilustrado por Maëva Da Silva  │
│  y publicado por Libellud.                │
│  ──────────────────────────────────────   │
│  App creada por 💬 Rodrigo Alonso ·       │
│  ✉ rodrigoalonso.dev@gmail.com            │
│           [ Colaborar ]                   │
└──────────────────────────────────────────┘
```

| # | Regla |
|---|---|
| R1 | El bloque vive dentro de `DeveloperFooter`, **arriba** de la línea del autor de la app. |
| R2 | La atribución del juego se lee antes que los datos del desarrollador: es lo que aclara que el proyecto no es oficial. |
| R3 | Una línea divisoria separa el bloque nuevo de los créditos del desarrollador. |
| R4 | El cajón sigue **cerrado por defecto**. La sección no aparece sola ni interrumpe la primera partida. |
| R5 | Al estar en el footer global, se ve desde cualquier pantalla: setup, continuar partida, puntuación y resultados. |
| R6 | El encabezado se muestra en mayúsculas y con menos jerarquía visual que el contenido, como etiqueta de sección. |
| R7 | Texto plano: **sin enlaces** a Libellud ni a los autores. |
| R8 | **Sin logos ni imágenes** de la editorial ni del juego en esta sección. |
| R9 | El texto cambia junto con el selector de idioma, como el resto de la app. |

## 5. Arquitectura

Cambios acotados a dos lugares:

```
src/components/DeveloperFooter.tsx        Bloque nuevo antes del <p> del autor
src/i18n/locales/{en,es,fr}/translation.json   Claves about.*
```

No hace falta componente nuevo: son tres elementos de texto dentro del contenedor que ya existe. Si el footer creciera más adelante, ahí sí conviene extraer `AboutSection`.

## 6. Fuera de alcance

- Una pantalla o modal de "Acerca de" separado.
- Enlaces a Libellud, a las redes de los autores o a la ficha del juego.
- Mostrar el aviso de forma proactiva (banner, primera visita, tooltip).
- Una cláusula legal explícita de no afiliación. "Independiente" ya lo transmite; sumar lenguaje legal endurece el tono sin necesidad.
- Versión de la app, licencia o changelog.
- Tocar el logotipo de la cabecera.

## 7. Criterios de aceptación

- [ ] Al abrir el cajón de créditos veo el encabezado "Acerca de" y las dos frases.
- [ ] La atribución del juego aparece arriba de los datos del desarrollador, separada por una línea.
- [ ] El cajón sigue cerrado al cargar la app.
- [ ] La sección se ve con el cajón abierto en las cuatro pantallas (setup, continuar, puntuación, resultados).
- [ ] Cambiar el idioma cambia el encabezado y las dos frases.
- [ ] Johan Benvenuto, Maëva Da Silva y Libellud se escriben igual en los tres idiomas, con sus acentos.
- [ ] No hay enlaces ni imágenes dentro del bloque.
- [ ] En 360 px de ancho el texto envuelve sin desbordar y el cajón no tapa el contenido al abrirse.
- [ ] `pnpm build` pasa.
