import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import { Category } from "@shared/schema";

interface ArtworkFiltersProps {
  categories: Category[];
  selectedCategory: number | null;
  priceRange: [number, number];
  availableMediums: string[];
  selectedMediums: string[];
  searchQuery: string;
  onCategoryChange: (categoryId: number | null) => void;
  onPriceChange: (range: [number, number]) => void;
  onMediumChange: (medium: string) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const ArtworkFilters = ({
  categories,
  selectedCategory,
  priceRange,
  availableMediums,
  selectedMediums,
  searchQuery,
  onCategoryChange,
  onPriceChange,
  onMediumChange,
  onSearchChange,
  onClearFilters,
}: ArtworkFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const handlePriceSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setLocalPriceRange(newRange);
    onPriceChange(newRange);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            type="text"
            placeholder="Search artwork..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-2.5 text-gray-400 hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-sm w-full border-primary text-primary hover:bg-primary hover:text-white"
        >
          <X className="h-4 w-4 mr-1" /> Clear Filters
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "medium"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="font-accent font-semibold">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(null)}
                  className={`text-sm mr-2 ${
                    selectedCategory === null
                      ? "bg-primary text-white"
                      : "border-gray-300"
                  }`}
                >
                  All
                </Button>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Button
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange(category.id)}
                    className={`text-sm mr-2 ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {category.name}
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="font-accent font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-2">
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                value={[localPriceRange[0], localPriceRange[1]]}
                max={10000}
                step={100}
                onValueChange={handlePriceSliderChange}
                className="mb-6"
              />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="price-min">Min</Label>
                  <Input
                    id="price-min"
                    type="number"
                    value={localPriceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setLocalPriceRange([value, localPriceRange[1]]);
                        onPriceChange([value, localPriceRange[1]]);
                      }
                    }}
                    className="w-24"
                  />
                </div>
                <div className="text-center">
                  <span className="text-gray-400">to</span>
                </div>
                <div>
                  <Label htmlFor="price-max">Max</Label>
                  <Input
                    id="price-max"
                    type="number"
                    value={localPriceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= localPriceRange[0]) {
                        setLocalPriceRange([localPriceRange[0], value]);
                        onPriceChange([localPriceRange[0], value]);
                      }
                    }}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="medium">
          <AccordionTrigger className="font-accent font-semibold">
            Medium
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {availableMediums.map((medium) => (
                <div key={medium} className="flex items-center space-x-2">
                  <Checkbox
                    id={`medium-${medium}`}
                    checked={selectedMediums.includes(medium)}
                    onCheckedChange={() => onMediumChange(medium)}
                  />
                  <label
                    htmlFor={`medium-${medium}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {medium}
                  </label>
                </div>
              ))}
              {availableMediums.length === 0 && (
                <p className="text-gray-500 text-sm">No mediums available</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ArtworkFilters;
