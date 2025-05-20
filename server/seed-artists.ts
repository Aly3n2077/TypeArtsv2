import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedArtists() {
  try {
    // Check if John Type already exists
    const existingArtist = await db.select()
      .from(users)
      .where(eq(users.username, "johntype"));
      
    if (existingArtist.length === 0) {
      // Add John Type to the database
      const johnType = await db.insert(users).values({
        username: "johntype",
        email: "john.type@example.com",
        password: "securepassword",
        firstName: "John",
        lastName: "Type",
        bio: "John grew up in Chitungwiza and started sculpting in 1989 with a sculptor called Kennedy Migeal, working as his assistant. After a year or so John started sculpting in his own right. John prefers to sculpt in abstract form and captures the grace and movement of each subject. Each piece will have a story to tell, which comes from experience and inspiration in his surrounding environment. John believes he is gifted by God to create such art forms, as he is the only one in his family that is sculpting. John has an ability to use the natural and spiritual elements of stone to create works of art that are incredibly expressive of movement and formation. Most of Johns works are in private collections around the world, from Germany, Canada, Belgium, Holland, the U.S. and the UK.",
        profileImageUrl: "https://images.unsplash.com/photo-1516756587022-7891ad56a8cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        location: "Chitungwiza, Zimbabwe",
        isArtist: true,
        isCollector: false
      }).returning();
      
      console.log("Added artist John Type to the database");
      return johnType[0];
    } else {
      console.log("Artist John Type already exists in the database");
      return existingArtist[0];
    }
  } catch (error) {
    console.error("Error adding artist:", error);
    throw error;
  }
}