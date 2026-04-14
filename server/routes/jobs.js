import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create job' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch {
    res.status(400).json({ message: 'Failed to update job' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

router.patch('/:id/accept', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status === 'accepted') {
      return res.status(400).json({ message: 'Already accepted' });
    }

    job.status = 'accepted';
    job.acceptedBy = req.body.acceptedBy || 'Substitute';

    const saved = await job.save();
    res.json(saved);
  } catch {
    res.status(400).json({ message: 'Failed to accept job' });
  }
});

export default router;