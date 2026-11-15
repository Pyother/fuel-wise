"use client";

// * Modules:
import { useStations } from "@/modules/map/provider";

// * Hooks:
import { useRanking } from "./hooks/useRanking";
import { REFUEL_LITERS } from "./lib/calculateRanking";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { ChartColumn, Info, LoaderCircle, MapPin } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import RankingItem from "./ui/ranking-item";
import "./ranking.css";

const Ranking = () => {
    const { t } = useTranslation();
    const { searchPoint, stations, selectedRanking, toggleRanking, consumption, setConsumption } = useStations();
    const { listRef, ...ranking } = useRanking(searchPoint, stations, consumption);
    return (
        <aside id="ranking-panel" className="ranking" aria-label={t("ranking_title")}>
            <header>
                <h2 className="flex items-center gap-2"><ChartColumn className="size-5" aria-hidden="true" />{t("ranking_title")}</h2>
                <p>{t("ranking_description")}</p>
                <p>{t("ranking_assumptions", { liters: REFUEL_LITERS, consumption })}</p>
                <p className="flex items-start gap-1.5"><Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{t("prices_sample_notice")}</p>
                <form className="ranking-options flex flex-wrap items-end gap-2" onSubmit={event => {
                    event.preventDefault();
                    const value = Number(new FormData(event.currentTarget).get("consumption"));
                    if (Number.isFinite(value) && value >= 0.1 && value <= 100) setConsumption(value);
                }}>
                    <label className="grid gap-1 text-sm">
                        {t("ranking_consumption")}
                        <Input className="w-32"
                            name="consumption" type="number" min={0.1} max={100} step={0.1}
                            required defaultValue={consumption} />
                    </label>
                    <Button type="submit">{t("search_apply")}</Button>
                </form>
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
                <Button type="button" variant="outline" className="ranking-retry" onClick={ranking.retry}>{t("ranking_retry")}</Button>
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
