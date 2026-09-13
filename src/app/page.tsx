import { LandingPage } from "@/components/pages/home/LandingPage";
import { fetchAllCategories } from "@/services/productApi";
import { DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";

export const revalidate = 60;

export default async function Home() {
  const categories = await fetchAllCategories();
  return <LandingPage categories={categories} />;
}
