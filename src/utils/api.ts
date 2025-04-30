export const BASE_URL = "https://59fe-148-226-145-93.ngrok-free.app/";

// Endpoints de la API
export const API_ROUTES = {
  LOGIN: `${BASE_URL}user/login`,
  SIGNUP: `${BASE_URL}user/signup`,
  PEDIDOS: {
    LIST: `${BASE_URL}pedidos/`,             // GET
    CREATE: `${BASE_URL}pedidos/create`,     // POST
    UPDATE: (id: number) => `${BASE_URL}pedidos/put/${id}`,   // PUT
    DELETE: (id: number) => `${BASE_URL}pedidos/delete/${id}` // DELETE
  }
};
