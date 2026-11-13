// * Translations:
import { Trans } from "react-i18next";

// * UI:
import { Droplet, Fuel } from "lucide-react";
import { PriceAmount } from "./price-amount";
import "./price-item.css";

// * Types:
import type { Price as StationPrice } from "../types/price.type";

const labels = { pb95: "Pb95", pb98: "Pb98", diesel: "Diesel", lpg: "LPG" };

const Price = ({ prices }: { prices?: StationPrice["prices"] | null }) => prices && Object.values(prices).some(value => value != null) ? (
    <div>
        <dl className="price-item">
            {(Object.keys(labels) as (keyof typeof labels)[]).map(fuel => {
                if (prices[fuel] == null) return null;
                const Icon = fuel === "lpg" ? Droplet : Fuel;
                return (
                    <div key={fuel} className={fuel === "diesel" ? "bg-muted" : "bg-primary/10"}>
                        <dt className="flex items-center gap-1 font-medium">
                            <Icon className={fuel === "diesel" ? "text-muted-foreground" : "text-primary"} aria-hidden="true" />
                            {labels[fuel]}
                        </dt>
                        <dd className="border-l border-border pl-2 text-sm font-semibold tabular-nums">
                            <PriceAmount value={prices[fuel]} />
                        </dd>
                    </div>
                );
            })}
        </dl>
        <span className="block text-right text-xs text-muted-foreground">€/L</span>
    </div>
) : (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Trans i18nKey="search_station_prices_unavailable" />
    </span>
);

export default Price;
