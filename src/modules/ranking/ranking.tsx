"use client";

// * Modules:
import { useStations } from "@/modules/map/provider";

// * Hooks:
import { useRanking } from "./hooks/useRanking";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { LoaderCircle } from "lucide-react";
import RankingItem from "./ui/ranking-item";
import "./ranking.css";

const Ranking = () => {
    const { t } = useTranslation();
    const { searchPoint, stations, selectedStation, setSelectedStation } = useStations();
    const { listRef, ...ranking } = useRanking(searchPoint, stations);
    return (
        <aside className="ranking" aria-label={t("ranking_title")}>
            <header>
                <h2>{t("ranking_title")}</h2>
                <p>{t("ranking_description")}</p>
                {searchPoint && <p className="ranking-origin" title={searchPoint.label}>
                    {t("ranking_from", { location: searchPoint.label })}
                </p>}
            </header>
            <div role="status" className="ranking-status">
                {ranking.loading ? <><LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />{t("ranking_loading")}</> :
                    ranking.error ? t("ranking_error") : ranking.failed ? t("ranking_failed", { count: ranking.failed }) :
                    !ranking.count ? t("ranking_wait") : null}
            </div>
            {(ranking.error || ranking.failed > 0) && !ranking.loading && (
                <button type="button" className="ranking-retry" onClick={ranking.retry}>{t("ranking_retry")}</button>
            )}
            <div className="ranking-list" ref={listRef} aria-busy={ranking.loading}>
                <ol start={ranking.offset + 1}>
                    {ranking.items.map((item, index) => (
                        <RankingItem key={item.station.place_id} item={item} rank={ranking.offset + index + 1}
                            selected={selectedStation?.place_id === item.station.place_id} onSelect={setSelectedStation} />
                    ))}
                </ol>
            </div>
            {ranking.count > 0 && <div className="ranking-pagination" style={{ visibility: ranking.pageCount > 1 ? "visible" : "hidden" }}>
                <button type="button" disabled={ranking.page === 1} onClick={() => ranking.setPage(ranking.page - 1)}>{t("search_previous")}</button>
                <span>{ranking.page} / {ranking.pageCount}</span>
                <button type="button" disabled={ranking.page === ranking.pageCount} onClick={() => ranking.setPage(ranking.page + 1)}>{t("search_next")}</button>
            </div>}
        </aside>
    );
};

export default Ranking;
