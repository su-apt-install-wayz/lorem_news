import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwt from "jsonwebtoken";

declare module "next-auth" {
    interface User {
        accessToken?: string;
        expiresAt?: number;
    }

    interface Session {
        accessToken?: string;
        expiresAt?: number;
    }
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Votre adresse email" },
                password: { label: "Password", type: "password", placeholder: "••••••••" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis");
                }

                try {
                    const { data } = await axios.post(
                        "http://localhost:88/api/login",
                        {
                            email: credentials.email,
                            password: credentials.password,
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (!data.token) throw new Error("Aucun token reçu");

                    const decoded = jwt.decode(data.token) as { exp?: number } | null;
                    const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 12 * 60 * 60 * 1000;

                    return { id: data.id, email: data.email, accessToken: data.token, expiresAt };
                } catch (error: any) {
                    console.error("Erreur d'authentification:", error.response?.data || error.message);
                    throw new Error("Identifiants invalides");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.expiresAt = user.expiresAt;
            }

            if (Date.now() > (token.expiresAt as number)) {
                return {};
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.expiresAt = token.expiresAt as number;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
