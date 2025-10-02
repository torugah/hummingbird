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
            //name: `next-auth.session-token`, //Usado em desenvolvimento
            name: `__Secure-next-auth.session-token`, //Usado somente em produção com HTTPS
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? "hummingbird-swart.vercel.app" : "localhost", 
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
        async signIn({ user, account, profile }) {
            // console.log('SignIn Callback:', { user, account, profile });
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                // console.log('True User - JWT Callback:', { token, user, account });
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    username: user.username
                }
            }
            // console.log('False User - JWT Callback:', { token, user, account });
            return token;
        },
        async session({ session, token, user }) {
            // console.log('Session Callback:', { session, token, user });
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
    },
    // No authOptions
    debug: process.env.NODE_ENV === "development",
    logger: {
        error(code, metadata) {
            console.error(code, metadata);
        },
        warn(code) {
            console.warn(code);
        },
        debug(code, metadata) {
            // console.log(code, metadata);
        }
    }
}