"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useStations } from "@/modules/map/provider";
import useSearch from "./hooks/useSearch";

const SearchContext = createContext<ReturnType<typeof useSearch> | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation();
    const { onStationsChange, setSearchPoint } = useStations();
    const search = useSearch(i18n.resolvedLanguage ?? "en", onStationsChange, setSearchPoint);
    return <SearchContext.Provider value={search}>{children}</SearchContext.Provider>;
}

export function useSearchState() {
    const search = useContext(SearchContext);
    if (!search) throw new Error("useSearchState must be used within SearchProvider.");
    return search;
}
