// * Next:
import { cookies } from "next/headers";

// * Types:
import { Theme } from "../theme.type";

export async function getTheme(): Promise<Theme> {
    const cookieStore = await cookies();
    const theme = await cookieStore.get('theme')?.value || "light";
    return theme as Theme;
}