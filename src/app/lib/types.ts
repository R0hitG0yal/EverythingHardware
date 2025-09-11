export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  brand: string;
  in_stock: boolean;
  specifications: Record<string, unknown>;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
