require("dotenv").config();
const bcrypt = require("bcryptjs");
const { get, run } = require("../db");

function main() {
  const [name, email, password] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.error('Usage: node server/scripts/create-admin.js "Full Name" email@example.com password');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase();
  const passwordHash = bcrypt.hashSync(password, 10);
  const existing = get("SELECT id FROM admins WHERE email = ?", [normalizedEmail]);

  if (existing) {
    run("UPDATE admins SET name = ?, password_hash = ? WHERE id = ?", [name, passwordHash, existing.id]);
    console.log(`Updated existing admin: ${normalizedEmail}`);
  } else {
    run("INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)", [name, normalizedEmail, passwordHash]);
    console.log(`Created admin: ${normalizedEmail}`);
  }
}

main();
