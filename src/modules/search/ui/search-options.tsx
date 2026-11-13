"use client";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { SearchOptions as Options } from "../types/search-point.type";

// * UI:
import "./search-options.css";
import { MapPin } from "lucide-react";

export function SearchOptions({ value, onApply, picking, onTogglePick }: {
    value: Options; onApply: (value: Options) => void; picking: boolean; onTogglePick: () => void;
}) {
    const { t } = useTranslation();
    return (
        <form className="search-options" onKeyDown={event => event.stopPropagation()} onSubmit={(event) => {
            event.preventDefault();
            const fields = new FormData(event.currentTarget);
            onApply({ limit: Number(fields.get("limit")), radius_m: Math.round(Number(fields.get("radius")) * 1000) });
        }}>
            <label>
                {t("search_limit")}
                <input name="limit" type="number" min={1} max={20} step={1} required defaultValue={value.limit} />
            </label>
            <label>
                {t("search_radius")}
                <input name="radius" type="number" min={0.1} max={50} step={0.1} required defaultValue={value.radius_m / 1000} />
            </label>
            <button type="submit">{t("search_apply")}</button>
            <button type="button" aria-pressed={picking} aria-label={t("search_pick_point")}
                title={t("search_pick_point")} onClick={onTogglePick}>
                <MapPin size={16} aria-hidden="true" />
            </button>
        </form>
    );
}
