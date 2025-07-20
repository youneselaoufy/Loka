/* -----------------------------------------------------------
   Loka – backend/server.js  (version corrigée)
----------------------------------------------------------- */
console.log("🟢 [ACTIF] Ceci est le BON server.js exécuté !");

require("dotenv").config({ override: false });

const express  = require("express");
const cors     = require("cors");
const sqlite3  = require("sqlite3").verbose();
const path     = require("path");
const multer   = require("multer");
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");

const app  = express();
const PORT = process.env.PORT || 4000;

/* ---------- Sécurité : secret JWT obligatoire ---------- */
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  console.error("❌ ERREUR : JWT_SECRET est manquant dans les variables d'environnement !");
  process.exit(1);
}
console.log("✅ JWT_SECRET initialisé :", SECRET);

/* ---------- CORS ---------- */
const allowedOrigins = [
  "http://localhost:3000",
  "https://loka.youneselaoufy.com"
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

/* ---------- Body parsing ---------- */
app.use(express.json());

/* ---------- Vérification de JWT ---------- */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès non autorisé" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    console.error("❌ Token invalide :", err.message);
    res.status(403).json({ error: "Token invalide" });
  }
}

/* ---------- Base SQLite ---------- */
const dbPath = path.resolve(__dirname, "db.sqlite");
const db     = new sqlite3.Database(dbPath);

/* ---------- Upload d’images ---------- */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename   : (_, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

/* =======================================================
   ROUTES
======================================================= */

/* --- Alive check --- */
app.get("/", (_, res) => res.send("Loka backend is running."));

/* -------- LISTINGS -------- */

/* GET /api/listings */
app.get("/api/listings", (req, res) => {
  const { title, location, category, minPrice, maxPrice } = req.query;

  const filters = [];
  const params  = [];

  if (title)               { filters.push("title LIKE ?");         params.push(`%${title}%`); }
  if (location)            { filters.push("location LIKE ?");      params.push(`%${location}%`); }
  if (category && category !== "all") {
                           filters.push("category = ?");           params.push(category);       }
  if (minPrice)            { filters.push("pricePerDay >= ?");     params.push(Number(minPrice)); }
  if (maxPrice)            { filters.push("pricePerDay <= ?");     params.push(Number(maxPrice)); }

  let query = "SELECT * FROM listings";
  if (filters.length) {
    query += " WHERE " + filters.join(" AND ");
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* GET /api/featured-listings */
app.get("/api/featured-listings", (_, res) => {
  db.all("SELECT * FROM listings WHERE isFeatured = 1 LIMIT 3", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* POST /api/listings */
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
    err => {
      if (err) return res.status(500).json({ error: "Erreur lors de l'insertion." });
      res.status(201).json({ message: "Annonce ajoutée avec succès", id });
    }
  );
});

/* GET /api/listings/:id */
app.get("/api/listings/:id", (req, res) => {
  db.get("SELECT * FROM listings WHERE id = ?", [req.params.id], (err, row) => {
    if (err)   return res.status(500).json({ error: "Erreur serveur." });
    if (!row)  return res.status(404).json({ error: "Annonce introuvable." });
    res.json(row);
  });
});

/* GET /api/user/listings */
app.get("/api/user/listings", verifyToken, (req, res) => {
  db.all("SELECT * FROM listings WHERE userEmail = ?", [req.user.email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* -------- AUTH -------- */

/* POST /api/register */
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Champs requis manquants." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = Date.now().toString();

  db.run(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashedPassword],
    err => {
      if (err?.message.includes("UNIQUE")) return res.status(409).json({ error: "Email déjà utilisé." });
      if (err) return res.status(500).json({ error: "Erreur serveur." });
      res.status(201).json({ message: "Utilisateur enregistré avec succès." });
    }
  );
});

/* POST /api/login */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!user) return res.status(401).json({ error: "Utilisateur introuvable." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );
    res.json({ message: "Connexion réussie", token, user: { name: user.name, email: user.email } });
  });
});

/* -------- RENTALS -------- */

/* POST /api/rentals */
app.post("/api/rentals", verifyToken, (req, res) => {
  const { listingId } = req.body;
  if (!listingId) return res.status(400).json({ error: "ID de l'annonce requis" });

  const rentalId   = Date.now().toString();
  const rentalDate = new Date().toISOString();

  db.run(
    "INSERT INTO rentals (id, userId, listingId, rentalDate) VALUES (?, ?, ?, ?)",
    [rentalId, req.user.id, listingId, rentalDate],
    err => {
      if (err) return res.status(500).json({ error: "Erreur lors de la location." });
      res.status(201).json({ message: "Annonce louée avec succès", rentalId });
    }
  );
});

/* GET /api/rentals */
app.get("/api/rentals", verifyToken, (req, res) => {
  db.all(
    `SELECT rentals.*, listings.title, listings.imageUrl, listings.pricePerDay
     FROM rentals
     JOIN listings ON rentals.listingId = listings.id
     WHERE rentals.userId = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.json(rows);
    }
  );
});

/* =======================================================
   Lancement du serveur
======================================================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port :${PORT}`);
});
