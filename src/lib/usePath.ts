import { useTranslation } from 'react-i18next';
import { path, type RouteArg, type RouteName } from './routes';
import type { AppLanguage } from '@/i18n';

/** Hook que produce paths localizados según el idioma i18n activo. */
export function usePath() {
  const { i18n } = useTranslation();
  const lang: AppLanguage = i18n.language.startsWith('ca') ? 'ca' : 'es';
  return (name: RouteName, ...args: RouteArg[]) => path(name, lang, ...args);
}
