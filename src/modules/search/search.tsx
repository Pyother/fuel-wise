"use client";

// * Hooks:
import type useSearch from "./hooks/useSearch";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { Command, CommandInput, CommandItem, CommandList } from "@/ui/components/command";
import { InputGroupButton } from "@/ui/components/input-group";
import { LocateFixed } from "lucide-react";
import SearchLocationsItem from "./ui/search-locations-item";
import SearchStationsItem from "./ui/search-stations-item";
import { SearchOptions } from "./ui/search-options";
import { SearchPagination } from "./ui/search-pagination";
import { SearchStatus } from "./ui/search-status";
import "./search.css";

// * Types:
import type { SearchLocationsResult } from "./types/search-locations-result.type";
import type { SearchStationsResult } from "./types/search-stations-result.type";

export const Search = ({ onSelect, onStationSelect, search: { listRef, ...search }, picking, onTogglePick }: {
    onSelect?: (result: SearchLocationsResult) => void;
    onStationSelect?: (result: SearchStationsResult) => void;
    search: ReturnType<typeof useSearch>;
    picking: boolean;
    onTogglePick: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <Command id="search-panel" className="search" shouldFilter={false}>
            <SearchOptions value={search.options} onApply={search.setOptions} picking={picking} onTogglePick={onTogglePick} />
            {search.city && (
                <div className="search-origin" onKeyDown={event => event.stopPropagation()}>
                    <span title={search.city.formatted}>{search.city.formatted}</span>
                    <button type="button" onClick={search.changeCity}>{t("search_change_city")}</button>
                </div>
            )}
            <CommandInput value={search.query} onValueChange={search.setQuery} maxLength={300}
                placeholder={t(search.city ? "search_street" : "search_city")}
                aria-label={t(search.city ? "search_street" : "search_city")}
                trailing={
                    <InputGroupButton type="button" size="icon-xs" disabled={search.isLocating}
                        onKeyDown={event => event.stopPropagation()}
                        aria-label={t("common_get_location")} title={t("common_get_location")}
                        onClick={() => search.locate(t("search_current_location"))}>
                        <LocateFixed aria-hidden="true" />
                    </InputGroupButton>
                }
            />
            {search.coordinates && (
                <CommandList>
                    <CommandItem value={search.query} onSelect={() => {
                        if (search.coordinates) search.pickPoint(search.coordinates.latitude, search.coordinates.longitude);
                        if (picking) onTogglePick();
                    }}>{search.query}</CommandItem>
                </CommandList>
            )}
            {search.city && !search.coordinates && !search.point && !search.showResults && (
                <p className="search-status">{t("search_street_hint")}</p>
            )}
            {search.showResults && (
                <>
                    <CommandList key={search.page} ref={listRef} aria-busy={search.isLoading}>
                        {search.stations.map(station => (
                            <SearchStationsItem key={station.place_id} props={station} onSelect={onStationSelect} />
                        ))}
                        {search.results.map(result => (
                            <SearchLocationsItem key={result.place_id} props={result} onSelect={location => {
                                search.selectLocation(location);
                                onSelect?.(location);
                            }} />
                        ))}
                    </CommandList>
                    <SearchStatus loading={search.isLoading} locating={search.isLocating} hasPoint={!!search.point}
                        error={search.error} empty={search.resultCount === 0} radius={search.options.radius_m} />
                    {search.resultCount > 0 && (
                        <SearchPagination page={search.page} pageCount={search.pageCount} onChange={search.setPage} />
                    )}
                </>
            )}
        </Command>
    );
};
