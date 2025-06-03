import { API_ROUTES } from './api';

export async function get_users(token: string) {
    const res = await fetch(API_ROUTES.GET_USERS, {
        headers: { Authorization: `JWT ${token}` }
    });

    if (!res.ok) throw new Error('Error al obtener usuarios');

    const json = await res.json();
  
    const users = json.data.map((user: any) => ({
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.is_superuser ? 'Admin' : 'Usuario',
    }));
  
    return users;}

    export async function create_group(token: string, user: { username: string; email: string; role: string }) {
        const res = await fetch(API_ROUTES.ADD_USER_GROUP, {
          method: 'POST',
          headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Error al crear usuario');
        return await res.json();
      }
      

export async function update_user(token: string, id: string, user: { role: string }) {
    const res = await fetch(API_ROUTES.UPDATE_USER_GROUP(id), {
        method: 'PUT',
        headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    return await res.json();
}

export async function delete_user(token: string, id: string) {
    const res = await fetch(API_ROUTES.DELETE_USER_GROUP(id), {
        method: 'DELETE',
        headers: { Authorization: `JWT ${token}` }
    });
    return res.ok;
}
