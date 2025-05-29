import * as Notifications from 'expo-notifications';

// Configuración del manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  /**
   * Programa una notificación local con el tipado correcto
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    delaySeconds: number = 2
  ): Promise<void> {
    try {
      // Validación de parámetros
      if (typeof delaySeconds !== 'number' || delaySeconds <= 0) {
        throw new Error('delaySeconds debe ser un número mayor a 0');
      }

      // SOLUCIÓN CORRECTA - Tipado exacto
      const trigger: Notifications.TimeIntervalTriggerInput = {
        type: 'timeInterval', // Tipo literal correcto
        seconds: delaySeconds,
        repeats: false // Opcional, por defecto false
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger,
      });

      console.log('Notificación programada correctamente');
    } catch (error) {
      console.error('Error al programar notificación:', error);
      throw new Error(`No se pudo programar la notificación: ${error.message}`);
    }
  },

};