const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const SECRET = "ton_secret_jwt_super_safe"; // à sécuriser avec .env

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base
const dbPath = path.resolve(__dirname, "db.sqlite");
const db = new sqlite3.Database(dbPath);

// Upload d'images
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

app.get("/", (req, res) => {
  res.send("Loka backend is running.");
});

// 🔍 Toutes les annonces avec filtres (page d’accueil / annonces)
app.get("/api/listings", (req, res) => {
  const { title, location, category, minPrice, maxPrice } = req.query;
  let query = "SELECT * FROM listings WHERE 1=1";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title}%`);
  }
  if (location) {
    query += " AND location LIKE ?";
    params.push(`%${location}%`);
  }
  if (category && category !== "all") {
    query += " AND category = ?";
    params.push(category);
  }
  if (minPrice) {
    query += " AND pricePerDay >= ?";
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    query += " AND pricePerDay <= ?";
    params.push(Number(maxPrice));
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ⭐ Annonces en vedette
app.get("/api/featured-listings", (req, res) => {
  db.all("SELECT * FROM listings WHERE isFeatured = 1 LIMIT 3", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ➕ Ajouter une annonce (avec userEmail)
app.post("/api/listings", upload.single("image"), (req, res) => {
  const { title, pricePerDay, location, availability, category, userEmail } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !pricePerDay || !location || !availability || !category || !userEmail) {
    return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis." });
  }

  const id = Date.now().toString();

  db.run(
    `INSERT INTO listings (id, title, pricePerDay, location, availability, imageUrl, category, userEmail)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, pricePerDay, location, availability, imageUrl, category, userEmail],
    (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de l'insertion." });
      res.status(201).json({ message: "Annonce ajoutée avec succès", id });
    }
  );
});

// 🧑‍💼 Récupérer les annonces d’un utilisateur
app.get("/api/user/listings", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email requis" });

  db.all("SELECT * FROM listings WHERE userEmail = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======================= AUTHENTIFICATION =======================

// 🔐 Inscription
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = Date.now().toString();

  const stmt = db.prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)");
  stmt.run(id, name, email, hashedPassword, (err) => {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Email déjà utilisé." });
      }
      return res.status(500).json({ error: "Erreur serveur." });
    }
    res.status(201).json({ message: "Utilisateur enregistré avec succès." });
  });
});

// 🔐 Connexion
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!user) return res.status(401).json({ error: "Utilisateur introuvable." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Connexion réussie", token, user: { name: user.name, email: user.email } });
  });
});

// ================= DÉMARRAGE =================

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
