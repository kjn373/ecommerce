'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const checkoutSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: Yup.string()
    .required('City is required'),
  country: Yup.string()
    .required('Country is required'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Postal code must be in format 12345 or 12345-6789')
});

interface CheckoutFormValues {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, loadFromDatabase } = useCartStore();
  const { data: session, status } = useSession();
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialValues: CheckoutFormValues = {
    name: session?.user?.username || '',
    email: session?.user?.email || '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  };

  useEffect(() => {
    fetchShippingCost();
  }, []);

  // Load cart from database when user is logged in
  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      loadFromDatabase();
    }
  }, [session, status, loadFromDatabase]);

  const fetchShippingCost = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setShippingCost(data.shippingCharge || 0);
    } catch (error) {
      console.error('Error fetching shipping cost:', error);
    }
  };

  const subtotal = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async (values: CheckoutFormValues) => {
    if (status !== 'authenticated') {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        ...values,
        products: items.map((item: CartItem) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const order = await response.json();
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/order-confirmation/${order._id}`);
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-card py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 font-heading">Your Cart</h1>
          <div className="text-center text-gray-500">
            Your cart is empty
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 font-heading">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-heading font-semibold mb-4">Cart Items</h2>
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="object-cover rounded-full w-20 h-20"
                      fill
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-card rounded-lg shadow p-6  h-[750px]">
            <h2 className="text-xl font-heading font-semibold mb-4">Checkout</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={checkoutSchema}
              onSubmit={handleCheckout}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Field
                      as={Input}
                      name="name"
                      className={errors.name && touched.name ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      className={errors.email && touched.email ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <Field
                      as={Input}
                      name="address"
                      className={errors.address && touched.address ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Field
                      as={Input}
                      name="city"
                      className={errors.city && touched.city ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Field
                      as={Input}
                      name="country"
                      className={errors.country && touched.country ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <Field
                      as={Input}
                      name="postalCode"
                      className={errors.postalCode && touched.postalCode ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : status === 'authenticated' ? 'Place Order' : 'Login to Checkout'}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
} 