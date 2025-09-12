"use client";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import { getCategoryById } from "../../../redux/features/categories/categoriesSlice";
import { fetchProducts } from "../../../redux/features/products/productsSlice";
import ProductCard from "../../../components/ProductCard";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { ArrowLeft, Package, Grid3X3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryPageProps {
  params: { id: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const dispatch = useAppDispatch();
  const {
    items: categories,
    loading: categoryLoading,
    error: categoryError,
  } = useAppSelector((state) => state.categories);
  const { items: allProducts, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );

  const categoryId = Number(params.id);
  const category = categories.find((c) => c.id === categoryId);
  const categoryProducts = allProducts.filter(
    (p) => p.categoryId === categoryId
  );

  useEffect(() => {
    // Fetch category if not in store
    if (!category) {
      dispatch(getCategoryById({ id: categoryId }));
    }

    // Fetch all products to filter by category
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, categoryId, category, allProducts.length]);

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {categoryError || "The category you're looking for doesn't exist."}
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-orange-600 hover:text-orange-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Category Image */}
          <div className="relative w-full lg:w-64 h-48 lg:h-40 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={category.image ?? "/placeholder-category.jpg"}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-sm">
                <Package className="h-3 w-3 mr-1" />
                Category
              </Badge>
              <Badge variant="outline">
                {categoryProducts.length} Products
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-gray-500 mb-4">
              {category.name}
            </h1>

            {category.description && (
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                {category.description}
              </p>
            )}

            {/* Category Stats */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Grid3X3 className="h-4 w-4" />
                <span>{categoryProducts.length} items available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-500">
            Products in {category.name}
          </h2>
          <div className="text-sm text-gray-600">
            Showing {categoryProducts.length} products
          </div>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : categoryProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-6">
                This category doesn&#39;t have any products yet.
              </p>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse Other Categories
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Link
                href={`/pages/product/${product.id}`}
                key={product.id}
                className="block"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related Categories */}
      {categories.length > 1 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-500 mb-6">
            Other Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories
              .filter((c) => c.id !== categoryId)
              .slice(0, 5)
              .map((relatedCategory) => (
                <Link
                  key={relatedCategory.id}
                  href={`/pages/category/${relatedCategory.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="relative w-full h-20 mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={
                            relatedCategory.image ?? "/placeholder-category.jpg"
                          }
                          alt={relatedCategory.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-medium text-sm text-gray-500 group-hover:text-orange-600 transition-colors">
                        {relatedCategory.name}
                      </h4>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
