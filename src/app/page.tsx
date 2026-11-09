// * React and Next:

// * Modules:
import { Map } from "@/modules/map/map";
import { Search } from "@/modules/search/search";

export default function Page() {

    return (
        <div 
            id="app" 
            className="grid min-h-0 flex-1 grid-rows-[auto_minmax(20rem,1fr)_auto] gap-(--spacing-md) lg:grid-cols-[1fr_2fr_1fr] lg:grid-rows-1 [&>*]:min-w-0 [&>*]:rounded-xl! [&>*]:border [&>*]:border-border [&>*]:shadow-none [&>*]:ring-0!"
        >
            <Search />
            <Map 
                fullScreen={false}
            />
            <aside aria-label="Ranking" className="min-h-32 bg-card lg:min-h-0" />
        </div>
    )
}
