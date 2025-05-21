import { Link } from "wouter";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/browse?category=${category.id}`}>
      <div className="category-card group relative rounded-xl overflow-hidden h-48 md:h-64 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-heading text-xl font-semibold">{category.name}</h3>
          <p className="text-sm text-white/80 max-h-0 group-hover:max-h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            {category.artworkCount.toLocaleString()} artworks
          </p>
        </div>
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 rounded-xl transition-all duration-300"></div>
      </div>
    </Link>
  );
};

export default CategoryCard;
