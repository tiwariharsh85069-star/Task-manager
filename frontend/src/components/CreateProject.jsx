import { useState } from "react";
import { Box, Button, Paper, TextField, Typography, Alert } from "@mui/material";
import { apiClient } from "../services/api";

export default function CreateProject({ onCreated }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiClient("/projects", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess("Project created");
      setForm({ title: "", description: "" });
      onCreated?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>Create Project</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField label="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button type="submit" variant="contained">Create</Button>
      </Box>
    </Paper>
  );
}