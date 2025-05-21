import {
  users, type User, type InsertUser,
  artworks, type Artwork, type InsertArtwork,
  categories, type Category, type InsertCategory,
  artworkCategories, type ArtworkCategory, type InsertArtworkCategory,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  favorites, type Favorite, type InsertFavorite
} from "@shared/schema";
import { eq, and, inArray } from "drizzle-orm";

// Storage interface for all CRUD operations
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private artworks: Map<number, Artwork>;
  private artworkCategories: Map<number, ArtworkCategory>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private favorites: Map<number, Favorite>;
  
  private userId: number = 1;
  private categoryId: number = 1;
  private artworkId: number = 1;
  private artworkCategoryId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;
  private favoriteId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.artworks = new Map();
    this.artworkCategories = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.favorites = new Map();
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Initialize with categories
    const categoryData: InsertCategory[] = [
      { name: 'Paintings', description: 'Original paintings in various styles and mediums', imageUrl: 'https://pixabay.com/get/g9204b5672bb74636973af60a666baf740854da7c8b154c26494a47562d6dc9a0710abed3993ac93f673cdfe79481cc85a30800035191a08f782555c46551cd3c_1280.jpg', artworkCount: 2453 },
      { name: 'Sculpture', description: 'Three-dimensional artworks in various materials', imageUrl: 'https://pixabay.com/get/ga08d9b4891d35e8b544cefb8bdbc0302533ab3c0c92448e3c2e2eed28844d5fedc0297c4830bcab65f9d51779d98da3b1f59ea13dea2c20b831040da3fe6eb6a_1280.jpg', artworkCount: 1237 },
      { name: 'Digital Art', description: 'Art created or presented using digital technology', imageUrl: 'https://pixabay.com/get/ge61ff26c67b87c5411ec3d8d4d772d17aeeadcfd43d2d0d58ee8e358f95de1a0c5ed6d55cd9a13ca65e24fdbd1a2adf55e49689c5eb54f893ee85ddf5d496034_1280.jpg', artworkCount: 954 },
      { name: 'Photography', description: 'Fine art photography prints and limited editions', imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350', artworkCount: 1782 },
    ];
    
    categoryData.forEach(cat => this.createCategory(cat));
    
    // Initialize with users (artists)
    const artistData: InsertUser[] = [
      { 
        username: 'johntype', 
        email: 'john.type@example.com', 
        password: 'securepassword', 
        firstName: 'John', 
        lastName: 'Type', 
        bio: 'John grew up in Chitungwiza and started sculpting in 1989 with a sculptor called Kennedy Migeal, working as his assistant. After a year or so John started sculpting in his own right. John prefers to sculpt in abstract form and captures the grace and movement of each subject. Each piece will have a story to tell, which comes from experience and inspiration in his surrounding environment. John believes he is gifted by God to create such art forms, as he is the only one in his family that is sculpting. John has an ability to use the natural and spiritual elements of stone to create works of art that are incredibly expressive of movement and formation. Most of Johns works are in private collections around the world, from Germany, Canada, Belgium, Holland, the U.S. and the UK. As co-founder of TypeArts, John is committed to [our mission of connecting talented artists with global collectors](/mission).',
        profileImageUrl: 'https://images.unsplash.com/photo-1516756587022-7891ad56a8cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        location: 'Chitungwiza, Zimbabwe',
        isArtist: true,
        isCollector: false
      },
      { 
        username: 'sarawalters', 
        email: 'sara@example.com', 
        password: 'password123', 
        firstName: 'Sara', 
        lastName: 'Walters', 
        bio: 'Contemporary abstract painter known for vibrant color palettes and dynamic compositions that evoke emotional resonance.',
        profileImageUrl: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e',
        location: 'New York, USA',
        isArtist: true,
        isCollector: false
      },
      { 
        username: 'davidchen', 
        email: 'david@example.com', 
        password: 'password123', 
        firstName: 'David', 
        lastName: 'Chen', 
        bio: 'Traditional oil painter specializing in atmospheric landscapes that capture the serene beauty of the Pacific Northwest.',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        location: 'Vancouver, Canada',
        isArtist: true,
        isCollector: false
      },
      { 
        username: 'jasmine', 
        email: 'jasmine@example.com', 
        password: 'password123', 
        firstName: 'Jasmine', 
        lastName: 'Lee', 
        bio: 'Contemporary sculptor working with bronze and mixed media to create pieces that explore urban identity and movement.',
        profileImageUrl: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d',
        location: 'Seoul, South Korea',
        isArtist: true,
        isCollector: false
      }
    ];
    
    const artists = artistData.map(artist => this.createUser(artist));
    
    // Initialize with artworks
    const artworkData: InsertArtwork[] = [
      {
        title: 'Harmony of Stone',
        description: 'An abstract stone sculpture that captures the grace and movement of its subject, reflecting John Type\'s unique ability to blend natural and spiritual elements.',
        price: '4500',
        imageUrl: 'https://images.unsplash.com/photo-1620200423727-8127f75d4f3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        artistId: 1,
        medium: 'Stone',
        style: 'Abstract',
        width: '24',
        height: '36',
        depth: '18',
        year: 2023,
        isFeatured: true,
        isNew: true
      },
      {
        title: 'Spiritual Movement',
        description: 'A flowing abstract sculpture that demonstrates John Type\'s signature style, telling a story inspired by his surrounding environment in Zimbabwe.',
        price: '5200',
        imageUrl: 'https://images.unsplash.com/photo-1553292022-03ba522870d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        artistId: 1,
        medium: 'Stone',
        style: 'Abstract',
        width: '30',
        height: '42',
        depth: '22',
        year: 2022,
        isFeatured: true,
        isNew: false
      },
      {
        title: 'Chromatic Dreams',
        description: 'A vibrant abstract painting exploring the relationship between color and emotion.',
        price: '3200',
        imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5',
        artistId: 2,
        medium: 'Acrylic',
        style: 'Abstract',
        width: '36',
        height: '48',
        depth: '1.5',
        year: 2023,
        isFeatured: true,
        isNew: false
      },
      {
        title: 'Serene Horizon',
        description: 'A peaceful landscape capturing the tranquility of a mountain lake at dawn.',
        price: '4850',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
        artistId: 2,
        medium: 'Oil',
        style: 'Landscape',
        width: '40',
        height: '30',
        depth: '1.5',
        year: 2023,
        isFeatured: false,
        isNew: false
      },
      {
        title: 'Urban Rhythm',
        description: 'A bronze sculpture depicting the flow and energy of city life.',
        price: '7500',
        imageUrl: 'https://pixabay.com/get/gfce8226febed1f309a0882950f8176e12fb8e7aad3518f09345f9f1b35e8fa93e33784a5e18466038fafadcc49e8c7d6fa094fe8a36d6b0f89a30ef4881a626b_1280.jpg',
        artistId: 3,
        medium: 'Bronze',
        style: 'Contemporary',
        width: '18',
        height: '24',
        depth: '12',
        year: 2023,
        isFeatured: false,
        isNew: true
      }
    ];
    
    artworkData.forEach(artwork => this.createArtwork(artwork));
    
    // Connect artworks to categories
    this.createArtworkCategory({ artworkId: 1, categoryId: 2 }); // Harmony of Stone - Sculptures
    this.createArtworkCategory({ artworkId: 2, categoryId: 2 }); // Spiritual Movement - Sculptures
    this.createArtworkCategory({ artworkId: 3, categoryId: 1 }); // Chromatic Dreams - Paintings
    this.createArtworkCategory({ artworkId: 4, categoryId: 1 }); // Serene Horizon - Paintings
    this.createArtworkCategory({ artworkId: 5, categoryId: 2 }); // Urban Rhythm - Sculpture
  }
  
  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const newUser: User = { ...user, id, createdAt };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Artwork operations
  async getAllArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values());
  }
  
  async getFeaturedArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.isFeatured);
  }
  
  async getNewArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.isNew);
  }
  
  async getArtworkById(id: number): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }
  
  async getArtworksByArtistId(artistId: number): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(artwork => artwork.artistId === artistId);
  }
  
  async getArtworksByCategory(categoryId: number): Promise<Artwork[]> {
    const artworkCategoryEntries = Array.from(this.artworkCategories.values())
      .filter(ac => ac.categoryId === categoryId);
    
    const artworkIds = artworkCategoryEntries.map(ac => ac.artworkId);
    
    return Array.from(this.artworks.values())
      .filter(artwork => artworkIds.includes(artwork.id));
  }
  
  async createArtwork(artwork: InsertArtwork): Promise<Artwork> {
    const id = this.artworkId++;
    const createdAt = new Date();
    const newArtwork: Artwork = { ...artwork, id, createdAt };
    this.artworks.set(id, newArtwork);
    return newArtwork;
  }
  
  async updateArtwork(id: number, artworkData: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const artwork = this.artworks.get(id);
    if (!artwork) return undefined;
    
    const updatedArtwork: Artwork = { ...artwork, ...artworkData };
    this.artworks.set(id, updatedArtwork);
    return updatedArtwork;
  }
  
  // Artwork-Category operations
  async createArtworkCategory(artworkCategory: InsertArtworkCategory): Promise<ArtworkCategory> {
    const id = this.artworkCategoryId++;
    const newArtworkCategory: ArtworkCategory = { ...artworkCategory, id };
    this.artworkCategories.set(id, newArtworkCategory);
    return newArtworkCategory;
  }
  
  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const createdAt = new Date();
    const newOrder: Order = { ...order, id, createdAt };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order item operations
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
  
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
  
  // Favorite operations
  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteId++;
    const createdAt = new Date();
    const newFavorite: Favorite = { ...favorite, id, createdAt };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }
  
  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(favorite => favorite.userId === userId);
  }
  
  async deleteFavorite(userId: number, artworkId: number): Promise<void> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.artworkId === artworkId
    );
    
    if (favorite) {
      this.favorites.delete(favorite.id);
    }
  }
}

// Import the database connection
import { db } from "./db";

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
      .set({ ...userData })
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
    return await db
      .select()
      .from(artworks)
      .where(eq(artworks.featured, true))
      .limit(10);
  }

  async getNewArtworks(): Promise<Artwork[]> {
    return await db
      .select()
      .from(artworks)
      .orderBy(desc(artworks.createdAt))
      .limit(10);
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

    if (artworkIds.length === 0) return [];

    const artworkIdList = artworkIds.map(ac => ac.artworkId);
    return await db
      .select()
      .from(artworks)
      .where(artworks.id.in(artworkIdList));
  }

  async createArtwork(artwork: InsertArtwork): Promise<Artwork> {
    const [newArtwork] = await db.insert(artworks).values(artwork).returning();
    return newArtwork;
  }

  async updateArtwork(id: number, artworkData: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const [updatedArtwork] = await db
      .update(artworks)
      .set({ ...artworkData })
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

// Use MemStorage for now to avoid database connectivity issues
export const storage = new MemStorage();
