"use client";

// * UI:
import { CommandItem } from "@/ui/components/command";
import Price from "@/modules/prices/ui/price-item";
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
                <div className="flex items-baseline gap-2">
                    <strong className="shrink-0 max-w-full">{props.name || props.formatted}</strong>
                    {props.name && <p title={props.formatted}>{props.formatted}</p>}
                </div>
                <Price prices={props.prices} />
            </div>
        </CommandItem>
    )
}

export default SearchStationsItem;
