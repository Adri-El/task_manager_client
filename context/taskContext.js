import React, { createContext, useEffect } from "react";
import apiCall from "@/app/apollo-client";
import variables from "@/app/variables";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "https://taskfyer.onrender.com/api/v1";

export const TasksProvider = ({ children }) => {
  const userId = useUserContext().user.id;

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});

  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  // get tasks
  const getTasks = async () => {
    setLoading(true);
    try {
      
      const schema = `
        query Get_tasks{
          get_tasks{
            tasks {
              id
              userID
              title
              description
              dueDate
              priority
              status
              completed
          }
        }
      }`

      const apiResponse = await apiCall(`${variables.host}/auth`, schema, null, false)
      
      setTasks(apiResponse.data.get_tasks.tasks);
    } catch (error) {
      console.log("Error getting tasks", error);
    }
    setLoading(false);
  };

  // get task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
    
      //setTask(response.data);
    } catch (error) {
      console.log("Error getting task", error);
    }
    setLoading(false);
  };

  const createTask = async (task) => {
    setLoading(true);
    try {
      const schema = `
        mutation Add_task($title: String!, $description: String!, $priority: String, $dueDate: String, $status: String, $completed: String) {
          add_task(title: $title, description: $description, priority: $priority, dueDate: $dueDate, status: $status, completed: $completed) {
          id, userID, title, description, dueDate, priority, status, completed
        }
      }`

      const apiResponse = await apiCall(`${variables.host}/auth`, schema, task, true)

      setTasks([...tasks, apiResponse.data.add_task]);
      toast.success("Task created successfully");
    } catch (error) {
      console.log("Error creating task", error);
    }
    setLoading(false);
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const schema = `
        mutation Update_task($id: ID!, $title: String, $description: String, $priority: String, $dueDate: String, $status: String, $completed: String) {
          update_task(id: $id, title: $title, description: $description, priority: $priority, dueDate: $dueDate, status: $status, completed: $completed) {
          id userID title description dueDate priority status completed
        }
      }`

      const apiResponse = await apiCall(`${variables.host}/auth`, schema, task, true)

      // update the task in the tasks array
      const newTasks = tasks.map((tsk) => {
        
        return tsk.id === apiResponse.data.update_task.id ? apiResponse.data.update_task : tsk;
      });

      toast.success("Task updated successfully");

      setTasks(newTasks);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      const schema = `
        mutation Delete_task($id: ID!){
          delete_task(id: $id){
            message
          }
        }`

      await apiCall(`${variables.host}/auth`, schema, {id: taskId}, true)

      // remove the task from the tasks array
      const newTasks = tasks.filter((tsk) => tsk.id !== taskId);

      setTasks(newTasks);
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  // get completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // get pending tasks
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    getTasks();
  }, [userId]);

  //console.log("Active tasks", activeTasks);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        tasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
