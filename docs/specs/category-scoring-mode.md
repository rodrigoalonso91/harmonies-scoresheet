# Spec: Modo de carga por categoría

**Estado:** Propuesta
**Fecha:** 2026-08-09
**Alcance:** Agregar un segundo modo de puntuación que recorre categorías cargando a todos los jugadores en cada paso, conviviendo con el modo actual por jugador.

---

## 1. Historia de usuario

> **Como** anfitrión que puntúa al final de la partida con los tableros de todos a la vista,
> **quiero** cargar una categoría para los cuatro jugadores y recién después pasar a la siguiente,
> **para** contar lo mismo en todos los tableros de una sola pasada, sin cambiar de jugador doce veces.

## 2. Situación actual

La pantalla de puntuación (`GameSessionScreen`) muestra `PlayerTabs` y, debajo, el `PlayerScoreSheet` del jugador activo: las tres secciones (`LandscapesSection`, `AnimalsSection`, `NatureSpiritSection`) más el `TotalsPanel`. El anfitrión carga los 11 campos de un jugador y recién ahí cambia de pestaña.

Todo el estado ya está centralizado en `GameSession`, y `UPDATE_SHEET` recibe un `playerId` explícito, así que escribir en cualquier jugador desde cualquier pantalla ya es posible sin tocar el reducer.

## 3. Los dos modos

| | **Por jugador** (actual) | **Por categoría** (nuevo) |
|---|---|---|
| Eje principal | Un jugador, sus 11 campos | Una categoría, todos los jugadores |
| Navegación | Pestañas de jugador | Pasos con Anterior / Siguiente |
| Totales | Desglose completo del jugador activo | Total general de cada jugador, en su fila |

Los dos editan exactamente la misma `GameSession`. Cambiar de modo no transforma ni migra nada.

## 4. Los pasos

### 4.1 Definición

Cada paso es **un campo concreto**, no un grupo de fichas. Son **11** y siguen el orden actual de la hoja:

| # | Paso | Ficha |
|---|---|---|
| 1 | Árboles solo verdes | grass |
| 2 | Árboles marrón + verde | grass |
| 3 | Árboles 2 marrón + verde | grass |
| 4 | Montañas de altura 1 | mountain |
| 5 | Montañas de altura 2 | mountain |
| 6 | Montañas de altura 3 | mountain |
| 7 | Grupos de campos | field |
| 8 | Edificios válidos | building |
| 9 | Agua | water |
| 10 | Puntos de animales | animal |
| 11 | Puntos del espíritu | spirit |

### 4.2 El paso de agua

El paso 9 resuelve su campo según `session.boardSide`: **Río más largo** en Lado A, **Cantidad de islas** en Lado B (con `min = 1`). Nunca muestra los dos. Si el lado cambia estando en ese paso, el campo se reemplaza en el momento y el índice del paso no se mueve.

### 4.3 Reutilización de textos

Cada paso reutiliza las claves de traducción que ya usan los campos actuales (`landscapes.trees.greenOnly.label`, etc.). No se duplican textos.

## 5. Pantalla del modo por categoría

```
┌──────────────────────────────────────────┐
│  ● ● ● ● ● ● ● ● ◉ ● ●    Paso 9 de 11   │  ← tira de pasos, saltable
├──────────────────────────────────────────┤
│            (ficha de agua)                │
│  Río más largo                            │
│  Solo Lado A. Puntúa 0, 2, 5, 8, 11, 15… │
│                                           │
│  ● Ana          [ − ][  4  ][ + ]    40   │
│  ● Beto         [ − ][  2  ][ + ]    25   │
│  ● Jugador 3    [ − ][  0  ][ + ]    25   │
│  ● Dani         [ − ][  1  ][ + ]    11   │
│                                           │
│  [ Anterior ]              [ Siguiente ]  │
└──────────────────────────────────────────┘
```

### 5.1 Reglas

| # | Regla |
|---|---|
| R1 | La cabecera del paso muestra la ficha, el nombre de la categoría y su texto de ayuda una sola vez, no repetido por jugador. |
| R2 | Hay una fila por jugador, en el orden de la mesa, con su punto de color, su nombre resuelto y el campo numérico con las flechas de `NumberField`. |
| R3 | Cada fila muestra a la derecha el **total general** de ese jugador, actualizado al instante. |
| R4 | La tira de pasos permite saltar a cualquier paso directamente. No es un wizard que obligue a completar en orden. |
| R5 | "Anterior" está deshabilitado en el paso 1. |
| R6 | En el paso 11 el botón principal deja de ser "Siguiente" y pasa a ser **"Ver resultados"**, que lleva a `GameResults` igual que el botón de la cabecera. |
| R7 | El indicador textual "Paso N de 11" acompaña siempre a la tira. |
| R8 | En este modo no se muestran `PlayerTabs` ni `TotalsPanel`: no hay jugador activo. |

### 5.2 Selector de modo

Un toggle en la cabecera, al lado del selector de lado del tablero: **Por jugador | Por categoría**. Cambiar de modo es inmediato y no pide confirmación, porque no destruye nada.

## 6. Modelo y persistencia

Dos campos nuevos en `GameSession`:

```ts
export type ScoringMode = "by-player" | "by-category";

interface GameSession {
  // …
  scoringMode: ScoringMode;   // por defecto "by-player"
  activeStepIndex: number;    // 0..10, por defecto 0
}
```

- Ambos se persisten con la sesión, igual que `activePlayerId`. Un refresh devuelve al anfitrión al mismo modo y al mismo paso.
- **No se sube `schemaVersion`.** Son campos aditivos con default: una sesión guardada de antes de esta feature se sigue considerando válida y se hidrata como `"by-player"` / paso `0`. Subir la versión descartaría partidas en curso sin necesidad.
- `activeStepIndex` se recorta a `[0, 10]` al hidratar, por si llega un valor fuera de rango.

Acciones nuevas del reducer de sesión:

```
| { type: "SET_SCORING_MODE"; mode: ScoringMode }
| { type: "SET_ACTIVE_STEP"; index: number }
```

## 7. Arquitectura propuesta

```
src/lib/scoring-steps.ts                        Definición de los 11 pasos (pura)
src/components/category/CategoryScoringView.tsx Pantalla del modo
src/components/category/StepNavigator.tsx       Tira de pasos + Anterior/Siguiente
src/components/category/PlayerStepRow.tsx       Fila jugador + campo + total
src/components/ui/ScoringModeToggle.tsx         Selector de modo
```

`GameSessionScreen` queda como shell: cabecera + selector, y debajo `PlayerTabs` + `PlayerScoreSheet` o `CategoryScoringView` según el modo.

Cada paso se describe con accesores para no repetir lógica de lectura/escritura:

```ts
export interface ScoringStep {
  id: string;
  token: TokenKind;
  labelKey: string;
  helpKey?: string;
  min: number;
  read: (sheet: PlayerScoreSheet) => number;
  write: (value: number) => PlayerScoreSheetPatch;
}

export function getScoringSteps(boardSide: BoardSide): ScoringStep[];
```

Así la vista no conoce la forma de `PlayerScoreSheet` y agregar un campo en el futuro es una entrada más en el array.

## 8. i18n

Claves nuevas en `en`, `es` y `fr`:

```
scoringMode.label, scoringMode.byPlayer, scoringMode.byCategory
steps.progress          // "Paso {{current}} de {{total}}"
steps.previous, steps.next
steps.water             // título neutro del paso 9 en la tira
steps.goToStep          // etiqueta accesible de cada punto de la tira
```

Los nombres de categoría y las ayudas se reutilizan de las claves existentes.

## 9. Fuera de alcance

- Reordenar los pasos o dejar que el anfitrión los configure.
- Saltear pasos automáticamente porque estén en cero.
- Un modo mixto o un tercer modo.
- Cambiar el modelo de puntaje, el rango de los campos o el comportamiento de `NumberField`.
- Elegir el modo desde el setup: se elige durante la puntuación.

## 10. Criterios de aceptación

- [ ] La cabecera de puntuación ofrece elegir entre "Por jugador" y "Por categoría".
- [ ] En modo por categoría veo un paso a la vez, con la ficha, el nombre y la ayuda de esa categoría.
- [ ] Cada jugador tiene su propio campo en el paso, con las flechas − / +.
- [ ] Cargar un valor actualiza el total de ese jugador en su fila, al instante.
- [ ] "Siguiente" avanza y "Anterior" retrocede; "Anterior" está deshabilitado en el paso 1.
- [ ] Puedo saltar directo a cualquier paso desde la tira, sin pasar por los intermedios.
- [ ] En el paso 11 el botón principal es "Ver resultados" y abre la pantalla de resultados.
- [ ] En Lado A el paso 9 pide el río; en Lado B pide las islas y no deja bajar de 1.
- [ ] Cambiar de lado estando en el paso 9 reemplaza el campo sin moverme de paso.
- [ ] Alterno entre los dos modos y ningún valor cargado se pierde, en ninguna dirección.
- [ ] Tras un refresh vuelvo al mismo modo y al mismo paso.
- [ ] Una partida guardada de antes de esta feature se sigue pudiendo continuar, y arranca en modo por jugador.
- [ ] Con 4 jugadores la pantalla entra en móvil sin scroll horizontal del `body`.
- [ ] Todos los textos nuevos están en los tres idiomas.
- [ ] `pnpm build` pasa.
