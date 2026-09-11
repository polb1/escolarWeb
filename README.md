# EstudiaWeb

Plataforma educativa interactiva para niños de 2º de Primaria (7-8 años), pensada para el sistema educativo español y con soporte de primera clase para catalán.

**Filosofía**: *que aprender sea tan fácil y divertido como jugar*.

---

## Empezar

```bash
npm install
npm run dev          # dev server en http://localhost:5173
npm test             # tests unitarios (Vitest)
npm run build        # bundle de producción (PWA incluida)
```

Requiere Node 20+.

## Qué hay ahora

- 🏠 **Home** con las 5 asignaturas y misión del día.
- 🔢 **Matemáticas**: sumas, restas, multiplicaciones (tablas 2/5/10), comparar y ordenar.
- 🇬🇧 **Inglés básico**: colores, animales y números.
- 🎮 **Juegos**: memoria de animales, colores y números.
- ⭐ **Progreso**: XP, estrellas, racha diaria, gráfica semanal.
- 🏆 **Logros**: 8 badges declarativos.
- 🧒 **Perfil editable** con avatar y apodo.
- 🌐 **i18n** español ↔ catalán, cambiable en caliente.
- ♿ **Accesibilidad**: `prefers-reduced-motion`, tamaño de letra ajustable, foco visible.
- 📱 **PWA instalable** con precache offline.

Todo el progreso vive **solo en el navegador** (IndexedDB via Dexie). No hay backend, no se envía nada a ningún servidor, no hay publicidad ni tracking.

## Arquitectura

```
UI (React)
  Home · SubjectView · LevelMap · ExercisePlayer · ProfilePage · SettingsPage

Exercise Engine
  registry · renderers · validators · adaptatividad
    tipos: multiple_choice · math_operation · matching
           image_selection · ordering · memory

Content Layer
  generadores procedurales (mates)
  contenido estático (inglés, juegos)

Progress
  Zustand store · Dexie · racha · XP · estrellas por sesión
```

## Añadir contenido

**Un nuevo topic procedural** (matemáticas):
1. Crea `src/engine/generators/<topic>.ts` con `generate(params)` puro y determinista por seed.
2. Añade una entrada al mapa `SESSIONS` en `src/features/exercise-player/sessions.ts`.
3. Añade el topic a `TOPICS_BY_SUBJECT` en `src/features/subjects/SubjectView.tsx`.
4. Añade las claves i18n en `src/i18n/locales/{es,ca}/common.json`.
5. Añade tests de propiedad en `tests/engine/`.

**Un nuevo tipo de ejercicio**:
1. Añade el discriminante a `ExerciseType` y la `Spec` correspondiente en `src/engine/types.ts`.
2. Crea el renderer en `src/engine/renderers/<Type>.tsx` respetando `RendererProps<Spec>`.
3. Regístralo en `src/engine/registry.tsx`.

**Contenido estático** (inglés, juegos): archivos TS en `src/content/<subject>/<topic>.ts` que exportan `MultipleChoiceSpec[]` u otro tipo.

## Sobre currículo

**Matemáticas (primer ciclo)** y **Lengua Castellana (vocabulario)** están auditadas contra el **Real Decreto 157/2022, ANEXO II**. El mapeo se documenta en [docs/CURRICULUM.md](docs/CURRICULUM.md), con:
- Los códigos oficiales de cada saber básico usados en la app (`RD.MAT.A.3`, `RD.LCL.D.vocab`, ...).
- La justificación de cada topic contra el saber básico correspondiente.
- Nota importante: **`math.multiplication`** no está en primer ciclo del RD; se ofrece como introducción opcional.

Cada `ExerciseSpec` cubierta lleva `curriculum: [...]` con los códigos. La pantalla previa a cada sesión muestra un desplegable "📘 Currículo oficial" con el texto literal del BOE — transparencia para adultos.

**Pendiente**: Inglés, Català, Medi, Juegos. La parte catalana se auditará contra el **Decret 175/2022**.

## Licencia

Pendiente. El código y contenido son originales — no se copian personajes, marcas ni recursos de terceros.
