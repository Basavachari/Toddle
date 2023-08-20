const express = require('express');
const router = express.Router();
const db = require('../db/queries'); // Import your query functions
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware

// Create a new journal entry and tag students


router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { description, studentUsernames } = req.body;
    const teacherId = req.userId; // Teacher's user ID from the middleware

    // Check if the authenticated user is a teacher
    const authenticatedUser = await db.getUserById(teacherId);
    if (!authenticatedUser || !authenticatedUser.is_teacher) {
      return res.status(403).json({ message: 'Permission denied. Only teachers can create journals.' });
    }

    const newJournal = await db.createJournal(description, teacherId);

    // Create tag entries for each student
    for (const username of studentUsernames) {
      const student = await db.getUserByUsername(username);
      if (student) {
        await db.createTag(newJournal.id, student.id);
      }
    }

    res.status(201).json(newJournal);
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


// Update a journal entry and its tags
router.post('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, studentUsernames } = req.body;
    const teacherId = req.userId; // Teacher's user ID from the middleware

    // Check if the journal entry exists and if the teacher is the creator
    const existingJournal = await db.getJournalById(id);
    if (!existingJournal || existingJournal.teacher_id !== teacherId) {
      return res.status(404).json({ message: 'Journal entry not found or permission denied' });
    }

    // Check if the authenticated user is a teacher
    const authenticatedUser = await db.getUserById(teacherId);
    if (!authenticatedUser || !authenticatedUser.is_teacher) {
      return res.status(403).json({ message: 'Permission denied. Only teachers can update journals.' });
    }

    const updatedJournal = await db.updateJournal(id, description, teacherId);

    // Update tags for the journal entry
    await db.deleteTagsForJournal(id); // Remove existing tags
    for (const username of studentUsernames) {
      const student = await db.getUserByUsername(username);
      if (student) {
        await db.createTag(id, student.id); // Create new tags
      }
    }

    res.json(updatedJournal);
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Delete a journal entry by creator
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.userId; // Teacher's user ID from the middleware
    
    // Check if the authenticated user is a teacher
    const authenticatedUser = await db.getUserById(teacherId);
    if (!authenticatedUser || !authenticatedUser.is_teacher) {
      return res.status(403).json({ message: 'Permission denied. Only teachers can delete journals.' });
    }
    // Check if the journal entry exists and if the teacher is the creator
    const existingJournal = await db.getJournalById(id);
    if (!existingJournal || existingJournal.teacher_id !== teacherId) {
      return res.status(404).json({ message: 'Journal entry not found or permission denied' });
    }


    // Delete the journal entry
    await db.deleteJournal(id);

    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// publish the journal

router.post('/publish/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { publish_date } = req.body;
    const teacherId = req.userId; // Teacher's user ID from the middleware

    // Check if the authenticated user is a teacher
    const authenticatedUser = await db.getUserById(teacherId);
    if (!authenticatedUser || !authenticatedUser.is_teacher) {
      return res.status(403).json({ message: 'Permission denied. Only teachers can publish journals.' });
    }
    // Check if the journal entry exists and if the teacher is the creator
    const existingJournal = await db.getJournalById(id);
    if (!existingJournal || existingJournal.teacher_id !== teacherId) {
      return res.status(404).json({ message: 'Journal entry not found or permission denied' });
    }


    const publishedJournal = await db.publishJournal(id, publish_date);

    res.json(publishedJournal);
  } catch (error) {
    console.error('Error publishing journal:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Check the role of the authenticated user
    const authenticatedUser = await db.getUserById(userId);
    if (!authenticatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let journals = [];

    if (authenticatedUser.is_teacher) {
      // Fetch journals created by the teacher
      journals = await db.getJournalsByTeacher(userId);
    } else {
      // Fetch journals tagged to the student and with a published date less than the current date
      journals = await db.getJournalsByStudent(userId);
    }

    res.json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


module.exports = router;
