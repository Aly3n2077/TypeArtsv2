# TypeArts Architecture Patterns & Blueprints

This document outlines the major architecture patterns and blueprints used in the TypeArts marketplace project.

## Database Architecture

### PostgreSQL Implementation

TypeArts uses a PostgreSQL database with the Drizzle ORM for type-safe database operations. The schema defines several entities with relationships:

```
Users ─┬── Artworks ─┬── ArtworkCategories ── Categories
       │            │
       └── Orders ──┴── OrderItems
       │
       └── Favorites
```

Key architectural decisions:
- Primary key standardization across tables (using auto-incrementing integers)
- Foreign key constraints to maintain data integrity
- Timestamps for entity creation tracking
- Boolean flags for feature highlighting (isFeatured, isNew)
- JSON data type for complex structure storage (shipping addresses)

## Frontend Architecture

### Component Design Pattern

The frontend follows a hierarchical component pattern:

1. **App Component**: Root container managing global state and routing
2. **Page Components**: Full page views handling data fetching and layout
3. **Feature Components**: Reusable business logic components (ArtworkGrid, ArtistProfile)
4. **UI Components**: Small, presentational components (from shadcn/ui)

```
App
├── Layout (Header/Footer)
├── Pages
│   ├── Home
│   │   ├── Hero
│   │   ├── FeaturedArtworks
│   │   ├── FeaturedArtists
│   │   └── CallToAction
│   ├── Browse
│   │   ├── Filters
│   │   └── ArtworkGrid
│   │       └── ArtworkCard
│   ├── Artwork
│   │   ├── ArtworkDetails
│   │   └── RelatedArtworks
│   ├── Artist
│   │   ├── ArtistProfile
│   │   └── ArtistPortfolio
│   └── Checkout
│       ├── CartItems
│       ├── ShippingForm
│       └── PaymentForm
```

### State Management Pattern

The application uses a hybrid state management approach:

1. **Local Component State**: useState for UI-specific state
2. **Lifted State**: For shared state between sibling components
3. **Server State**: TanStack Query for remote data fetching and caching
4. **Persisted State**: localStorage for cart and user authentication state

## API Design Pattern

### RESTful API Structure

The API follows RESTful conventions with resource-based URLs:

- Resource collections: `/api/artworks`, `/api/users`
- Specific resources: `/api/artworks/:id`, `/api/users/:id`
- Nested resources: `/api/artworks/artist/:artistId`
- Actions: `/api/create-payment-intent`

### Data Flow Pattern

The application follows a unidirectional data flow:

1. **UI Event** → User interaction triggers action
2. **State Update** → State is updated via hooks
3. **API Request** → Data is sent/requested via TanStack Query
4. **Storage Access** → Server accesses data via Storage interface
5. **Database Operation** → Database is queried/updated
6. **Response Flow** → Data flows back through the same layers

## Authentication Blueprint (Future Implementation)

The planned authentication system will follow these patterns:

1. **JWT Token-based Authentication**:
   - Token generation on login
   - Token storage in HttpOnly cookies
   - Token verification middleware
   
2. **Role-based Authorization**:
   - Artist vs Collector permissions
   - Admin role for marketplace management

## Payment Processing Blueprint

The Stripe integration follows this pattern:

1. **Server-side Intent Creation**:
   - Create payment intent with order details
   - Return client secret to frontend

2. **Client-side Payment Processing**:
   - Initialize Stripe Elements with client secret
   - Handle payment submission and confirmation
   - Redirect to order confirmation

## Error Handling Pattern

The application implements a multi-layer error handling approach:

1. **Client-side Validation**: Form validation with zod schemas
2. **API Request Validation**: Request body validation at API endpoints
3. **Database Error Handling**: Try/catch around storage operations
4. **UI Error States**: Loading, error, and empty states in components

## Responsive Design Pattern

The UI implements a mobile-first responsive design using:

1. **Fluid Grid System**: Using Tailwind's responsive utilities
2. **Breakpoint-based Adaptation**: Component layout changes at breakpoints
3. **Flexible Image Handling**: Images resize proportionally
4. **Touch-friendly Interactions**: Larger tap targets on mobile

## Future Extension Patterns

### AR Preview Feature

The planned AR preview functionality will follow this pattern:

1. **Device Capability Detection**: Check for WebXR support
2. **3D Model Generation**: Convert artwork images to 3D planes
3. **AR Scene Setup**: Place artwork in camera view
4. **Interaction Handling**: Allow positioning and scaling of artwork

### AI Recommendation Engine

The future recommendation system will follow this architecture:

1. **User Behavior Tracking**: Record browsing and interaction patterns
2. **Similarity Calculation**: Compare artwork metadata and user preferences
3. **Recommendation Generation**: Suggest similar artworks
4. **Feedback Loop**: Learn from user interactions with recommendations

## Development Workflow

The project follows a component-driven development workflow:

1. **Schema Definition**: Define data models and relationships
2. **API Implementation**: Create server-side routes and handlers
3. **Component Building**: Create UI components with mock data
4. **Integration**: Connect components to real data sources
5. **Refinement**: Optimize and improve based on testing

This architectural overview provides insight into the patterns and blueprints that guide the TypeArts marketplace implementation.