// import { Box, Chip, Paper, Typography } from "@mui/material";
// import { apiClient } from "../services/api";

// export default function TaskItem({ task, onChanged }) {
//   const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "completed";

//   const statusColor =
//     task.status === "completed" ? "success" :
//     task.status === "in-progress" ? "info" : "warning";

//   const toggleStatus = async () => {
//     const next =
//       task.status === "pending" ? "in-progress" :
//       task.status === "in-progress" ? "completed" : "pending";

//     await apiClient(`/tasks/${task._id}`, {
//       method: "PATCH",
//       body: JSON.stringify({ status: next }),
//     });
//     onChanged?.();
//   };

//   return (
//     <Paper sx={{ p: 2, borderRadius: 2, borderLeft: isOverdue ? "5px solid #d32f2f" : "5px solid transparent" }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "start", flexWrap: "wrap" }}>
//         <Box>
//           <Typography fontWeight={600}>{task.title}</Typography>
//           <Typography variant="body2" color="text.secondary">{task.description}</Typography>
//           <Typography variant="caption" color={isOverdue ? "error" : "text.secondary"}>
//             Due: {task.due_date ? new Date(task.due_date).toLocaleString() : "N/A"}
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//           <Chip label={task.status} color={statusColor} size="small" />
//           <Chip label={isOverdue ? "Overdue" : "On time"} color={isOverdue ? "error" : "default"} size="small" />
//           <Chip label="Toggle Status" clickable onClick={toggleStatus} />
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

import { Box, Chip, Paper, Typography } from "@mui/material";
import { apiClient } from "../services/api";

export default function TaskItem({ task, onChanged }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "completed";

  const statusColor =
    task.status === "completed" ? "success" :
    task.status === "in-progress" ? "info" : "warning";

  const toggleStatus = async () => {
    const next =
      task.status === "pending" ? "in-progress" :
      task.status === "in-progress" ? "completed" : "pending";

    await apiClient(`/tasks/${task._id || task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    onChanged?.();
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, borderLeft: isOverdue ? "5px solid #d32f2f" : "5px solid transparent" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "start", flexWrap: "wrap" }}>
        <Box>
          <Typography fontWeight={600}>{task.title}</Typography>
          <Typography variant="body2" color="text.secondary">{task.description}</Typography>
          <Typography variant="caption" color={isOverdue ? "error" : "text.secondary"}>
            Due: {task.due_date ? new Date(task.due_date).toLocaleString() : "N/A"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <Chip label={task.status} color={statusColor} size="small" />
          <Chip label={isOverdue ? "Overdue" : "On time"} color={isOverdue ? "error" : "default"} size="small" />
          <Chip label="Toggle Status" clickable onClick={toggleStatus} />
        </Box>
      </Box>
    </Paper>
  );
}