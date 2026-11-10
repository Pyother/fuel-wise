"use client";

// * UI:
import { CommandItem } from "@/ui/components/command";
import { MapPin } from "lucide-react";
import "./search-locations-item.css";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";

const SearchLocationsItem = ({ props, onSelect }:
    { props: SearchLocationsResult; onSelect?: (result: SearchLocationsResult) => void }
) => {
    return (
        <CommandItem
            className="search-locations-item"
            value={props.place_id}
            keywords={[props.formatted]}
            onSelect={() => onSelect?.(props)}
        >
            <MapPin aria-hidden="true" />
            <span className="search-locations-item-content" title={props.formatted}>
                {props.formatted}
            </span>
        </CommandItem>
    )
}

export default SearchLocationsItem;
