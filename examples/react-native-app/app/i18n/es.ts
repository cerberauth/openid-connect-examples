import { Translations } from './en'

const es: Translations = {
  common: {
    ok: 'OK',
    cancel: 'Cancelar',
    back: 'Volver',
  },
  errorScreen: {
    title: '¡Algo salió mal!',
    friendlySubtitle:
      'Esta es la pantalla que verán tus usuarios en producción cuando haya un error. Vas a querer personalizar este mensaje (que está ubicado en `app/i18n/es.ts`) y probablemente también su diseño (`app/screens/ErrorScreen`). Si quieres eliminarlo completamente, revisa `app/app.tsx` y el componente <ErrorBoundary>.',
    reset: 'REINICIA LA APP',
  },
  emptyStateComponent: {
    generic: {
      heading: 'Muy vacío... muy triste',
      content:
        'No se han encontrado datos por el momento. Intenta darle clic en el botón para refrescar o recargar la app.',
      button: 'Intentemos de nuevo',
    },
  },
}

export default es
