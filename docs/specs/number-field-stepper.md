# Spec: Stepper con flechas en los campos de puntaje

**Estado:** Propuesta
**Fecha:** 2026-08-09
**Alcance:** Convertir `NumberField` en un control con flechas de −1 / +1 en los extremos, conservando la edición por teclado.

---

## 1. Historia de usuario

> **Como** anfitrión cargando puntajes con el tablero en la mesa,
> **quiero** poder sumar o restar de a uno con flechas a los costados del campo,
> **para** no tener que abrir el teclado por cada ajuste chico — pero conservando la escritura directa cuando el número es alto.

## 2. Situación actual

`src/components/NumberField.tsx` es un `<label>` que envuelve el texto de la etiqueta, la ayuda opcional y un `<input type="number">`. Tiene:

- Estado local `draft` (string) sincronizado con la prop `value` vía `useEffect`.
- `onFocus` selecciona todo el contenido.
- `onChange` emite solo si el valor parseado está dentro de `[min, max]`.
- `onBlur` hace *commit*: vacío → `min`; si no, recorta al rango.
- Defaults `min = 0`, `max = 150`.

Se usa en 12 campos: 3 de árboles, 3 de montañas, campos, edificios, río, islas, animales y espíritu.

## 3. Comportamiento objetivo

### 3.1 Disposición

Un único control horizontal: **[ − ] [ valor ] [ + ]**. La etiqueta y el texto de ayuda quedan arriba, como hoy.

```
┌──────────────────────────────────┐
│ Árboles solo verdes              │
│ Cada árbol de una sola ficha…    │
│ ┌────┬──────────────────┬────┐   │
│ │ −  │        4         │ +  │   │
│ └────┴──────────────────┴────┘   │
└──────────────────────────────────┘
```

El número queda centrado. El control ocupa el mismo ancho que el input actual, para no alterar la grilla de dos columnas de `TokenGroup`.

### 3.2 Reglas

| # | Regla |
|---|---|
| R1 | Cada toque de flecha cambia el valor en **1**. No hay paso grande. |
| R2 | Las flechas operan sobre el **valor confirmado** (la prop `value`), no sobre el borrador que se esté tipeando. |
| R3 | `−` se deshabilita cuando `value <= min`; `+` se deshabilita cuando `value >= max`. El estado deshabilitado es visible, no solo inerte. |
| R4 | **No hay auto-repetición** al mantener presionado. Un toque, un cambio. Para saltos grandes está el teclado. |
| R5 | Si el campo está deshabilitado (`disabled`), las dos flechas también lo están. |
| R6 | El input central conserva el comportamiento actual: se puede escribir, se selecciona todo al recibir foco, y al salir recorta al rango. |
| R7 | Se ocultan los spinners nativos del `input type=number` para no tener dos controles de incremento en el mismo campo. |
| R8 | El rango no cambia: `min = 0` / `max = 150` por defecto, e islas del Lado B con `min = 1`. |

### 3.3 Estados visuales

- **Normal**: flechas con fondo neutro, contraste suficiente sobre blanco.
- **Deshabilitada por límite** (R3): atenuada y sin respuesta al hover.
- **Campo deshabilitado** (R5): todo el control atenuado, igual que hoy hace el campo completo.

### 3.4 Táctil y accesibilidad

- Área de toque mínima de **44×44 px** en cada flecha (el input hoy mide 44 px de alto, así que las flechas acompañan esa altura).
- Cada flecha es un `<button type="button">` con etiqueta accesible propia que **nombra el campo**: "Aumentar árboles solo verdes" / "Disminuir árboles solo verdes". Sin eso, un lector de pantalla anuncia doce pares de botones idénticos.
- Las flechas quedan en el orden natural de tabulación, después del input.

## 4. Notas de implementación

### 4.1 El `<label>` no puede envolver las flechas

Hoy todo el componente es un `<label>`. Si los `<button>` quedan dentro, al tocarlos el navegador además dispara el comportamiento de la etiqueta y enfoca el input, abriendo el teclado en móvil — exactamente lo que la feature quiere evitar.

La estructura pasa a ser un contenedor `<div>` con un `<label htmlFor>` explícito sobre el texto, y las flechas como hermanas del input, fuera de la etiqueta.

### 4.2 Ocultar los spinners nativos

En `src/app/globals.css`:

```css
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
}
```

### 4.3 API del componente

La firma pública de `NumberField` **no cambia**: `label`, `value`, `onChange`, `help?`, `disabled?`, `min?`, `max?`, `className?`. Los 12 usos existentes siguen funcionando sin tocarlos.

El incremento se calcula internamente:

```ts
const step = (delta: number) => onChange(Math.min(max, Math.max(min, value + delta)));
```

### 4.4 i18n

Dos claves nuevas en `en`, `es` y `fr`, con interpolación del nombre del campo:

```
numberField.increase   // "Increase {{label}}" / "Aumentar {{label}}" / "Augmenter {{label}}"
numberField.decrease   // "Decrease {{label}}" / "Disminuir {{label}}" / "Diminuer {{label}}"
```

`NumberField` pasa a necesitar `useTranslation`, por lo que se mantiene como componente cliente.

## 5. Fuera de alcance

- Paso grande (±5 / ±10) o auto-repetición al mantener presionado.
- Gestos de arrastre o rueda del mouse para cambiar el valor.
- Cambiar el rango, la validación o el momento de *commit* del input.
- Modificar el resto de los inputs de la app que no son de puntaje (nombres de jugador en el setup y en las pestañas).

## 6. Criterios de aceptación

- [ ] Los 12 campos de puntaje muestran flechas − y + en los extremos.
- [ ] Tocar `+` sube el valor en 1 y el total del panel se actualiza al instante.
- [ ] Tocar `−` baja el valor en 1.
- [ ] Con el valor en `min`, la flecha `−` está deshabilitada; con el valor en `max`, lo está la `+`.
- [ ] En el campo de islas del Lado B, `−` se deshabilita en 1, no en 0.
- [ ] Con el campo deshabilitado por el lado del tablero, ambas flechas están deshabilitadas.
- [ ] Tocar el número abre el teclado y permite escribir; al salir el valor se recorta al rango.
- [ ] Tocar una flecha **no** enfoca el input ni abre el teclado en móvil.
- [ ] No se ven los spinners nativos del navegador en ningún campo.
- [ ] Cada flecha se anuncia nombrando su campo, en el idioma activo.
- [ ] El layout de dos columnas de `TokenGroup` se mantiene sin desbordes en móvil.
- [ ] `pnpm build` pasa.
