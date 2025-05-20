import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertArtworkSchema, insertOrderSchema, insertOrderItemSchema, insertFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User API routes
  app.post('/api/users/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  
  app.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // In a real app, would generate JWT here
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        isArtist: user.isArtist,
        isCollector: user.isCollector,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl
      });
    } catch (error) {
      res.status(500).json({ message: 'Error during login' });
    }
  });
  
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return password
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  });
  
  // Category API routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });
  
  app.get('/api/categories/:id', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.getCategoryById(categoryId);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category' });
    }
  });
  
  // Artwork API routes
  app.get('/api/artworks', async (req, res) => {
    try {
      const artworks = await storage.getAllArtworks();
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching artworks' });
    }
  });
  
  app.get('/api/artworks/featured', async (req, res) => {
    try {
      const artworks = await storage.getFeaturedArtworks();
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching featured artworks' });
    }
  });
  
  app.get('/api/artworks/new', async (req, res) => {
    try {
      const artworks = await storage.getNewArtworks();
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching new artworks' });
    }
  });
  
  app.get('/api/artworks/:id', async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const artwork = await storage.getArtworkById(artworkId);
      
      if (!artwork) {
        return res.status(404).json({ message: 'Artwork not found' });
      }
      
      // Get artist details for the artwork
      const artist = await storage.getUserById(artwork.artistId);
      
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found for this artwork' });
      }
      
      // Don't return artist password
      const { password, ...artistData } = artist;
      
      res.json({
        ...artwork,
        artist: artistData
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching artwork' });
    }
  });
  
  app.get('/api/artists/:id/artworks', async (req, res) => {
    try {
      const artistId = parseInt(req.params.id);
      const artworks = await storage.getArtworksByArtistId(artistId);
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching artist artworks' });
    }
  });
  
  app.get('/api/categories/:id/artworks', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const artworks = await storage.getArtworksByCategory(categoryId);
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category artworks' });
    }
  });
  
  app.post('/api/artworks', async (req, res) => {
    try {
      const artworkData = insertArtworkSchema.parse(req.body);
      const artwork = await storage.createArtwork(artworkData);
      res.status(201).json(artwork);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid artwork data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating artwork' });
    }
  });
  
  // Order API routes
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating order' });
    }
  });
  
  app.post('/api/orders/:orderId/items', async (req, res) => {
    try {
      const orderItemData = insertOrderItemSchema.parse(req.body);
      const orderItem = await storage.createOrderItem(orderItemData);
      res.status(201).json(orderItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order item data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating order item' });
    }
  });
  
  app.get('/api/orders/:id', async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItemsByOrderId(order.id);
      
      res.json({
        ...order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order' });
    }
  });
  
  app.get('/api/users/:userId/orders', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user orders' });
    }
  });
  
  app.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order status' });
    }
  });
  
  // Favorite API routes
  app.post('/api/favorites', async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.createFavorite(favoriteData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid favorite data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating favorite' });
    }
  });
  
  app.get('/api/users/:userId/favorites', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavoritesByUserId(userId);
      
      // Get full artwork details for each favorite
      const artworkPromises = favorites.map(async (favorite) => {
        const artwork = await storage.getArtworkById(favorite.artworkId);
        return {
          ...favorite,
          artwork
        };
      });
      
      const favoritesWithArtworks = await Promise.all(artworkPromises);
      res.json(favoritesWithArtworks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user favorites' });
    }
  });
  
  app.delete('/api/favorites', async (req, res) => {
    try {
      const { userId, artworkId } = req.body;
      
      if (!userId || !artworkId) {
        return res.status(400).json({ message: 'User ID and artwork ID are required' });
      }
      
      await storage.deleteFavorite(userId, artworkId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error removing favorite' });
    }
  });
  
  // Shipping cost calculation (simplified)
  app.post('/api/shipping/calculate', async (req, res) => {
    try {
      const { destination, items } = req.body;
      
      if (!destination || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Destination and items array are required' });
      }
      
      // Simple shipping calculation based on item count and destination
      // In a real app, would integrate with shipping APIs
      const baseRate = 15;
      const itemRate = 5 * items.length;
      
      // Add rates based on destination region
      let regionRate = 0;
      if (destination.country !== 'United States') {
        regionRate = 25;
      } else if (destination.state === 'Alaska' || destination.state === 'Hawaii') {
        regionRate = 15;
      }
      
      const totalShippingCost = baseRate + itemRate + regionRate;
      
      res.json({
        cost: totalShippingCost,
        currency: 'USD',
        estimatedDelivery: '5-7 business days'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating shipping cost' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
