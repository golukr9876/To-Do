import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteTodo, getAllTodos, toggleTodo } from "../api/todoApi";
import { useEffect, useState, useMemo } from "react";
import { Todo } from "./index";
const Dashboard = () => {
  const [todos, setTodos] = useState([]);

  const totalTask = todos.length;
  const completedTask = useMemo(
    () => todos.filter((t) => t.isdone).length,
    [todos],
  );
  const pendingTask = totalTask - completedTask;
  const completionPercentage =
    totalTask === 0 ? '-' : Math.floor((completedTask / totalTask) * 100).toString() + '%';

  const [error, setError] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [searchValue, setSearchvalue] = useState("");

  useEffect(() => {
    setError("");
    getAllTodos()
      .then((res) => setTodos(res.data))
      .catch((error) => {
        setError(error.message);
        console.log("error while getting all todos", error);
      });
  }, []);

  const handleTodoDelete = async (id) => {
    await deleteTodo(id);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.todo_id != id));
  };

  const handleIsdone = async (id, flag) => {
    try {
      await toggleTodo(id, flag);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.todo_id === id ? { ...todo, isdone: flag } : todo,
        ),
      );
    } catch (error) {
      console.log("while toggle isdone", error);
      setError(error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    console.log(searchValue);
    const matchesSearch = todo.title?.toLowerCase().includes(searchValue.toLocaleLowerCase());
    console.log("matchesSearch", todo.title , matchesSearch)
    const matchesPriority =
      filter === "All" || todo.priority?.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  // Split the already-filtered array into clean sub-sections
  const activeTasks = filteredTodos.filter((todo) => !todo.isdone);
  const completedTasks = filteredTodos.filter((todo) => todo.isdone);
  return (
    <div className="space-y-8 my-6">
      <div className="p-8 bg-linear-to-br from-emerald-500 to-green-600 rounded-3xl shadow-xl shadow-emerald-200/50 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            Welcome Back, {userData?.full_name}
          </h2>
          <p className="text-emerald-100 mb-8">
            You have {pendingTask} pending tasks today. Keep it up!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stat Cards - Glass on dark background */}
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <p className="text-sm text-emerald-100">Total Tasks</p>
              <p className="text-2xl font-bold">{totalTask}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <p className="text-sm text-emerald-100">Completed</p>
              <p className="text-2xl font-bold">{completedTask}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <p className="text-sm text-emerald-100">Pending</p>
              <p className="text-2xl font-bold">{pendingTask}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <p className="text-sm text-emerald-100">Completion</p>
              <p className="text-2xl font-bold">{completionPercentage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Filters & Create */}
        <div className="space-y-6">
          <div className="p-6 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchvalue(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-inner"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                onClick={() => setFilter("All")}
                className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                  filter === "All"
                    ? "text-emerald-700 bg-emerald-100"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All Tasks
              </span>
              <span
                onClick={() => setFilter("High")}
                className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                  filter === "High"
                    ? "text-emerald-700 bg-emerald-100"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                🔥 High Priority
              </span>
            </div>
          </div>

          {/* Create Button (Collapsed State) */}
          <button
            onClick={() => navigate("/createtodo")}
            className="w-full p-4 border-2 border-dashed border-emerald-300 rounded-3xl text-emerald-600 font-semibold hover:bg-emerald-50 hover:border-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> Create New Task
          </button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {/* Section A: Active Tasks */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {filter === "High"
                ? "High Priority Active Tasks"
                : "Active Tasks"}{" "}
              ({activeTasks.length})
            </h3>

            <div className="flex flex-col gap-3">
              {activeTasks.length > 0 ? (
                activeTasks.map((todo) => (
                  <Todo
                    key={todo.todo_id}
                    todoData={todo}
                    handleTodoDelete={handleTodoDelete}
                    handleIsdone={handleIsdone}
                  />
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-400 font-medium">
                    No active tasks match your selection.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section B: Completed Tasks */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-md font-semibold text-gray-500 mb-4">
              Completed Tasks ({completedTasks.length})
            </h3>

            <div className="flex flex-col gap-3">
              {completedTasks.length > 0 ? (
                completedTasks.map((todo) => (
                  <Todo
                    key={todo.todo_id}
                    todoData={todo}
                    handleTodoDelete={handleTodoDelete}
                    handleIsdone={handleIsdone}
                  />
                ))
              ) : (
                <p className="text-xs text-gray-400 italic pl-2">
                  No completed tasks found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
