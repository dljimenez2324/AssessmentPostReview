// this will be everything in one file
//this is going to be similar to a todo list

import { useEffect, useState } from "react";

// interface here to shape the data
interface Task {
  id: number;
  text: string;
  complete: boolean;
}

// key for our localStorage save to a variable
const storageKey = "Tasks";

const App = () => {
  // useStates for managing tasks, input and edit mode
  const [task, setTask] = useState<Task[]>(() => {
    const storedTask = localStorage.getItem(storageKey);
    return storedTask ? JSON.parse(storedTask) : [];
  });
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<Number | null>(null);

  // load tasks from local storage

  // the useEffect will run what's inside as soon as the app component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem(storageKey);

    if (storedTasks) {
      setTask(JSON.parse(storedTasks));
    }
  }, []);

  // this will set the tasks to our localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(task));

    // save tasks to localStorage whenever tasks change
  }, [task]);

  // functions will go below here -----------------

  ///  function to add (save) or update (edit) a task
  const addTask = () => {
    if (input === "") return;

    if (editingId !== null) {
      const updateTasks = task.map((task) =>
        task.id === editingId ? { ...task, text: input } : task
      );
      setTask(updateTasks);
      setEditingId(null);
      setInput("");
    } else {
      // adding
      const newTask: Task = {
        id: Date.now(),
        text: input.trim(),
        complete: false,
      };
      setTask([newTask, ...task]);
      setInput("");
    }
  };

  /// function to start editing a task
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setInput(text);
  };

  /// function to stop editing if canceling
  const cancelEdit = () => {
    setEditingId(null);
    setInput("");
  };

  /// function to delete a task
  const deleteTask = (id: number) => {
    const deleteItem = task.filter((task) => task.id !== id);
    setTask(deleteItem);
  };

  /// function to toggle a task complete status (complete or pending (not done))
  const toggleComplete = (id: number) => {
    const updateTasks = task.map((task) =>
      task.id === id ? { ...task, complete: !task.complete } : task
    );
    setTask(updateTasks);
  };

  return (
    <>
      {/* map through our data and display containers, row, col, ul, li */}
      <div className="container">
        <h1>One File App</h1>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Add a Task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={addTask} >{editingId !=null ? "Update" : "Add"} Task </button>
          </div>
          {editingId !== null &&
            <div className="col">
              <button className="btn btn-primary" onClick={cancelEdit}> Cancel Editing</button>
            </div>
          }
        </div>
        <ul className="list-group/ mt-4" data-bs-theme="dark">
          {task.map((task) => (
            <li key={task.id} className={`list-group-item d-flex justify-content-between ${task.complete ? "complete" : ""}`}>

              <div>
                <input type="checkbox" className="form-check-input me-2" checked={task.complete} onChange={() => {toggleComplete(task.id)}}/>
              </div>
              <span style={{textDecoration: task.complete ? "line-through":"none" , color: task.complete ? "gray":"white"}}>
                {task.text}
              </span>

              <div>
                <button className="btn btn-info mx-2" onClick={() => {startEditing(task.id, task.text)}}>Edit</button>
                <button className="btn btn-danger mx-3" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
