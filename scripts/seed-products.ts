import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { DEFAULT_PRODUCTS } from "../src/lib/products";
import { connectToDatabase } from "../src/lib/mongodb";
import { Product } from "../src/models/Product";

async function seedProducts() {
  console.log("Starting LUMINA product seed script...");
  await connectToDatabase();

  let count = 0;
  for (const product of DEFAULT_PRODUCTS) {
    await Product.updateOne(
      { slug: product.slug },
      { $set: product },
      { upsert: true }
    );
    count++;
    console.log(`Seeded product: [${product.title}] (Category: ${product.categorySlug}, Brand: ${product.brand})`);
  }

  console.log(`Successfully seeded ${count} LUMINA products into lumina_db.products!`);
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error("Error seeding LUMINA products:", error);
  process.exit(1);
});
