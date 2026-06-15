"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";

async function getUserId() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user.id;
}

export async function getUserCategories() {
  try {
    const userId = await getUserId();
    return await db.query.categories.findMany({
      where: eq(categories.userId, userId),
      orderBy: (cats, { asc }) => [asc(cats.sortOrder)],
    });
  } catch (error) {
    console.error("[getUserCategories] Failed:", error);
    return [];
  }
}

export async function createCategory(name: string, color?: string) {
  try {
    const userId = await getUserId();
    
    // Very simplistic sort order logic
    const existing = await getUserCategories();
    const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder! + 1 : 0;

    const [newCat] = await db.insert(categories).values({
      userId,
      name,
      sortOrder: nextOrder,
      // Note: If color is desired, it requires a schema update. 
      // For now, we omit storing color directly, but we accept it to maintain UI contract.
    }).returning();

    revalidatePath("/", "layout");
    return newCat;
  } catch (error) {
    console.error("[createCategory] Failed:", error);
    throw error;
  }
}
