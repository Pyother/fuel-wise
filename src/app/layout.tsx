

// * React and Next:
import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";

// * UI:
import "@/ui/globals.css";
import { cn } from "@/lib/ui/utils";
import { geistMono, geistSans, inter } from "@/ui/fonts";

// * Modules:
import LangProvider from "@/modules/lang/provider";
import ThemeProvider from "@/modules/theme/provider";
import { Navigation } from "@/modules/navigation/navigation";

// * Lib:
import { getTheme } from "@/modules/theme/lib/getTheme";

export const metadata: Metadata = {
    title: "Fuel Wise",
    description: "",
};

async function ThemedContent({ children }: { children: ReactNode }) {
    const initialTheme = await getTheme();

    return (
        <ThemeProvider initialTheme={initialTheme}>
            <Navigation>{children}</Navigation>
        </ThemeProvider>
    );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
        >
            <body className="h-dvh flex flex-col">
                <LangProvider>
                    <Suspense fallback={
                        <div role="status" className="flex flex-1 items-center justify-center">
                            Loading Fuel Wise…
                        </div>
                    }>
                        <ThemedContent>{children}</ThemedContent>
                    </Suspense>
                </LangProvider>
            </body>
        </html>
    );
}
