/**
 * Mapeo de topics de la app a saberes básicos oficiales del
 * Real Decreto 157/2022, ANEXO II — Educación Primaria, PRIMER CICLO.
 *
 * Nomenclatura utilizada: RD.<AREA>.<BLOQUE>.<APARTADO>
 *   RD.MAT.A.1  = Matemáticas, Sentido numérico, Conteo
 *   RD.MAT.A.2  = Matemáticas, Sentido numérico, Cantidad
 *   RD.MAT.A.3  = Matemáticas, Sentido numérico, Sentido de las operaciones
 *   RD.MAT.A.4  = Matemáticas, Sentido numérico, Relaciones
 *   RD.MAT.A.5  = Matemáticas, Sentido numérico, Educación financiera
 *   RD.MAT.B.1  = Matemáticas, Sentido de la medida, Magnitud
 *   RD.MAT.C.1  = Matemáticas, Sentido espacial, Figuras geométricas
 *   RD.LCL.A    = Lengua Castellana, Las lenguas y sus hablantes
 *   RD.LCL.D    = Lengua Castellana, Reflexión sobre la lengua (vocabulario)
 *   RD.CMN.*    = Conocimiento del Medio Natural, Social y Cultural (pendiente)
 *
 * IMPORTANTE — límite honesto:
 *   El RD 157/2022 organiza los saberes básicos por CICLO, pero la asignación
 *   fina de cada actividad a un saber concreto es una interpretación pedagógica
 *   propia, no una certificación oficial. La parte catalana (Decret 175/2022)
 *   está pendiente de mapeo formal.
 *
 *   Multiplicación NO aparece como saber básico del primer ciclo en el RD 157/2022
 *   — aparece por primera vez en el segundo ciclo ("Construcción de las tablas de
 *   multiplicar apoyándose en número de veces, suma repetida…"). Se ofrece en la
 *   app como INTRODUCCIÓN opcional pensada para alumnos que ya dominan suma/resta.
 */

export interface CurriculumTag {
  code: string;
  /** Fuente normativa. */
  source: 'RD-157-2022' | 'Decret-175-2022';
  /** Ciclo al que pertenece este saber en la fuente. */
  cycle: 1 | 2 | 3;
  /** Texto literal (abreviado) del saber básico. */
  text: string;
}

/**
 * Catálogo de saberes básicos citados en la app. Fuente literal de referencia.
 * Añadir aquí cada saber que un topic mapee, con su texto tal como aparece en
 * el BOE (abreviado si es muy largo — la referencia oficial siempre prevalece).
 */
export const CURRICULUM_TAGS: Record<string, CurriculumTag> = {
  'RD.MAT.A.1': {
    code: 'RD.MAT.A.1',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Estrategias variadas de conteo y recuento sistemático en situaciones de la vida cotidiana en cantidades hasta el 999.'
  },
  'RD.MAT.A.2': {
    code: 'RD.MAT.A.2',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Cantidad: estimaciones razonadas; lectura, representación, composición, descomposición y recomposición de números naturales hasta 999.'
  },
  'RD.MAT.A.3': {
    code: 'RD.MAT.A.3',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Sentido de las operaciones: estrategias de cálculo mental con números naturales hasta 999. Suma y resta resueltas con flexibilidad y sentido.'
  },
  'RD.MAT.A.4': {
    code: 'RD.MAT.A.4',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Relaciones: sistema de numeración de base diez hasta 999. Números naturales en contextos de la vida cotidiana: comparación y ordenación. Relaciones entre suma y resta.'
  },
  'RD.MAT.A.5': {
    code: 'RD.MAT.A.5',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Educación financiera: sistema monetario europeo — monedas (1, 2 euros) y billetes de euro (5, 10, 20, 50 y 100), valor y equivalencia.'
  },
  'RD.MAT.B.1': {
    code: 'RD.MAT.B.1',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Sentido de la medida: magnitud — longitud, masa, capacidad, distancias y tiempos. Unidades convencionales (metro, kilo, litro). Unidades de tiempo (año, mes, semana, día y hora).'
  },
  'RD.MAT.C.1': {
    code: 'RD.MAT.C.1',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Sentido espacial: figuras geométricas sencillas de dos dimensiones — identificación y clasificación. Vocabulario geométrico básico.'
  },
  'RD.LCL.D.vocab': {
    code: 'RD.LCL.D.vocab',
    source: 'RD-157-2022',
    cycle: 1,
    text: 'Reflexión sobre la lengua: procedimientos básicos de adquisición de vocabulario. Mecanismos léxicos básicos para la formación de palabras.'
  },

  // ─────────── Decret 175/2022 (Cataluña) — Cicle inicial (1r i 2n) ───────────

  'DEC.MAT.SNUM.SO': {
    code: 'DEC.MAT.SNUM.SO',
    source: 'Decret-175-2022',
    cycle: 1,
    text: 'Sentit numèric — Sentit de les operacions: pràctica de la suma i la resta de nombres naturals amb flexibilitat i sentit en situacions contextualitzades. Càlcul mental amb nombres naturals fins al 199.'
  },
  'DEC.MAT.SNUM.REL': {
    code: 'DEC.MAT.SNUM.REL',
    source: 'Decret-175-2022',
    cycle: 1,
    text: 'Sentit numèric — Relacions: comparació i ordenació dels nombres naturals en contextos de la vida quotidiana. Identificació de les relacions entre la suma i la resta.'
  },
  'DEC.LCA.REF.paraules': {
    code: 'DEC.LCA.REF.paraules',
    source: 'Decret-175-2022',
    cycle: 1,
    text: 'Reflexió sobre la llengua: identificació de diferents relacions formals, semàntiques i sintàctiques entre les paraules en la lectura i en les diferents produccions escrites.'
  },
  'DEC.LCA.COO.vocab': {
    code: 'DEC.LCA.COO.vocab',
    source: 'Decret-175-2022',
    cycle: 1,
    text: 'Comunicació oral — Identificació d\'elements bàsics de contingut (tema, fórmules fixes, lèxic) i forma en les produccions orals de la vida quotidiana.'
  },
  'DEC.CMN.CC.vida': {
    code: 'DEC.CMN.CC.vida',
    source: 'Decret-175-2022',
    cycle: 1,
    text: 'Cultura científica — La vida al nostre planeta: anàlisi de les adaptacions dels éssers vius a l\'hàbitat per tal de classificar-los segons les característiques observables.'
  },
  'DEC.CMN.CC.cos': {
    code: 'DEC.CMN.CC.cos',
    source: 'Decret-175-2022',
    cycle: 1,
    text: 'Cultura científica — La vida al nostre planeta: comprensió de les funcions vitals dels éssers vius i identificació d\'hàbits saludables relacionats amb el benestar físic de l\'ésser humà.'
  }
};

/** Mapeo de sessionId de la app a lista de códigos curriculares. */
export const SESSION_CURRICULUM: Record<string, string[]> = {
  // Matemáticas — primer ciclo (RD + Decret catalán)
  'math.addition': ['RD.MAT.A.3', 'RD.MAT.A.4', 'DEC.MAT.SNUM.SO'],
  'math.subtraction': ['RD.MAT.A.3', 'RD.MAT.A.4', 'DEC.MAT.SNUM.SO'],
  'math.comparison': ['RD.MAT.A.4', 'DEC.MAT.SNUM.REL'],
  'math.ordering': ['RD.MAT.A.4', 'DEC.MAT.SNUM.REL'],
  // Multiplicación es un avance sobre saberes de segundo ciclo — no se etiqueta como saber básico de primer ciclo.
  'math.multiplication': [],

  // Castellano
  'spanish.synonyms': ['RD.LCL.D.vocab'],
  'spanish.antonyms': ['RD.LCL.D.vocab'],

  // Català — cicle inicial (Decret 175/2022)
  'catalan.sinonims': ['DEC.LCA.REF.paraules'],
  'catalan.animals': ['DEC.LCA.COO.vocab'],

  // Coneixement del Medi — cicle inicial
  'science.animals': ['DEC.CMN.CC.vida'],
  'science.body': ['DEC.CMN.CC.cos'],

  // Inglés y juegos siguen sin auditar en esta iteración.
};

/** Devuelve las etiquetas curriculares completas para una sesión. */
export function getCurriculumFor(sessionId: string): CurriculumTag[] {
  const codes = SESSION_CURRICULUM[sessionId] ?? [];
  return codes.map((c) => CURRICULUM_TAGS[c]).filter((t): t is CurriculumTag => !!t);
}
