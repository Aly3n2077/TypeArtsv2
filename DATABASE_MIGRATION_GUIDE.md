# TypeArts: Database Migration Guide

This document provides the steps needed to migrate the TypeArts application from in-memory storage to a persistent PostgreSQL database.

## Prerequisites

Before proceeding with the migration, ensure you have:
- PostgreSQL database provisioned (already done in the Replit environment)
- Environment variables configured (`DATABASE_URL`, etc.)
- All table schemas defined in `shared/schema.ts` (already completed)

## Migration Process

### Step 1: Implement the Database Connection

The connection to PostgreSQL has been set up in `server/db.ts`:

```typescript
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

### Step 2: Create DatabaseStorage Implementation

Replace the current `MemStorage` implementation with a `DatabaseStorage` class that uses Drizzle ORM:

```typescript
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, artworks, categories, artworkCategories, 
  orders, orderItems, favorites,
  type User, type InsertUser,
  type Artwork, type InsertArtwork,
  type Category, type InsertCategory,
  type ArtworkCategory, type InsertArtworkCategory,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Favorite, type InsertFavorite
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  
  // Artwork operations
  async getAllArtworks(): Promise<Artwork[]> {
    return await db.select().from(artworks);
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return await db.select().from(artworks).where(eq(artworks.isFeatured, true));
  }

  async getNewArtworks(): Promise<Artwork[]> {
    return await db.select().from(artworks).where(eq(artworks.isNew, true));
  }

  async getArtworkById(id: number): Promise<Artwork | undefined> {
    const [artwork] = await db.select().from(artworks).where(eq(artworks.id, id));
    return artwork;
  }

  async getArtworksByArtistId(artistId: number): Promise<Artwork[]> {
    return await db.select().from(artworks).where(eq(artworks.artistId, artistId));
  }

  async getArtworksByCategory(categoryId: number): Promise<Artwork[]> {
    const artworkIds = await db
      .select()
      .from(artworkCategories)
      .where(eq(artworkCategories.categoryId, categoryId));
    
    if (artworkIds.length === 0) {
      return [];
    }
    
    const artworkIdValues = artworkIds.map(ac => ac.artworkId);
    return await db
      .select()
      .from(artworks)
      .where(artworks.id.in(artworkIdValues));
  }

  async createArtwork(artwork: InsertArtwork): Promise<Artwork> {
    const [newArtwork] = await db.insert(artworks).values(artwork).returning();
    return newArtwork;
  }

  async updateArtwork(id: number, artworkData: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const [updatedArtwork] = await db
      .update(artworks)
      .set(artworkData)
      .where(eq(artworks.id, id))
      .returning();
    return updatedArtwork;
  }
  
  // Artwork-Category operations
  async createArtworkCategory(artworkCategory: InsertArtworkCategory): Promise<ArtworkCategory> {
    const [newArtworkCategory] = await db
      .insert(artworkCategories)
      .values(artworkCategory)
      .returning();
    return newArtworkCategory;
  }
  
  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
  
  // Order item operations
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  
  // Favorite operations
  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async deleteFavorite(userId: number, artworkId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.artworkId, artworkId)
        )
      );
  }
}
```

### Step 3: Update Storage Instance

Replace the current MemStorage instantiation with DatabaseStorage:

```typescript
// At the end of storage.ts
// export const storage = new MemStorage();
export const storage = new DatabaseStorage();
```

### Step 4: Create Database Tables

Use Drizzle to push the schema to the database:

```bash
# Add this script to package.json
# "db:push": "drizzle-kit push:pg"

# Run the command to create tables
npm run db:push
```

### Step 5: Seed Initial Data (Optional)

If you want to seed the database with initial data:

```typescript
// Create a script in server/seed.ts

import { db } from "./db";
import { users, categories, artworks } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  
  // Seed users
  const [user1] = await db.insert(users).values({
    username: "artist1",
    email: "artist1@example.com",
    password: "password123", // Note: In production, always hash passwords
    firstName: "John",
    lastName: "Doe",
    bio: "Contemporary artist specializing in abstract expressionism",
    profileImageUrl: "https://example.com/profile1.jpg",
    location: "New York, NY",
    isArtist: true,
    isCollector: false
  }).returning();
  
  // Seed categories
  const [category1] = await db.insert(categories).values({
    name: "Abstract",
    description: "Non-representational art that does not attempt to depict reality",
    imageUrl: "https://example.com/abstract.jpg",
  }).returning();
  
  // Seed artworks
  await db.insert(artworks).values({
    title: "Convergence",
    description: "A dynamic abstract piece exploring movement and color",
    price: "1200.00",
    imageUrl: "https://example.com/artwork1.jpg",
    artistId: user1.id,
    medium: "Acrylic on canvas",
    style: "Abstract",
    width: "36",
    height: "48",
    depth: "1.5",
    year: "2023",
    isFeatured: true,
    isNew: true
  });
  
  console.log("Database seeded successfully!");
}

seed().catch(console.error);
```

### Step 6: Testing the Migration

After completing the migration:

1. Start the application
2. Test each API endpoint to ensure data is being stored and retrieved correctly
3. Verify that the frontend application works with the new database storage

### Step 7: Monitoring and Maintenance

After migrating to PostgreSQL:

1. Set up regular database backups
2. Monitor database performance
3. Consider adding indexes for frequently queried columns
4. Implement connection pooling for production environments

## Rollback Plan

If issues occur during the migration:

1. Revert `storage.ts` to use MemStorage
2. Update the affected API endpoints
3. Fix any database-related issues
4. Retry the migration with fixes applied

## Future Database Enhancements

Once the basic migration is complete, consider these enhancements:

1. **Optimized Queries**: Review and optimize database queries
2. **Transactions**: Use transactions for operations that update multiple tables
3. **Soft Delete**: Implement soft delete for entities that shouldn't be permanently removed
4. **Auditing**: Add audit logs for important data changes
5. **Search**: Implement full-text search capabilities

By following these steps, you can successfully migrate from in-memory storage to a persistent PostgreSQL database while minimizing downtime and ensuring data integrity.