// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { LoaderCircle } from "lucide-react";

export function SearchStatus({ loading, locating, hasPoint, error, empty, radius }: {
    loading: boolean; locating: boolean; hasPoint: boolean; error: string; empty: boolean; radius: number;
}) {
    const { t } = useTranslation();
    const message = loading ? locating ? "search_locating" : hasPoint ? "search_stations_loading" : "search_loading" :
        error || (empty ? hasPoint ? "search_stations_empty" : "search_empty" : "");
    return (
        <div role="status" className="search-status">
            {loading && <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            {message && t(message, { radius: radius / 1000 })}
        </div>
    );
}
