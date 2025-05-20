import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artwork } from "@shared/schema";
import { Link } from "wouter";

interface CartItemProps {
  item: Artwork & { quantity?: number };
  updateQuantity: (artworkId: number, quantity: number) => void;
  removeItem: (artworkId: number) => void;
}

const CartItem = ({ item, updateQuantity, removeItem }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const formatPrice = (price: string | number) => {
    return `$${Number(price).toLocaleString()}`;
  };

  const calculateItemTotal = () => {
    return formatPrice(parseFloat(item.price.toString()) * quantity);
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <Link href={`/artwork/${item.id}`}>
            <a>
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover rounded-md" 
              />
            </a>
          </Link>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <Link href={`/artwork/${item.id}`}>
                <a className="font-heading font-semibold hover:text-primary transition-colors">
                  {item.title}
                </a>
              </Link>
              <div className="text-sm text-gray-600">
                {item.medium}{item.style ? `, ${item.style}` : ''}
              </div>
            </div>
            
            <div className="text-accent font-accent font-bold">
              {calculateItemTotal()}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className={`p-1 border border-gray-300 rounded-l-md ${
                  quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    handleQuantityChange(value);
                  }
                }}
                className="w-12 h-8 border-y border-gray-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemove}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
