"use client";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { RankingResult } from "../types/ranking-result.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";

// * UI:
import { Fuel, Navigation } from "lucide-react";
import { PriceAmount } from "@/modules/prices/ui/price-amount";
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
                <span className={`ranking-item-position ${route && rank === 1 ? "bg-primary/15 text-primary" : "bg-muted"}`}>{route ? rank : "—"}</span>
                <span className="ranking-item-content">
                    <strong title={station.name || station.formatted}>{station.name || station.formatted}</strong>
                    {station.name && <span className="ranking-item-address" title={station.formatted}>{station.formatted}</span>}
                    {route ? (
                        <span className="ranking-item-metrics">
                            <Navigation className="size-3.5" aria-hidden="true" />
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
                {station.prices?.pb95 != null ? (
                    <span className="ranking-item-price">
                        <span className="flex items-center gap-1 text-xs"><Fuel className="size-4 text-primary" aria-hidden="true" />Pb95</span>
                        <strong className="tabular-nums"><PriceAmount value={station.prices.pb95} /></strong>
                        <small className="text-muted-foreground">€/L</small>
                    </span>
                ) : <span className="max-w-24 text-xs text-muted-foreground">{t("search_station_prices_unavailable")}</span>}
            </button>
        </li>
    );
};

export default RankingItem;
