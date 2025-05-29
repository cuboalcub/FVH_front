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
