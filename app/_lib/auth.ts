import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/'
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {        

            if (!credentials?.email || !credentials?.password){
                return null;
            }            
      
            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email}
            });
            if(!existingUser){
                return null;
            }

            if(existingUser.password){
                const passwordMatch = await compare(credentials.password, existingUser.password);

                if(!passwordMatch){
                    return null;
                }
            }
            

            return {
                id: `${existingUser.id}`,
                name: existingUser.name,
                username: existingUser.username,
                email: existingUser.email,
                image: existingUser.image
            }
          }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name 
                }
            }
            return token;
        },
        async session({ session, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name
                }
            }
        }
    }
}
