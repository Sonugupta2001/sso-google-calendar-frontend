import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();

  const theme = createTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');

        const response = await fetch('http://localhost:5001/api/events/getEvents', {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'x-refresh-token': refresh_token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setEvents(Array.isArray(data.events) ? data.events : []);
        } else {
          console.error('Failed to fetch events:', data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!fetched) {
      setFetched(true);
      fetchEvents();
    }
  }, [fetched]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
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

export default Dashboard;