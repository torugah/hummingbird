import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 dias (padrão para "Remember Me")
    },
    cookies: {
        // Personaliza os cookies para sessão persistente
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
                domain: process.env.NODE_ENV === "production" 
                ? "hummingbird-swart.vercel.app" // 👈 Substitua pelo seu domínio
                : undefined, // Localhost não precisa de domain
                // Expiração longa se "Remember Me" estiver ativo
                maxAge: 30 * 24 * 60 * 60, // 30 dias
            },
        },
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
                password: { label: "Password", type: "password" },
                rememberMe: { label: "Remember Me", type: "checkbox" } // Adiciona o campo
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Por favor, preencha todos os campos");
                }

                const existingUser = await db.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!existingUser) {
                    throw new Error("E-mail não encontrado");
                }

                if (existingUser.password) {
                    const passwordMatch = await compare(credentials.password, existingUser.password);
                    if (!passwordMatch) {
                        throw new Error("Senha incorreta");
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
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    username: user.username
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    username: token.username
                }
            }
        }
    }
}