"use client";

// * Hooks:
import useSearch from "./hooks/useSearch";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { Command, CommandInput, CommandList } from "@/ui/components/command";
import { LoaderCircle } from "lucide-react";
import SearchLocationsItem from "./ui/search-locations-item";
import SearchStationsItem from "./ui/search-stations-item";
import "./search.css";

// * Types:
import type { SearchLocationsResult } from "./types/search-locations-result.type";
import type { SearchStationsResult } from "./types/search-stations-result.type";

export const Search = ({ onSelect, onStationSelect, onStationsChange }: {
    onSelect?: (result: SearchLocationsResult) => void;
    onStationSelect?: (result: SearchStationsResult) => void;
    onStationsChange?: (stations: SearchStationsResult[]) => void;
}) => {
    const { t, i18n } = useTranslation();
    const { listRef, ...search } = useSearch(i18n.resolvedLanguage ?? "en", onStationsChange);

    return (
        <Command className="search" shouldFilter={false}>
            <CommandInput
                value={search.query}
                onValueChange={search.setQuery}
                maxLength={300}
                placeholder={`${t("common_search")}...`}
                aria-label={t("common_search")}
            />
            {(search.isSearching || search.selectedLocation) && (
                <>
                    <CommandList ref={listRef} aria-busy={search.isLoading}>
                        {search.stations.map((station) => (
                            <SearchStationsItem key={station.place_id} props={station} onSelect={onStationSelect} />
                        ))}
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
                        {search.isLoading ? (
                            <>
                                <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                                {t(search.selectedLocation ? "search_stations_loading" : "search_loading")}
                            </>
                        ) : search.error ? t("search_error") : search.selectedLocation ?
                            search.stations.length === 0 ? t("search_stations_empty") : null :
                            search.results.length === 0 ? t("search_empty") : null}
                    </div>
                    {search.resultCount > 0 && (
                        <div className="search-pagination" style={{ visibility: search.pageCount > 1 ? "visible" : "hidden" }}>
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
