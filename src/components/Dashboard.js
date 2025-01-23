import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  Popover,
  TextField,
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
  const [selectedEvent, setSelectedEvent] = useState(null);
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

  const handleRowClick = (params) => {
    setSelectedEvent(params.row);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "summary",
      headerName: "Event",
      width: 250,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => handleRowClick(params)}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "start", headerName: "Start Time", width: 180 },
    { field: "end", headerName: "End Time", width: 180 },
  ];

  const rows = filteredEvents.map((event, index) => ({
    id: index + 1,
    summary: event.summary || "No Summary",
    start: event.start?.dateTime || event.start?.date || "No Start Time",
    end: event.end?.dateTime || event.end?.date || "No End Time",
    details: event.description || "No additional details",
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h5">Your Google Calendar Events</Typography>
          <IconButton onClick={handleProfileClick}>
            <Avatar alt={profile.name} src={profile.picture || ""}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Box>

        {/* Popover for Profile */}
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
          <Box
            sx={{
              width: 250,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {profile.name || "User Name"}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {profile.email || "user@example.com"}
            </Typography>
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* Events Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            padding: 2,
            gap: 2,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              width: "70%",
              height: "100%",
              border: "1px solid #ddd",
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            {loading ? (
              <Typography sx={{ textAlign: "center", paddingTop: 10 }}>
                Loading events...
              </Typography>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 20px",
                  }}
                >
                  <TextField
                    type="date"
                    label="Filter by Date"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </Box>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  pagination
                />
              </>
            )}
          </Box>

          {/* Event Details Drawer */}
          {selectedEvent && (
            <Box
              sx={{
                width: "30%",
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedEvent.summary || "No Summary"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Start:</strong> {selectedEvent.start}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>End:</strong> {selectedEvent.end}
              </Typography>
              <Typography variant="body1">
                <strong>Details:</strong> {selectedEvent.details}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedEvent(null)}
                sx={{ marginTop: 2 }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;






/* -------------------------------------------------------------------------- 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();

  const theme = createTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // production url - https://sso-google-calendar-backend.onrender.com
        // development url - http://localhost:5001
        const response = await fetch('http://localhost:5001/api/getEvents', {
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setEvents(Array.isArray(data.events) ? data.events : []);
          setProfile(Object.keys(data.profile).length ? data.profile : {});
        }
        else {
          navigate('/');
          console.error( data.message );
        }
      }
      catch (error) {
        console.error( error );
      }
      finally {
        setLoading( false );
      }
    };

    if (!fetched) {
      setFetched(true);
      fetchEvents();
    }
  }, [fetched]);

  const handleLogout = async () => {
    localStorage.removeItem('authorization_code');
    await fetch('http://localhost:5001/api/logout', {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('logged out successfully');
        navigate('/');
      }
      else {
        console.error( data.message );
      }
    })
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'summary', headerName: 'Event', width: 200 },
    { field: 'start', headerName: 'Start Time', width: 180 },
    { field: 'end', headerName: 'End Time', width: 180 },
  ];

  const rows = events.map((event, index) => ({
    id: index + 1,
    summary: event.summary || 'No Summary',
    start: event.start?.dateTime || event.start?.date || 'No Start Time',
    end: event.end?.dateTime || event.end?.date || 'No End Time',
  }));


  return (
    <ThemeProvider theme={theme}>
      <div className="dashboard-container">
        <h1>Your Google Calendar Events</h1>
        <button onClick={handleLogout}>Logout</button>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Dashboard; */