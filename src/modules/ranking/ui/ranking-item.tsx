"use client";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { RankingResult } from "../types/ranking-result.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";

// * UI:
import "./ranking-item.css";

const RankingItem = ({ item, rank, selected, onSelect }: {
    item: RankingResult; rank: number; selected: boolean; onSelect: (station: SearchStationsResult) => void;
}) => {
    const { t, i18n } = useTranslation();
    const { station, route } = item;
    const number = new Intl.NumberFormat(i18n.resolvedLanguage, { maximumFractionDigits: 1 });
    return (
        <li>
            <button type="button" className="ranking-item" aria-pressed={selected} onClick={() => onSelect(station)}>
                <span className="ranking-item-position">{route ? rank : "—"}</span>
                <span className="ranking-item-content">
                    <strong title={station.name || station.formatted}>{station.name || station.formatted}</strong>
                    {station.name && <span className="ranking-item-address" title={station.formatted}>{station.formatted}</span>}
                    {route ? (
                        <span className="ranking-item-metrics">
                            <span title={t("ranking_distance")}>
                                {number.format(route.distance < 1000 ? Math.round(route.distance) : route.distance / 1000)}
                                {route.distance < 1000 ? " m" : " km"}
                            </span>
                            <span title={t("ranking_time")}>
                                {t("ranking_duration", { minutes: number.format(Math.ceil(route.time / 60)) })}
                            </span>
                        </span>
                    ) : <span className="ranking-item-address">{t("ranking_unavailable")}</span>}
                </span>
            </button>
        </li>
    );
};

export default RankingItem;
