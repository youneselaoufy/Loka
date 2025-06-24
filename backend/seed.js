const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite");

db.serialize(() => {
  // TABLE: listings
  db.run(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      pricePerDay INTEGER,
      location TEXT,
      availability TEXT,
      imageUrl TEXT,
      category TEXT,
      isFeatured BOOLEAN,
      rating REAL,
      ownerName TEXT
    )
  `);

  const listings = [
    ["Perceuse à percussion Makita Pro", 20, "Montréal, QC", "Immédiate", "/uploads/perceuse.png", "Outils", 1, 4.8, "Jean D."],
    ["Vélo de montagne Norco Adulte", 35, "Laval, QC", "Dès demain", "/uploads/velo.png", "Sports", 0, 4.5, null],
    ["Tondeuse Ryobi", 25, "Québec, QC", "Week-ends", "/uploads/tondeuse.png", "Jardinage", 1, null, null],
    ["Camping Woods", 45, "Longueuil, QC", "Sur demande", "/uploads/camping.png", "Sports", 0, 4.2, null],
    ["JBL Charge 5", 15, "Gatineau, QC", "Immédiate", "/uploads/jbl.png", "Électronique", 1, null, null],
    ["Brouette Garant", 10, "Sherbrooke, QC", "10/08", "/uploads/brouette.png", "Jardinage", 0, null, null],
    ["Kayak Pelican", 30, "Trois-Rivières, QC", "Immédiate", "/uploads/kayak.png", "Sports", 0, 4.0, null]
  ];

  const stmt = db.prepare(`
    INSERT INTO listings (title, pricePerDay, location, availability, imageUrl, category, isFeatured, rating, ownerName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  listings.forEach((l) => stmt.run(l));
  stmt.finalize();

  // TABLE: users (ajoutée ici)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  console.log("Database seeded.");
});

db.close();
