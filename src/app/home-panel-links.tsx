"use client";

// * Translations:
import { useTranslation } from "react-i18next";

// * UI:
import { Search, MapPin, ListOrdered } from "lucide-react";

export function HomePanelLinks() {
    const { t } = useTranslation();
    return (
        <nav className="home-panel-links" aria-label={t("home_panels")}>
            <a href="#search-panel"><Search aria-hidden="true" /><span>{t("common_search")}</span></a>
            <a href="#map-panel"><MapPin aria-hidden="true" /><span>{t("config_modules_map_name")}</span></a>
            <a href="#ranking-panel"><ListOrdered aria-hidden="true" /><span>{t("config_modules_ranking_name")}</span></a>
        </nav>
    );
}
