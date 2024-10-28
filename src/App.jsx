import React, { useState, useEffect } from "react";

// Card Component
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

const App = () => {
  // State for vanishing button
  const [isVisible, setIsVisible] = useState(true);

  // States for timer
  const [time, setTime] = useState({ mins: 0, secs: 0 });
  const [isRunning, setIsRunning] = useState(false);

  // State for task list
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // States for form
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved
      ? JSON.parse(saved)
      : {
          username: "",
          fullName: "",
          age: "",
        };
  });
  const [submittedData, setSubmittedData] = useState(() => {
    const saved = localStorage.getItem("submittedData");
    return saved ? JSON.parse(saved) : null;
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newSecs = prev.secs + 1;
          return {
            mins: prev.mins + Math.floor(newSecs / 60),
            secs: newSecs % 60,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Form data effect
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (submittedData) {
      localStorage.setItem("submittedData", JSON.stringify(submittedData));
    }
  }, [submittedData]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
    console.log("Form submitted:", formData);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add task handler
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* 1. Vanishing Text */}
      <Card className="p-6">
        {isVisible && (
          <h2 className="text-2xl font-bold mb-4">1. Make this vanish</h2>
        )}
        <button
          onClick={() => setIsVisible(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Click me!
        </button>
      </Card>

      {/* 2. Basic Timer */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">2. Create a Basic Timer</h2>
        <div className="text-xl mb-4">
          {time.mins} mins {time.secs} secs
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setIsRunning(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={isRunning}
          >
            Start
          </button>
          <button
            onClick={() => setIsRunning(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={!isRunning}
          >
            Stop
          </button>
          <button
            onClick={() => {
              setTime({ mins: 0, secs: 0 });
              setIsRunning(false);
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Reset
          </button>
        </div>
      </Card>

      {/* 3. Task List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">3. Add to a list</h2>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="Enter a task"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded">
              {task}
            </li>
          ))}
        </ul>
      </Card>

      {/* 4. Form with LocalStorage */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">4. Submit a form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {/* Display submitted data */}
        {submittedData && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">
              Request Sent to DB with below request data
            </h3>
            <ul className="space-y-2 text-lg">
              <li>UserName: {submittedData.username}</li>
              <li>FullName: {submittedData.fullName}</li>
              <li>Age: {submittedData.age}</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default App;
