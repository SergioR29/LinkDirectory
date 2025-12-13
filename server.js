const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Helper to read DB
const readDb = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return [];
    }
};

// Helper to write DB
const writeDb = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing DB:", err);
    }
};

// GET /api/links
app.get('/api/links', (req, res) => {
    const links = readDb();
    res.json(links);
});

// POST /api/links
app.post('/api/links', (req, res) => {
    const { title, url, category } = req.body;
    if (!title || !url || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const links = readDb();
    const newLink = {
        id: Date.now().toString(),
        title,
        url,
        category
    };

    links.push(newLink);
    writeDb(links);

    res.status(201).json(newLink);
});

// DELETE /api/links/:id
app.delete('/api/links/:id', (req, res) => {
    const { id } = req.params;
    const links = readDb();
    const filteredLinks = links.filter(link => link.id !== id);

    if (links.length === filteredLinks.length) {
        return res.status(404).json({ error: "Link not found" });
    }

    writeDb(filteredLinks);
    res.json({ message: "Link deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
