export const estadosConfig = {
  programada: {
    titulo: 'PROGRAMADAS',
    color: 'from-blue-600 to-blue-800',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  en_proceso: {
    titulo: 'EN PROCESO',
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-300'
  },
  completada: {
    titulo: 'COMPLETADAS',
    color: 'from-green-600 to-green-800',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300'
  }
};

export const estadosValidos = {
  programada: 'programada',
  en_proceso: 'en_proceso',
  completada: 'completada'
};