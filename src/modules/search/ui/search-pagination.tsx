// * Translations:
import { useTranslation } from "react-i18next";

export function SearchPagination({ page, pageCount, onChange }: {
    page: number; pageCount: number; onChange: (page: number) => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="search-pagination" onKeyDown={event => event.stopPropagation()}
            style={{ visibility: pageCount > 1 ? "visible" : "hidden" }}>
            <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>{t("search_previous")}</button>
            <span>{page} / {pageCount}</span>
            <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)}>{t("search_next")}</button>
        </div>
    );
}
