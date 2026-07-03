import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    todos: []
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action)=>{
            const todo = action.payload;
            state.todos.push(todo);
        },
        removeTodo: (state, action)=>{
            state.todos = state.todos.filter((todo) => todo.todo_id !== action.payload)
        }
    }
})

export const {addTodo, removeTodo} = todoSlice.actions

export default todoSlice.reducers