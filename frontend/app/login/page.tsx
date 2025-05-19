"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Section } from "@/components/Section";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoaderCircleIcon } from "lucide-react";

// Schéma de validation
const loginSchema = z.object({
    email: z.string().min(1, "L'email est requis").email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 8 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), 
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { handleSubmit, control, setError, formState: { errors, isSubmitting } } = form;

    const onSubmit = async (data: LoginFormValues) => {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setError("email", { type: "manual", message: "Identifiants incorrects" });
            return;
        }

        router.push("/");
    };

    const avatars = [
        {
            src: "/assets/profile/Ander.png",
            alt: "Ander",
        },
        {
            src: "/assets/profile/Bill.png",
            alt: "Bill",
        },
        {
            src: "/assets/profile/Cap.png",
            alt: "Cap",
        },
        {
            src: "/assets/profile/Dee.png",
            alt: "Dee",
        },
    ];

    return (
        <Section className="flex h-full min-h-screen p-4">
            <div className="w-full max-w-1/2 flex flex-col justify-center items-center rounded-md p-4 gap-8 max-md:max-w-none max-md:p-0">
                <img className="w-56" src="/assets/logo2.png" alt="" />
                <p className="mb-14 text-xl text-secondary font-semibold text-center">Connectez-vous et accédez à tous nos articles</p>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl space-y-8">
                        {/* Champ Email */}
                        <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="ml-1">Adresse email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Saisissez votre adresse email" {...field} className="h-11" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage className="ml-3">{errors.email?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Champ Mot de passe */}
                        <FormField
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mb-1">
                                    <FormLabel className="ml-1">Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••••••" {...field} className="h-11" disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage className="ml-3">{errors.password?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <div className="mx-1 flex flex-wrap gap-3 justify-between">
                            <Button variant={"link"} className="text-secondary text-xs p-0 cursor-pointer ml-auto" disabled={isSubmitting}>Mot de passe oublié ?</Button>
                        </div>

                        <Button type="submit" className="w-full h-11 cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" /> : "Se connecter"}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="w-1/2 flex justify-center items-center bg-primary rounded-md p-12 max-lg:p-6 relative max-md:hidden bg-cover bg-center" style={{ backgroundImage: "url('/assets/ffflux.svg')" }}>
                <div className="w-full bg-primary/20 text-primary-foreground space-y-4 p-4 py-8 rounded-md">
                    <h1 className="mb-14 text-6xl font-bold">Lorem News</h1>
                    <p className="text-4xl font-semibold">La dose quotidienne d'actualités</p>
                    <p className="text-md font-light">Rejoignez vous-aussi nos lecteurs passionnés qui font confiance à <span className="font-semibold">Lorem News</span> pour rester informés. Découvrez des articles captivants sur l'économie, la technologie, la culture, la santé, et bien plus encore. <span className="font-semibold">Lorem News</span>, c'est votre dose quotidienne d'actualités fiable et de qualité.</p>

                    <div className="mt-12 flex items-center space-x-6">
                        <div className="flex -space-x-4">
                            {avatars.map((avatar, index) => (
                                <div key={avatar.alt} className="w-10 h-10" style={{ zIndex: index }}>
                                    <Avatar className="w-full h-full rounded-full border-2">
                                        <AvatarImage src={avatar.src} alt={avatar.alt} />
                                        <AvatarFallback>{avatar.alt[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            ))}
                        </div>
                        <Separator orientation="vertical" className="!h-6 bg-primary-foreground" />
                        <p className="font-light text-primary-foreground">Déjà plus de <span className="font-semibold">250</span> étudiants inscrits</p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
