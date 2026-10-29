"use client";

// * React:
import { ReactNode } from "react";

// * i18n:
import i18n from "./i18n";
import { I18nextProvider } from 'react-i18next';

export function LangProvider({children}: { children: ReactNode }) {
    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    )
}