"use client";

// * React and Next:
import { ReactNode } from "react";
import Link from "next/link";

// * Modules:
import { MODULES } from '@/modules/config/config';
import { useTheme } from "../theme/provider";

// * UI:
import { 
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from "@/app/ui/components/navigation-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/ui/components/button";
import "./navigation.css";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { ConfigModule } from "@/modules/config/config";
import type { Theme } from "../theme/theme.type";


export function Navigation({children}: { children: ReactNode }) {

    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    return (
        <NavigationMenu className="navigation-menu">
            <NavigationMenuList className="navigation-list">
                {MODULES.map((module: ConfigModule, index) => (
                    <Link key={index} href={module.href}>
                        <NavigationMenuItem>
                        {t(module.name)}
                    </NavigationMenuItem>
                    </Link>
                ))}
                <div className="flex flex-1 flex-row gap-(--spacing-md) justify-end">
                    <Button
                        variant="outline" 
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {
                            theme === "dark" ? 
                            <Sun /> :
                            <Moon />
                        }
                    </Button>
                </div>
            </NavigationMenuList>
            {children}
        </NavigationMenu>
    )
}
