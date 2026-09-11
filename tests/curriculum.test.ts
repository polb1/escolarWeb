import { describe, expect, it } from 'vitest';
import { CURRICULUM_TAGS, SESSION_CURRICULUM, getCurriculumFor } from '@/data/curriculum';
import { generateAddition } from '@/engine/generators/addition';
import { generateSubtraction } from '@/engine/generators/subtraction';
import { generateComparison } from '@/engine/generators/comparison';
import { generateOrdering } from '@/engine/generators/ordering';
import { buildSinonimsSet } from '@/content/catalan/sinonims';
import { buildAnimalsCatalanSet } from '@/content/catalan/vocabulari';
import { buildAnimalCategoriesSet } from '@/content/science/animals';
import { buildBodyPartsSet } from '@/content/science/body';

/**
 * Estos tests protegen contra dos regresiones:
 *   1. Que un código citado en SESSION_CURRICULUM no exista en el catálogo.
 *   2. Que un topic auditado deje de producir specs con `curriculum` poblado.
 */

describe('curriculum mapping', () => {
  it('todos los códigos referenciados existen en el catálogo', () => {
    for (const [sessionId, codes] of Object.entries(SESSION_CURRICULUM)) {
      for (const code of codes) {
        expect(CURRICULUM_TAGS[code], `${sessionId} referencia ${code} que no existe`).toBeDefined();
      }
    }
  });

  it('las entradas del catálogo tienen fuente conocida y ciclo válido', () => {
    for (const [code, tag] of Object.entries(CURRICULUM_TAGS)) {
      expect(tag.code, `${code} debería igualarse a su clave`).toBe(code);
      expect(['RD-157-2022', 'Decret-175-2022']).toContain(tag.source);
      expect([1, 2, 3]).toContain(tag.cycle);
      expect(tag.text.length).toBeGreaterThan(20);
    }
  });

  it('generadores de math.addition emiten los códigos declarados', () => {
    const spec = generateAddition({ difficulty: 1, seed: 42 });
    expect(spec.curriculum).toEqual(expect.arrayContaining(SESSION_CURRICULUM['math.addition']!));
  });

  it('generadores de math.subtraction emiten los códigos declarados', () => {
    const spec = generateSubtraction({ difficulty: 1, seed: 7 });
    expect(spec.curriculum).toEqual(expect.arrayContaining(SESSION_CURRICULUM['math.subtraction']!));
  });

  it('generadores de math.comparison emiten los códigos declarados', () => {
    const spec = generateComparison({ difficulty: 1, seed: 3 });
    expect(spec.curriculum).toEqual(expect.arrayContaining(SESSION_CURRICULUM['math.comparison']!));
  });

  it('generadores de math.ordering emiten los códigos declarados', () => {
    const spec = generateOrdering({ difficulty: 1, seed: 5 });
    expect(spec.curriculum).toEqual(expect.arrayContaining(SESSION_CURRICULUM['math.ordering']!));
  });

  it('getCurriculumFor devuelve tags completos para una sesión conocida', () => {
    const tags = getCurriculumFor('math.addition');
    expect(tags.length).toBeGreaterThan(0);
    for (const t of tags) {
      expect(['RD-157-2022', 'Decret-175-2022']).toContain(t.source);
      expect(t.cycle).toBe(1);
    }
  });

  it('devuelve lista vacía para una sesión no auditada', () => {
    expect(getCurriculumFor('english.colours')).toEqual([]);
    expect(getCurriculumFor('math.multiplication')).toEqual([]);
  });

  it('catalan.sinonims emite etiqueta del Decret 175/2022', () => {
    const specs = buildSinonimsSet();
    expect(specs[0]!.curriculum).toEqual(['DEC.LCA.REF.paraules']);
  });

  it('catalan.animals emite etiqueta del Decret 175/2022', () => {
    const specs = buildAnimalsCatalanSet();
    expect(specs[0]!.curriculum).toEqual(['DEC.LCA.COO.vocab']);
  });

  it('science.animals emite etiqueta de coneixement del medi', () => {
    const specs = buildAnimalCategoriesSet();
    expect(specs[0]!.curriculum).toEqual(['DEC.CMN.CC.vida']);
  });

  it('science.body emite etiqueta de coneixement del medi (cos humà)', () => {
    const specs = buildBodyPartsSet();
    expect(specs[0]!.curriculum).toEqual(['DEC.CMN.CC.cos']);
  });

  it('generadores de mates emiten ambas fuentes (RD estatal + Decret catalán)', () => {
    const specs = [
      generateAddition({ difficulty: 1, seed: 1 }),
      generateSubtraction({ difficulty: 1, seed: 2 }),
      generateComparison({ difficulty: 1, seed: 3 }),
      generateOrdering({ difficulty: 1, seed: 4 })
    ];
    for (const spec of specs) {
      const codes = spec.curriculum ?? [];
      const hasRD = codes.some((c) => c.startsWith('RD.'));
      const hasDecret = codes.some((c) => c.startsWith('DEC.'));
      expect(hasRD, `${spec.id} debería citar el RD estatal`).toBe(true);
      expect(hasDecret, `${spec.id} debería citar el Decret catalán`).toBe(true);
    }
  });
});
