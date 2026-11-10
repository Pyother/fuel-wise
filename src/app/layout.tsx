

// * React and Next:
import type { Metadata } from "next";

// * UI:
import "@/ui/globals.css";
import { cn } from "@/lib/ui/utils";
import { geistMono, geistSans, inter } from "@/ui/fonts";

// * Modules:
import LangProvider from "@/modules/lang/provider";
import ThemeProvider from "@/modules/theme/provider";
import StationsProvider from "@/modules/map/provider";
import { Navigation } from "@/modules/navigation/navigation";

// * Lib:
import { getTheme } from "@/modules/theme/lib/getTheme";

export const metadata: Metadata = {
    title: "Fuel Wise",
    description: "",
};

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
    
    const initialTheme = await getTheme();

    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
        >
            <body className="h-dvh flex flex-col">
                <LangProvider>
                    <ThemeProvider initialTheme={initialTheme}>
                        <StationsProvider>
                            <Navigation>{children}</Navigation>
                        </StationsProvider>
                    </ThemeProvider>
                </LangProvider>
            </body>
        </html>
    );
}
