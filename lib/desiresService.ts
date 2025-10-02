import { ListaDeDesejos } from "@prisma/client";

export async function getDesires(userId: string | null | undefined): Promise<ListaDeDesejos[]> {
  if (!userId) {
    // console.log("No user ID found, skipping category fetch.");
    return [];
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'

    const response = await fetch(`${baseUrl}/api/desires?userId=${userId}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // console.log("No desiress found for this user.");
        return [];
      }
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error("Error in getCategories:", error);
    return [];
  }
}