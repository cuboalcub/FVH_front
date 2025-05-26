export const BASE_URL = "https://6b0p61tb-8000.usw3.devtunnels.ms/";

// Endpoints de la API
export const API_ROUTES = {
  LOGIN: `${BASE_URL}user/login`,
  SIGNUP: `${BASE_URL}user/singup`,
  CHECK_TOKEN: `${BASE_URL}user/validate_token`,
  GET_USERS: `${BASE_URL}user/get_group`,
  
  CREATE_GRUPO: `${BASE_URL}user/create_group`,
  ADD_USER_GROUP: `${BASE_URL}user/add_user_group`,
  DELETE_USER_GROUP: (id: string | number) => `${BASE_URL}user/delete_user_group/${id}`,
  UPDATE_USER_GROUP: (id: string | number) => `${BASE_URL}user/update_user/${id}`,
  GET_GRUPOS: `${BASE_URL}user/get_groups`,

  PEDIDOS: `${BASE_URL}pedido/`,
  PEDIDOS_CREATE: `${BASE_URL}pedido/create`,
  PEDIDOS_UPDATE: (id: string | number) => `${BASE_URL}pedido/put/${id}`,
  PEDIDOS_DELETE: (id: string | number) => `${BASE_URL}pedido/delete/${id}`,

  INVERNADEROS: `${BASE_URL}invernadero/`,
  
  RACKS: (id: string | number) => `${BASE_URL}invernadero/racks/${id}`,

  CHAROLAS: (id: string | number) => `${BASE_URL}invernadero/bandejas/${id}`,

  SENSORES: (id: string) => `${BASE_URL}mqtt/get_topic_s/${id}`,
  ACTUADORES: (id: string) => `${BASE_URL}mqtt/get_topic_a/${id}`,

  PATCH_PEDIDO: `${BASE_URL}pedido/charola`,

  PATCH_CHAROLA: `${BASE_URL}invernadero/bandejas/peso_semilla`
};      