import { Search, ShoppingCart, Menu, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

export default function Header() {
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
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 pr-4"
              />
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
