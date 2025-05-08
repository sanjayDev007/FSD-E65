const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let posts = [
    { id: 1, title: "Hello World", content: "First post!" },
    { id: 2, title: "API Guide", content: "Learning APIs is fun!" }
];

// GET all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// GET a single post
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
});

// POST create a new post
app.post('/api/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content required" });
    const newPost = { id: Date.now(), title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// PUT replace a post
app.put('/api/posts/:id', (req, res) => {
    const idx = posts.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Post not found" });
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content required" });
    posts[idx] = { id: posts[idx].id, title, content };
    res.json(posts[idx]);
});

// PATCH update part of a post
app.patch('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    const { title, content } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    res.json(post);
});

// DELETE a post
app.delete('/api/posts/:id', (req, res) => {
    const idx = posts.findIndex(p => p.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: "Post not found" });
    const deleted = posts.splice(idx, 1)[0];
    res.json(deleted);
});

// Error simulation endpoint
app.get('/api/error', (req, res) => {
    res.status(500).json({ error: "Simulated server error" });
});

app.listen(PORT, () => {
    console.log(`Backend API running at http://localhost:${PORT}`);
});
