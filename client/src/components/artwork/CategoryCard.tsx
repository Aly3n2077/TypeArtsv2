import { Link } from "wouter";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/browse?category=${category.id}`}>
      <a className="category-card group relative rounded-xl overflow-hidden h-48 md:h-64 shadow-md hover-scale">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="font-heading text-xl font-semibold">{category.name}</h3>
          <p className="text-sm text-white/80">{category.artworkCount.toLocaleString()} artworks</p>
        </div>
      </a>
    </Link>
  );
};

export default CategoryCard;
