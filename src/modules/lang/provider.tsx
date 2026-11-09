"use client";

// * React:
import { useEffect, type ReactNode } from "react";
import { LANGUAGES } from "@/modules/config/config";

// * i18n:
import i18n from "./i18n";
import { I18nextProvider } from 'react-i18next';

export default function LangProvider({children}: { children: ReactNode }) {
    useEffect(() => {
        const syncLanguage = (language: string) => {
            if (!LANGUAGES.some((lang) => lang.shortcut === language)) return;

            document.documentElement.lang = language;
            try {
                localStorage.setItem("language", language);
            } catch {
                // Language switching still works when browser storage is unavailable.
            }
        };

        i18n.on("languageChanged", syncLanguage);

        let savedLanguage: string | null = null;
        try {
            savedLanguage = localStorage.getItem("language");
        } catch {
            // Keep the default language when browser storage is unavailable.
        }

        if (savedLanguage && LANGUAGES.some((lang) => lang.shortcut === savedLanguage)) {
            void i18n.changeLanguage(savedLanguage);
        } else {
            syncLanguage(i18n.resolvedLanguage ?? "en");
        }

        return () => {
            i18n.off("languageChanged", syncLanguage);
        };
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    )
}
