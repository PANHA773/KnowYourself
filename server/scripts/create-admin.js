const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const { connectDb } = require("../src/config/db");
const User = require("../src/models/User");

async function main() {
  const email = String(process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = String(process.env.ADMIN_PASSWORD || "").trim();
  const name = String(process.env.ADMIN_NAME || "Admin").trim();

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment");
  }

  await connectDb(process.env.MONGODB_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    if (password) existing.passwordHash = await bcrypt.hash(password, 10);
    if (name) existing.name = name;
    await existing.save();
    // eslint-disable-next-line no-console
    console.log("Updated existing user to admin:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash, role: "admin" });
  // eslint-disable-next-line no-console
  console.log("Created admin user:", email);
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

