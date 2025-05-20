import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";
import CategoryCard from "./artwork/CategoryCard";
import { ArrowRight } from "lucide-react";

const ArtCategories = () => {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">Explore Art Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover artwork by medium, style, or subject matter that resonates with your aesthetic preferences.</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden h-48 md:h-64 bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load categories. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/browse">
                <a className="inline-flex items-center text-primary font-accent font-semibold hover:text-accent transition-colors">
                  View All Categories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ArtCategories;
