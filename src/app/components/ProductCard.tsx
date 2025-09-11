"use client";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "./../lib/utils";
import type { Product } from "../lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = `Hi! I'm interested in ${product.name} (₹${product.price}). Is it available?`;
  const whatsappUrl = `https://wa.me/917872926780?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">4.5</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-gray-500">{product.brand}</p>
            </div>
            <Badge variant="secondary" className="text-xs text-gray-500">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium"
            disabled={!product.in_stock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-green-50 border-green-500 text-green-700 hover:bg-green-100 font-medium"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs ml-1">WhatsApp Order</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
