const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 255 }),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed.'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Invalid date format.'),
];

const updateValidation = [
  body('title').optional().trim().isLength({ max: 255 }),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be pending or completed.'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Invalid date format.'),
];

// Routes
router.get('/', getTasks);
router.post('/', taskValidation, createTask);
router.put('/:id', updateValidation, updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);

module.exports = router;
