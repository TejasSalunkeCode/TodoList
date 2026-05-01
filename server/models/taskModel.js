const pool = require('../config/db');

const TaskModel = {
  // Get all tasks for a user with optional search/filter/pagination
  async findAllByUser({ userId, search, status, page, limit }) {
    const offset = (page - 1) * limit;
    const params = [userId];
    let conditions = 'WHERE user_id = $1';
    let paramIndex = 2;

    if (status && status !== 'all') {
      conditions += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      conditions += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Count total matching tasks
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tasks ${conditions}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Fetch paginated tasks
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM tasks ${conditions}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    return { tasks: result.rows, total };
  },

  // Get a single task by id (with ownership check)
  async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },

  // Create a new task
  async create({ userId, title, description, status, due_date }) {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, description || null, status || 'pending', due_date || null]
    );
    return result.rows[0];
  },

  // Update an existing task
  async update(id, userId, { title, description, status, due_date }) {
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           due_date = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, status, due_date || null, id, userId]
    );
    return result.rows[0];
  },

  // Toggle task status
  async toggleStatus(id, userId) {
    const result = await pool.query(
      `UPDATE tasks
       SET status = CASE WHEN status = 'pending' THEN 'completed' ELSE 'pending' END
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  },

  // Delete a task
  async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  },
};

module.exports = TaskModel;
