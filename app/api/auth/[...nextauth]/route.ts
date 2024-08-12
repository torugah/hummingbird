import nextAuth from "next-auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CrendentialProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CrendentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = {
          id: '1',
          email: 'user@email.com',
          password: '123',
          name: 'Mocked User'
        }

        const isValidEmail = user.email === credentials?.email
        const isValidPassword = user.password === credentials?.password

        if(!isValidEmail || !isValidPassword){
          return null
        }

        return user;
      }      
    })
  ],  
  callbacks: {
    jwt: ({ token }) => {
      return token
    },
    session: async ({ session }) => {
      return session
    }
  },
  pages: {
    signIn: '/'
  }
};

const handler = nextAuth(authOptions)

export {handler as GET, handler as POST}