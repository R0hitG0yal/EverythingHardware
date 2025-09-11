import { prisma } from "./../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
    include: { category: true },
  });
  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const updated = await prisma.product.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.product.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
