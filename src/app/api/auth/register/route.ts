// Method	Endpoint	        Description	                        Body / Params
// POST	    /api/auth/register	Register new user	                { name, email?, phone, password? }
// POST	    /api/auth/login	    Login (email+password OR phone OTP)	{ email/phone, password/otp }
// POST	    /api/auth/logout	Logout user	                        —
// GET	    /api/users/me	    Get profile of logged-in user	    Auth header
// PUT	    /api/users/me	    Update profile	                    { name, phone, ... }

import { PrismaClient } from "@/generated/prisma";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role } = body;

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: role ? role : "customer",
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
