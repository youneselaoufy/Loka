/* ------------------------------------------------------------------ */
/*  Loka – serveur Express (SQLite)                                   */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Sécurité – vérifie la présence du secret JWT                      */
/* ------------------------------------------------------------------ */
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  console.error("❌ ERREUR : JWT_SECRET manquant. Ajoute-le dans ton .env ou ton écosystème !");
  process.exit(1);
}
console.log("✅ JWT_SECRET initialisé :", SECRET);

/* ------------------------------------------------------------------ */
/*  Middlewares globaux                                               */
/* ------------------------------------------------------------------ */
const allowedOrigins = [
  "http://localhost:3000",
  "https://loka.youneselaoufy.com"
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

/* ------------------------------------------------------------------ */
/*  Vérification (obligatoire) du token JWT                           */
/* ------------------------------------------------------------------ */
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Accès non autorisé (token manquant)" });
  }
  try {
    req.user = jwt.verify(auth.split(" ")[1], SECRET);
    next();
  } catch (e) {
    console.error("❌ Token invalide :", e.message);
    res.status(403).json({ error: "Token invalide" });
  }
}

/* ------------------------------------------------------------------ */
/*  Base SQLite                                                       */
/* ------------------------------------------------------------------ */
const dbPath = path.resolve(__dirname, "db.sqlite");
const db     = new sqlite3.Database(dbPath);

/* ------------------------------------------------------------------ */
/*  Gestion des fichiers (images)                                     */
/* ------------------------------------------------------------------ */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename   : (_, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads")); // accès public aux images

/* ------------------------------------------------------------------ */
/*  Routes                                                            */
/* ------------------------------------------------------------------ */

/* Simple ping */
app.get("/", (_, res) => res.send("Loka backend is running."));

/* ----------------------- LISTINGS --------------------------------- */

/* GET /api/listings – filtrage dynamique */
app.get("/api/listings", (req, res) => {
  const { title, location, category, minPrice, maxPrice } = req.query;
  let   sql    = "SELECT * FROM listings WHERE 1=1";
  const params = [];

  if (title)     { sql += " AND title     LIKE ?"; params.push(`%${title}%`); }
  if (location)  { sql += " AND location  LIKE ?"; params.push(`%${location}%`); }
  if (category && category !== "all") {
                 sql += " AND category   = ?";   params.push(category);
  }
  if (minPrice)  { sql += " AND pricePerDay >= ?"; params.push(+minPrice); }
  if (maxPrice)  { sql += " AND pricePerDay <= ?"; params.push(+maxPrice); }

  db.all(sql, params, (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

/* GET /api/featured-listings – 3 annonces mises en vedette */
app.get("/api/featured-listings", (_, res) => {
  db.all("SELECT * FROM listings WHERE isFeatured = 1 LIMIT 3",
    (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

/* POST /api/listings – publier une annonce */
app.post("/api/listings", upload.single("image"), (req, res) => {
  // l’e-mail arrive soit via le token (si envoyé), soit dans le body (front existant)
  let userEmail = req.body.userEmail || null;
  try {                                 // tentative de décoder un Bearer éventuel
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      userEmail = jwt.verify(auth.split(" ")[1], SECRET).email;
    }
  } catch { /* silencieux – on garde userEmail du body */ }

  const { title, pricePerDay, location, availability, category } = req.body;
  if (!title || !pricePerDay || !location || !availability || !category || !userEmail) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  const id       = Date.now().toString();
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO listings
                 (id, title, pricePerDay, location, availability, imageUrl, category, userEmail)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [id, title, +pricePerDay, location, availability, imageUrl, category, userEmail];

  db.run(sql, params, err =>
    err ? res.status(500).json({ error: err.message })
        : res.status(201).json({ message: "Annonce ajoutée", id })
  );
});

/* GET /api/listings/:id */
app.get("/api/listings/:id", (req, res) => {
  db.get("SELECT * FROM listings WHERE id = ?", [req.params.id],
    (err, row) =>
      err  ? res.status(500).json({ error: err.message })
    : !row ? res.status(404).json({ error: "Annonce introuvable." })
           : res.json(row)
  );
});

/* GET /api/user/listings – annonces de l’utilisateur connecté */
app.get("/api/user/listings", verifyToken, (req, res) => {
  db.all("SELECT * FROM listings WHERE userEmail = ?", [req.user.email],
    (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

/* ------------------------- AUTH ----------------------------------- */

/* POST /api/register */
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });

  const hashed = await bcrypt.hash(password, 10);
  const id     = Date.now().toString();

  db.run(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashed],
    err => {
      if (err?.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Email déjà utilisé." });
      }
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Utilisateur enregistré." });
    }
  );
});

/* POST /api/login */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err)   return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Utilisateur introuvable." });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );
    res.json({ message: "Connexion réussie", token, user: { name: user.name, email: user.email } });
  });
});

/* ------------------------ RENTALS --------------------------------- */

/* POST /api/rentals – louer une annonce */
app.post("/api/rentals", verifyToken, (req, res) => {
  const { listingId } = req.body;
  if (!listingId) return res.status(400).json({ error: "ID de l'annonce requis." });

  const sql    = `INSERT INTO rentals (id, userId, listingId, rentalDate)
                  VALUES (?, ?, ?, ?)`;
  const params = [Date.now().toString(), req.user.id, listingId, new Date().toISOString()];

  db.run(sql, params, err =>
    err ? res.status(500).json({ error: err.message })
        : res.status(201).json({ message: "Annonce louée avec succès" })
  );
});

/* GET /api/rentals – locations de l’utilisateur */
app.get("/api/rentals", verifyToken, (req, res) => {
  const sql = `SELECT rentals.*, listings.title, listings.imageUrl, listings.pricePerDay
               FROM rentals
               JOIN listings ON rentals.listingId = listings.id
               WHERE rentals.userId = ?`;
  db.all(sql, [req.user.id], (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
});

/* ------------------------------------------------------------------ */
/*  Démarrage                                                         */
/* ------------------------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`✅ Server running on port :${PORT}`);
});
