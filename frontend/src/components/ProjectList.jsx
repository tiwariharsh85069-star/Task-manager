import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProjectList({ projects }) {
  const navigate = useNavigate();

  if (!projects.length) return <Typography color="text.secondary">No projects yet.</Typography>;

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      {projects.map((project) => {
        const id = project._id || project.id;
        return (
          <Paper key={id} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>{project.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {project.description}
            </Typography>
            <Button variant="outlined" size="small" onClick={() => navigate(`/projects/${id}`)}>
              View Project
            </Button>
          </Paper>
        );
      })}
    </Box>
  );
}