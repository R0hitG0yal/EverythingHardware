"use client";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import { getProductById } from "../../../redux/features/products/productsSlice";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { ShoppingCart, MessageCircle, Star, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../../lib/utils";

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );
  const productId = Number(params.id);

  useEffect(() => {
    dispatch(getProductById({ id: productId }));
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Hi! I'm interested in ${selectedProduct.name} (₹${selectedProduct.price}). Is it available?`;
  const whatsappUrl = `https://wa.me/917872926780?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-orange-600 hover:text-orange-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={selectedProduct.imageUrl ?? "/placeholder-product.jpg"}
              alt={selectedProduct.name}
              fill
              className="object-cover"
              priority
            />
            {selectedProduct.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {selectedProduct.category?.name ?? "Uncategorized"}
              </Badge>
              {selectedProduct.brand && (
                <Badge variant="outline">{selectedProduct.brand}</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-500 mb-4">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.5) • 128 reviews</span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Price and Stock */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatPrice(selectedProduct.price)}
                  </p>
                  {selectedProduct.unit && (
                    <p className="text-sm text-gray-500">
                      per {selectedProduct.unit}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <Badge
                    variant={
                      selectedProduct.stock > 0 ? "default" : "destructive"
                    }
                  >
                    {selectedProduct.stock > 0
                      ? `${selectedProduct.stock} available`
                      : "Out of stock"}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    size="lg"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                    disabled={selectedProduct.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full bg-green-50 border-green-500 text-green-700 hover:bg-green-100 font-medium"
                    onClick={() => window.open(whatsappUrl, "_blank")}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">
                    {selectedProduct.brand || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {selectedProduct.category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit:</span>
                  <span className="font-medium">
                    {selectedProduct.unit || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">
                    {selectedProduct.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
