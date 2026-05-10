// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiClient } from "../services/api";
// import { Box, Button, Container, Paper, TextField, Typography, Alert, MenuItem } from "@mui/material";
// import TaskList from "./TaskList";

// export default function ProjectDetails() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [members, setMembers] = useState([]);
//   const [form, setForm] = useState({ title: "", description: "", assignee_id: "", due_date: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const fetchProject = async () => {
//     const data = await apiClient("/projects");
//     const found = data.find((p) => p._id === projectId);
//     setProject(found || null);
//   };

//   useEffect(() => {
//     fetchProject();
//   }, [projectId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     try {
//       await apiClient(`/tasks/${projectId}`, {
//         method: "POST",
//         body: JSON.stringify(form),
//       });
//       setSuccess("Task created.");
//       setForm({ title: "", description: "", assignee_id: "", due_date: "" });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Container sx={{ py: 3 }}>
//       <Button variant="text" onClick={() => navigate("/")}>← Back</Button>

//       <Paper sx={{ p: 2, my: 2, borderRadius: 3 }}>
//         <Typography variant="h5" fontWeight={700}>{project?.title || "Project"}</Typography>
//         <Typography color="text.secondary">{project?.description || ""}</Typography>
//       </Paper>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

//       <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
//         <Typography variant="h6" gutterBottom>Create Task</Typography>
//         <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
//           <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
//           <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
//           <TextField label="Due Date" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
//           <Button type="submit" variant="contained">Create Task</Button>
//         </Box>
//       </Paper>

//       <Paper sx={{ p: 2, borderRadius: 3 }}>
//         <Typography variant="h6" gutterBottom>Tasks</Typography>
//         <TaskList projectId={projectId} />
//       </Paper>
//     </Container>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import { Box, Button, Container, Paper, TextField, Typography, Alert } from "@mui/material";
import TaskList from "./TaskList";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", assignee_id: "", due_date: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProject = async () => {
    const data = await apiClient(`/projects/${projectId}`);
    setProject(data);
  };

  useEffect(() => {
    fetchProject().catch((err) => setError(err.message));
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiClient(`/tasks/${projectId}`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          due_date: new Date(form.due_date).toISOString(),
          assignee_id: form.assignee_id || null,
        }),
      });
      setSuccess("Task created");
      setForm({ title: "", description: "", assignee_id: "", due_date: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container sx={{ py: 3 }}>
      <Button variant="text" onClick={() => navigate("/")}>← Back</Button>

      <Paper sx={{ p: 2, my: 2, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700}>{project?.title || "Project"}</Typography>
        <Typography color="text.secondary">{project?.description || ""}</Typography>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Create Task</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Assignee ID" value={form.assignee_id} onChange={(e) => setForm({ ...form, assignee_id: e.target.value })} />
          <TextField label="Due Date" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
          <Button type="submit" variant="contained">Create Task</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Tasks</Typography>
        <TaskList projectId={projectId} />
      </Paper>
    </Container>
  );
}