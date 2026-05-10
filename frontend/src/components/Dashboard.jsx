import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography, Alert } from "@mui/material";
import { apiClient } from "../services/api";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import ProjectList from "./ProjectList";
import TaskItem from "./TaskItem";
import CreateProject from "./CreateProject";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const projectsData = await apiClient("/projects");
      setProjects(projectsData);

      const taskResults = [];
      for (const p of projectsData) {
        const t = await apiClient(`/tasks?project_id=${p._id || p.id}`);
        taskResults.push(...t.map((x) => ({ ...x, projectTitle: p.title })));
      }
      setTasks(taskResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const overdue = tasks.filter((t) => t.due_date && new Date(t.due_date) < now && t.status !== "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    return { total, completed, overdue, pending };
  }, [tasks]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Team Task Manager</Typography>
          <Typography variant="body2" color="text.secondary">Projects, team work and progress overview</Typography>
        </Box>
        <Button variant="outlined" onClick={handleLogout}>Logout</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Total Tasks" value={stats.total} color="#1976d2" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Completed" value={stats.completed} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Pending" value={stats.pending} color="#ed6c02" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard label="Overdue" value={stats.overdue} color="#d32f2f" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: "grid", gap: 2 }}>
            <CreateProject onCreated={fetchData} />
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>Projects</Typography>
              <ProjectList projects={projects} />
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Tasks</Typography>
            {tasks.length === 0 ? (
              <Typography color="text.secondary">No tasks yet.</Typography>
            ) : (
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {tasks.slice(0, 8).map((task) => (
                  <TaskItem key={task._id || task.id} task={task} onChanged={fetchData} />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Paper sx={{ p: 2, borderRadius: 3, borderLeft: `5px solid ${color}` }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h4" fontWeight={700}>{value}</Typography>
    </Paper>
  );
}