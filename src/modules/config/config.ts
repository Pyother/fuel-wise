// * Next:


export const MODULES = [
    {
        "name": "config_modules_home_name",
        "href": "/"
    },
    {
        "name": "config_modules_map_name",
        "href": "/map"
    },
    {
        "name": "config_modules_ranking_name",
        "href": "/ranking"
    }
] as const;

export const LANGUAGES = [
    {
        "name": "config_languages_english_name",
        "shortcut": "en"
    },
    {
        "name": "config_languages_german_name",
        "shortcut": "de"
    },
    {
        "name": "config_languages_italian_name",
        "shortcut": "it"
    },
    {
        "name": "config_languages_spanish_name",
        "shortcut": "es"
    },
    {
        "name": "config_languages_french_name",
        "shortcut": "fr"
    }
] as const;

// * Export Types:
export type ConfigModules = typeof MODULES;
export type ConfigLanguages = typeof LANGUAGES;
export type ConfigLanguage = ConfigLanguages[number];
export type ConfigModule = ConfigModules[number];
