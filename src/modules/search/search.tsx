"use client";

// * Hooks:
import useSearch from "./hooks/useSearch";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { Command, CommandInput, CommandList } from "@/ui/components/command";
import SearchLocationsItem from "./ui/search-locations-item";
import "./search.css";

// * Types:
import type { SearchLocationsResult } from "./types/search-locations-result.type";

export const Search = ({ onSelect }: {
    onSelect?: (result: SearchLocationsResult) => void;
}) => {
    const { t, i18n } = useTranslation();
    const search = useSearch(i18n.resolvedLanguage ?? "en");

    return (
        <Command className="search" shouldFilter={false}>
            <CommandInput
                value={search.query}
                onValueChange={search.setQuery}
                maxLength={300}
                placeholder={`${t("common_search")}...`}
                aria-label={t("common_search")}
            />
            {search.isSearching && (
                <>
                    <CommandList aria-busy={search.isLoading}>
                        {search.results.map((result) => (
                            <SearchLocationsItem
                                key={result.place_id}
                                props={result}
                                onSelect={(location) => {
                                    search.selectLocation(location);
                                    onSelect?.(location);
                                }}
                            />
                        ))}
                    </CommandList>
                    <div role="status" className="search-status">
                        {search.isLoading ? t("search_loading") : search.error ? t("search_error") :
                            search.results.length === 0 ? t("search_empty") : null}
                    </div>
                    {search.pageCount > 1 && (
                        <div className="search-pagination">
                            <button type="button" disabled={search.page === 1}
                                onClick={() => search.setPage(search.page - 1)}>
                                {t("search_previous")}
                            </button>
                            <span>{search.page} / {search.pageCount}</span>
                            <button type="button" disabled={search.page === search.pageCount}
                                onClick={() => search.setPage(search.page + 1)}>
                                {t("search_next")}
                            </button>
                        </div>
                    )}
                </>
            )}
        </Command>
    )
}
