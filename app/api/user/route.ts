import { db } from "@/app/_lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const dynamic = 'force-dynamic'

//Define a schema for input validation
const userSchema = z
  .object({
    username: z.string().min(2,"First Name must be at least 2 characters.").max(101),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters."),
  })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        // check if email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email}
        });
        if(existingUserByEmail){
            return NextResponse.json({ user: null, message: "User with this email already exists"}, { status: 409 })
        }

        // check if username already exists
        const existingUserByUsername = await db.user.findUnique({
            where: { name: username }
        });
        if(existingUserByUsername){
            return NextResponse.json({ user: null, message: "User with this username already exists"}, { status: 409 })
        }

        const hashedPassword = await hash(password, 10)
        const newUser = await db.user.create({
            data: {
                name: username,
                email,
                password: hashedPassword
            }
        })
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: "User created successfully"}, {status: 201});
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input data", errors: error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Log specific Prisma errors for better debugging on the server
            console.error("Prisma Error:", { code: error.code, message: error.message, meta: error.meta });
        } else {
            // Log any other kind of unexpected error
            console.error("Error creating user:", error);
        }

        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}