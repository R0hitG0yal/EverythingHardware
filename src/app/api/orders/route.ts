// | `GET`  | `/api/orders`             | List user’s orders (customer) / all orders (admin)    |
// | `POST` | `/api/orders`             | Place order from cart or direct buy                   |

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user || !("role" in user) || !("id" in user))
      return NextResponse.json("Please SignIn!", {
        status: 401,
      });

    if (user.role === "customer") {
      const orders = await prisma.order.findMany({
        where: {
          userId: user.id,
        },
      });
      return NextResponse.json(orders);
    }

    if (user.role === "admin") {
      const orders = await prisma.order.findMany({});
      return NextResponse.json(orders);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getCurrentUser(req);
    if (!user || !("role" in user) || !("id" in user))
      return NextResponse.json("Please SignIn!", {
        status: 401,
      });

    if (user.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can place orders" },
        { status: 403 }
      );
    }

    const { addressId, paymentMethod, items: directItems } = body || {};

    // Resolve items: use provided items or fall back to cart
    let itemsToOrder: Array<{ productId: number; quantity: number }>;
    if (Array.isArray(directItems) && directItems.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemsToOrder = directItems.map((it: any) => ({
        productId: Number(it.productId),
        quantity: Number(it.quantity),
      }));
    } else {
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: true },
      });
      if (!cart || cart.items.length === 0) {
        return NextResponse.json(
          { error: "No items to order" },
          { status: 400 }
        );
      }
      itemsToOrder = cart.items.map((ci) => ({
        productId: ci.productId,
        quantity: ci.quantity,
      }));
    }

    // Basic validation
    if (
      !itemsToOrder.every((i) => i.productId && i.quantity && i.quantity > 0)
    ) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    // Fetch products and validate stock
    const productIds = [...new Set(itemsToOrder.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    const productById = new Map(products.map((p) => [p.id, p]));

    for (const item of itemsToOrder) {
      const product = productById.get(item.productId)!;
      if (!product.isActive) {
        return NextResponse.json(
          { error: `Product ${product.id} is inactive` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product.id}` },
          { status: 409 }
        );
      }
    }

    // Compute total amount
    const totalAmountNumber = itemsToOrder.reduce((sum, item) => {
      const product = productById.get(item.productId)!;
      const priceNumber = Number(product.price);
      return sum + priceNumber * item.quantity;
    }, 0);

    // Create order in a transaction: order, order items, decrement stock, clear cart if used
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          addressId: addressId ? Number(addressId) : undefined,
          paymentMethod: paymentMethod ?? undefined,
          totalAmount: totalAmountNumber,
        },
      });

      // Create order items
      for (const item of itemsToOrder) {
        const product = productById.get(item.productId)!;
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        });
        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // If items came from cart, clear cart
      if (!Array.isArray(directItems) || directItems.length === 0) {
        const cart = await tx.cart.findFirst({ where: { userId: user.id } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return order;
    });

    // Return order with items
    const orderWithItems = await prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(orderWithItems, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to place order", details: String(err) },
      { status: 400 }
    );
  }
}
