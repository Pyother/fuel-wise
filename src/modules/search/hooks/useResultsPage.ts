"use client";

// * React and Next:
import { useCallback, useState } from "react";

export function useResultsPage(count: number, key: string, itemSelector = '[data-slot="command-item"]', fixedSize?: number) {
    const [measuredSize, setSize] = useState(5);
    const size = fixedSize ?? measuredSize;
    const [selection, setSelection] = useState({ key, page: 1 });
    const pageCount = Math.ceil(count / size);
    const page = Math.min(selection.key === key ? selection.page : 1, Math.max(1, pageCount));
    const listRef = useCallback((list: HTMLDivElement | null) => {
        if (!list || !count || fixedSize) return;
        const observer = new ResizeObserver(() => {
            const items = list.querySelectorAll<HTMLElement>(itemSelector);
            const height = Math.max(...Array.from(items, item => item.getBoundingClientRect().height));
            const group = items[0]?.parentElement;
            const gap = group ? parseFloat(getComputedStyle(group).rowGap) || 0 : 0;
            if (height > 0 && list.clientHeight > 0) setSize(Math.max(1, Math.floor((list.clientHeight + gap) / (height + gap))));
        });
        observer.observe(list);
        list.querySelectorAll(itemSelector).forEach(item => observer.observe(item));
        return () => observer.disconnect();
    }, [count, itemSelector, fixedSize]);

    return { listRef, page, pageCount, size, offset: (page - 1) * size,
        setPage: (value: number) => setSelection({ key, page: Math.max(1, Math.min(value, pageCount)) }) };
}
