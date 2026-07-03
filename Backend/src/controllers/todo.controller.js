import { pool } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const createToDo = asyncHandler( async (req, res, next)=>{
    
    const {title, description, priority} = req.body;
    if(!req.user.id){
        throw new ApiError(401, "Authentication required");
    }
    if(!title?.trim()){
        throw new ApiError(400, "Title is required.");
    }
    let checkPriority = priority;
    if(checkPriority !== "low" && checkPriority !== "medium" && checkPriority !== "high"){
        checkPriority = "medium";
    }


    try {
        const created = await pool.query(
            'insert into todos (title, description, priority, created_by) values ($1, $2, $3, $4) returning * ',
            [title, description, checkPriority, req.user.id]
        );
    
        if(!created.rows.length){
            throw new ApiError(500, "server error encountered during creating todo");
        }
    
       res.status(200).json(
            new ApiResponse(200, created.rows[0], "Todo Created successfully")
       )
    } catch (error) {
        next(error);
    }

})

const readToDo = asyncHandler( async (req, res, next)=>{
    const id = req.user?.id;
    if(!id){
        throw new ApiError(401, "Authentication required");
    }

    try {
        const todos = await pool.query(
            'select * from todos where created_by = $1',
            [req.user.id]
        )
    
        if(!todos.rows.length){
            return res.status(200).json(
                new ApiResponse(200, [] , "create todos")
            )
        }
    
        res.status(200).json(
            new ApiResponse(200, todos.rows, "todos fetched successfully")
        )
    } catch (error) {
        next(error);
    }
})

const getTodo = asyncHandler(async (req, res, next) =>{
     if(!req.user?.id){
        throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;

    if(!id){
        throw new ApiError(400, "todo id is required for updating the todo");
    }
    const todo_id = Number(id);
    try {
        const todo = await pool.query(
            'select * from todos where todo_id = $1 and created_by = $2',
            [todo_id, req.user.id]
        )
    
        if(!todo.rows.length){
            return res.status(404).json(
                new ApiResponse(404, "Todo not found or you are not authenticated")
            )
        }
    
        res.status(200).json(
            new ApiResponse(200, todo.rows[0], "todo fetched successfully")
        )
    } catch (error) {
        next(error);
    }
})

const updateToDo = asyncHandler(async(req, res, next)=>{
    if(!req.user.id){
        throw new ApiError(401, "Authorization Required");
    }
    const { id } = req.params;
    const {title, description, priority} = req.body;

    if(!id){
        throw new ApiError(400, "todo id is required for updating the todo");
    }
    const todo_id = Number(id);
    
    const updates = {};
    if(title != undefined && title.trim() !== "") updates.title = title;
    if(description !== undefined) updates.description = description;
    if(priority !== undefined) updates.priority = priority;

    const keys = Object.keys(updates);
    if(keys.length === 0){
        throw new ApiError(400, "At least one value is required to update");
    }
    try {
        const setClause = keys.map((key, index) => {
            return `${key} = $${index+1}`
        })
        const queryValues = Object.values(updates);
        const todoIdPlaceholder = `$${queryValues.length + 1}`;
        const userIdPlaceholder = `$${queryValues.length + 2}`;

        queryValues.push(todo_id, req.user.id);

        const queryText = `
            update todos
            set ${setClause.join(', ')}
            where todo_id = ${todoIdPlaceholder} and created_by = ${userIdPlaceholder}
            returning *;
            `;

        const result = await pool.query(queryText, queryValues);

        if(result.rows.length===0){
            throw new ApiError(404, "Todo not found or you are not authorized to update it");
        }
    
        res.status(200).json(
            new ApiResponse(200, result.rows[0], "todo updated successfully")
        )
    } catch (error) {
        next(error);
    }
})


const isDone = asyncHandler(async(req, res, next)=>{
    if(!req.user.id){
        throw new ApiError(401, "Authentication required");
    }
    const { id } = req.params;
    const { isDone } = req.body;

    if(!id){
        throw new ApiError(400, "todo id is required to update");
    }
    const todo_id = Number(id);
    if(isDone === null){
        throw new ApiError(400, "isDone required to update");
    }
    try {
        
            const result = await pool.query(
                'update todos set isDone = $1 where todo_id = $2 and created_by = $3 returning * ;',
                [isDone, todo_id, req.user.id]
            )
        
            if(result.rows.length===0){
                throw new ApiError(404, "Todo not found or you are not authorized to update it");
            }
        
            res.status(200).json(
                new ApiResponse(200, result.rows[0], "todo isDone updated successfully")
            )
    } catch (error) {
        next(error);
    }
    
})


const deleteToDo = asyncHandler(async (req, res, next)=>{
    if(!req.user.id){
        throw new ApiError(401, "Authorization required");
    }

    const { id } = req.params;
    if(!id){
        throw new ApiError(400, "todo id is required for deleting todo");
    }
    const todo_id = Number(id);
    try {
        const result = await pool.query(
            'delete from todos where todo_id = $1 and created_by = $2 returning * ',
            [todo_id, req.user.id]
        )
        if(result.rows.length===0){
            throw new ApiError(404, "todo not found or you are not authorized to delet it");
        }
        
        res.status(200).json(
            new ApiResponse(200, result, "Todo deleted successfully")
        )
    } catch (error) {
            next(error);
    }
})

export {createToDo, readToDo, getTodo, updateToDo, isDone, deleteToDo};