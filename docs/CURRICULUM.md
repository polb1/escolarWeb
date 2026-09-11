# Auditoría curricular

Este documento describe la correspondencia entre el contenido de la app y los **saberes básicos oficiales** de la normativa educativa vigente.

## Fuente normativa

### España
- **Real Decreto 157/2022**, de 1 de marzo, por el que se establecen la ordenación y las enseñanzas mínimas de la Educación Primaria.
- Publicado en el **BOE núm. 52, de 2 de marzo de 2022** (pp. 24386 y siguientes).
- Los saberes básicos de cada área se recogen en el **ANEXO II** y se organizan por **ciclos** (1º ciclo = 1º + 2º).

### Cataluña
- **Decret 175/2022**, de 27 de setembre, d'ordenació dels ensenyaments de l'educació bàsica.
- Publicat al **DOGC núm. 8762, de 29.9.2022**.
- La estructura catalana usa **Cicle Inicial** (1r + 2n), **Cicle Mitjà** (3r + 4t) y **Cicle Superior** (5è + 6è).
- **Estado**: mapeo completado para Matemàtiques, Llengua Catalana i Coneixement del Medi (cicle inicial).

## Mapeo — Matemáticas (primer ciclo)

Basado en RD 157/2022, ANEXO II, área de Matemáticas, **Primer ciclo, Saberes básicos** (pp. 24491-24493).

| Bloque | Código | Contenido oficial (abreviado) |
|---|---|---|
| A. Sentido numérico | RD.MAT.A.1 | Estrategias de conteo hasta 999 |
| A. Sentido numérico | RD.MAT.A.2 | Cantidad: lectura, representación y descomposición de números naturales hasta 999 |
| A. Sentido numérico | RD.MAT.A.3 | Sentido de las operaciones: cálculo mental. Suma y resta con flexibilidad y sentido |
| A. Sentido numérico | RD.MAT.A.4 | Relaciones: sistema decimal hasta 999. Comparación y ordenación. Relaciones suma↔resta |
| A. Sentido numérico | RD.MAT.A.5 | Educación financiera: monedas y billetes de euro |
| B. Sentido de la medida | RD.MAT.B.1 | Magnitud: longitud, masa, capacidad. Tiempo (año, mes, semana, día, hora) |
| C. Sentido espacial | RD.MAT.C.1 | Figuras geométricas 2D. Vocabulario básico |

### Topics de la app cubiertos

| Topic | Etiquetas | Justificación |
|---|---|---|
| `math.addition` | RD.MAT.A.3 + A.4 | Suma con flexibilidad, relaciones suma↔resta |
| `math.subtraction` | RD.MAT.A.3 + A.4 | Resta con flexibilidad, relaciones suma↔resta |
| `math.comparison` | RD.MAT.A.4 | Comparación y ordenación de números naturales |
| `math.ordering` | RD.MAT.A.4 | Comparación y ordenación de números naturales |

### Nota importante: multiplicación

El topic `math.multiplication` **NO** figura como saber básico del primer ciclo en el RD 157/2022. Aparece por primera vez en el **segundo ciclo**: *"Construcción de las tablas de multiplicar apoyándose en número de veces, suma repetida o disposición en cuadrículas"* (p. 24495).

La app la ofrece como **introducción opcional** para alumnos con dominio previo de suma y resta. En el UI no se marca como saber básico oficial del ciclo actual.

## Mapeo — Lengua Castellana

Basado en RD 157/2022, ANEXO II, área de Lengua Castellana y Literatura.

Los saberes básicos del área se organizan en cuatro bloques (A. Las lenguas y sus hablantes / B. Comunicación / C. Educación literaria / D. Reflexión sobre la lengua). Los topics activos de la app se mapean así:

| Topic | Etiquetas | Justificación |
|---|---|---|
| `spanish.synonyms` | RD.LCL.D.vocab | Bloque D — *"Procedimientos básicos de adquisición de vocabulario. Mecanismos léxicos básicos para la formación de palabras"* |
| `spanish.antonyms` | RD.LCL.D.vocab | Bloque D — mismo saber |

## Mapeo — Decret 175/2022 (Cataluña, cicle inicial)

Basado en Annex 2 del Decret 175/2022 (DOGC núm. 8762, pp. 138-142 del PDF descargado).

### Matemàtiques (cicle inicial, 1r i 2n)

| Bloc | Código | Contenido oficial (abreviado) |
|---|---|---|
| Sentit numèric | DEC.MAT.SNUM.SO | Sentit de les operacions: suma i resta amb flexibilitat. Càlcul mental fins 199 |
| Sentit numèric | DEC.MAT.SNUM.REL | Relacions: comparació i ordenació. Relacions suma↔resta |

**Diferencia importante detectada** — el Decret catalán acota el rango de números del cicle inicial a **199**, mientras el RD estatal usa **999**. La app ofrece hasta el nivel 5 con rangos superiores; se documenta esta divergencia y en Cataluña se recomienda mantenerse en niveles 1-2 (que no exceden 199). Un futuro toggle "modo currículum catalán estricto" podría limitar la selección de dificultad automáticamente.

Otras diferencias detectadas:
- El Decret catalán introduce **=, ≠, <, >** en cicle inicial. El RD estatal solo introduce **=, ≠**.
- Billetes de euro en cicle inicial: **1, 2, 5, 10, 20, 50** (RD estatal añade 100).

### Llengua Catalana i Literatura (cicle inicial)

| Bloc | Código | Contenido oficial (abreviado) |
|---|---|---|
| Reflexió sobre la llengua | DEC.LCA.REF.paraules | Relacions formals, semàntiques i sintàctiques entre paraules |
| Comunicació oral | DEC.LCA.COO.vocab | Contingut: tema, fórmules fixes, lèxic |

### Coneixement del Medi Natural, Social i Cultural (cicle inicial)

| Bloc | Código | Contenido oficial (abreviado) |
|---|---|---|
| Cultura científica > La vida al nostre planeta | DEC.CMN.CC.vida | Anàlisi de les adaptacions dels éssers vius a l'hàbitat i classificació |
| Cultura científica > La vida al nostre planeta | DEC.CMN.CC.cos | Funcions vitals de l'ésser humà i hàbits saludables |

## Trabajo pendiente

- **Inglés** (Lengua Extranjera del RD 157/2022 — vocabulario básico, saludos).
- **Juegos** (memoria) — al ser transversales, se documentarán como refuerzo, no como saberes autónomos.

## Cómo se muestra al usuario

Cada pantalla `SessionStart` (antes de empezar una sesión con selector de dificultad) muestra un **desplegable "📘 Currículo oficial"** con los códigos oficiales y el texto literal del saber básico, más la referencia de la fuente. Está pensado como transparencia para adultos (profesores, padres), no como material didáctico para el niño.

## Cómo añadir una nueva etiqueta curricular

1. Añade la entrada al catálogo en `src/data/curriculum.ts` (mapa `CURRICULUM_TAGS`) con el texto literal y la fuente.
2. Añade el sessionId al mapa `SESSION_CURRICULUM` con los códigos correspondientes.
3. En el generador o el contenido estático, añade el campo `curriculum: [...]` a la spec producida.
4. Documenta el mapeo en este archivo.

## Advertencia

Este mapeo es una **interpretación pedagógica propia** basada en la lectura literal del BOE. No es una certificación oficial. Cualquier centro educativo que quiera usar la app en su currículo debe validar el mapeo contra su propia programación didáctica.
