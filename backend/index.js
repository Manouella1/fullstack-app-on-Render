const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL setup
const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // Attach user info to the request
    next();
  });
}

// Serve static files from the 'dist' directory (for frontend)
app.use(express.static(path.join(__dirname, "dist")));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Test route
app.get("/users", async (_req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM users");
    res.send(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USER AUTH ROUTES *******

// Register User POST
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password generated");
  try {
    const result = await client.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINTS FOR POSTS *********************

app.get("/posts", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    res.json({ posts: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/posts", async (req, res) => {
  const { userId, title, content } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content]
    );
    res.json({ post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await client.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id]
    );
    res.json({ post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await client.query("DELETE FROM posts WHERE id = $1", [id]);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINTS FOR COMMENTS *************
// GET Comments Endpoint
app.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      `SELECT comments.*, users.username
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`,
      [id]
    );
    res.json({ comments: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Comment Endpoint
app.post("/posts/:id/comments", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, parentCommentId } = req.body;
  const userId = req.user.id; // Securely obtained from the token

  try {
    const result = await client.query(
      "INSERT INTO comments (post_id, user_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, userId, content, parentCommentId || null]
    );
    res.json({ comment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route to serve `index.html` for client-side routing in Vue
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
