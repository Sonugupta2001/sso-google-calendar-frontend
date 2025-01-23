import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  Popover,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  const theme = createTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://sso-google-calendar-backend.onrender.com/api/getEvents",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (data.success) {
          setEvents(Array.isArray(data.events) ? data.events : []);
          setProfile(Object.keys(data.profile).length ? data.profile : {});
        } else {
          navigate("/");
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!fetched) {
      setFetched(true);
      fetchEvents();
    }
  }, [fetched, navigate]);

  useEffect(() => {
    if (filterDate) {
      const filtered = events.filter(
        (event) =>
          event.start?.dateTime?.startsWith(filterDate) ||
          event.start?.date?.startsWith(filterDate)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [filterDate, events]);

  const handleLogout = async () => {
    localStorage.removeItem("authorization_code");
    await fetch("https://sso-google-calendar-backend.onrender.com/api/logout", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then((response) =>
      response.json().then((data) => {
        if (data.success) {
          console.log("Logged out successfully");
          navigate("/");
        } else {
          console.error(data.message);
        }
      })
    );
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const isProfileOpen = Boolean(anchorEl);

  const formatToIST = (utcDate) => {
    if (!utcDate) return "No Date";
    const date = new Date(utcDate);
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "summary",
      headerName: "Event",
      width: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "start",
      headerName: "Start Time",
      width: 200,
      valueFormatter: ({ value }) => formatToIST(value),
    },
    {
      field: "end",
      headerName: "End Time",
      width: 200,
      valueFormatter: ({ value }) => formatToIST(value),
    },
  ];

  const rows = filteredEvents.map((event, index) => ({
    id: index + 1,
    summary: event.summary || "No Summary",
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Your Google Calendar Events
          </Typography>
          <IconButton onClick={handleProfileClick}>
            <Avatar alt={profile.name} src={profile.picture || ""}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Box>

        {/* Popover */}
        <Popover
          open={isProfileOpen}
          anchorEl={anchorEl}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ padding: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {profile.name || "User Name"}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {profile.email || "user@example.com"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              fullWidth
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Popover>

        {/* Events Table */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: 400,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              padding: 2,
            }}
          >
            {loading ? (
              <Typography sx={{ textAlign: "center" }}>Loading events...</Typography>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                pagination
                sx={{
                  border: "1px solid #ddd",
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #eee",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #ddd",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #ddd",
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;