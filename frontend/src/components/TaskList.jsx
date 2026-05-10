// import { useEffect, useState } from "react";
// import { apiClient } from "../services/api";
// import { Box, Typography } from "@mui/material";
// import TaskItem from "./TaskItem";

// export default function TaskList({ projectId }) {
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState("");

//   const fetchTasks = async () => {
//     try {
//       const data = await apiClient(`/tasks?project_id=${projectId}`);
//       setTasks(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [projectId]);

//   if (error) return <Typography color="error">{error}</Typography>;

//   if (!tasks.length) return <Typography color="text.secondary">No tasks yet.</Typography>;

//   return (
//     <Box sx={{ display: "grid", gap: 1.5 }}>
//       {tasks.map((task) => (
//         <TaskItem key={task._id} task={task} onChanged={fetchTasks} />
//       ))}
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import { apiClient } from "../services/api";
import { Box, Typography } from "@mui/material";
import TaskItem from "./TaskItem";

export default function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const data = await apiClient(`/tasks?project_id=${projectId}`);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!tasks.length) return <Typography color="text.secondary">No tasks yet.</Typography>;

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      {tasks.map((task) => (
        <TaskItem key={task._id || task.id} task={task} onChanged={fetchTasks} />
      ))}
    </Box>
  );
}