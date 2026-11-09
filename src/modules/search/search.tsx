"use client";

// * React and Next:

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { 
    Command,
    CommandInput
} from "@/ui/components/command";
import "./search.css";


export const Search = () => {

    const { t } = useTranslation();

    return (
        <Command className="search">
            <CommandInput 
                placeholder={`${t("common_search")}...`} 
                aria-label={t("common_search")}
            />
        </Command>
    )
}
