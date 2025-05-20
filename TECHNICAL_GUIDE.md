# TypeArts Technical Guide

This document provides more in-depth technical information about the TypeArts art marketplace application, including architectural decisions, data model details, and implementation notes.

## Database Schema Details

### Users Table
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  firstName: varchar("first_name", { length:
  100 }),
  lastName: varchar("last_name", { length: 100 }),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  location: varchar("location", { length: 100 }),
  isArtist: boolean("is_artist").default(false).notNull(),
  isCollector: boolean("is_collector").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Artworks Table
```typescript
export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  artistId: integer("artist_id").references(() => users.id).notNull(),
  medium: varchar("medium", { length: 100 }),
  style: varchar("style", { length: 100 }),
  width: varchar("width", { length: 50 }),
  height: varchar("height", { length: 50 }),
  depth: varchar("depth", { length: 50 }),
  year: varchar("year", { length: 4 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Categories Table
```typescript
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  artworkCount: integer("artwork_count").default(0).notNull(),
});
```

### Artwork-Categories Junction Table
```typescript
export const artworkCategories = pgTable("artwork_categories", {
  id: serial("id").primaryKey(),
  artworkId: integer("artwork_id").references(() => artworks.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
});
```

### Orders Table
```typescript
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  totalAmount: varchar("total_amount", { length: 50 }).notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  shippingCost: varchar("shipping_cost", { length: 50 }).notNull(),
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Order Items Table
```typescript
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  artworkId: integer("artwork_id").references(() => artworks.id).notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
});
```

### Favorites Table
```typescript
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  artworkId: integer("artwork_id").references(() => artworks.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Storage Implementation

The application currently uses a `MemStorage` class that implements the `IStorage` interface. This class provides in-memory storage functionality for development and testing. Future versions will migrate to `DatabaseStorage` using the Drizzle ORM to interact with PostgreSQL.

### IStorage Interface

The application defines a comprehensive storage interface to ensure consistent data access patterns:

```typescript
export interface IStorage {
  // User operations
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Artwork operations
  getAllArtworks(): Promise<Artwork[]>;
  getFeaturedArtworks(): Promise<Artwork[]>;
  getNewArtworks(): Promise<Artwork[]>;
  getArtworkById(id: number): Promise<Artwork | undefined>;
  getArtworksByArtistId(artistId: number): Promise<Artwork[]>;
  getArtworksByCategory(categoryId: number): Promise<Artwork[]>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  updateArtwork(id: number, artworkData: Partial<InsertArtwork>): Promise<Artwork | undefined>;
  
  // Artwork-Category operations
  createArtworkCategory(artworkCategory: InsertArtworkCategory): Promise<ArtworkCategory>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item operations
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  
  // Favorite operations
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  deleteFavorite(userId: number, artworkId: number): Promise<void>;
}
```

## API Implementation

The backend API is implemented in Express and provides RESTful endpoints for all core application features. The routes are registered in `server/routes.ts`.

### Example API Routes

```typescript
export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: err.errors });
        return;
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Artwork routes
  app.get("/api/artworks", async (req, res) => {
    const artworks = await storage.getAllArtworks();
    res.json(artworks);
  });

  app.get("/api/artworks/featured", async (req, res) => {
    const artworks = await storage.getFeaturedArtworks();
    res.json(artworks);
  });
  
  // More API routes...
}
```

## Frontend Component Architecture

The frontend utilizes a component-based architecture with React, organized into:

- **Layout components**: Header, Footer
- **Page components**: Home, Artwork, Artist, Browse, Checkout
- **Feature components**: ArtworkCard, ArtistCard, Filters, Cart
- **UI components**: Button, Card, Input (from shadcn/ui)

### Component Communication

Components communicate primarily through:
1. **Props**: For parent-child communication
2. **Context**: For global state (planned for future implementation)
3. **TanStack Query**: For server state management
4. **Local state**: For component-specific state using useState/useEffect

### Data Fetching Pattern

```tsx
// Example of data fetching with TanStack Query
const { data: artwork, isLoading, error } = useQuery({
  queryKey: [`/api/artworks/${id}`],
  retry: false,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Stripe Integration (Pending API Keys)

The application includes integration with Stripe for payment processing. The main components are:

1. **Server-side payment intent creation**: Uses Stripe's Node.js SDK to create payment intents
2. **Client-side payment element**: Uses Stripe's React SDK to render payment forms
3. **Webhook handling**: For processing payment events (planned for future implementation)

### Payment Flow

1. User adds artworks to cart
2. User proceeds to checkout and enters shipping information
3. On the payment step, the application creates a payment intent on the server
4. User completes payment using Stripe Elements
5. Server confirms payment and updates order status

## Planned Authentication System

The future authentication system will:

1. Implement JWT-based authentication
2. Support email/password login
3. Add social login options
4. Implement role-based authorization (artist vs collector)
5. Add password reset flows

## Deployment Configuration

The application is configured to deploy on Replit with:

1. PostgreSQL database integration
2. Environment variables for configuration
3. Vite for frontend building
4. Express server for API and static file serving

## Performance Considerations

1. **Database indexes**: Planned for high-traffic queries
2. **API response caching**: Using TanStack Query's built-in caching
3. **Image optimization**: Planned for artwork images
4. **Code splitting**: Using dynamic imports for larger page components

## Security Measures

1. **Input validation**: Using Zod schemas
2. **SQL injection prevention**: Using Drizzle ORM's parameterized queries
3. **CSRF protection**: Planned for implementation
4. **XSS prevention**: React's built-in output escaping
5. **Secure headers**: Planned for implementation

## Testing Strategy

1. **Unit tests**: Planned for core business logic
2. **Integration tests**: Planned for API endpoints
3. **E2E tests**: Planned for critical user flows
4. **Component tests**: Planned for UI components

## Future Technical Considerations

1. **Real-time updates**: Potential WebSocket implementation for notifications
2. **CDN integration**: For artwork image delivery
3. **ML integration**: For artwork recommendations
4. **AR implementation**: Using WebXR API for artwork previews

This technical guide provides a more detailed look at the implementation decisions and architecture of the TypeArts marketplace. Refer to the main README.md for usage instructions and higher-level information.