const formatter = new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
});

export function round(price: number) {
    return formatter.format(price);
}
