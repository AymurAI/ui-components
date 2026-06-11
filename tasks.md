# Plan — Migrar Voz a Texto (desktop-app) a `@aymurai/ui`

> **Objetivo (corregido):** actualizar la feature **voice-to-text** que YA está
> implementada en `desktop-app` para que consuma `@aymurai/ui` en lugar de sus
> primitivos locales `@/components/ui/*`, y alinear el diseño con Figma.
> **No** es crear componentes nuevos ni rehacer pantallas desde cero.
>
> **Repos:**
> - Consumidor: `../desktop-app` · feature en `src/renderer/src/components/voice-to-text/` + rutas `src/renderer/src/routes/app.$feature/*`.
> - Librería: `@aymurai/ui` (este repo). Tarball: `https://github.com/AymurAI/ui-components/releases/download/v0.1.0/aymurai-ui-0.1.0.tgz`.
> **Figma (referencia de diseño):** archivo `2BahKpebYzaccFih0ZB79y` · página 🚀 Screens (`0:1`) · sección **Speech to text WIP** (`40001343:39472`).
>
> **Hallazgo clave (actualizado):** `@aymurai/ui` se portó *desde* los primitivos de
> desktop-app, pero **ya fue alineado a Figma al 100%** (ver
> [`docs/figma-alignment-audit.md`](docs/figma-alignment-audit.md)). Por eso la
> migración **ya no es un drop-in idéntico**: además de repuntar imports, **trae las
> correcciones de diseño** (sombras de focus, border-color en inputs, Switch gris,
> tipografía del Callout, Stepper con estado `complete`, íconos correctos del
> ToolButton, etc.). Son cambios visuales **esperados y deseados**, no regresiones.
>
> ⚠️ Requiere **cortar un release nuevo** (p. ej. `v0.2.0`) para que desktop-app
> consuma la versión alineada (el tarball `v0.1.0` es anterior a la alineación).

---

## 0. Mapa actual de la feature (referencia)

Flujo (stepper 4 pasos): **Selección → Transcripción → Edición → Descarga**

| Paso | Ruta | Componente VTT |
|---|---|---|
| 1 Selección | `app.$feature/onboarding` → `preview` | `voice-to-text/onboarding.tsx`, `preview.tsx` |
| 2 Transcripción | `app.$feature/process` | `voice-to-text/process.tsx` |
| 3 Edición | `app.$feature/validation` | `voice-to-text/validation.tsx` → `transcription-editor/*` |
| 4 Descarga | `app.$feature/finish` | `voice-to-text/finish.tsx` |

Primitivos `@/components/ui/*` usados por la feature: **Button, Card, Switch, Dialog, Callout, BackButton** (+ `Input/Select/Popover/Tooltip/Suggestion/Toast` en sub-componentes del editor).
Componentes propios (se quedan en desktop-app, deben apoyarse en `@aymurai/ui`): `audio-player`, `speaker-avatar`, `file-drop`, `how-it-works`, `stepper`, `transcription-editor/{index,turn-block,speaker-picker,turn-side-panel,selection-toolbar}`.

---

## 1. Setup (una vez)
- [ ] **Cortar release nuevo de `@aymurai/ui`** con la alineación a Figma: bump a
      `0.2.0` en `package.json` → tag `v0.2.0` → la action publica el tarball.
- [ ] Agregar `@aymurai/ui` como dependencia en `desktop-app` (tarball del release **v0.2.0**).
- [ ] Importar el CSS de la librería una vez en el root del renderer (`@aymurai/ui/styles.css`). ⚠️ Validar que **no** colisione con la config Panda local (la lib usa `preflight:false` + prefijo `aym-`, así que debería convivir; verificar especificidad/orden de capas).
- [ ] (Opcional) Importar el preset Panda `@aymurai/ui/preset` para compartir tokens, si se quiere unificar.
- [ ] Decisión de alcance: **A)** repuntar sólo los imports de la feature voice-to-text (duplicación temporal con `@/components/ui/*` para el resto), o **B)** migrar app-wide y borrar `@/components/ui/*`. → **Recomendado A** (menor riesgo); B como follow-up.

---

## 2. Migración de primitivos — **DROP-IN directos**
Repuntar imports de `@/components/ui/X` → `@aymurai/ui` en los archivos de la feature. Sin cambios de props.

- [ ] **`Button`** (`onboarding, preview, process, validation, finish` + rutas) → `@aymurai/ui`. ⚠️ ver §4 (regresiones).
- [ ] **`Card`** (`preview, process, finish`) → idéntico.
- [ ] **`Switch`** (`transcription-editor/index`) → idéntico (sólo fix interno de token).
- [ ] **`Dialog*`** (`how-it-works`) → todos los named exports preservados.
- [ ] **`Callout`** (ruta `process`) → idéntico.
- [ ] **`Select`** (editor/sub-componentes si aplica) → idéntico.
- [ ] **`Popover`** (`speaker-picker`/editor) → idéntico.
- [ ] **`Tooltip`** → idéntico.
- [ ] **`Suggestion`** → idéntico.
- [ ] **`Toast`** → idéntico.

> ⚠️ Ya **no** son ports 1:1: al consumir la lib alineada, estos componentes traen
> los fixes de Figma (§4). Verificar por componente: build + render + comparar contra Figma.

---

## 3. Migración de primitivos — **NEEDS-ADAPTER**
- [ ] **`BackButton`** → `@aymurai/ui` exporta `ButtonLink` (un `<a>` plano, **sin** integración con TanStack Router). El `BackButton` local usa `createLink`. Crear adapter en desktop-app:
      ```tsx
      import { createLink } from '@tanstack/react-router'
      import { ButtonLink } from '@aymurai/ui'
      import { ArrowLeft } from 'phosphor-react'
      const BackButton = createLink((props) => (
        <ButtonLink {...props} iconLeft={<ArrowLeft size={32} />} />
      ))
      ```
      Usado en `onboarding, preview, process, validation`. (Alternativa: agregar `BackButton` con router glue a la lib — follow-up.)
- [ ] **`Input` → `TextField`** (si la feature lo usa en editor/side-panel/picker): renombrar tag `<Input>`→`<TextField>` y repuntar import. Props idénticas, sólo cambia el nombre.

---

## 4. Cambios visuales **esperados** al adoptar la lib (alineación a Figma)
Estos NO son regresiones — son las correcciones de `docs/figma-alignment-audit.md` que la
migración trae. Verificarlos en el flujo, no "arreglarlos".
- [ ] **`Button`**: `sm` ahora `h-8` (32px, era 36px); `tertiary` tiene estilo ghost real (antes stub); focus `:focus-visible` + sombra 8px tokenizada.
- [ ] **`Switch`**: track inactivo ahora **gris** (`action.disabled` #E0DDE2), antes lila (#C5CAFF). Muy visible en el toggle "Modo Edición" del editor.
- [ ] **`Callout`**: tipografía `label.md` (era paragraph.sm), padding 16px, ícono 24px. Afecta el callout "Transcribiendo audio…" de `process`.
- [ ] **`Card`**: sombra de hover corregida (7.5px). Afecta los `Card Tool`/cards del flujo.
- [ ] **`Select`/`TextField`/`Search`**: border-color de focus = `primary-alt` (#110041) + sombra correcta; dropdown de Select con sombra 16px; item `sm` a 14px.
- [ ] **`Tooltip`**: radio 4px (era 8px) + padding + sombra correcta.
- [ ] **`Stepper`** (si se migra al de la lib): pasos completados ahora `complete` = `#3F479D` con número blanco (antes gris). Coincide con el editor.
- [ ] **`ToolButton`** (si aplica): íconos correctos (`Repeat`/`RepeatOnce`/`TrashSimple`/`Backspace` rot.).
- [ ] **CSS de la lib**: confirmar que `@aymurai/ui/styles.css` no pisa estilos del resto de la app (prefijo `aym-`, `preflight:false`).

---

## 5. Componentes propios de la feature — apoyar en `@aymurai/ui` + alinear a Figma
Estos quedan en desktop-app, pero deben (a) construirse sobre primitivos de la lib donde aplique y (b) coincidir con Figma. Comparar cada uno contra su nodo Figma con `get_design_context` antes de tocar.

- [ ] **`stepper.tsx`** vs Figma `173:16638`. La lib ya tiene los 3 estados alineados (`complete` #3F479D blanco / `focus` #C5CAFF+borde / `disabled` gris) → **migrar al `Stepper` de la lib** (API `steps[]` + `current`); evaluar sólo el slot de label por paso.
- [ ] **`speaker-avatar.tsx`** vs Figma `40001422:54714` (círculo 24px, iniciales, bg por locutor). Candidato a **promover `Avatar` a `@aymurai/ui`** (no existe en la lib). Decidir.
- [ ] **`audio-player.tsx`** vs Figma Player `40001482:38874` / editor `40001486:41884` (controles, velocidad dropdown, track, tiempo, slot "Finalizar"). Candidato a **promover `Player` a la lib**. Decidir. Apoyar controles en `BigIconButton` de la lib.
- [ ] **`file-drop.tsx`** vs Figma `40001343:48853` (dropzone, icono FileAudio, formatos). Verificar copy/estados (hover/drag/error).
- [ ] **`how-it-works.tsx`** vs Figma `40002158:43245` (grid 2×2) y modal `40002158:43364`. Usa `Dialog` (ya migrado en §2) + `Button` "Entendido". Verificar ilustraciones y textos i18n.
- [ ] **`process.tsx`** vs Figma `40001343:48816`: barra de progreso/estados, `Callout` info, botón "Detener". La lib tiene `ArchiveProgress` — evaluar si la fila de progreso debería usarlo.
- [ ] **`transcription-editor/turn-block.tsx`** vs Figma `40001426:54619`: avatar+nombre+timestamp+párrafo editable, highlight activo/seleccionado.
- [ ] **`transcription-editor/{speaker-picker,turn-side-panel,selection-toolbar}.tsx`** vs Figma `40001481:54822` (Menu_speakers) y panel lateral. Apoyar en `Popover`/`TextField`/`Button` de la lib.
- [ ] **`finish.tsx`** vs Figma (resumen + descarga). Usa `Card`+`Button` (ya migrados).

---

## 6. Verificación (gate de cierre)
- [ ] `pnpm typecheck` + build del renderer sin errores tras repuntar imports.
- [ ] Correr la app (`pnpm dev:web`) y recorrer el flujo completo Voz a Texto.
- [ ] QA visual pantalla-por-pantalla contra los screenshots de Figma (dashboard, onboarding, file-select vacío/con-archivo, proceso, editor lectura/edición, menú locutores).
- [ ] Diff de comportamiento vs `main` en los puntos de §4.
- [ ] Lint limpio.

---

## 7. Decisiones a confirmar
- [ ] **Alcance**: ¿migrar sólo voice-to-text (A, recomendado) o app-wide borrando `@/components/ui/*` (B)?
- [ ] **`Avatar` / `Player` / `Stepper`**: ¿promoverlos a `@aymurai/ui` ahora (para reusar en otras features) o dejarlos locales en desktop-app por ahora?
- [ ] **`BackButton`**: ¿adapter local con `createLink` (rápido) o agregar `BackButton` router-aware a la lib?
- [ ] **CSS**: ¿se importa `@aymurai/ui/styles.css` global o se confía 100% en el preset Panda compartido?
- [ ] ¿Hay divergencias de diseño Figma↔implementación que quieras corregir como parte de esto, o sólo el swap a `@aymurai/ui` (diseño se mantiene como está)?

---

## Review (completar al cerrar)
- _Pendiente._
