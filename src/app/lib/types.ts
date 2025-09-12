// Generated from prisma/schema.prisma domain model (frontend-friendly types)

export type ID = number;

export enum Role {
  customer = "customer",
  admin = "admin",
  delivery = "delivery",
}

export enum OrderStatus {
  pending = "pending",
  confirmed = "confirmed",
  shipped = "shipped",
  delivered = "delivered",
  cancelled = "cancelled",
}

export enum PaymentType {
  COD = "COD",
  Razorpay = "Razorpay",
}

export enum PaymentStatus {
  unpaid = "unpaid",
  paid = "paid",
  failed = "failed",
}

export enum DeliveryStatus {
  assigned = "assigned",
  out_for_delivery = "out_for_delivery",
  delivered = "delivered",
}

export interface Address {
  id: ID;
  userId: ID;
  addressLine: string;
  city: string;
  pincode: string;
  state: string; // default handled server-side
  landmark?: string | null;
  isDefault: boolean;
  createdAt: Date;
}

export interface User {
  id: ID;
  name: string;
  email?: string | null;
  phone?: string | null;
  passwordHash?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  addresses?: Address[];
  orders?: Order[];
  deliveries?: Delivery[]; // as DeliveryPerson
  reviews?: Review[];
  carts?: Cart[];
}

export interface Category {
  id: ID;
  name: string;
  description?: string | null;
  image: string;
  slug: string;
  parentId?: ID | null;
  children?: Category[];
  products?: Product[];
}

export interface Product {
  id: ID;
  name: string;
  description?: string | null;
  categoryId?: ID | null;
  price: number; // Prisma Decimal represented as number in UI
  stock: number;
  unit?: string | null;
  brand?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  orderItems?: OrderItem[];
  cartItems?: CartItem[];
  inventory?: InventoryLog[];
  reviews?: Review[];
}

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  quantity: number;
  price: number; // Decimal
}

export interface Order {
  id: ID;
  userId: ID;
  addressId?: ID | null;
  status: OrderStatus;
  paymentMethod: PaymentType;
  paymentStatus: PaymentStatus;
  totalAmount: number; // Decimal
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  delivery?: Delivery | null;
}

export interface CartItem {
  id: ID;
  cartId: ID;
  productId: ID;
  quantity: number;
}

export interface Cart {
  id: ID;
  userId: ID;
  createdAt: Date;
  items?: CartItem[];
}

export interface Delivery {
  id: ID;
  orderId: ID; // unique per schema
  deliveryPersonId: ID;
  status: DeliveryStatus;
  assignedAt: Date;
  deliveredAt?: Date | null;
}

export interface InventoryLog {
  id: ID;
  productId: ID;
  change: number;
  reason?: string | null;
  createdAt: Date;
}

export interface Review {
  id: ID;
  productId: ID;
  userId: ID;
  rating: number;
  comment?: string | null;
  createdAt: Date;
}

// Convenience aggregate shapes often used in UI
export interface CategoryWithChildren extends Category {
  children: Category[];
}

export interface ProductWithCategory extends Product {
  category?: Category | null;
}

// export type Product = {
//   id: number;
//   name: string;
//   description?: string;
//   category?: string;
//   stock: number;
//   unit?: String;
//   image_url?: string;
//   price: number;
//   brand?: string;
//   isActive?: boolean;

//   specifications: Record<string, unknown>;
//   created_at: string;
//   updated_at: string;
//   orderItems: OrderItem[];
//   cartItems: CartItem[];
//   inventory: InventoryLog[];
//   reviews: Review[];
// };

// export type Category = {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   image_url: string;
// };

// export type CartItem = {
//   product: Product;
//   quantity: number;
// };
