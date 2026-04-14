import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  acceptJob,
} from './api';

import JobDialog from './JobDialog';

function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue + 'T00:00:00');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function buildGoogleCalendarLink(job) {
  const start = `${job.date}T${job.startTime}:00`;
  const end = `${job.date}T${job.endTime}:00`;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const toGoogleFormat = (date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const text = encodeURIComponent(`Sub Job: ${job.subject}`);
  const details = encodeURIComponent(
    `${job.description}\nTeacher: ${job.teacherName}\nGrade: ${job.gradeLevel}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${toGoogleFormat(
    startDate
  )}/${toGoogleFormat(endDate)}&details=${details}`;
}

export default function App() {
const [jobs, setJobs] = useState([]);
const [role, setRole] = useState('teacher');
const [statusFilter, setStatusFilter] = useState('all');
const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedJob, setSelectedJob] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const loadJobs = async (showErrorToast = true) => {
    try {
      const res = await getJobs();
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setJobs([]);
      if (showErrorToast) {
        showToast('Failed to load jobs', 'error');
      }
    }
  };

  useEffect(() => {
    loadJobs(false);
  }, []);

  const openAddDialog = () => {
    setDialogMode('add');
    setSelectedJob(null);
    setDialogOpen(true);
  };

  const openEditDialog = (job) => {
    setDialogMode('edit');
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleSaveJob = async (formData) => {
    try {
      if (dialogMode === 'add') {
        await createJob(formData);
        showToast('Job created successfully');
      } else {
        await updateJob(selectedJob._id, formData);
        showToast('Job updated successfully');
      }

      setDialogOpen(false);
      loadJobs();
    } catch (error) {
      showToast('Failed to save job', 'error');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      showToast('Job deleted successfully');
      loadJobs();
    } catch (error) {
      showToast('Failed to delete job', 'error');
    }
  };

  const handleAcceptJob = async (id) => {
    try {
      await acceptJob(id, 'Demo Substitute');
      showToast('Job accepted successfully');
      loadJobs();
    } catch (error) {
      showToast(
        error?.response?.data?.message || 'Failed to accept job',
        'error'
      );
    }
  };

  const filteredJobs = useMemo(() => {
  let result = [...jobs];

  if (statusFilter === 'open') {
    result = result.filter((job) => job.status === 'open');
  } else if (statusFilter === 'accepted') {
    result = result.filter((job) => job.status === 'accepted');
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}, [jobs, statusFilter]);
  return (
    <Box sx={{ backgroundColor: '#e0e0e0', minHeight: '100vh', p: 4 }}>
      <Paper
        elevation={4}
        sx={{
          overflow: 'hidden',
          borderRadius: 3,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: '#424242' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SUBSTITUTE FINDER
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  <FormControl size="small">
  <Select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    displayEmpty
    sx={{
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderRadius: 1,
      minWidth: 150,
      height: 36,
      color: '#333',
    }}
  >
    <MenuItem value="all">All Jobs</MenuItem>
    <MenuItem value="open">Open Only</MenuItem>
    <MenuItem value="accepted">Accepted Only</MenuItem>
  </Select>
</FormControl>
  <Box sx={{ width: 130, display: 'flex', justifyContent: 'flex-end' }}>
    {role === 'teacher' && (
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={openAddDialog}
      >
        ADD JOB
      </Button>
    )}
  </Box>

  <ToggleButtonGroup
    value={role}
    exclusive
    onChange={(e, newRole) => {
      if (newRole) setRole(newRole);
    }}
    size="small"
    sx={{
      '& .MuiToggleButton-root': {
        color: 'white',
        borderColor: 'rgba(255,255,255,0.5)',
      },
      '& .Mui-selected': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
      },
      '& .MuiToggleButton-root:hover': {
        backgroundColor: 'rgba(255,255,255,0.15)',
      },
    }}
  >
    <ToggleButton value="teacher">Teacher View</ToggleButton>
    <ToggleButton value="sub">Sub View</ToggleButton>
  </ToggleButtonGroup>
</Box>
          </Toolbar>
        </AppBar>

        <Table sx={{ backgroundColor: '#fafafa' }}>
          <TableHead>
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Lesson Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No jobs available yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.teacherName}</TableCell>
                  <TableCell>{job.subject}</TableCell>
                  <TableCell>{formatDate(job.date)}</TableCell>
                  <TableCell>
                    {job.startTime} - {job.endTime}
                  </TableCell>
                  <TableCell>{job.gradeLevel}</TableCell>
                  <TableCell>{job.description}</TableCell>
                  <TableCell>
                    {job.lessonPlanUrl ? (
                     <a
  href={job.lessonPlanUrl}
  target="_blank"
  rel="noreferrer"
  style={{ color: '#1565c0', fontWeight: 500 }}
>
  View Plan
</a>
                    ) : (
                      'None'
                    )}
                  </TableCell>
                  <TableCell>
                    {job.status === 'accepted'
                      ? `Accepted by ${job.acceptedBy}`
                      : 'Open'}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: 140,
                      }}
                    >
                      {role === 'teacher' && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => openEditDialog(job)}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            DELETE
                          </Button>
                        </>
                      )}

                      {role === 'sub' && (
  job.status === 'open' ? (
    <Button
      variant="contained"
      color="success"
      size="small"
      startIcon={<CheckCircleIcon />}
      onClick={() => handleAcceptJob(job._id)}
    >
      ACCEPT
    </Button>
  ) : (
    <Button
      variant="contained"
      size="small"
      disabled
    >
      ACCEPTED
    </Button>
  )
)}

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EventIcon />}
                        component="a"
                        href={buildGoogleCalendarLink(job)}
                        target="_blank"
                      >
                        CALENDAR
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <JobDialog
        open={dialogOpen}
        mode={dialogMode}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveJob}
        initialData={selectedJob}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}