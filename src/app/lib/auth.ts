import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUser(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return new Response(JSON.stringify({ Error: "Invalid Token." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });

    const user = jwt.verify(token, process.env.JWT_SECRET as string);

    if (user && typeof user === "object" && "id" in user) {
      return prisma.user.findUnique({ where: { id: user.id } });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return null;
  }
}
