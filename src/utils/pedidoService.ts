import { API_ROUTES } from "./api";

// Tipos de datos basados en tu estructura JSON
export type EstadoPedido = 'Pendiente' | 'Confirmado' | 'Cancelado' | 'Completado';

export interface DetallePedido {
  id: number ; // ID puede ser null si no se ha asignado
  pedido_id: number ; // ID puede ser null si no se ha asignado
  producto: string;
  cantidad: number;
}

export interface Pedido {
  id: number ; // ID puede ser null si no se ha asignado
  user_id: number; // ID puede ser null si no se ha asignado
  tiempo_final: string; // ISO 8601 format
  estado: EstadoPedido;
  detalle_pedido: DetallePedido[]; // TODO: Cambiar a detalles
}

// Cache para pedidos
const pedidosCache: {
  data: Pedido[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de cache

/**
 * Obtiene todos los pedidos del usuario
 */
export const obtenerPedidos = async (token?: string, group?: string): Promise<Pedido[]> => {
  console.log("token", token);
  try {
    console.log("pedidos");
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }

    const json ={
      "id": group
    }
    console.log("json", json);
    const response = await fetch(API_ROUTES.PEDIDOS, {
      method: 'POST',
      body: JSON.stringify(json),
      headers
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los pedidos');
    }
    
    const data: Pedido[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error en obtenerPedidos:', error);
    throw error;
  }
};

/**
 * Obtiene un pedido específico por ID
 */
export const obtenerPedidoPorId = async (id: number, token?: string): Promise<Pedido> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }

    const response = await fetch(`${API_ROUTES.PEDIDOS}/${id}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al obtener el pedido ${id}`);
    }

    const data: Pedido = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en obtenerPedidoPorId (${id}):`, error);
    throw error;
  }
};

/**
 * Crea un nuevo pedido
 */
export const crearPedido = async (detalles: Omit<DetallePedido, 'id' | 'pedido_id'>[], token?: string): Promise<Pedido> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };


    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    } 
    const tiempo_final = new Date().toISOString(); // Fecha y hora actual en formato ISO 8601

    const pedido = {
      tiempo_final,
      estado: 'Pendiente', // Estado inicial del pedido
      productos: detalles.map((detalle) => ({
        ...detalle,
      }))
    };

    const response = await fetch(API_ROUTES.PEDIDOS_CREATE, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...pedido
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el pedido');
    }

    const data: Pedido = await response.json();
    return data;
  } catch (error) {
    console.error('Error en crearPedido:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de un pedido
 */
export const actualizarEstadoPedido = async (id: number, nuevoEstado: EstadoPedido, token?: string): Promise<Pedido> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }

    const response = await fetch(`${API_ROUTES.PEDIDOS}/${id}/estado`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        estado: nuevoEstado
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al actualizar el estado del pedido ${id}`);
    }

    const data: Pedido = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en actualizarEstadoPedido (${id}):`, error);
    throw error;
  }
};

/**
 * Agrega items a un pedido existente
 */
export const agregarItemsAPedido = async (
  pedidoId: number,
  items: Omit<DetallePedido, 'id' | 'pedido_id'>[],
  token?: string
): Promise<Pedido> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }
    const pedido ={
      tiempo_final: new Date().toISOString(), // Fecha y hora actual en formato ISO 8601
      estado: 'Pendiente', // Estado inicial del pedido
      productos: items.map((detalle) => ({
        ...detalle,
      }))
    }

    const response = await fetch(API_ROUTES.PEDIDOS_UPDATE(pedidoId), {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ...pedido
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al agregar items al pedido ${pedidoId}`);
    }

    const data: Pedido = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en agregarItemsAPedido (${pedidoId}):`, error);
    throw error;
  }
};

/**
 * Elimina un pedido
 */
export const eliminarPedido = async (id: number, token?: string): Promise<void> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }

    const response = await fetch(API_ROUTES.PEDIDOS_DELETE(id), {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al eliminar el pedido ${id}`);
    }
  } catch (error) {
    console.error(`Error en eliminarPedido (${id}):`, error);
    throw error;
  }
};

/**
 * Versión con cache de obtenerPedidos
 */
export const obtenerPedidosConCache = async (token?: string): Promise<Pedido[]> => {
  const now = Date.now();
  
  // Si tenemos datos en caché y no han expirado
  if (pedidosCache.data && pedidosCache.timestamp && 
      (now - pedidosCache.timestamp) < CACHE_DURATION) {
    return pedidosCache.data;
  }

  try {
    const data = await obtenerPedidos(token);
    // Actualizamos la caché
    pedidosCache.data = data;
    pedidosCache.timestamp = now;
    return data;
  } catch (error) {
    // Si hay un error pero tenemos datos en caché, los devolvemos
    if (pedidosCache.data) {
      console.warn('Usando datos en caché debido a error:', error);
      return pedidosCache.data;
    }
    throw error;
  }
};

/**
 * Formatea la fecha del pedido para mostrarla en la UI
 */
export const formatearFechaPedido = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Filtra pedidos por estado
 */
export const filtrarPedidosPorEstado = (pedidos: Pedido[], estado: EstadoPedido): Pedido[] => {
  return pedidos.filter(pedido => pedido.estado === estado);
};