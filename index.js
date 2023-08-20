require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

const auth = require('./Controllers/auth');
const journal = require('./Controllers/journal');
const authenticate = require('./middleware/authenticateToken');


const db = require('./db/dbConnection'); 
const JWT_SECRET =  process.env.JWT_SECRET; 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.db = db.client; 
  next();
});

app.use((req, res, next) => {
  req.JWT_SECRET = JWT_SECRET; 
  next();
});

// Use the routes
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with a specified role.
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: boolean
 *             required:
 *               - username
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       500:
 *         description: An error occurred
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user and provides a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: An error occurred
 */
app.use('/api/user', auth);


/**
 * @swagger
 * /api/user/journal/create:
 *   post:
 *     summary: Create a new journal entry
 *     description: Creates a new journal entry with tags for students. Only teachers can create journals.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               studentUsernames:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - description
 *               - studentUsernames
 *     responses:
 *       201:
 *         description: New journal entry created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       403:
 *         description: Permission denied. Only teachers can create journals.
 *       500:
 *         description: An error occurred
 */

/**
 * @swagger
 * /api/user/journal/update/{id}:
 *   post:
 *     summary: Update a journal entry
 *     description: Updates a journal entry with new description and tags for students. Only the teacher who created the journal can update it.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the journal entry to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               studentUsernames:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - description
 *     responses:
 *       200:
 *         description: Journal entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       403:
 *         description: Permission denied. Only teachers can update journals.
 *       404:
 *         description: Journal entry not found or permission denied
 *       500:
 *         description: An error occurred
 */

/**
 * @swagger
 * /api/user/journal/delete/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     description: Deletes a journal entry. Only the teacher who created the journal can delete it.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the journal entry to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Journal entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Permission denied. Only teachers can delete journals.
 *       404:
 *         description: Journal entry not found or permission denied
 *       500:
 *         description: An error occurred
 */

/**
 * @swagger
 * /api/user/journal/publish/{id}:
 *   post:
 *     summary: Publish a journal entry
 *     description: Publishes a journal entry with the specified publish date. Only the teacher who created the journal can publish it.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the journal entry to publish
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publish_date:
 *                 type: string
 *                 format: date
 *             required:
 *               - publish_date
 *     responses:
 *       200:
 *         description: Journal entry published successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       403:
 *         description: Permission denied. Only teachers can publish journals.
 *       404:
 *         description: Journal entry not found or permission denied
 *       500:
 *         description: An error occurred
 */

/**
 * @swagger
 * /api/user/journal/feed:
 *   get:
 *     summary: Get journal feed
 *     description: Returns the journal feed for the authenticated user. For teachers, it returns journals created by them. For students, it returns journals tagged to them and published before the current date.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Journal feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journal'
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred
 */
app.use('/api/user/journal',authenticate,journal)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




