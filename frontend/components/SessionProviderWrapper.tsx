"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <AutoLogoutHandler />
            {children}
        </SessionProvider>
    );
}

function AutoLogoutHandler() {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.expiresAt) return;

        const expiresAt = session.expiresAt;
        const timeLeft = expiresAt - Date.now();

        if (timeLeft <= 0) {
            signOut();
        } else {
            const timeout = setTimeout(() => signOut(), timeLeft);
            return () => clearTimeout(timeout);
        }
    }, [session?.expiresAt]);

    return null;
}
