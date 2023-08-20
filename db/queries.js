// db/queries.js
const db = require('./dbConnection'); // Import your db connection
const createUser = async (username, hashedPassword, is_teacher) => {
  // Perform the SQL insert to create a new user
  const query = `
      INSERT INTO users (username, password,is_teacher)
      VALUES ($1, $2,$3)
      RETURNING id,username;
    `;
  
  const values = [username, hashedPassword, is_teacher];
  const result = await db.query(query, values);
  // const result2 = await db.query(query2, [result.rows[0].id]);
  // console.log(result2.rows[0].id);
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  // Retrieve user by username
  // Replace 'users' with your actual table name
  const query = `
      SELECT * FROM users WHERE username = $1;
    `;

  const result = await db.query(query, [username]);

  return result.rows[0];
};

const getUserById = async (userId) => {
  const query = `
    SELECT * FROM users
    WHERE id = $1;
  `;

  const values = [userId];
  const result = await db.query(query, values);

  return result.rows[0];
};
// Add more query functions for user management, fetching, etc.

const createJournal = async (description, teacherId) => {
  const query = `
    INSERT INTO journals (description, published_date, teacher_id)
    VALUES ($1, NULL, $2)
    RETURNING *;
  `;

  const values = [description, teacherId];
  const result = await db.query(query, values);

  return result.rows[0];
};

// db/queries.js

const getJournalById = async (journalId) => {
  const query = `
    SELECT * FROM journals
    WHERE id = $1;
  `;

  const values = [journalId];
  const result = await db.query(query, values);

  return result.rows[0];
};
// db/queries.js

const updateJournal = async (id, description, teacherId) => {
  const query = `
    UPDATE journals
    SET description = $1
    WHERE id = $2 AND teacher_id = $3
    RETURNING *;
  `;

  const values = [description, id, teacherId];
  const result = await db.query(query, values);

  return result.rows[0];
};

const deleteJournal = async (journalId) => {
  const query = `
    DELETE FROM journals
    WHERE id = $1;
  `;

  const values = [journalId];
  await db.query(query, values);
};

const createTag = async (journalId, studentId) => {
  const query = `
    INSERT INTO tags (journal_id, student_id)
    VALUES ($1, $2)
    RETURNING id;
  `;

  const values = [journalId, studentId];
  const result = await db.query(query, values);

  return result.rows[0];
};
// db/queries.js

const deleteTagsForJournal = async (journalId) => {
  const query = `
    DELETE FROM tags
    WHERE journal_id = $1;
  `;

  const values = [journalId];
  await db.query(query, values);
};



const getJournalsByTeacher = async (teacherId) => {
  const query = `
    SELECT * FROM journals
    WHERE teacher_id = $1;
  `;

  const values = [teacherId];
  const result = await db.query(query, values);

  return result.rows;
};

// db/queries.js

const getJournalsByStudent = async (studentId) => {
  const query = `
    SELECT j.* FROM journals j
    JOIN tags t ON j.id = t.journal_id
    WHERE t.student_id = $1 AND (j.published_date IS NULL OR j.published_date <= CURRENT_DATE);
  `;

  const values = [studentId];
  const result = await db.query(query, values);

  return result.rows;
};

const publishJournal = async (journalId, publishDate) => {
  const query = `
    UPDATE journals
    SET published_date = $1
    WHERE id = $2
    RETURNING *;
  `;

  const values = [publishDate, journalId];
  const result = await db.query(query, values);

  return result.rows[0];
};


module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  
  createJournal,
  getJournalById,
  updateJournal,
  deleteJournal,
  publishJournal,
  
  getJournalsByTeacher,
  getJournalsByStudent,


  createTag,
  deleteTagsForJournal
  // Add other functions here
};
