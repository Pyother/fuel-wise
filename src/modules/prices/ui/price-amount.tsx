// * Lib:
import { round } from "../lib/round";

export function PriceAmount({ value }: { value: number }) {
    return round(value);
}
