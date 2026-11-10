"use client";

// * React and Next:
import { ReactNode } from "react";
import Link from "next/link";

// * Modules:
import { MODULES, LANGUAGES } from '@/modules/config/config';
import { useTheme } from "../theme/provider";

// * UI:
import { 
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from "@/ui/components/navigation-menu";
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/ui/components/select";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/ui/components/button";
import "./navigation.css";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { 
    ConfigModule, 
    ConfigLanguage 
} from "@/modules/config/config";


export function Navigation({children}: { children: ReactNode }) {

    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();
    const language = LANGUAGES.find((lang) => lang.shortcut === i18n.resolvedLanguage) ?? LANGUAGES[0];

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
                <div className="navigation-controls flex flex-1 flex-row gap-(--spacing-md) justify-end">
                    
                    <Select
                        value={language.shortcut}
                        onValueChange={(value) => {
                            if (value && LANGUAGES.some((lang) => lang.shortcut === value)) {
                                void i18n.changeLanguage(value);
                            }
                        }}
                    >
                        <SelectTrigger className="w-full max-w-48" aria-label={t("config_languages_label")}>
                            <SelectValue lang={language.shortcut}>
                                {t(language.name, { lng: language.shortcut })}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>{t("config_languages_label")}</SelectLabel>
                            {LANGUAGES.map((lang: ConfigLanguage) => (
                                <SelectItem key={lang.shortcut} value={lang.shortcut} lang={lang.shortcut}>
                                    {t(lang.name, { lng: lang.shortcut })}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline" 
                        size="icon"
                        aria-label={t("common_toggle_theme")}
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
