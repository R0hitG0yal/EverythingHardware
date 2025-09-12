"use client";

import ProductCard from "./ProductCard";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { fetchProducts } from "../redux/features/products/productsSlice";
import Link from "next/link";

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const {
    items: featuredProducts,
    loading,
    error,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">Best selling items from our store</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link href={`/pages/product/${product.id}`} key={product.id} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
