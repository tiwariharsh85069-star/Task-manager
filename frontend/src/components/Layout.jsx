import { Outlet } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function Layout() {
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <Box sx={{ p: 3 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Typography variant="h5">Team Task Manager</Typography>
        <Button variant="contained" onClick={logout}>
          Logout
        </Button>
      </header>
      <main>
        <Outlet /> {/* renders Dashboard, TaskList, etc. */}
      </main>
    </Box>
  );
}