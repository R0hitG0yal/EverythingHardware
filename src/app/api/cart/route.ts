// | Method   | Endpoint            | Description                                   |
// | -------- | ------------------- | --------------------------------------------- |
// | `GET`    | `/api/cart`         | Get logged-in user’s cart                     |
// | `POST`   | `/api/cart`         | Add product to cart `{ productId, quantity }` |
// | `PUT`    | `/api/cart/:itemId` | Update quantity of cart item                  |
// | `DELETE` | `/api/cart/:itemId` | Remove item from cart                         |
// | `DELETE` | `/api/cart/clear`   | Clear cart                                    |

import { prisma } from "./../../lib/prisma";
import { getCurrentUser } from "./../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !("id" in user))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(cart);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !("id" in user))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  let cart = await prisma.cart.findFirst({ where: { userId: user.id } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: user.id } });

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
    include: { product: true },
  });

  if (existingItem) {
    // Update existing item quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true },
    });
    return NextResponse.json(updatedItem);
  } else {
    // Create new item
    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: true },
    });
    return NextResponse.json(item);
  }
}
