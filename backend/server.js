
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: "postgres", // Change if your PostgreSQL username is different
  host: "localhost",
  database: "blogDB",
  password: "Abhay132004#", // Replace with your actual password
  port: 5432, // Default PostgreSQL port
});

// Fetch all blogs
app.get("/getBlogs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs ORDER BY created_at DESC");
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
    res.json({ success: true, blog: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
