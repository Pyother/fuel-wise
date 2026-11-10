// * React and Next:

// * Modules:
import { SearchMap } from "@/modules/search/search-map";
import Ranking from "@/modules/ranking/ranking";

// * UI:
import { HomePanelLinks } from "./home-panel-links";
import "./home.css";

export default function Page() {

    return (
        <div 
            id="app" 
            className="grid min-h-0 flex-1 grid-rows-[auto_minmax(20rem,1fr)_auto] gap-(--spacing-md) lg:grid-cols-[1fr_2fr_1fr] lg:grid-rows-1 [&>*]:min-w-0 [&>*]:rounded-xl! [&>*]:border [&>*]:border-border [&>*]:shadow-none [&>*]:ring-0!"
        >
            <HomePanelLinks />
            <SearchMap />
            <Ranking />
        </div>
    )
}
