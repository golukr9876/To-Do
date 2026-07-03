import React from 'react'
import { useNavigate } from 'react-router-dom'
import TodoForm from './TodoForm';
import { deleteTodo } from '../api/todoApi';

function Todo({todoData, handleTodoDelete, handleIsdone}) {
    const navigate = useNavigate();

    const formatRelativeTime = (dateString) => {
      if (!dateString) return "Just now";
      
      const created = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - created) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return "Yesterday";
      return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

  return !todoData?.isdone ? (
    <div className="group flex items-center justify-between p-5 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4">
              <input
               type="checkbox"
               checked={todoData.isdone}
               onChange={()=> handleIsdone(todoData.todo_id, !todoData.isdone)}
                className="mt-1 w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer" />
              <div>
                <h4 className="text-base font-semibold text-gray-800">{todoData.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{todoData.description}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                    {formatRelativeTime(todoData?.created_at)}
                  </span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between h-full space-y-4">
              
              <div className={`flex items-center gap-1.5 px-2.5 py-1 ${(todoData.priority === "high") ? 'bg-red-50 border-red-100' : (todoData.priority === "medium") ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'} rounded-full border `}>
                <span className={`w-2 h-2 rounded-full ${(todoData.priority === "high") ? 'bg-red-500' : (todoData.priority === "medium") ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                <span
                 className={`text-xs font-medium  ${(todoData.priority === "high") ? 'text-red-700' : (todoData.priority === "medium") ? 'text-yellow-600' : 'text-green-700'}`}>
                    {/* {(todoData.priority === "high") ? "High" : (todoData.priority === "medium") ? "Medium" : "Low"} */}
                    {todoData.priority==='high' && "High"}
                    {todoData.priority==='medium' && "Medium"}
                    {todoData.priority==='low' && "Low"}
                    </span>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                onClick={()=> navigate(`/updatetodo/${todoData.todo_id}`)}
                className="text-gray-400 hover:text-emerald-600 cursor-pointer">✏️</button>
                <button
                onClick={()=>{handleTodoDelete(todoData.todo_id)}}
                 className="text-gray-400 hover:text-red-500 cursor-pointer">🗑️</button>
              </div>
            </div>
    </div>
  ) : ( 
    <div className="flex items-center justify-between p-5 bg-white/40 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm opacity-60">
        <div className="flex items-center gap-4">
        <input
         type="checkbox"
          defaultChecked
          disabled
           className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer" />
        <div>
            <h4 className="text-base font-semibold text-gray-500 line-through">{todoData.title}</h4>
        </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full border border-green-100">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="text-xs font-medium text-emerald-700">Done</span>
        </div>
    </div>

  )
}

export default Todo
