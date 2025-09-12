"use client";
import { Search, ShoppingCart, Menu, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { Product } from "../lib/types";

export default function Header() {
  const [search, setSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const { items: products } = useAppSelector((state) => state.products);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!search.trim() || search.length < 2) return [];

    return products
      .filter(
        (product: Product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.brand?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [search, products]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredProducts.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
          handleProductSelect(filteredProducts[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSearch(product.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    // Navigate to product page
    window.location.href = `/pages/product/${product.id}`;
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show suggestions when search changes
  useEffect(() => {
    setShowSuggestions(search.length >= 2 && filteredProducts.length > 0);
    setSelectedIndex(-1);
  }, [search, filteredProducts.length]);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar with contact info */}
      <div className="bg-orange-700 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>+91 7872926780</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Gairkata, Jalpaiguri</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Free Delivery within 10km • Same Day Delivery Available</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-orange-600 text-white p-2 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center font-bold">
                HG
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hardware Galaxy
              </h1>
              <p className="text-xs text-gray-800">Your Local Hardware Store</p>
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 pr-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() =>
                  setShowSuggestions(
                    search.length >= 2 && filteredProducts.length > 0
                  )
                }
              />

              {/* Search Suggestions Dropdown */}
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-50 overflow-y-auto">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                        index === selectedIndex
                          ? "bg-orange-50 border-orange-200"
                          : ""
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex items-center space-x-3">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-gray-500 truncate">
                              {product.brand}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-orange-600">
                            ₹{product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="pl-10 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() =>
                setShowSuggestions(
                  search.length >= 2 && filteredProducts.length > 0
                )
              }
            />

            {/* Mobile Search Suggestions Dropdown */}
            {showSuggestions && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                      index === selectedIndex
                        ? "bg-orange-50 border-orange-200"
                        : ""
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="flex items-center space-x-3">
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        {product.brand && (
                          <p className="text-xs text-gray-500 truncate">
                            {product.brand}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-orange-600">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
