"use client";

// * UI:
import { CommandItem } from "@/ui/components/command";
import { MapPin } from "lucide-react";
import "./search-item.css";

// * Types:
import type { SearchResult } from "../types/search-result.type";

const SearchItem = ({ props, onSelect }: 
    { props: SearchResult; onSelect?: (result: SearchResult) => void }
) => {
    return (
        <CommandItem
            className="search-item"
            value={props.place_id}
            keywords={[props.name ?? "", props.formatted]}
            onSelect={() => onSelect?.(props)}
        >
            <MapPin aria-hidden="true" />
            <div className="search-item-content">
                <strong>{props.name || props.formatted}</strong>
                {props.name && <p>{props.formatted}</p>}
            </div>
        </CommandItem>
    )
}

export default SearchItem;
