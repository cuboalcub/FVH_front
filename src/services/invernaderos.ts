// src/services/authService.ts
import { API_ROUTES } from "./api";
const API_URL = API_ROUTES; // Cambia por tu IP o dominio

export const get_invernadores = async (token?: string ) => {
  try {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }
    console.log( headers);
    
    const response = await fetch(`${API_URL.INVERNADEROS}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los pedidos");
    }

    const data = await response.json();
    return data; // Devuelve el resultado del registro
  } catch (error) {
    throw error;
  }
};

export const get_racks = async (id: string | number, token?: string) => {
  try {

    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }
    console.log( headers);
    
    const response = await fetch(API_ROUTES.RACKS(id), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los pedidos");
    }

    const data = await response.json();
    return data; // Devuelve el resultado del registro
  } catch (error) {
    throw error;
  }
};

export const get_charolas = async (id: string | number, token?: string) => {
  try {

    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }
    console.log( headers);
    
    const response = await fetch(API_ROUTES.CHAROLAS(id), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los pedidos");
    }

    const data = await response.json();
    return data; // Devuelve el resultado del registro
  } catch (error) {
    throw error;
  }
};  

export const patch_pedido = async (token?:string, json?:any) => {
  try {

    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }
    console.log( headers);
    
    const response = await fetch(API_ROUTES.PATCH_PEDIDO, {
      method: "PATCH",
      headers,
      body: JSON.stringify(json)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los pedidos");
    }

    const data = await response.json();
    return data; // Devuelve el resultado del registro
  } catch (error) {
    throw error;
  }
}


export const patch_bandeja = async (token?:string, json?:any) => {
  try {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }
    console.log( headers);
    
    const response = await fetch(API_ROUTES.PATCH_CHAROLA, {
      method: "PATCH",
      headers,
      body: json
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los pedidos");
    }

    const data = await response.json();
    return data; // Devuelve el resultado del registro
  } catch (error) {
    throw error;
  }
}

