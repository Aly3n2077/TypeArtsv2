import { db } from "./db";
import { artworks } from "@shared/schema";
import { seedArtists } from "./seed-artists";
import { eq } from "drizzle-orm";

export async function seedArtworks() {
  try {
    // Get the artist John Type (or add him if he doesn't exist)
    const johnType = await seedArtists();
    
    // Check if artworks already exist for this artist
    const existingArtworks = await db.select()
      .from(artworks)
      .where(eq(artworks.artistId, johnType.id));
      
    if (existingArtworks.length === 0) {
      // Add John Type's sculptures
      const sculptures = [
        {
          title: "Spiritual Connection",
          description: "An abstract stone sculpture capturing the connection between human and spiritual realms, carved from serpentine stone.",
          price: "2800",
          imageUrl: "https://images.unsplash.com/photo-1576020796936-c79320edfa9d?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3",
          artistId: johnType.id,
          medium: "Stone Sculpture",
          style: "Abstract",
          width: "45cm",
          height: "68cm",
          depth: "30cm",
          weight: "15kg",
          materials: "Serpentine Stone",
          isFeatured: true,
          isNew: true
        },
        {
          title: "Endless Motion",
          description: "A flowing sculpture showcasing John's ability to capture movement in solid stone. The piece suggests continuous motion and grace.",
          price: "3500",
          imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=816&auto=format&fit=crop&ixlib=rb-4.0.3",
          artistId: johnType.id,
          medium: "Stone Sculpture",
          style: "Abstract",
          width: "52cm",
          height: "75cm",
          depth: "28cm",
          weight: "18kg",
          materials: "Springstone",
          isFeatured: true,
          isNew: false
        },
        {
          title: "Ancestral Wisdom",
          description: "A powerful representation of traditional wisdom passed through generations, carved with intricate detail from a single piece of stone.",
          price: "4200",
          imageUrl: "https://images.unsplash.com/photo-1597336355039-710aa053d89f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
          artistId: johnType.id,
          medium: "Stone Sculpture",
          style: "Traditional",
          width: "38cm",
          height: "90cm",
          depth: "25cm",
          weight: "22kg",
          materials: "Opal Stone",
          isFeatured: false,
          isNew: true
        },
        {
          title: "Natural Harmony",
          description: "This sculpture explores the relationship between humanity and nature, showing how we are all interconnected.",
          price: "3200",
          imageUrl: "https://images.unsplash.com/photo-1569411078648-e6bb8bed12ee?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.0.3",
          artistId: johnType.id,
          medium: "Stone Sculpture",
          style: "Modern",
          width: "42cm",
          height: "60cm",
          depth: "32cm",
          weight: "17kg",
          materials: "Springstone",
          isFeatured: false,
          isNew: false
        },
        {
          title: "Divine Grace",
          description: "An elegant piece showcasing the divine feminine energy through smooth curved lines and delicate features.",
          price: "5000",
          imageUrl: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3",
          artistId: johnType.id,
          medium: "Stone Sculpture",
          style: "Abstract",
          width: "35cm",
          height: "82cm",
          depth: "28cm",
          weight: "20kg",
          materials: "Leopard Rock",
          isFeatured: true,
          isNew: true
        }
      ];
      
      // Insert all sculptures
      const insertedArtworks = await db.insert(artworks).values(sculptures).returning();
      
      console.log(`Added ${insertedArtworks.length} sculptures by John Type to the database`);
      return insertedArtworks;
    } else {
      console.log(`${existingArtworks.length} artworks by John Type already exist in the database`);
      return existingArtworks;
    }
  } catch (error) {
    console.error("Error adding artworks:", error);
    throw error;
  }
}