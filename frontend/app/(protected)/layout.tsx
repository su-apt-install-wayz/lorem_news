import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";
import { Footer } from "@/components/Footer";
import { PropsWithChildren } from "react";


export default function Layout(props: PropsWithChildren) {
    return (
        <>
            <Header />
            <Spacing size="sm" />

            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">{props.children}</main>

            <Spacing size="lg" />
            <Footer />
        </>
    );
}
