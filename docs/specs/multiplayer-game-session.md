# Spec: Sesión de juego multi-jugador

**Estado:** Propuesta
**Fecha:** 2026-08-09
**Alcance:** Escalar la app de una hoja de puntaje individual a una sesión de hasta 4 jugadores manejada por un solo anfitrión en un solo dispositivo.

---

## 1. Historia de usuario

> **Como** anfitrión de una partida de Harmonies,
> **quiero** llevar el puntaje de todos los jugadores de la mesa (hasta 4) desde mi dispositivo,
> **para** hacer el conteo final una sola vez, sin que cada jugador necesite su propio teléfono, y ver quién ganó.

## 2. Fuera de alcance

Se declara explícitamente fuera de alcance para evitar ambigüedad:

- Cuentas de usuario, login o identidad persistente.
- Sincronización entre dispositivos o carga colaborativa (cada jugador desde su teléfono).
- Backend, base de datos o cualquier comunicación de red. La app sigue siendo 100% cliente.
- Historial de partidas anteriores o estadísticas acumuladas.
- Múltiples partidas abiertas en paralelo.
- Cambios en las fórmulas de puntaje existentes (`src/lib/scoring.ts` mantiene su comportamiento).

---

## 3. Modelo de dominio

### 3.1 Tipos nuevos

```ts
// src/types/game-session.type.ts

export type PlayerColor = "teal" | "amber" | "rose" | "violet";

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  sheet: PlayerScoreSheet;
}

export type SessionStatus = "setup" | "scoring" | "finished";

export interface GameSession {
  id: string;
  schemaVersion: number;
  boardSide: BoardSide;
  players: Player[];        // invariante: 1 <= length <= 4
  activePlayerId: string;   // invariante: siempre referencia a un player existente
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
}
```

### 3.2 Cambio en tipos existentes

`boardSide` deja de vivir en la hoja individual y pasa al nivel de sesión, porque en Harmonies todos los jugadores usan el mismo lado del tablero. Modelarlo por jugador permitiría estados inconsistentes que las reglas no admiten.

```ts
// src/types/score-sheet.type.ts

// PlayerScoreSheet = ScoreSheetInput actual SIN boardSide
export interface PlayerScoreSheet {
  trees: TreeScoreInput;
  mountains: MountainScoreInput;
  fieldGroups: number;
  water: WaterScoreInput;
  validBuildings: number;
  animalPoints: number;
  natureSpiritPoints: number;
}
```

`ScoreSheetInput`, `LandscapeBreakdown`, `ScoreBreakdown` y `ValidationIssue` se mantienen; `ScoreSheetInput` queda como alias de compatibilidad o se elimina si no quedan usos.

### 3.3 Impacto en `src/lib/scoring.ts`

Las funciones de puntaje son puras y no cambian su lógica, solo su firma para recibir el lado del tablero por separado:

```ts
export function calculateScore(sheet: PlayerScoreSheet, boardSide: BoardSide): ScoreBreakdown
export function calculateLandscapeBreakdown(sheet: PlayerScoreSheet, boardSide: BoardSide): LandscapeBreakdown
```

`scoreTrees`, `scoreMountains`, `scoreFields`, `scoreWater` y `scoreBuildings` quedan intactas.

### 3.4 Invariantes

| # | Invariante |
|---|---|
| I1 | La sesión tiene entre 1 y 4 jugadores en todo momento. |
| I2 | `activePlayerId` siempre apunta a un jugador existente. Al eliminar el jugador activo, pasa a ser activo el anterior en la lista (o el primero si era el primero). |
| I3 | Los `PlayerColor` asignados son únicos dentro de la sesión. |
| I4 | `boardSide` es único para toda la sesión. |
| I5 | Con `boardSide === "A"`, `water.islandCount` es 0 para todos los jugadores. Con `boardSide === "B"`, `water.longestRiver` es 0 y `water.islandCount >= 1` para todos. |

---

## 4. Comportamiento funcional

### 4.1 Setup de partida

**Cuándo aparece:** al abrir la app sin partida guardada, o al elegir "Nueva partida".

**Contenido:**
- Selector de cantidad de jugadores (1 a 4).
- Campo de nombre por jugador, opcional. Placeholder con el nombre por defecto.
- Selector de lado del tablero (A / B).
- Botón primario "Empezar a puntuar".
- Botón secundario "Empezar rápido": crea inmediatamente 2 jugadores con nombres por defecto y lado A, saltando el formulario.

**Reglas:**
- Nombres por defecto: `Jugador 1` … `Jugador 4`, traducidos según el idioma activo.
- Los nombres vacíos se resuelven al nombre por defecto al confirmar.
- Nombres duplicados están permitidos; el color y la posición los diferencian.
- Al confirmar, `status` pasa a `"scoring"` y el primer jugador queda activo.

### 4.2 Pantalla de puntuación

**Barra de jugadores (sticky, arriba):**
- Una pestaña por jugador con: color, nombre y total en vivo.
- La pestaña activa se distingue con contraste claro, no solo por color (accesibilidad).
- Botón `+` para agregar jugador, visible solo si hay menos de 4.
- En móvil la barra scrollea horizontalmente si no entran las 4 pestañas.

**Formulario:**
- Es el `ScoreSheet` actual, aplicado al jugador activo.
- Cambiar de pestaña reemplaza los valores del formulario por los del jugador seleccionado, sin perder los del anterior.
- El panel de totales muestra el desglose del jugador activo únicamente.

**Controles de cabecera:**
- Selector de lado del tablero: afecta a toda la sesión. Al cambiarlo se aplica la normalización de I5 a **todos** los jugadores, y se pide confirmación si algún jugador ya tiene valores de agua cargados que se perderán.
- Selector de idioma (sin cambios).
- Menú de acciones con: "Reiniciar puntajes de este jugador", "Nueva partida", "Ver resultados".

### 4.3 Gestión de jugadores

| Acción | Comportamiento |
|---|---|
| Agregar | Disponible con menos de 4 jugadores. Crea un jugador con hoja en cero, nombre por defecto según el primer índice libre y el primer color libre. Queda activo automáticamente. |
| Renombrar | Editable en cualquier momento desde la pestaña (tap sobre el nombre) o desde un menú por jugador. |
| Eliminar | Disponible con más de 1 jugador. Pide confirmación explícita indicando que se pierden los puntajes de ese jugador. Aplica I2. |
| Reordenar | Fuera de alcance en esta iteración. |

### 4.4 Reset

Dos acciones distintas, ambas con confirmación:

- **Reiniciar puntajes de este jugador**: pone la hoja del jugador activo en cero, respetando I5 según el lado vigente. No toca a los demás jugadores, ni nombres, ni lado del tablero.
- **Nueva partida**: descarta la sesión completa (incluyendo la persistida), vuelve al setup.

### 4.5 Pantalla de resultados

**Acceso:** manual, desde "Ver resultados". Nunca automático. Se puede volver a la pantalla de puntuación sin perder nada; al volver, `status` regresa a `"scoring"`.

**Contenido:**
- Ranking ordenado por total descendente, con el ganador destacado.
- Tabla comparativa con una fila por categoría (árboles, montañas, campos, agua, edificios, subtotal paisajes, animales, espíritu de la naturaleza, total) y una columna por jugador.
- En móvil la tabla scrollea horizontalmente dentro de su propio contenedor; la columna de categorías queda fija.

**Empates:** los jugadores con el mismo total comparten posición y se marcan explícitamente como empatados (ej. "1º — empate"). **No se aplica ningún criterio de desempate.** El reglamento oficial de Harmonies no fue verificado en este punto; introducir un desempate inventado daría un ganador incorrecto. Si más adelante se confirma la regla oficial, se agrega como cambio acotado al ordenamiento.

### 4.6 Persistencia

- La `GameSession` completa se guarda en `localStorage` bajo la clave `harmonies-points:session`.
- Se escribe con debounce (~300 ms) ante cualquier cambio de estado.
- Al iniciar la app, si existe una sesión guardada, se ofrece **"Continuar partida"** o **"Nueva partida"**. No se restaura en silencio.
  - *Corregido durante la fase 3:* originalmente esta spec excluía las sesiones con `status === "finished"`. Como la pantalla de resultados es reversible ("Volver a puntuar"), descartarlas haría que un refresh estando en resultados perdiera la partida entera. Ahora se ofrece continuar cualquier sesión guardada y se restaura la pantalla en la que estaba.
- `schemaVersion` permite descartar o migrar sesiones de versiones viejas. Ante una versión desconocida o un JSON inválido, se descarta la sesión y se va al setup sin mostrar error técnico.
- Se asume disponibilidad de `localStorage`; si falla (modo privado restrictivo), la app funciona igual pero sin persistencia, sin bloquear el uso.

---

## 5. Arquitectura propuesta

### 5.1 Estado

`useReducer` + Context. No se agregan dependencias: el estado es local a una sola pantalla y no justifica una librería externa.

```
src/state/game-session-reducer.ts   Reducer puro + acciones
src/state/GameSessionProvider.tsx   Context + hidratación/persistencia
src/state/use-game-session.ts       Hook de acceso a sesión y acciones
src/state/use-active-player.ts      Hook del jugador activo: { player, score, updateSheet }
```

**Acciones:**

```ts
type GameSessionAction =
  | { type: "START_SESSION"; players: { name: string }[]; boardSide: BoardSide }
  | { type: "QUICK_START" }
  | { type: "ADD_PLAYER" }
  | { type: "REMOVE_PLAYER"; playerId: string }
  | { type: "RENAME_PLAYER"; playerId: string; name: string }
  | { type: "SET_ACTIVE_PLAYER"; playerId: string }
  | { type: "SET_BOARD_SIDE"; boardSide: BoardSide }
  | { type: "UPDATE_SHEET"; playerId: string; patch: PlayerSheetPatch }
  | { type: "RESET_PLAYER_SCORES"; playerId: string }
  | { type: "SET_STATUS"; status: SessionStatus }
  | { type: "NEW_GAME" }
  | { type: "HYDRATE"; session: GameSession };
```

`UPDATE_SHEET` con un patch tipado reemplaza las ~12 closures inline que hoy viven dentro del JSX de `ScoreSheet.tsx`.

### 5.2 Componentes

`ScoreSheet.tsx` (hoy ~380 líneas mezclando estado, layout y presentación) se parte:

```
src/components/session/GameSetup.tsx        Pantalla de setup
src/components/session/PlayerTabs.tsx       Barra sticky de jugadores
src/components/session/ResumePrompt.tsx     "Continuar partida / Nueva partida"
src/components/session/GameResults.tsx      Ranking + tabla comparativa
src/components/sheet/PlayerScoreSheet.tsx   Formulario del jugador activo
src/components/sheet/LandscapesSection.tsx
src/components/sheet/AnimalsSection.tsx
src/components/sheet/NatureSpiritSection.tsx
src/components/sheet/TotalsPanel.tsx
src/components/ui/Section.tsx               Extraído del actual ScoreSheet
src/components/ui/BoardSideToggle.tsx       Extraído del actual ScoreSheet
src/components/ui/ScoreRow.tsx              Extraído del actual ScoreSheet
```

`src/app/page.tsx` renderiza el provider y despacha según `status`.

### 5.3 i18n

Nuevas claves en `en`, `es` y `fr`:

```
setup.title, setup.playerCount, setup.playerName, setup.start, setup.quickStart
players.defaultName            // con interpolación {{index}}
players.add, players.remove, players.rename
players.removeConfirm
session.resume.title, session.resume.continue, session.resume.new
session.newGameConfirm, session.resetPlayerConfirm
session.boardSideChangeConfirm
results.title, results.winner, results.tie, results.position
results.viewResults, results.backToScoring
results.category, results.player
```

---

## 6. Deuda técnica a resolver en el camino

Estos puntos no son parte de la historia pero se agravan al multiplicarse por 4 jugadores. Se resuelven como parte del trabajo o se documenta explícitamente la decisión de no hacerlo:

1. **`isolatedHeight1/2/3`**: existen en `MountainScoreInput` y `scoreMountains` los resta, pero ningún campo de la UI los setea — siempre valen 0. Decidir entre agregar los inputs o eliminarlos del modelo. Arrastrar un campo muerto a 4 hojas multiplica la confusión.
2. **`PointDashboard` y `PointField`**: no los referencia `page.tsx` ni `ScoreSheet.tsx`. Confirmar que son legacy y eliminarlos antes de refactorizar, o documentar su uso.
3. **Sin tests**: el reducer y las funciones de puntaje son puras y de alto valor. Esta feature es el momento natural para incorporar un runner y cubrirlos.

---

## 7. Plan de implementación por fases

| Fase | Alcance | Entregable verificable |
|---|---|---|
| **1** | Extraer `GameSession`, reducer, context, provider. Partir `ScoreSheet.tsx`. Un solo jugador, UI sin cambios visibles. | La app funciona exactamente igual que hoy, con el estado ya en el reducer. |
| **2** | Setup, `PlayerTabs`, gestión de jugadores, persistencia en `localStorage`, `ResumePrompt`. | Se puede jugar una partida de 4 y sobrevive a un refresh. |
| **3** | `GameResults`: ranking, ganador, empates, tabla comparativa. | Se ve quién ganó al terminar. |
| **4** | Opcional: compartir resultado como imagen o texto, historial de partidas. | — |

La fase 1 es un refactor sin cambio visible, lo que la hace segura de mergear de forma independiente.

---

## 8. Criterios de aceptación

**Setup**
- [ ] Puedo iniciar una partida eligiendo entre 1 y 4 jugadores.
- [ ] Puedo iniciar una partida en 1 tap con "Empezar rápido".
- [ ] Los jugadores sin nombre reciben el nombre por defecto en el idioma activo.

**Puntuación**
- [ ] La barra superior muestra el total en vivo de cada jugador y se actualiza al cargar puntos.
- [ ] Cambiar de jugador conserva los valores del jugador anterior.
- [ ] Puedo volver a un jugador ya cargado y corregir cualquier campo.
- [ ] Cambiar el lado del tablero afecta a los 4 jugadores y pide confirmación si hay datos de agua cargados.
- [ ] Puedo agregar un jugador con la partida empezada, hasta un máximo de 4.
- [ ] Eliminar un jugador pide confirmación y no rompe la app aunque sea el jugador activo.
- [ ] No puedo eliminar al último jugador.

**Reset**
- [ ] "Reiniciar puntajes de este jugador" no afecta a los demás jugadores.
- [ ] "Nueva partida" borra todo, incluida la sesión persistida, y vuelve al setup.

**Persistencia**
- [ ] Tras un refresh, la app ofrece continuar la partida y al aceptar restaura todos los jugadores, sus puntajes, el jugador activo y el lado del tablero.
- [ ] Una sesión guardada corrupta o de otra `schemaVersion` no rompe la app: lleva al setup.

**Resultados**
- [ ] El ranking ordena por total descendente y destaca al ganador.
- [ ] Dos jugadores con el mismo total aparecen en la misma posición, marcados como empate.
- [ ] La tabla comparativa muestra todas las categorías de todos los jugadores.
- [ ] Puedo volver a puntuar desde resultados sin perder datos.

**Transversales**
- [ ] Todos los textos nuevos están traducidos a `en`, `es` y `fr`.
- [ ] La pantalla funciona en móvil sin scroll horizontal del `body`.
- [ ] `pnpm lint` y `pnpm build` pasan sin errores.
