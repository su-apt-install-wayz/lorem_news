import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"

class InvalidLoginError extends CredentialsSignin {
    code = "Email ou mot de passe invalide"
}

interface CustomUser {
    token: string
}

declare module "next-auth" {
    interface Session {
        user: {
            token: string;
        }
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const response = await fetch(`${process.env.API_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                });

                if (!response.ok) {
                    return null;
                }

                const user = await response.json();

                if (!user) {
                    throw new InvalidLoginError()
                }

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 86400,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser
                token.accessToken = customUser.token
            }
            return token
        },
        async session({ session, token }) {
            session.user.token = token.accessToken as string
            return session
        }
    },
    pages: {
        signIn: "/login",
    },
})