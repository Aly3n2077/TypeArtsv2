import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ShippingForm from "@/components/cart/ShippingForm";
import CartItem from "@/components/cart/CartItem";
import { Artwork } from "@shared/schema";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface CheckoutProps {
  cart: Artwork[];
  updateCartItemQuantity: (artworkId: number, quantity: number) => void;
  removeFromCart: (artworkId: number) => void;
  clearCart?: () => void;
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

const Checkout = ({ 
  cart = [], 
  updateCartItemQuantity, 
  removeFromCart,
  clearCart
}: CheckoutProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Calculate shipping when cart changes
    if (cart.length > 0) {
      calculateShipping();
    }
  }, [cart, shippingInfo.country]);

  const calculateShipping = async () => {
    try {
      // If we don't have an address yet, use default values
      if (!shippingInfo.country) return;

      const response = await apiRequest("POST", "/api/shipping/calculate", {
        destination: {
          country: shippingInfo.country,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode
        },
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity || 1
        }))
      });
      
      const data = await response.json();
      setShippingCost(data.cost);
    } catch (error) {
      setShippingCost(25); // Fallback shipping cost
      console.error("Error calculating shipping:", error);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + parseFloat(item.price.toString()) * (item.quantity || 1);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost;
  };

  const handleShippingSubmit = (data: any) => {
    setShippingInfo(data);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Process the order
      const orderData = {
        userId: 1, // This would come from authenticated user
        totalAmount: calculateTotal().toString(),
        status: "pending",
        shippingAddress: shippingInfo,
        shippingCost: shippingCost.toString(),
      };

      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const order = await orderResponse.json();

      // Add order items
      for (const item of cart) {
        await apiRequest("POST", `/api/orders/${order.id}/items`, {
          orderId: order.id,
          artworkId: item.id,
          price: item.price,
          quantity: item.quantity || 1
        });
      }

      setCurrentStep('confirmation');
      if (clearCart) clearCart();
    } catch (error) {
      toast({
        title: "Error processing payment",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (cart.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 max-w-3xl">
        <Helmet>
          <title>Your Cart | TypeArts</title>
        </Helmet>
        
        <h1 className="font-heading text-3xl font-bold text-center mb-6">Your Cart</h1>
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/browse">
              <Button className="bg-primary hover:bg-accent text-white font-accent">
                Browse Artwork
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {currentStep === 'confirmation' 
            ? 'Order Confirmation | TypeArts' 
            : 'Checkout | TypeArts'}
        </title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 mt-16 max-w-5xl">
        {currentStep !== 'confirmation' && (
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold mb-6 text-center">Checkout</h1>
            
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  currentStep === 'cart' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`h-1 w-16 mx-1 ${
                  currentStep === 'shipping' || currentStep === 'payment' ? 'bg-primary' : 'bg-gray-200'
                }`}></div>
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  currentStep === 'shipping' ? 'bg-primary text-white' : 
                  currentStep === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <div className={`h-1 w-16 mx-1 ${
                  currentStep === 'payment' ? 'bg-primary' : 'bg-gray-200'
                }`}></div>
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  currentStep === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'cart' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-xl font-bold">Your Cart</h2>
                    <span className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <CartItem 
                        key={item.id} 
                        item={item} 
                        updateQuantity={updateCartItemQuantity}
                        removeItem={removeFromCart}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Link href="/browse">
                      <a className="text-primary hover:text-accent flex items-center font-medium">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                      </a>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold mb-6">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(calculateTotal())}</span>
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentStep('shipping')}
                    className="w-full bg-primary hover:bg-accent text-white font-accent"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {currentStep === 'shipping' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-bold mb-6">Shipping Information</h2>
                  <ShippingForm onSubmit={handleShippingSubmit} initialValues={shippingInfo} />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold mb-6">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(calculateTotal())}</span>
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentStep('cart')}
                    variant="outline"
                    className="w-full mb-3"
                  >
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {currentStep === 'payment' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-bold mb-6">Payment Information</h2>
                  
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Security Code
                          </label>
                          <input
                            type="text"
                            placeholder="CVC"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep('shipping')}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-primary hover:bg-accent text-white font-accent"
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Complete Purchase'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Shipping to:</h3>
                    <p className="text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}
                    </p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(calculateTotal())}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {currentStep === 'confirmation' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <CheckCircle className="h-16 w-16 text-success" />
                </div>
                
                <h1 className="font-heading text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                  Thank you for your purchase. Your order has been successfully placed and a confirmation email has been sent to {shippingInfo.email}.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-heading text-lg font-semibold mb-4">Order Summary</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Shipping Information:</h4>
                    <p className="text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                      {shippingInfo.country}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Payment Amount:</h4>
                    <p className="text-accent font-bold">{formatPrice(calculateTotal())}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button className="bg-primary hover:bg-accent text-white font-accent">
                      Return to Home
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => navigate('/browse')}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
