import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

export default function JobDialog({ open, mode, onClose, onSave, initialData }) {
  const isEditMode = mode === 'edit';

  const [formData, setFormData] = useState({
    teacherName: '',
    subject: '',
    gradeLevel: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    lessonPlanUrl: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        setFormData({
          teacherName: initialData.teacherName || '',
          subject: initialData.subject || '',
          gradeLevel: initialData.gradeLevel || '',
          date: initialData.date || '',
          startTime: initialData.startTime || '',
          endTime: initialData.endTime || '',
          description: initialData.description || '',
          lessonPlanUrl: initialData.lessonPlanUrl || '',
        });
      } else {
        setFormData({
          teacherName: '',
          subject: '',
          gradeLevel: '',
          date: '',
          startTime: '',
          endTime: '',
          description: '',
          lessonPlanUrl: '',
        });
      }

      setErrors({});
    }
  }, [open, isEditMode, initialData]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.teacherName.trim()) {
      nextErrors.teacherName = 'Teacher name is required';
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = 'Subject is required';
    }

    if (!formData.gradeLevel.trim()) {
      nextErrors.gradeLevel = 'Grade level is required';
    }

    if (!formData.date) {
      nextErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      nextErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      nextErrors.endTime = 'End time is required';
    }

    if (!formData.description.trim()) {
      nextErrors.description = 'Description is required';
    }

    if (
      formData.lessonPlanUrl &&
      !/^https?:\/\/.+/i.test(formData.lessonPlanUrl.trim())
    ) {
      nextErrors.lessonPlanUrl =
        'Lesson plan URL must start with http:// or https://';
    }

    if (formData.date) {
      const now = new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(formData.date + 'T00:00:00');

      if (selectedDate < today) {
        nextErrors.date = 'Date cannot be in the past';
      }

      if (selectedDate.getTime() === today.getTime() && formData.startTime) {
        const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
        if (startDateTime < now) {
          nextErrors.startTime = 'Start time cannot be in the past for today';
        }
      }
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}:00`);
      const end = new Date(`2000-01-01T${formData.endTime}:00`);

      if (end <= start) {
        nextErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <Dialog
  open={open}
  onClose={(event, reason) => {
    if (reason === 'backdropClick') return;
    onClose();
  }}
  fullWidth
>
      <DialogTitle
        sx={{ backgroundColor: '#424242', color: 'white', fontWeight: 600 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditMode ? <EditIcon /> : <AddCircleIcon />}
          {isEditMode ? 'Edit Job' : 'Add Job'}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: '20px !important' }}>
        <TextField
          fullWidth
          label="Teacher"
          margin="normal"
          value={formData.teacherName}
          onChange={handleChange('teacherName')}
          error={Boolean(errors.teacherName)}
          helperText={errors.teacherName}
        />

        <TextField
          fullWidth
          label="Subject"
          margin="normal"
          value={formData.subject}
          onChange={handleChange('subject')}
          error={Boolean(errors.subject)}
          helperText={errors.subject}
        />

        <TextField
          fullWidth
          label="Grade"
          margin="normal"
          value={formData.gradeLevel}
          onChange={handleChange('gradeLevel')}
          error={Boolean(errors.gradeLevel)}
          helperText={errors.gradeLevel}
        />

        <TextField
  fullWidth
  type="date"
  label="Date"
  margin="normal"
  value={formData.date}
  onChange={handleChange('date')}
  error={Boolean(errors.date)}
  helperText={errors.date}
  InputLabelProps={{ shrink: true }}
  inputProps={{
    min: new Date().toISOString().split('T')[0],
  }}
/>

        <TextField
          fullWidth
          type="time"
          label="Start Time"
          margin="normal"
          value={formData.startTime}
          onChange={handleChange('startTime')}
          error={Boolean(errors.startTime)}
          helperText={errors.startTime}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="time"
          label="End Time"
          margin="normal"
          value={formData.endTime}
          onChange={handleChange('endTime')}
          error={Boolean(errors.endTime)}
          helperText={errors.endTime}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          minRows={3}
          value={formData.description}
          onChange={handleChange('description')}
          error={Boolean(errors.description)}
          helperText={errors.description}
        />

        <TextField
          fullWidth
          label="Lesson Plan URL"
          margin="normal"
          value={formData.lessonPlanUrl}
          onChange={handleChange('lessonPlanUrl')}
          error={Boolean(errors.lessonPlanUrl)}
          helperText={errors.lessonPlanUrl || 'Optional. Must start with http:// or https://'}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isEditMode ? <EditIcon /> : <AddCircleIcon />}
        >
          {isEditMode ? 'SAVE' : 'ADD'}
        </Button>

        <Button
          onClick={onClose}
          color="error"
          variant="contained"
          startIcon={<CancelIcon />}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
}