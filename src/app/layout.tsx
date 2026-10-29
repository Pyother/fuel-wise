// * Next:
import type { Metadata } from "next";

// * UI:
import "@/ui/globals.css";
import { cn } from "@/lib/ui/utils";
import { geistMono, geistSans, inter } from "@/ui/fonts";

// * Modules:
import { LangProvider } from "@/modules/lang/provider";
import { Navigation } from "@/modules/navigation/navigation";

export const metadata: Metadata = {
    title: "Fuel Wise",
    description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
        >
            <body className="min-h-full flex flex-col">
                <LangProvider>
                    <Navigation>
                        {children}
                    </Navigation>
                </LangProvider>
            </body>
        </html>
    );
}
