import { prisma } from "./../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: categoryId ? Number(categoryId) : undefined,
      name: search ? { contains: search, mode: "insensitive" } : undefined,
    },
    include: { category: true },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const data = await req.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json(product);
}
