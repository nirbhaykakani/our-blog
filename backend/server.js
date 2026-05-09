const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection for Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Fetch all blogs
app.get("/getBlogs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new blog
app.post("/addBlog", async (req, res) => {
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO blogs (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );

    res.json({
      success: true,
      blog: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Fetch comments for a blog
app.get("/getComments/:blogId", async (req, res) => {
  console.log("HIT /getComments:", req.params.blogId);

  const { blogId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at ASC",
      [blogId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a comment
app.post("/addComment", async (req, res) => {
  const { blog_id, content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO comments (blog_id, content) VALUES ($1, $2) RETURNING *",
      [blog_id, content]
    );

    res.json({
      success: true,
      comment: result.rows[0],
    });
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({
      error: "Database error",
      details: err.message
    });
  }
});

// Dynamic Port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});