"use client";

// * Modules:
import { useStations } from "@/modules/map/provider";

// * Hooks:
import { useRanking } from "./hooks/useRanking";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { ChartColumn, LoaderCircle, MapPin } from "lucide-react";
import { Button } from "@/ui/components/button";
import RankingItem from "./ui/ranking-item";
import "./ranking.css";

const Ranking = () => {
    const { t } = useTranslation();
    const { searchPoint, stations, selectedRanking, toggleRanking } = useStations();
    const { listRef, ...ranking } = useRanking(searchPoint, stations);
    return (
        <aside id="ranking-panel" className="ranking" aria-label={t("ranking_title")}>
            <header>
                <h2 className="flex items-center gap-2"><ChartColumn className="size-5" aria-hidden="true" />{t("ranking_title")}</h2>
                <p>{t("ranking_description")}</p>
                {searchPoint && <p className="ranking-origin" title={searchPoint.label}>
                    <MapPin className="mr-1 inline size-4" aria-hidden="true" />{t("ranking_from", { location: searchPoint.label })}
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
                            selected={selectedRanking?.station.place_id === item.station.place_id} onSelect={toggleRanking} />
                    ))}
                </ol>
            </div>
            {ranking.count > 0 && <nav aria-label={t("ranking_title")} className="ranking-pagination" style={{ visibility: ranking.pageCount > 1 ? "visible" : "hidden" }}>
                <Button variant="ghost" size="sm" disabled={ranking.page === 1} onClick={() => ranking.setPage(ranking.page - 1)}>{t("search_previous")}</Button>
                <span>{ranking.page} / {ranking.pageCount}</span>
                <Button variant="ghost" size="sm" disabled={ranking.page === ranking.pageCount} onClick={() => ranking.setPage(ranking.page + 1)}>{t("search_next")}</Button>
            </nav>}
        </aside>
    );
};

export default Ranking;
