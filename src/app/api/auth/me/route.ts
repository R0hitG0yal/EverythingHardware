import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";
import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(user, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    const token = cookieStore.get("token")?.value;

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      if (user && typeof user === "object" && "id" in user) {
        const updatedUser = await prisma.user.update({
          where: { email: user.email },
          data: {
            name,
            email,
            phone,
            passwordHash,
            role,
            updatedAt: new Date(),
          },
        });

        const updatedToken = jwt.sign(
          updatedUser,
          process.env.JWT_SECRET as string
        );

        cookieStore.set("token", updatedToken);

        return new Response(JSON.stringify(token), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
