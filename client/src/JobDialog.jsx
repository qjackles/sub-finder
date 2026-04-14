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

  useEffect(() => {
    if (open) {
      if (isEditMode && initialData) {
        setFormData(initialData);
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
    }
  }, [open, isEditMode, initialData]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edit Job' : 'Add Job'}
      </DialogTitle>

      <DialogContent>
        <TextField fullWidth label="Teacher" margin="normal"
          value={formData.teacherName}
          onChange={handleChange('teacherName')}
        />

        <TextField fullWidth label="Subject" margin="normal"
          value={formData.subject}
          onChange={handleChange('subject')}
        />

        <TextField fullWidth label="Grade" margin="normal"
          value={formData.gradeLevel}
          onChange={handleChange('gradeLevel')}
        />

        <TextField fullWidth type="date" margin="normal"
          value={formData.date}
          onChange={handleChange('date')}
        />

        <TextField fullWidth type="time" margin="normal"
          value={formData.startTime}
          onChange={handleChange('startTime')}
        />

        <TextField fullWidth type="time" margin="normal"
          value={formData.endTime}
          onChange={handleChange('endTime')}
        />

        <TextField fullWidth label="Description" margin="normal"
          value={formData.description}
          onChange={handleChange('description')}
        />

        <TextField fullWidth label="Lesson Plan URL" margin="normal"
          value={formData.lessonPlanUrl}
          onChange={handleChange('lessonPlanUrl')}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit}>
          {isEditMode ? 'SAVE' : 'ADD'}
        </Button>
        <Button onClick={onClose} color="error">
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
}