# Auditoría curricular

Este documento describe la correspondencia entre el contenido de la app y los **saberes básicos oficiales** de la normativa educativa vigente.

## Fuente normativa

### España
- **Real Decreto 157/2022**, de 1 de marzo, por el que se establecen la ordenación y las enseñanzas mínimas de la Educación Primaria.
- Publicado en el **BOE núm. 52, de 2 de marzo de 2022** (pp. 24386 y siguientes).
- Los saberes básicos de cada área se recogen en el **ANEXO II** y se organizan por **ciclos** (1º ciclo = 1º + 2º).

### Cataluña
- **Decret 175/2022**, de 27 de setembre, d'ordenació dels ensenyaments de l'educació bàsica.
- La estructura catalana usa **Cicle Inicial** (1r + 2n), **Cicle Mitjà** (3r + 4t) y **Cicle Superior** (5è + 6è).
- **Estado**: mapeo pendiente. Ver sección "Trabajo pendiente" abajo.

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

## Trabajo pendiente

Los siguientes contenidos de la app **no** están aún etiquetados contra normativa oficial:

- **Inglés** (Lengua Extranjera del RD 157/2022 — vocabulario básico, saludos).
- **Català** (Decret 175/2022 — Cicle Inicial, àrea de Llengua Catalana i Literatura).
- **Coneixement del Medi** (Decret 175/2022 — àmbit de Coneixement del Medi Natural / Social).
- **Juegos** (memoria) — al ser transversales, se documentarán como refuerzo, no como saberes autónomos.

Estos contenidos siguen etiquetados internamente como *borrador pedagógico* hasta que se realice el mapeo formal con las fuentes correspondientes.

## Cómo se muestra al usuario

Cada pantalla `SessionStart` (antes de empezar una sesión con selector de dificultad) muestra un **desplegable "📘 Currículo oficial"** con los códigos oficiales y el texto literal del saber básico, más la referencia de la fuente. Está pensado como transparencia para adultos (profesores, padres), no como material didáctico para el niño.

## Cómo añadir una nueva etiqueta curricular

1. Añade la entrada al catálogo en `src/data/curriculum.ts` (mapa `CURRICULUM_TAGS`) con el texto literal y la fuente.
2. Añade el sessionId al mapa `SESSION_CURRICULUM` con los códigos correspondientes.
3. En el generador o el contenido estático, añade el campo `curriculum: [...]` a la spec producida.
4. Documenta el mapeo en este archivo.

## Advertencia

Este mapeo es una **interpretación pedagógica propia** basada en la lectura literal del BOE. No es una certificación oficial. Cualquier centro educativo que quiera usar la app en su currículo debe validar el mapeo contra su propia programación didáctica.
