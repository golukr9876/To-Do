import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { createTodo, updateTodo } from '../api/todoApi';

const TodoForm = ({ todo }) => {
  const {register, handleSubmit, setValue, getValues} = useForm({
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      priority: todo?.priority || "medium",
    }
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (data) => {
    setError("");
    try{
      console.log("hereee");
      let response;
      if(todo){
        console.log("at todoform ", data);
        response = await updateTodo(todo.todo_id, data);
      }
      else{
         response = await createTodo(data);
      }
      console.log(response);
       if(response) navigate('/');
    } catch(error){
      console.log("during create todo",error);
      setError(error);
    }
   
  }

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-md transition-opacity">
      
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 overflow-hidden">
        
        {/* Subtle background glow for the modal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {todo ? "Update Task" : "Create New Task"}
              </h2>
            <p className="text-sm text-gray-500 mt-1">
             {todo? "What do you need to update?" : "What do you need to get done?" }
              </p>
          </div>
          {/* Close Button */}
          <button
          onClick={()=> navigate('/')}
           className="p-2 text-gray-400 bg-gray-50/50 hover:bg-gray-100 rounded-full hover:text-gray-600 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(submit)}
        className="space-y-5 relative z-10">
          
          {/* Task Title (Required) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., Prepare quarterly report" 
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-400 shadow-sm"
              {...register("title", { required: true})}
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <label className=" text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
              <span>Description</span>
              <span className="text-xs font-normal text-gray-400">Optional</span>
            </label>
            <textarea 
              rows="3" 
              placeholder="Add any extra details or notes here..." 
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-400 shadow-sm resize-none"
              {...register("description")}
            ></textarea>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-gray-700 cursor-pointer"
                defaultValue="Medium"
                {...register("priority", {required: true})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100/60 mt-6">
            <button 
              type="button" 
              onClick={()=> navigate('/')}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 text-sm font-medium text-white rounded-xl bg-linear-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {todo? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default TodoForm
