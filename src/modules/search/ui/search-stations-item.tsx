"use client";

// * UI:
import { CommandItem } from "@/ui/components/command";
import { MapPin } from "lucide-react";
import "./search-stations-item.css";

// * Types:
import type { SearchStationsResult } from "../types/search-stations-result.type";

const SearchStationsItem = ({ props, onSelect }: 
    { props: SearchStationsResult; onSelect?: (result: SearchStationsResult) => void }
) => {
    return (
        <CommandItem
            className="search-stations-item"
            value={props.place_id}
            keywords={[props.name ?? "", props.formatted]}
            onSelect={() => onSelect?.(props)}
        >
            <MapPin aria-hidden="true" />
            <div className="search-stations-item-content">
                <strong>{props.name || props.formatted}</strong>
                {props.name && <p>{props.formatted}</p>}
            </div>
        </CommandItem>
    )
}

export default SearchStationsItem;
