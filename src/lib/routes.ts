import type { AppLanguage } from '@/i18n';

/**
 * Mapeo de rutas por idioma. Los IDs internos (math.addition, science.body...)
 * no se traducen porque son claves programáticas; solo se traducen los
 * segmentos base de la URL para que el usuario vea rutas en su idioma.
 */
const SEGMENTS = {
  subject: { es: 'asignatura', ca: 'assignatura' },
  start: { es: 'empezar', ca: 'comencar' },
  play: { es: 'jugar', ca: 'jugar' },
  progress: { es: 'progreso', ca: 'progres' },
  achievements: { es: 'logros', ca: 'assoliments' },
  games: { es: 'juegos', ca: 'jocs' },
  profile: { es: 'perfil', ca: 'perfil' },
  settings: { es: 'ajustes', ca: 'ajustos' }
} as const;

export type RouteName = keyof typeof SEGMENTS;
export type RouteArg = string | number;

/**
 * Todas las traducciones para una ruta, útil para registrar rutas en el router.
 */
export function allPatternsFor(name: RouteName): string[] {
  const seg = SEGMENTS[name];
  const langs = Object.values(seg);
  // Deduplicamos (algunos segmentos son iguales en ES y CA, como "jugar" o "perfil").
  return Array.from(new Set(langs));
}

/**
 * Devuelve el path para una ruta en el idioma dado.
 * Ejemplo: `path('subject', 'es', 'math')` → `/asignatura/math`
 */
export function path(name: RouteName, lang: AppLanguage, ...args: RouteArg[]): string {
  const seg = SEGMENTS[name][lang];
  if (args.length === 0) return `/${seg}`;
  return `/${seg}/${args.join('/')}`;
}

/** Detecta la lengua a partir de una ruta actual — útil al cambiar de idioma. */
export function detectLangFromPath(pathname: string): AppLanguage | null {
  const first = pathname.split('/')[1] ?? '';
  for (const [, translations] of Object.entries(SEGMENTS)) {
    if (translations.es === first && translations.ca !== first) return 'es';
    if (translations.ca === first && translations.es !== first) return 'ca';
  }
  return null;
}

/**
 * Convierte una ruta del idioma A al idioma B intentando preservar el resto.
 * Útil para que al cambiar de idioma el usuario no se quede en una ruta rota.
 */
export function translatePath(pathname: string, from: AppLanguage, to: AppLanguage): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  const first = parts[0]!;
  for (const [name, translations] of Object.entries(SEGMENTS) as [
    RouteName,
    (typeof SEGMENTS)[RouteName]
  ][]) {
    if (translations[from] === first) {
      const rest = parts.slice(1);
      return path(name, to, ...rest);
    }
  }
  return pathname;
}
