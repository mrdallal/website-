/**
 * Seed script: creates the initial admin user and default settings.
 *
 * It deliberately does NOT create sample leads, clients, projects or tasks.
 * The dashboard is designed to show honest empty states until real data exists.
 *
 * Run with: pnpm db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "TECHSIDES Admin";

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the admin user.");
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("ADMIN_PASSWORD must be at least 10 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, role: "ADMIN" },
    create: { email, name, passwordHash, role: "ADMIN" },
    select: { id: true, email: true, role: true },
  });
  console.log(`Admin user ready: ${admin.email} (${admin.role})`);

  const defaults: { key: string; value: string }[] = [
    { key: "agency_name", value: "TECHSIDES" },
    { key: "lead_auto_reply_enabled", value: "false" },
  ];
  for (const setting of defaults) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`Default settings ready (${defaults.length}).`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
