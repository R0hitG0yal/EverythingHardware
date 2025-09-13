"use client";
import React, { useEffect } from "react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import {
  fetchCart,
  removeItem,
  updateItemQuantity,
} from "@/app/redux/features/cart/cartSlice";
import { Card, CardContent } from "@/app/components/ui/card";
import { ShoppingCart } from "lucide-react";
// import { updateCartItem, removeCartItem, fetchCart } from "../../redux/features/cart/cartSlice"; // Uncomment if you have these

const CartPage: React.FC = () => {
  const {
    items: cartItems,
    loading,
    error,
  } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product?.price) * Number(item.quantity),
    0
  );

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: string, value: number) => {
    dispatch(updateItemQuantity({ itemId: Number(itemId), quantity: value }));
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeItem(Number(itemId)));
  };

  if (loading) {
    return <div className="py-8 text-center">Loading cart...</div>;
  }
  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load cart: {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 w-screen min-h-screen">
      <h2 className="container mx-auto px-4 pt-12 max-w-4xl text-3xl text-orange-900 font-bold">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-amber-600">Review your items before checkout</p>
        </div>
      </h2>
      {cartItems.length === 0 ? (
        <Card className="text-center container mx-auto px-4 max-w-4xl py-16 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven&#39;t added anything to your cart yet.
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full"
              >
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 container mx-auto px-4 py-12 max-w-3xl">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-amber-100 rounded-lg shadow p-4"
            >
              <div className="flex items-center">
                {item.product && item.product.imageUrl && (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="rounded object-cover mr-4 w-16 h-16"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {item.product?.name}
                  </div>
                  {item.product?.brand && (
                    <div className="text-xs text-gray-500">
                      {item.product.brand}
                    </div>
                  )}
                  {item.product?.price !== undefined && (
                    <div className="text-amber-600 font-bold">
                      ₹{item.product.price}{" "}
                      <span className="text-gray-500 font-normal text-xs">
                        x {item.quantity}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-700">
                    Total: ₹
                    {item.product?.price !== undefined
                      ? (item.product.price * item.quantity).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={String(item.quantity)}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id.toString(),
                        Number(e.target.value)
                      )
                    }
                    className="w-16 text-center bg-amber-800"
                  />
                  <Button
                    variant="outline"
                    className="bg-amber-800"
                    size="sm"
                    onClick={() => handleRemove(String(item.id))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Totals section */}
          <div className="flex flex-col items-end border-t pt-6">
            <div className="mb-2 text-lg text-amber-600 font-semibold">
              Items:{" "}
              <span className="font-bold text-amber-800">{totalQuantity}</span>
            </div>
            <div className="mb-4 text-xl text-amber-600 font-bold">
              Subtotal:{" "}
              <span className="font-bold text-amber-800">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <Button
              size="lg"
              className=" mx-auto max-w-lg w-full mt-8 bg-amber-700 hover:bg-orange-700 text-white py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
