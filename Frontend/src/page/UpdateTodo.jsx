import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTodo } from '../api/todoApi';
import { Container, TodoForm } from '../components';

const UpdateTodo = () => {
    const {slug} = useParams();
    const [todo, setTodo] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect( ()=>{
        setError("");
        try{
            if(slug){
                getTodo(slug)
                .then(response=> response.data)
                .then(data => setTodo(data))
                .catch(error => setError(error))
            } else {
                navigate('/');
            }
        }
        catch(error){
            setError(error);
        }
        
    }, [])
  return todo? (
        <TodoForm todo={todo} />
  ) : null
}

export default UpdateTodo
