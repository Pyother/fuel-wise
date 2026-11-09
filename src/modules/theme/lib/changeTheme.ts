// * Types:
import { Theme } from "../theme.type";

export function changeTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}