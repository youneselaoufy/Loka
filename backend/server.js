/* -----------------------------------------------------------
   Loka – backend/server.js  (2025-07-20)
   ► version sans colonne userEmail dans "listings"
----------------------------------------------------------- */

console.log("🟢 [ACTIF] Ceci est le BON server.js exécuté !");
require("dotenv").config({ override: false });

/* ===== Dépendances ===== */
const fs       = require("fs");
const path     = require("path");
const express  = require("express");
const cors     = require("cors");
const sqlite3  = require("sqlite3").verbose();
const multer   = require("multer");
const bcrypt   = require("bcrypt");
const jwt      = require("jsonwebtoken");

/* ===== Config ===== */
const app  = express();
const PORT = process.env.PORT || 4000;

const SECRET = process.env.JWT_SECRET;
if (!SECRET) { console.error("❌ JWT_SECRET manquant"); process.exit(1); }
console.log("✅ JWT_SECRET :", SECRET);

/* ===== CORS / JSON ===== */
const allowedOrigins = [
  "http://localhost:3000",
  "https://loka.youneselaoufy.com",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

/* ===== Uploads ===== */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename   : (_, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
});
app.use("/uploads", express.static(uploadDir));

/* ===== SQLite (schéma déjà présent) ===== */
const dbPath = path.join(__dirname, "db.sqlite");
const db = new sqlite3.Database(dbPath, err => {
  if (err) { console.error("❌ SQLite :", err.message); process.exit(1); }
  db.run("PRAGMA foreign_keys = ON");
  console.log("🗄️  Base ouverte :", dbPath);
});

/* ===== JWT middleware ===== */
function verifyToken(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  if (!token) return res.status(401).json({ error: "Accès non autorisé" });
  try { req.user = jwt.verify(token, SECRET); return next(); }
  catch { return res.status(403).json({ error: "Token invalide" }); }
}

/* =========================================================
   ROUTES
========================================================= */

/* ------- Ping ------- */
app.get("/", (_, res) => res.send("Loka backend is running."));

/* ------- LISTINGS ------- */
app.get("/api/listings", (req, res) => {
  const { title, location, category, minPrice, maxPrice } = req.query;
  const clauses = [], params = [];
  if (title)    { clauses.push("title LIKE ?");         params.push(`%${title}%`); }
  if (location) { clauses.push("location LIKE ?");      params.push(`%${location}%`); }
  if (category && category !== "all") {
                clauses.push("category = ?");           params.push(category); }
  if (minPrice) { clauses.push("pricePerDay >= ?");     params.push(+minPrice); }
  if (maxPrice) { clauses.push("pricePerDay <= ?");     params.push(+maxPrice); }

  const sql = `SELECT * FROM listings${clauses.length ? " WHERE " + clauses.join(" AND ") : ""}`;
  db.all(sql, params, (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

app.get("/api/featured-listings", (_, res) => {
  db.all("SELECT * FROM listings WHERE isFeatured = 1 LIMIT 3",
         (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows));
});

/* ► INSERT : plus de userEmail ◄ */
app.post("/api/listings", upload.single("image"), (req, res) => {
  const { title, pricePerDay, location, availability, category } = req.body;
  if (!title || !pricePerDay || !location || !availability || !category) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }
  const id       = Date.now().toString();
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(`INSERT INTO listings
          (id, title, pricePerDay, location, availability, imageUrl, category)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [id, title, +pricePerDay, location, availability, imageUrl, category],
         err => err
           ? res.status(500).json({ error: err.message })
           : res.status(201).json({ message: "Annonce ajoutée", id }));
});

app.get("/api/listings/:id", (req, res) => {
  db.get("SELECT * FROM listings WHERE id = ?", [req.params.id],
         (err, row) => err
           ? res.status(500).json({ error: err.message })
           : row
             ? res.json(row)
             : res.status(404).json({ error: "Annonce introuvable" }));
});

/* ------- AUTH (inchangé) ------- */
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });

  const hashed = await bcrypt.hash(password, 10);
  db.run("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
         [Date.now().toString(), name, email, hashed],
         err => err
           ? err.message.includes("UNIQUE")
             ? res.status(409).json({ error: "Email déjà utilisé." })
             : res.status(500).json({ error: err.message })
           : res.status(201).json({ message: "Utilisateur enregistré." }));
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err)   return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Utilisateur introuvable." });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email },
                           SECRET, { expiresIn: "7d" });
    res.json({ message: "Connexion réussie", token,
               user: { name: user.name, email: user.email } });
  });
});

/* ------- RENTALS (inchangé) ------- */
app.post("/api/rentals", verifyToken, (req, res) => {
  const { listingId } = req.body;
  if (!listingId) return res.status(400).json({ error: "ID annonce requis" });
  db.run("INSERT INTO rentals (id, userId, listingId, rentalDate) VALUES (?, ?, ?, ?)",
         [Date.now().toString(), req.user.id, listingId, new Date().toISOString()],
         err => err
           ? res.status(500).json({ error: err.message })
           : res.status(201).json({ message: "Location confirmée" }));
});

app.get("/api/rentals", verifyToken, (req, res) => {
  const sql = `SELECT rentals.*, listings.title, listings.imageUrl, listings.pricePerDay
               FROM rentals JOIN listings ON rentals.listingId = listings.id
               WHERE rentals.userId = ?`;
  db.all(sql, [req.user.id],
         (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows));
});

/* ========================================================= */
app.listen(PORT, () => console.log(`✅ Backend prêt sur port ${PORT}`));
