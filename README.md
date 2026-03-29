# Harmonies Points

Aplicación web construida con Next.js 16 para llevar la cuenta de puntos de una partida de **Harmonies**. El prototipo está centrado en una planilla de puntaje manual: el usuario carga cantidades y subtotales, y la app calcula el desglose final entre paisajes, animales y cartas de Nature's Spirit.

## Estado actual

Hoy el proyecto implementa una única pantalla de scoring en `src/app/page.tsx` con estas capacidades:

- Selección de lado del tablero `A` o `B`.
- Cálculo de paisajes por categoría:
  - árboles
  - montañas
  - campos
  - edificios
  - agua
- Carga manual del total de puntos de cartas de animales.
- Carga manual del total de puntos de cartas de Nature's Spirit.
- Cálculo separado de:
  - subtotal de paisajes
  - subtotal de animales
  - subtotal de Nature's Spirit
  - puntaje total
- Reinicio rápido de la planilla manteniendo el lado del tablero seleccionado.

## Reglas de dominio reflejadas

El prototipo ya contempla parte de las reglas de puntuación del juego:

- `Side A` puntúa el río más largo.
- `Side B` puntúa cantidad de islas.
- Árboles:
  - verde solo = 1 punto
  - marrón + verde = 3 puntos
  - 2 marrones + verde = 5 puntos
- Montañas:
  - altura 1 = 1 punto
  - altura 2 = 3 puntos
  - altura 3 = 7 puntos
- Campos: cada grupo válido suma 5 puntos.
- Edificios válidos: cada uno suma 5 puntos.
- El puntaje de paisajes se mantiene separado del puntaje de animales y Nature's Spirit.

La lógica principal vive en [src/lib/scoring.ts](src/lib/scoring.ts).

## Stack

- Next.js 16
- React 19
- TypeScript estricto
- Tailwind CSS 4
- ESLint 9

## Estructura del proyecto

```text
src/
  app/          App Router y estilos globales
  components/   UI reutilizable de la planilla
  lib/          lógica de scoring y estado inicial
  types/        tipos de dominio y contratos de puntaje
  assets/       imágenes de fichas y branding
public/         assets públicos
```

Componentes y módulos principales:

- [src/components/ScoreSheet.tsx](/Users/rodrigoalonso/Documents/projects/harmonies-points/src/components/ScoreSheet.tsx): pantalla principal de carga y resumen.
- [src/components/NumberField.tsx](/Users/rodrigoalonso/Documents/projects/harmonies-points/src/components/NumberField.tsx): input numérico reutilizable.
- [src/lib/scoring.ts](/Users/rodrigoalonso/Documents/projects/harmonies-points/src/lib/scoring.ts): funciones puras de cálculo.
- [src/lib/initial-scoring-input.ts](/Users/rodrigoalonso/Documents/projects/harmonies-points/src/lib/initial-scoring-input.ts): estado inicial del formulario.
- [src/types/score-sheet.type.ts](/Users/rodrigoalonso/Documents/projects/harmonies-points/src/types/score-sheet.type.ts): tipos principales de entrada y salida.

## Desarrollo

Instalación:

```bash
pnpm install
```

Servidor de desarrollo:

```bash
pnpm dev
```

Abrir en `http://localhost:3000`.

Build de producción:

```bash
pnpm build
```

Servidor de producción:

```bash
pnpm start
```

Lint:

```bash
pnpm lint
```

## Convenciones del repositorio

- Usar `pnpm`.
- Preferir imports con alias `@/*`.
- Mantener nombres de dominio explícitos como `TokenKind`, `AnimalCard` o `HabitatPattern`.
- Preservar la separación entre puntaje de paisajes y puntaje de cartas.
- Si se amplía la lógica del juego, alinearla con las reglas oficiales de Harmonies.
