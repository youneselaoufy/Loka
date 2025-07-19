console.log("��� [ACTIF] Ceci est le BON server.js exécuté !");
require("dotenv").config({ override: false }); // ✅ À garder en haut

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET;

// ✅ Debug token secret
console.log("✅ JWT_SECRET utilisé :", SECRET);

// ✅ Autoriser plusieurs origines (localhost + domaine prod)
const allowedOrigins = [
  "http://localhost:3000",
  "https://loka.youneselaoufy.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ Vérification du token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès non autorisé" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token invalide:", err.message);
    return res.status(403).json({ error: "Token invalide" });
  }
}

// ✅ Connexion à la base
const dbPath = path.resolve(__dirname, "db.sqlite");
const db = new sqlite3.Database(dbPath);

// ✅ Upload images
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

app.get("/", (req, res) => res.send("Loka backend is running."));

// 🔍 Filtrage dynamique
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

// ⭐ Sélection vedette
app.get("/api/featured-listings", (req, res) => {
  db.all("SELECT * FROM listings WHERE isFeatured = 1 LIMIT 3", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ➕ Créer une annonce
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

// 🔍 Obtenir une annonce
app.get("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM listings WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!row) return res.status(404).json({ error: "Annonce introuvable." });
    res.json(row);
  });
});

// 🔍 Annonces par utilisateur
app.get("/api/user/listings", verifyToken, (req, res) => {
  const email = req.user.email;
  db.all("SELECT * FROM listings WHERE userEmail = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ================= AUTH =================

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = Date.now().toString();

  db.run(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashedPassword],
    (err) => {
      if (err?.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Email déjà utilisé." });
      }
      if (err) return res.status(500).json({ error: "Erreur serveur." });
      res.status(201).json({ message: "Utilisateur enregistré avec succès." });
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!user) return res.status(401).json({ error: "Utilisateur introuvable." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect." });

console.log("DEBUG SIGN TOKEN SECRET:", SECRET)
console.log("DEBUG SIGN TOKEN typeof SECRET:", typeof SECRET)
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Connexion réussie", token, user: { name: user.name, email: user.email } });
  });
});

// 📦 Louer une annonce
app.post("/api/rentals", verifyToken, (req, res) => {
  const rentalId = Date.now().toString();
  const userId = req.user.id;
  const { listingId } = req.body;
  const rentalDate = new Date().toISOString();

  if (!listingId) return res.status(400).json({ error: "ID de l'annonce requis" });

  db.run(
    "INSERT INTO rentals (id, userId, listingId, rentalDate) VALUES (?, ?, ?, ?)",
    [rentalId, userId, listingId, rentalDate],
    (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de la location." });
      res.status(201).json({ message: "Annonce louée avec succès", rentalId });
    }
  );
});

// 📦 Voir les locations
app.get("/api/rentals", verifyToken, (req, res) => {
  const userId = req.user.id;
  db.all(
    `SELECT rentals.*, listings.title, listings.imageUrl, listings.pricePerDay 
     FROM rentals 
     JOIN listings ON rentals.listingId = listings.id 
     WHERE rentals.userId = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.json(rows);
    }
  );
});

// ================= DÉMARRAGE =================

app.listen(PORT, () => {
  console.log(`✅ Server running on port :${PORT}`);
});
