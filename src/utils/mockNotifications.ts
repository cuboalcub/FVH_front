// utils/mockNotifications.ts
export const generateMockNotifications = () => {
  return [
    {
      id: '1',
      title: 'Bienvenido al sistema',
      body: 'Tu registro se completó exitosamente',
      date: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      title: 'Recordatorio importante',
      body: 'Tu invernadero necesita mantenimiento',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
      read: true
    },
    {
      id: '3',
      title: 'Alerta de temperatura',
      body: 'La temperatura ha excedido los límites',
      date: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
      read: false
    }
  ];
};