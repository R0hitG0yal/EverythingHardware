import ProductCard from "./ProductCard";
import type { Product } from "../lib/types";

// Mock data - in real app, this would come from Supabase
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Asian Paints Tractor Emulsion - White (20L)",
    description:
      "Premium quality interior wall paint with excellent coverage and durability",
    price: 3200,
    image_url:
      "https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Paints",
    brand: "Asian Paints",
    in_stock: true,
    specifications: { volume: "20L", type: "Emulsion" },
    created_at: "2024-01-01",
  },
  {
    id: "2",
    name: "Havells Crabtree Athena 16A Switch",
    description: "Modular switch with superior quality and elegant design",
    price: 145,
    image_url:
      "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Electrical",
    brand: "Havells",
    in_stock: true,
    specifications: { amperage: "16A", type: "Modular" },
    created_at: "2024-01-01",
  },
  {
    id: "3",
    name: "Supreme PVC Pipe 4 inch (6 meter)",
    description: "High quality PVC pipe for plumbing and drainage applications",
    price: 890,
    image_url:
      "https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Plumbing",
    brand: "Supreme",
    in_stock: true,
    specifications: { diameter: "4 inch", length: "6 meter" },
    created_at: "2024-01-01",
  },
  {
    id: "4",
    name: "Bosch GSB 500 RE Impact Drill",
    description: "Professional grade impact drill with variable speed control",
    price: 2850,
    image_url:
      "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Tools",
    brand: "Bosch",
    in_stock: false,
    specifications: { power: "500W", type: "Impact Drill" },
    created_at: "2024-01-01",
  },
  {
    id: "5",
    name: "Godrej Locking System - Digital",
    description: "Smart digital door lock with keypad and emergency key backup",
    price: 8500,
    image_url:
      "https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Hardware",
    brand: "Godrej",
    in_stock: true,
    specifications: { type: "Digital", backup: "Emergency Key" },
    created_at: "2024-01-01",
  },
  {
    id: "6",
    name: "ACC Cement - OPC 53 Grade (50kg)",
    description: "High strength cement for construction and structural work",
    price: 385,
    image_url:
      "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Building Materials",
    brand: "ACC",
    in_stock: true,
    specifications: { grade: "OPC 53", weight: "50kg" },
    created_at: "2024-01-01",
  },
];

export default function FeaturedProducts() {
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
