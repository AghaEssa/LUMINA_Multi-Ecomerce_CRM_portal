import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { DEFAULT_CATEGORIES } from "../src/lib/categories";
import { connectToDatabase } from "../src/lib/mongodb";
import { Category } from "../src/models/Category";


async function seed() {
  console.log("Starting LUMINA category seed script...");
  await connectToDatabase();

  let count = 0;
  for (const category of DEFAULT_CATEGORIES) {
    await Category.updateOne(
      { slug: category.slug },
      { $set: category },
      { upsert: true }
    );
    count++;
    console.log(`Seeded category: [${category.name}] (${category.slug})`);
  }

  console.log(`Successfully seeded ${count} LUMINA categories into lumina_db!`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding LUMINA categories:", error);
  process.exit(1);
});

