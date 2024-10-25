//Mantendo o código abaixo em comentário como porto seguro.
/*import NextAuth from "next-auth";
import { string } from "zod";

declare module "next-auth" {
    interface User {
        username: string | null
    }
    interface Session {
        user: User & {
            username: string
        }
        token: {
            username: string
        }
    }
}*/

import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string; // Adicione o campo id
        username: string | null;
    }

    interface Session {
        user: User & {
            id: string;  // Adicione o campo id à sessão
            username: string;
        };
    }

    interface JWT {
        id: string;  // Adicione o campo id ao token JWT
        username: string;
    }
}
