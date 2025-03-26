// src/services/authService.ts
import { API_ROUTES } from "./rutas";
import { BASE_URL } from "./rutas";
const API_URL = API_ROUTES; // Cambia por tu IP o dominio

export const login = async (username: string, password: string) => {
  try {
    console.log("service");
    
    const response = await fetch(`${API_URL.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return data; // Devuelve el token o lo que responda tu backend
  } catch (error) {
    throw error;
  }
};

export const signup = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrarse');
    }

    const data = await response.json();
    return data; // Devuelve el resultado del registro
  } catch (error) {
    throw error;
  }
};
