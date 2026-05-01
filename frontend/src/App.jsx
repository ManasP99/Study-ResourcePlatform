import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [resources, setResources] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  /* FETCH RESOURCES*/
  const fetchResources = () => {
    fetch("https://study-resourceplatform.onrender.com/resources")
      .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
      .then((data) => setResources(data))
      .catch((err) => console.log(err));
  };

  const fetchTasks = () => {
  fetch("https://study-resourceplatform.onrender.com/tasks")
    .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
    .then((data) => setTasks(data))
    .catch((err) => console.log(err));
};

  useEffect(() => {
    fetchResources();
    fetchTasks();
  }, []);

  /*ADD RESOURCE*/
  const addResource = () => {
    if (!title || !description) {
      alert("Please fill title and description");
      return;
    }
    setLoading(true);

    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("description", description);

    // if (file) {
    //   formData.append("file", file);
    // }

    fetch("https://study-resourceplatform.onrender.com/resources", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title,
    description
  })
})
      .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
      .then(() => {
        setTitle("");
        setDescription("");
        setFile(null);
        fetchResources();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addTask = () => {
  if (!taskText.trim()) return;

  fetch("https://study-resourceplatform.onrender.com/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: taskText })
  })
    .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
    .then(() => {
      setTaskText("");
      fetchTasks();
    })
    .catch((err) => console.log(err));
};

const deleteTask = (id) => {
  fetch(`https://study-resourceplatform.onrender.com/tasks/${id}`, {
    method: "DELETE",
  })
    .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
    .then(() => fetchTasks())
    .catch((err) => console.log(err));
};

const toggleTask = (id, completed) => {
  fetch(`https://study-resourceplatform.onrender.com/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completed: !completed })
  })
    .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
    .then(() => fetchTasks())
    .catch((err) => console.log(err));
};

  /*DELETE RESOURCE*/
  const deleteResource = (id) => {
    fetch(`https://study-resourceplatform.onrender.com/resources/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server returned:", text);
    throw new Error("Invalid JSON response");
  }
})
      .then(() => fetchResources())
      .catch((err) => console.log(err));
  };

  return (
    <div>

      {/* NAVBAR */}
      <div style={{
        background: "#1e293b",
        color: "white",
        padding: "15px",
        fontSize: "20px",
        fontWeight: "bold",
        textAlign: "center"
      }}>
        📚 Study Planner & Resource Platform
      </div>

      <div className="container">

        {/* FORM */}
        <div className="card">
          <h2>Add Resource</h2>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px", marginRight: "10px", width: "45%" }}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: "10px", width: "45%" }}
          />

          <br /><br />

          {/* <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          /> */}

          <br /><br />

          <button
              onClick={addResource}
              disabled={loading}
              className="btn-green"
          >
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </div>

        {/* TASK SECTION */}
        <div className="card">
          <h2>Study Planner</h2>

          <input
            placeholder="Enter task..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            style={{ padding: "10px", width: "70%", marginRight: "10px" }}
          />

          <button onClick={addTask} className="btn-blue">
            Add Task
          </button>

              <ul style={{ marginTop: "15px" }}>
                {tasks.map((task) => (
                  <li key={task._id} className="task">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                    />

                    <span
                      style={{
                        textDecoration: task.completed ? "line-through" : "none",
                        marginLeft: "8px"
                      }}
                    >
                    {task.text}
                    </span>
                    <button
                        onClick={() => deleteTask(task._id)}
                        className="btn-red"
                        style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>

        </div>
        
        {/* LIST */}
        <h2>Available Resources</h2>

        <div className="grid">
          {resources.map((item) => (
            <div key={item._id} style={{
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h3>{item.title || item.name}</h3>
              <p>{item.description || item.email}</p>

              {/* DOWNLOAD */}
              {item.fileUrl && (
                <a
                  href={`https://study-resourceplatform.onrender.com/uploads/${item.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", marginBottom: "10px" }}
                >
                  📥 Download File
                </a>
              )}

              <br />

              <button
                  onClick={() => deleteResource(item._id)}
                  className="btn-red"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
