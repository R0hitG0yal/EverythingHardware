import { prisma } from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const { email, password, phone } = body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone }, { email }],
      },
    });

    if (!user)
      return new Response(JSON.stringify({ error: "Please SignUp!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    const verify = bcrypt.compareSync(password, user.passwordHash!);

    if (!verify)
      return new Response(JSON.stringify({ error: "Invalid Credentials!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    // Remove sensitive info
    const { passwordHash, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, secret!);
    cookieStore.set("token", token);

    return new Response(JSON.stringify({ token, user: userWithoutPassword }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `An error occurred during login: ${error}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
