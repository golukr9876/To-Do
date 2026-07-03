import api from "./axios";

export const getAllTodos = async () => {
  return await api.get("/todos");
};

export const getTodo = async (id) => {
  console.log("at todo api ", id)
  return await api.get(`/todos/${id}`);
};

export const createTodo = async (data) => {
  return await api.post("/todos", data);
};

export const updateTodo = async ( id, data ) => {
  return await api.put(`/todos/${id}`, data);
};

export const deleteTodo = async (id) => {
  return await api.delete(`/todos/${id}`);
};

export const toggleTodo = async ( id, flag ) => {
  return await api.patch(`/todos/${id}/done`, {isDone: flag});
};
