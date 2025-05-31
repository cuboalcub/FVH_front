import { API_ROUTES } from "./api";

const API_URL = API_ROUTES;

export const get_sensor_topics = async (greenhouseId: string, token?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }

    const response = await fetch(API_URL.SENSORES(greenhouseId), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los sensores");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const get_actuator_topics = async (greenhouseId: string, token?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }

    const response = await fetch(API_URL.ACTUADORES(greenhouseId), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los actuadores");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const post_actuator_mode_change = async (
  topic: string,
  state: string,
  token?: string
) => {
  console.log(token);
  
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `JWT ${token}`;
    }

    const response = await fetch(`${API_URL.ACTUADORES_LOG}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        topic,
        state,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al enviar el cambio de modo");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};


