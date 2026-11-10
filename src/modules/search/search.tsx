"use client";

// * React and Next:

// * Lib:
import { getLocation } from "./lib/getLocation";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { 
    Command,
    CommandInput,
    CommandList
} from "@/ui/components/command";
import { LocateFixed } from "lucide-react";
import { InputGroupButton } from "@/ui/components/input-group";
import "./search.css";
import SearchStationsItem from "./ui/search-stations-item";
import type { SearchStationsResult } from "./types/search-stations-result.type";


export const Search = ({ results = [], onSelect }: {
    results?: SearchStationsResult[];
    onSelect?: (result: SearchStationsResult) => void;
}) => {

    const { t } = useTranslation();

    return (
        <Command className="search">
            <CommandInput 
                placeholder={`${t("common_search")}...`} 
                aria-label={t("common_search")}
                trailing={
                    <InputGroupButton
                        size="icon-xs"
                        aria-label={t("common_get_location")}
                        title={t("common_get_location")}
                        onClick={() => { void getLocation(); }}
                    >
                        <LocateFixed />
                    </InputGroupButton>
                }
            />
            {results.length > 0 && (
                <CommandList>
                    {results.map((result) => (
                        <SearchStationsItem key={result.place_id} props={result} onSelect={onSelect} />
                    ))}
                </CommandList>
            )}
        </Command>
    )
}
