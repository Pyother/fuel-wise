"use client";

// * React and Next:
import { ReactNode } from "react";
import Link from "next/link";

// * Modules:
import { MODULES } from '@/modules/config/config';

// * UI:
import { 
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from "@/app/ui/components/navigation-menu";
import "./navigation.css";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { ConfigModule } from "@/modules/config/config";


export function Navigation({children}: { children: ReactNode }) {

    const { t } = useTranslation();

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
            </NavigationMenuList>
            {children}
        </NavigationMenu>
    )
}
