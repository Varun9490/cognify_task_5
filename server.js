const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-memory data store
let items = [];

// Routes
app.get("/", (req, res) => {
  res.render("index", { items });
});

app.post("/api/items", (req, res) => {
  const newItem = req.body;
  // Ensure 'id' is provided and unique
  if (!newItem.id) {
    return res.status(400).json({ error: "ID is required" });
  }
  if (items.find((item) => item.id === newItem.id)) {
    return res.status(400).json({ error: "ID must be unique" });
  }
  items.push(newItem);
  res.status(201).json(newItem);
});

app.get("/api/items", (req, res) => {
  res.json(items);
});

app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  items.splice(itemIndex, 1);
  res.status(204).end();
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
