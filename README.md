# TypeArts: Art Marketplace Platform

## Project Overview

TypeArts is a web-based art marketplace platform that connects artists with collectors. The platform provides a digital space for artists to showcase and sell their artwork while providing collectors with an intuitive interface to discover, preview, and purchase art.

## Core Features

- **Artist Profiles**: Customizable profiles for artists to showcase their portfolio and biography
- **Artwork Listings**: Detailed listings for individual artwork pieces with descriptions, pricing, and categories
- **Browsing & Discovery**: Category-based and filter-based artwork discovery
- **Shopping Cart**: Full e-commerce functionality to purchase artwork
- **Secure Checkout**: Integration with Stripe for payment processing (pending API key configuration)
- **User Authentication**: Secure user registration and login system

## Technical Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Hooks for local state, TanStack Query for remote state
- **Styling**: Tailwind CSS with Shadcn UI components
- **API Client**: TanStack Query for data fetching and mutations

### Backend
- **Server**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom auth system (planned for future integration with OAuth providers)
- **Payment Processing**: Stripe (integration pending)

### Infrastructure
- **Hosting**: Replit
- **Database Hosting**: Managed PostgreSQL service via Replit

## Application Architecture

### Database Schema

The database schema includes the following entities:

1. **Users**: Store user information for both artists and collectors
2. **Artworks**: Store details about each artwork
3. **Categories**: Art categories for classification
4. **Artwork Categories**: Many-to-many relationship between artworks and categories
5. **Orders**: Track purchases made by collectors
6. **Order Items**: Individual items within an order
7. **Favorites**: User's saved/favorited artworks

### API Endpoints

The backend provides the following API endpoints:

- **User Management**:
  - `GET /api/users/:id`: Get user details
  - `POST /api/users`: Create new user
  - `PATCH /api/users/:id`: Update user information

- **Artwork Management**:
  - `GET /api/artworks`: List all artworks
  - `GET /api/artworks/featured`: Get featured artworks
  - `GET /api/artworks/new`: Get new artworks
  - `GET /api/artworks/:id`: Get artwork details
  - `GET /api/artworks/artist/:id`: Get artworks by artist
  - `GET /api/artworks/category/:id`: Get artworks by category
  - `POST /api/artworks`: Create new artwork

- **Category Management**:
  - `GET /api/categories`: List all categories
  - `GET /api/categories/:id`: Get category details

- **Order Management**:
  - `POST /api/orders`: Create a new order
  - `GET /api/orders/:id`: Get order details
  - `GET /api/orders/user/:id`: Get user's orders
  - `PATCH /api/orders/:id`: Update order status

- **Payment Processing** (pending implementation):
  - `POST /api/create-payment-intent`: Create a Stripe payment intent

### Client-Side Routes

- `/`: Home page
- `/browse`: Browse artwork gallery
- `/artwork/:id`: Individual artwork details
- `/artist/:id`: Artist profile and portfolio
- `/checkout`: Shopping cart and checkout process

## Development Roadmap

### Phase 1: Core Functionality (Current Phase)
- ✅ Initial project setup and infrastructure
- ✅ Database schema design and implementation
- ✅ Basic frontend components and pages
- ✅ Core API endpoints and functionality

### Phase 2: User Experience Enhancements
- 🔄 User authentication system
- 🔄 Artist dashboard for artwork management
- 🔄 Collector dashboard for order history
- 🔄 Advanced search and filtering

### Phase 3: Advanced Features
- 📅 AR preview functionality
- 📅 AI-powered artwork recommendations
- 📅 Shipping logistics integration
- 📅 Social sharing functionality

### Phase 4: Monetization and Scale
- 📅 Subscription-based premium features
- 📅 Commission management system
- 📅 International payment methods
- 📅 Analytics dashboard for marketplace trends

## Getting Started

### Prerequisites
- Node.js and npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Database connection details (provided automatically by Replit)
   - Stripe API keys (for payment processing)

4. Start the development server:
   ```
   npm run dev
   ```

### Configuration

The project requires the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string (provided by Replit)
- `STRIPE_SECRET_KEY`: Stripe secret key (for server-side operations)
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key (for client-side operations)

## Code Structure

```
/
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and shared logic
│   │   ├── pages/        # Individual page components
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Entry point
├── server/               # Backend code
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer
│   └── vite.ts           # Vite server configuration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema definitions
└── package.json          # Project dependencies and scripts
```

## Implementation Notes

### Authentication
The application currently uses a basic authentication system with localStorage for persistence. Future iterations will implement more secure methods like JWT or OAuth.

### State Management
- **Local State**: React's useState and useEffect hooks
- **Server State**: TanStack Query for fetching and caching API data
- **Form State**: react-hook-form with zod validation

### Payment Processing
Stripe integration is configured but awaiting API keys for full functionality. The checkout process is implemented with placeholder functions until API keys are provided.

## Future Enhancements

### AR Preview Functionality
A future enhancement will include AR (Augmented Reality) capabilities, allowing users to visualize artwork in their own space before purchasing.

### AI Artwork Recommendations
Machine learning algorithms will be implemented to provide personalized artwork recommendations based on browsing history and preferences.

### Social Features
Integration with social media platforms for sharing artwork and following favorite artists.

## Changelog

### v0.1.0 (Initial Development)
- Set up project infrastructure with Node.js and PostgreSQL
- Implemented database schema for users, artworks, artists, and transactions
- Created comprehensive frontend component structure
- Developed key pages (home, browse, artwork details, artist profiles, checkout)
- Prepared Stripe integration (pending API keys)

## Contributors

This project was developed by the Replit AI team.

## License

This project is proprietary and not licensed for redistribution or copying.